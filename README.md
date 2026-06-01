# 📊 FonParam MCP Sunucusu

[![smithery badge](https://smithery.ai/badge/@kemalersin/fonparam-mcp)](https://smithery.ai/server/@kemalersin/fonparam-mcp)

Bu Model Context Protocol (MCP) sunucusu, Claude Desktop'un Türkiye'deki yatırım fonları verilerine erişmesini sağlar. [FonParam API](https://fonparam.apimapi.net) üzerinden fonların güncel verilerini, performans istatistiklerini ve karşılaştırmalarını alabilirsiniz.

<a href="https://glama.ai/mcp/servers/@kemalersin/fonparam-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@kemalersin/fonparam-mcp/badge" alt="FonParam MCP server" />
</a>

## ✨ Özellikler

- 📈 **Fon Listeleme**: Tüm yatırım fonlarını filtreleme ve arama
- 🔍 **Fon Karşılaştırma**: 2-5 fonu karşılaştırarak analiz etme
- 📊 **Performans Analizi**: Fon yatırım analizi ve getiri hesaplaması
- 🏢 **Şirket Bilgileri**: Portföy yönetim şirketleri ve istatistikleri
- 📈 **Geçmiş Veriler**: Fonların tarihsel performans verileri
- 📊 **İstatistikler**: Günlük piyasa istatistikleri
- 💰 **Enflasyon Verileri**: Türkiye enflasyon oranları

## 🚀 Kurulum

### Seçenek 1: NPM ile Kurulum (Önerilen)

NPM paketi otomatik olarak çalıştırılacağı için ayrı kurulum gerekmez. Claude Desktop konfigürasyonunda `npx` kullanarak paketi çalıştırabilirsiniz.

### Seçenek 2: Kaynak Koddan Kurulum

#### 1. Bağımlılıkları Yükleyin

```bash
npm install
```

#### 2. Projeyi Derleyin

```bash
npm run build
```

### Claude Desktop Konfigürasyonu

Claude Desktop'ın `claude_desktop_config.json` dosyasına aşağıdaki konfigürasyonu ekleyin:

#### Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

#### macOS:
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Linux:
```
~/.config/Claude/claude_desktop_config.json
```

**Konfigürasyon:**

#### NPM paketi kullanıyorsanız (önerilen):
```json
{
  "mcpServers": {
    "fonparam": {
      "command": "npx",
      "args": ["-y", "fonparam-mcp"],
      "env": {}
    }
  }
}
```

#### Kaynak koddan kurulum yaptıysanız:
```json
{
  "mcpServers": {
    "fonparam": {
      "command": "node",
      "args": ["/tam/yol/to/fonparam-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

> **Not**: Kaynak koddan kurulum için `/tam/yol/to/fonparam-mcp` kısmını projenizin gerçek yolu ile değiştirin.

### 4. Claude Desktop'ı Yeniden Başlatın

Konfigürasyonu ekledikten sonra Claude Desktop'ı kapatıp yeniden açın.

## 🛠️ Kullanılabilir Araçlar

### 📊 Fon Araçları

- **`list_funds`**: Fonları listeler ve filtreler
- **`top_performing_funds`**: En iyi performans gösteren fonları getirir
- **`compare_funds`**: Fonları karşılaştırır (2-5 fon)
- **`analyze_fund`**: Fon yatırım analizi yapar
- **`fund_historical_data`**: Fonun geçmiş değerlerini getirir

### 🏢 Şirket Araçları

- **`list_companies`**: Portföy yönetim şirketlerini listeler
- **`company_details`**: Şirket detaylarını getirir

### 📈 İstatistik Araçları

- **`statistics`**: Günlük istatistikleri listeler
- **`latest_statistics`**: En son istatistikleri getirir
- **`statistics_by_date`**: Belirli tarihteki istatistikleri getirir

### 🎯 Fon Tipi Araçları

- **`list_fund_types`**: Fon tiplerini listeler
- **`fund_type_details`**: Fon tipi detaylarını getirir

### 💰 Enflasyon Araçları

- **`inflation_rates`**: Enflasyon verilerini listeler
- **`latest_inflation_rate`**: En son enflasyon verisini getirir
- **`monthly_inflation_rate`**: Belirli ay/yıl enflasyon verisini getirir

## 💡 Kullanım Örnekleri

### Claude Desktop'ta Örnek Komutlar:

```
En iyi performans gösteren 10 fonu göster
```

```
"ATA PORTFÖY" şirketine ait fonları listele
```

```
AAK ve DAH fonlarını karşılaştır
```

```
AAK fonuna 10.000 TL yatırıp yıl başından bugüne kadar kaç para olacağını hesapla
```

```
Hisse senedi fonlarının bu ayki performansını göster
```

```
Son enflasyon verilerini göster
```

## 🔧 Geliştirme

### Scripts

```bash
# TypeScript derlemesi (watch mode)
npm run dev

# Projeyi derle
npm run build

# Sunucuyu başlat
npm start

# Derleme dosyalarını temizle
npm run clean
```

### Proje Yapısı

```
src/
├── index.ts          # Ana MCP sunucusu
├── api-client.ts     # FonParam API client
├── tools.ts          # MCP araçları tanımları
└── types.ts          # TypeScript tip tanımları
```

## 🤝 Katkıda Bulunma

1. Repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: amazing new feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🔗 Bağlantılar

- [FonParam API Dokümantasyonu](https://fonparam.apimapi.net/api-docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Desktop](https://claude.ai/desktop)

## ⚠️ Not

Bu sunucu FonParam API'sinin ücretsiz katmanını kullanır ve rate limiting kurallarına tabidir:
- 15 dakikada maksimum 25 istek
- Günlük maksimum 100 istek

Yoğun kullanım için API anahtarı almayı düşünebilirsiniz. 