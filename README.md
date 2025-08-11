# YouTube Discord RPC Servisi

Bu servis, YouTube Discord Presence eklentisi için RPC sunucusunu arka planda çalıştırır.

## 🚀 Kurulum

### Otomatik Kurulum (Önerilen)
1. `install-service.bat` dosyasına çift tıklayın
2. Servis otomatik olarak yüklenecek ve başlayacak
3. Kurulum detayları `install-log.txt` dosyasında görülebilir

### Manuel Kurulum
1. Terminal/CMD açın
2. `cd masaüstü` komutunu çalıştırın
3. `npm install` komutunu çalıştırın
4. `npm install -g pm2` komutunu çalıştırın
5. `pm2 start pm2-config.json` komutunu çalıştırın
6. `pm2 startup` komutunu çalıştırın
7. `pm2 save` komutunu çalıştırın

## 📋 Kullanım

### Servis Yönetimi
- **Başlat**: `start-service.bat` veya `pm2 start youtube-discord-rpc`
- **Durdur**: `stop-service.bat` veya `pm2 stop youtube-discord-rpc`
- **Durum**: `status-service.bat` veya `pm2 status`
- **Loglar**: `pm2 logs youtube-discord-rpc`

### Servis Kaldırma
- `uninstall-service.bat` dosyasına çift tıklayın

## 📝 Log Dosyaları

Her batch dosyası çalıştırıldığında sonuçlar txt dosyalarına kaydedilir:

- **`install-log.txt`** - Kurulum detayları ve sonuçları
- **`uninstall-log.txt`** - Kaldırma detayları ve sonuçları
- **`start-log.txt`** - Başlatma detayları ve sonuçları
- **`stop-log.txt`** - Durdurma detayları ve sonuçları
- **`status-log.txt`** - Durum kontrolü detayları

### Log Dosyalarını Görüntüleme
- Her batch dosyası çalıştırıldıktan sonra ilgili txt dosyasını açabilirsiniz
- Dosyalar masaüstü klasöründe oluşturulur
- Tarih ve saat bilgileri otomatik olarak eklenir

## 🔧 Özellikler

- ✅ **Otomatik başlatma**: Sistem başlangıcında otomatik çalışır
- ✅ **Otomatik yeniden başlatma**: Çökerse otomatik olarak yeniden başlar
- ✅ **Log dosyaları**: Hata ve çıktı logları tutulur
- ✅ **Bellek yönetimi**: 1GB bellek sınırı
- ✅ **Kolay yönetim**: Batch dosyaları ile kolay kontrol
- ✅ **Detaylı loglar**: Her işlem txt dosyalarına kaydedilir

## 📁 Dosya Yapısı

```
masaüstü/
├── rpc.js                 # Ana RPC sunucusu
├── pm2-config.json        # PM2 konfigürasyonu
├── install-service.bat    # ✅ Servis yükleme
├── uninstall-service.bat  # ✅ Servis kaldırma
├── start-service.bat      # ✅ Servis başlatma
├── stop-service.bat       # ✅ Servis durdurma
├── status-service.bat     # ✅ Servis durumu kontrolü
├── logs/                  # 📝 PM2 log dosyaları
├── install-log.txt        # 📝 Kurulum logları
├── uninstall-log.txt      # 📝 Kaldırma logları
├── start-log.txt          # 📝 Başlatma logları
├── stop-log.txt           # 📝 Durdurma logları
├── status-log.txt         # 📝 Durum kontrolü logları
└── README.md             # 📖 Bu dosya
```

## 🎯 Discord Presence

Servis çalıştığında:
- Discord'da YouTube aktivitesi görünür
- Video butonları çalışır
- Gerçek zamanlı güncelleme yapılır

## 🔍 Sorun Giderme

### Servis Başlamıyorsa
1. `status-service.bat` ile durumu kontrol edin
2. `install-log.txt` dosyasını kontrol edin
3. `pm2 logs youtube-discord-rpc` ile logları kontrol edin
4. Discord'un açık olduğundan emin olun

### Discord'da Presence Görünmüyorsa
1. Discord'da RPC ayarlarını kontrol edin
2. `status-service.bat` ile servisin çalıştığından emin olun
3. Eklentinin yüklü olduğundan emin olun

### Log Dosyalarını Kontrol Etme
- Her batch dosyası çalıştırıldıktan sonra ilgili txt dosyasını açın
- Hata mesajları ve başarı durumları detaylı olarak kaydedilir
- Tarih ve saat bilgileri ile hangi işlemin ne zaman yapıldığı görülebilir 