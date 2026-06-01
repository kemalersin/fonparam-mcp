# 📊 FonParam API

FonParam, Türkiye'deki yatırım fonlarının verilerini sunan bir API servisidir.

## ✨ Özellikler

- 📈 Yatırım fonlarının güncel ve geçmiş verilerini sorgulama
- 🏢 Portföy yönetim şirketleri hakkında detaylı bilgiler
- 🔄 Fonların karşılaştırmalı analizi
- 📊 Performans istatistikleri ve getiri oranları

## 🚦 Rate Limiting

API'nin tüm endpointleri için rate limiting uygulanmaktadır:

- ⏱️ Her endpoint için 15 dakikada maksimum 25 istek
- 📅 Her endpoint için günlük maksimum 100 istek
- ⚠️ Rate limit aşıldığında 429 (Too Many Requests) hatası döner
- 🔒 Rate limit sayaçları IP bazlı tutulur

## 🚀 Kurulum

1. Repoyu klonlayın:
```bash
git clone git@github.com:kemalersin/fonparam-backend.git
cd fonparam-backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Örnek env dosyasını kopyalayıp düzenleyin:
```bash
cp .env.example .env
```

4. Veritabanını oluşturun:
```sql
CREATE DATABASE fonparam CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
```

5. Uygulamayı başlatın:
```bash
# 🔧 Geliştirme modu
npm run dev

# 🚀 Prodüksiyon modu
npm run build
npm start
```

## 📚 API Dokümantasyonu

API dokümantasyonuna `https://fonparam.apimapi.net/api-docs` adresinden erişebilirsiniz.

## 🛠️ Teknolojiler

- ⚡ Node.js & Express.js
- 🎯 TypeScript
- 🗄️ MySQL & Sequelize ORM
- 📝 Swagger API Dokümantasyonu
- 🔒 JWT Tabanlı Güvenlik
- 🚦 Rate Limiting & Caching

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing new feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.