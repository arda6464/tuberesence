let lastVideoId = null;
let lastTimeUpdate = null;

function getVideoId(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  } catch {
    return null;
  }
}

function getChannelInfo() {
  // Kanal adını al
  const channelElement = document.querySelector('a[href*="/@"]') || 
                        document.querySelector('a[href*="/channel/"]') ||
                        document.querySelector('a[href*="/c/"]');
  
  if (channelElement) {
    const channelUrl = channelElement.href;
    const channelName = channelElement.textContent?.trim() || "";
    return { channelName, channelUrl };
  }
  
  return { channelName: "", channelUrl: "" };
}

function getVideoTimeInfo() {
  // Mevcut süre (dakika:saniye)
  const currentTime = document.querySelector(".ytp-time-current")?.textContent || "0:00";
  
  // Toplam süre (dakika:saniye)
  const totalTime = document.querySelector(".ytp-time-duration")?.textContent || "0:00";

  // Saniyeye çevirme fonksiyonu
  const timeToSeconds = (timeStr) => {
    if (!timeStr || timeStr === "0:00" || timeStr === "LIVE") return 0;
    const parts = timeStr.split(":").map(Number);
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return 0;
    return parts[0] * 60 + parts[1];
  };

  const currentSeconds = timeToSeconds(currentTime);
  const totalSeconds = timeToSeconds(totalTime);
  
  return {
    current: currentTime,
    total: totalTime,
    currentSeconds: currentSeconds,
    totalSeconds: totalSeconds,
    percentage: totalSeconds > 0 ? Math.round((currentSeconds / totalSeconds) * 100) : 0
  };
}

function sendVideoInfo() {
  const url = location.href;
  const videoId = getVideoId(url);
  if (!videoId) return;

  const timeInfo = getVideoTimeInfo();
  const channelInfo = getChannelInfo();
  const now = Date.now();

  // Yeni video VEYA 5 saniyede bir süre güncellemesi
  if (videoId !== lastVideoId || !lastTimeUpdate || (now - lastTimeUpdate) > 5000) {
    lastVideoId = videoId;
    lastTimeUpdate = now;
    
    chrome.runtime.sendMessage({ 
      title: document.title.replace(" - YouTube", ""),
      videoId,
      url,
      channelName: channelInfo.channelName,
      channelUrl: channelInfo.channelUrl,
      time: {
        current: timeInfo.current,
        total: timeInfo.total,
        progress: timeInfo.percentage
      }
    });
  }
}

// Dinleyiciler
window.addEventListener("load", sendVideoInfo);
setInterval(sendVideoInfo, 1000); // Her 1 saniyede bir kontrol