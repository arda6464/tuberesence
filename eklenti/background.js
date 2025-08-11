let currentTitle = "";
let currentVideoId = "";
let currentUrl = "";
let currentTime = "0:00";
let totalTime = "0:00";
let progressPercentage = 0;
let channelName = "";
let channelUrl = "";
let useLocalServer = false;

// Video URL'sini oluştur
function getVideoUrl() {
  if (currentVideoId) {
    return `https://www.youtube.com/watch?v=${currentVideoId}`;
  }
  return currentUrl || "https://www.youtube.com";
}

// Discord RPC'ye activity gönder
function sendDiscordActivity() {
  if (!currentTitle) return;

  const videoUrl = getVideoUrl();
  const buttons = [];
  
  // Video URL'si varsa "Video Linki" butonu ekle
  if (currentVideoId || (currentUrl && currentUrl !== "https://www.youtube.com")) {
    const videoTitle = currentTitle.length > 15 ? currentTitle.substring(0, 12) + "..." : currentTitle;
    buttons.push({
      label: `🎬 ${videoTitle}`,
      url: videoUrl
    });
  }
  
  // Kanal bilgisi varsa "Kanala Git" butonu ekle
  if (channelUrl && channelName) {
    const channelDisplayName = channelName.length > 15 ? channelName.substring(0, 12) + "..." : channelName;
    buttons.push({
      label: `📺 ${channelDisplayName}`,
      url: channelUrl
    });
  }
  
  // YouTube ana sayfası butonu (sadece diğer butonlar yoksa)
  if (buttons.length < 2) {
    buttons.push({
      label: "🏠 YouTube",
      url: "https://www.youtube.com"
    });
  }

  const activity = {
    details: currentTitle.length > 128 ? currentTitle.substring(0, 125) + "..." : currentTitle,
    state: `▶ ${currentTime} / ${totalTime} (${progressPercentage}%)`,
    largeImageKey: "youtube",
    largeImageText: "YouTube'da izliyor",
    smallImageKey: "play",
    smallImageText: "Oynatılıyor",
    buttons: buttons.slice(0, 2) // Discord maksimum 2 buton destekler
  };

  // End timestamp hesaplama
  if (totalTime !== "0:00" && currentTime !== "0:00") {
    const [currentMins, currentSecs] = currentTime.split(":").map(Number);
    const [totalMins, totalSecs] = totalTime.split(":").map(Number);
    const currentSeconds = (currentMins * 60) + currentSecs;
    const totalSeconds = (totalMins * 60) + totalSecs;
    const remainingSeconds = totalSeconds - currentSeconds;
    
    if (remainingSeconds > 0) {
      activity.endTimestamp = new Date(Date.now() + remainingSeconds * 1000);
    }
  }

  // Local sunucuya gönder
  if (useLocalServer) {
    fetch("http://localhost:3000/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        details: activity.details,
        state: activity.state,
        buttons: activity.buttons,
        endTimestamp: activity.endTimestamp
      })
    }).then(response => {
      if (response.ok) {
        console.log("Discord presence güncellendi");
      } else {
        console.error("Discord presence güncellenemedi");
      }
    }).catch((e) => {
      console.error("Local server error:", e);
      useLocalServer = false;
    });
  } else {
    console.log("Discord presence için local RPC sunucusu gerekli");
    console.log("Activity:", activity);
  }
}

// Local sunucu kontrolü ve başlatma
function checkLocalServer() {
  fetch("http://localhost:3000/health", { method: "GET" })
    .then(response => {
      if (response.ok) {
        useLocalServer = true;
        console.log("✅ Local RPC sunucusu bulundu - Discord presence aktif!");
      }
    })
    .catch(() => {
      useLocalServer = false;
      console.log("❌ Local RPC sunucusu bulunamadı - Discord presence yok");
      console.log("💡 Discord presence için: node rpc.js çalıştırın");
      
      // Otomatik sunucu başlatmayı dene
      startLocalServer();
    });
}

// Local sunucuyu başlatmayı dene
function startLocalServer() {
  // Chrome extension'da doğrudan Node.js çalıştıramayız
  // Bu yüzden kullanıcıya manuel başlatma talimatı veriyoruz
  console.log("🚀 Local RPC sunucusunu başlatmak için:");
  console.log("1. Terminal/CMD açın");
  console.log("2. cd masaüstü");
  console.log("3. node rpc.js");
}

// Mesaj geldiğinde değişkenleri güncelle
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.title) currentTitle = msg.title;
  if (msg.videoId) currentVideoId = msg.videoId;
  if (msg.url) currentUrl = msg.url;
  if (msg.channelName) channelName = msg.channelName;
  if (msg.channelUrl) channelUrl = msg.channelUrl;
  if (msg.time) {
    currentTime = msg.time.current || currentTime;
    totalTime = msg.time.total || totalTime;
    // Progress'i number olarak handle et
    if (typeof msg.time.progress === 'number') {
      progressPercentage = msg.time.progress;
    } else if (typeof msg.time.progress === 'string') {
      progressPercentage = parseInt(msg.time.progress.replace('%', '')) || 0;
    } else {
      progressPercentage = 0;
    }
  }
  
  // Mesaj alındığında hemen presence güncelle
  if (msg.title || msg.time || msg.channelName) {
    sendDiscordActivity();
  }
  
  sendResponse({ success: true });
});

// Eklenti başladığında local sunucu kontrolü yap
checkLocalServer();

// Her 5 saniyede bir güncelle
setInterval(sendDiscordActivity, 5000);

// Her 30 saniyede bir local sunucu kontrolü
setInterval(checkLocalServer, 30000);