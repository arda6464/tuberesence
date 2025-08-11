const RPC = require("discord-rpc");
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const clientId = "1403426174423666768"; // Discord Developer Portal'dan alın

const app = express();
app.use(cors());
app.use(express.json());

const rpc = new RPC.Client({ transport: "ipc" });

// WebSocket sunucusu
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('WebSocket bağlantısı kuruldu');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'setActivity') {
        const activity = data.activity;
        
        // Discord RPC'ye gönder
        rpc.setActivity(activity)
          .then(() => {
            console.log("Activity WebSocket üzerinden güncellendi");
            ws.send(JSON.stringify({ success: true }));
          })
          .catch((e) => {
            console.error("RPC setActivity hatası:", e);
            ws.send(JSON.stringify({ error: e.message }));
          });
      }
    } catch (error) {
      console.error('WebSocket mesaj hatası:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket bağlantısı kapandı');
  });
});

rpc.on("ready", () => {
  console.log("Discord RPC Bağlandı");

  app.post("/update", (req, res) => {
    const { details, state, startTimestamp, buttons, timeInfo } = req.body;

    if (!details || details.trim() === "") {
      return res.status(400).send("Details alanı boş olamaz");
    }

    // Zaman bilgisi formatlama
    let activityState = state;
    
    if (timeInfo && !state) {
      activityState = `⏳ ${timeInfo.current || "0:00"} / ${timeInfo.total || "0:00"} (${timeInfo.progress || 0}%)`;
    }

    // Butonları Discord RPC formatına uygun hale getir
    const formattedButtons = [];
    if (buttons && Array.isArray(buttons) && buttons.length > 0) {
      buttons.slice(0, 2).forEach((button) => { // Discord maksimum 2 buton destekler
        if (button.label && button.url) {
          formattedButtons.push({
            label: button.label.substring(0, 32), // Discord buton etiketi maksimum 32 karakter
            url: button.url
          });
        }
      });
    }

    const activity = {
      details: details.length > 128 ? details.substring(0, 125) + "..." : details,
      state: activityState.length > 128 ? activityState.substring(0, 125) + "..." : activityState,
      largeImageKey: "youtube",
      largeImageText: "YouTube'da izliyor",
      smallImageKey: "play",
      smallImageText: "Oynatılıyor"
    };

    // Butonları sadece varsa ekle
    if (formattedButtons.length > 0) {
      activity.buttons = formattedButtons;
      console.log("Butonlar eklendi:", formattedButtons);
    } else {
      console.log("Buton bulunamadı veya boş");
    }

    // End timestamp hesaplama
    if (timeInfo?.totalSeconds && timeInfo?.currentSeconds) {
      const remainingSeconds = timeInfo.totalSeconds - timeInfo.currentSeconds;
      if (remainingSeconds > 0) {
        activity.endTimestamp = new Date(Date.now() + remainingSeconds * 1000);
      }
    }

    console.log("Gönderilen activity:", JSON.stringify(activity, null, 2)); // Debug için detaylı log

    rpc.setActivity(activity)
      .then(() => {
        console.log("Activity başarıyla güncellendi");
        res.sendStatus(200);
      })
      .catch((e) => {
        console.error("RPC setActivity hatası:", e);
        res.status(500).send("RPC setActivity hatası");
      });
  });

  app.post("/clear", (req, res) => {
    rpc.clearActivity()
      .then(() => res.sendStatus(200))
      .catch((e) => {
        console.error("RPC clearActivity hatası:", e);
        res.status(500).send("RPC clearActivity hatası");
      });
  });

  app.get("/health", (req, res) => {
    res.sendStatus(200);
  });

  app.listen(3000, () => console.log("HTTP Sunucu 3000 portunda çalışıyor"));
  console.log("WebSocket Sunucu 3001 portunda çalışıyor");
});

rpc.login({ clientId }).catch(console.error);