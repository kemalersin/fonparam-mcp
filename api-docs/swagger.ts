import swaggerJsdoc from 'swagger-jsdoc';
import { FundTypeEnum } from '../types';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'FonParam API',
            version: '1.0.0',
            description: `
# FonParam REST API Dökümantasyonu

FonParam, Türkiye'deki yatırım fonlarının verilerini sunan bir API servisidir. 
Bu API ile fonların güncel ve geçmiş verilerine erişebilir, karşılaştırmalar yapabilir ve detaylı analizler gerçekleştirebilirsiniz.

## Özellikler

- 📊 Tüm yatırım fonlarının güncel verileri
- 📈 Geçmiş performans verileri
- 🔍 Gelişmiş filtreleme ve arama
- 📊 Fon karşılaştırma
- 🏢 Portföy yönetim şirketi bilgileri
- 📈 Enflasyon verileri

## Rate Limiting

24 saat içinde en fazla 100 istek.

## Önbellek (Cache)

Performansı artırmak için önbellek kullanılmaktadır (30 dakika).
<br><br>`,
            contact: {
                name: 'API Desteği',
                email: 'mail@kemalersin.com',
                url: 'https://fonparam.com/docs'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Geliştirme Ortamı'
            },
            {
                url: 'https://fonparam.apimapi.net',
                description: 'Prodüksiyon Ortamı'
            }
        ],
        tags: [
            {
                name: 'Fon Tipleri',
                description: 'Fon tipleri ile ilgili operasyonlar'
            },
            {
                name: 'Fonlar',
                description: 'Yatırım fonları ile ilgili tüm operasyonlar'
            },
            {
                name: 'Portföy Yönetim Şirketleri',
                description: 'Portföy yönetim şirketleri ile ilgili operasyonlar'
            },
            {
                name: 'İstatistikler',
                description: 'Günlük istatistikler ile ilgili operasyonlar'
            },
            {
                name: 'Enflasyon',
                description: 'Enflasyon oranları ile ilgili operasyonlar'
            }
        ],
        paths: {
            '/companies': {
                get: {
                    tags: ['Portföy Yönetim Şirketleri'],
                    summary: 'Tüm portföy yönetim şirketlerini listeler',
                    description: 'Portföy yönetim şirketlerini ve ortalama getiri istatistiklerini listeler',
                    parameters: [
                        {
                            name: 'page',
                            in: 'query',
                            description: 'Sayfa numarası',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                default: 1
                            }
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            description: 'Sayfa başına kayıt sayısı',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 100,
                                default: 20
                            }
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'Sıralama alanı',
                            schema: {
                                type: 'string',
                                enum: [
                                    'code',
                                    'title',
                                    'total_funds',
                                    'avg_yield_1d',
                                    'avg_yield_1w',
                                    'avg_yield_1m',
                                    'avg_yield_3m',
                                    'avg_yield_6m',
                                    'avg_yield_ytd',
                                    'avg_yield_1y',
                                    'avg_yield_3y',
                                    'avg_yield_5y'
                                ],
                                default: 'code'
                            }
                        },
                        {
                            name: 'order',
                            in: 'query',
                            description: 'Sıralama yönü',
                            schema: {
                                type: 'string',
                                enum: ['ASC', 'DESC']
                            }
                        },
                        {
                            name: 'min_total_funds',
                            in: 'query',
                            description: 'Minimum fon sayısı'
                        },
                        {
                            name: 'max_total_funds',
                            in: 'query',
                            description: 'Maksimum fon sayısı'
                        },
                        {
                            name: 'search',
                            in: 'query',
                            description: 'Şirket adı veya kodu ile arama'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            total: {
                                                type: 'integer',
                                                description: 'Toplam kayıt sayısı'
                                            },
                                            page: {
                                                type: 'integer',
                                                description: 'Mevcut sayfa'
                                            },
                                            limit: {
                                                type: 'integer',
                                                description: 'Sayfa başına kayıt sayısı'
                                            },
                                            data: {
                                                $ref: '#/components/schemas/CompanyList'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ValidationError'
                        }
                    }
                }
            },
            '/companies/{code}': {
                get: {
                    tags: ['Portföy Yönetim Şirketleri'],
                    summary: 'Portföy yönetim şirketi detaylarını getirir',
                    description: 'Belirtilen portföy yönetim şirketinin detaylarını ve istatistiklerini getirir',
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            description: 'Şirket kodu',
                            schema: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 10
                            },
                            example: 'APY'
                        },
                        {
                            name: 'include_funds',
                            in: 'query',
                            description: 'Şirketin fonlarını da getir',
                            schema: {
                                type: 'boolean',
                                default: true
                            },
                            example: true
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            company: {
                                                $ref: '#/components/schemas/FundManagementCompany'
                                            },
                                            stats: {
                                                $ref: '#/components/schemas/CompanyStatistics'
                                            }
                                        },
                                        example: {
                                            company: {
                                                code: 'APY',
                                                title: 'ATA PORTFÖY YÖNETİMİ A.Ş.',
                                                logo: 'https://fonparam.apimapi.net/public/logos/ata_portfoy_icon.png',
                                                total_funds: 22,
                                                avg_yield_1d: -0.0042,
                                                avg_yield_1w: 1.0066,
                                                avg_yield_1m: 5.4131,
                                                avg_yield_3m: 8.2963,
                                                avg_yield_6m: 10.8271,
                                                avg_yield_ytd: 43.3379,
                                                avg_yield_1y: 45.65,
                                                avg_yield_3y: 313.4222,
                                                avg_yield_5y: 1750.9015,
                                                best_performing_funds: [
                                                    {
                                                        code: "NKJ",
                                                        title: "ATA PORTFÖY GIG SİGORTA SERBEST (TL) ÖZEL FON",
                                                        type: "serbest",
                                                        yield_1d: 0.3287,
                                                        yield_1w: 3.28,
                                                        yield_1m: 12.2927,
                                                        yield_3m: 17.3773,
                                                        yield_6m: 17.4993,
                                                        yield_ytd: 92.9748,
                                                        yield_1y: 104.1684,
                                                        yield_3y: 665.8415,
                                                        yield_5y: null
                                                    },
                                                    {
                                                        code: "PKF",
                                                        title: "ATA PORTFÖY ALTIN KATILIM FONU",
                                                        type: "katilim",
                                                        yield_1d: 0.115,
                                                        yield_1w: 0.397,
                                                        yield_1m: 2.511,
                                                        yield_3m: 9.5514,
                                                        yield_6m: 26.1391,
                                                        yield_ytd: 54.4689,
                                                        yield_1y: 61.8553,
                                                        yield_3y: null,
                                                        yield_5y: null
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ValidationError'
                        }
                    }
                }
            },
            '/funds': {
                get: {
                    tags: ['Fonlar'],
                    summary: 'Tüm fonları listeler',
                    description: 'Tüm yatırım fonlarını listeler ve filtreleme imkanı sunar',
                    parameters: [
                        {
                            name: 'page',
                            in: 'query',
                            description: 'Sayfa numarası',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                default: 1
                            }
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            description: 'Sayfa başına kayıt sayısı',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 100,
                                default: 20
                            }
                        },
                        {
                            name: 'type',
                            in: 'query',
                            description: 'Fon tipi',
                            schema: {
                                type: 'string',
                                enum: [
                                    'altin',
                                    'borclanma_araclari',
                                    'degisken',
                                    'fon_sepeti',
                                    'gumus',
                                    'hisse_senedi',
                                    'hisse_senedi_yogun',
                                    'karma',
                                    'katilim',
                                    'kiymetli_madenler',
                                    'para_piyasasi',
                                    'serbest',
                                    'yabanci',
                                    'diger'
                                ]
                            }
                        },
                        {
                            name: 'search',
                            in: 'query',
                            description: 'Fon kodu, açıklaması, şirket kodu veya şirket adı ile arama',
                            schema: {
                                type: 'string'
                            }
                        },
                        {
                            name: 'code',
                            in: 'query',
                            description: 'Fon kodu veya kodları (virgülle ayrılmış)',
                            schema: {
                                type: 'string'
                            },
                            example: 'AAK,DAH'
                        },
                        {
                            name: 'management_company',
                            in: 'query',
                            description: 'Portföy yönetim şirketi kodu',
                            schema: {
                                type: 'string'
                            }
                        },
                        {
                            name: 'tefas',
                            in: 'query',
                            description: "TEFAS'ta işlem görme durumu",
                            schema: {
                                type: 'boolean'
                            }
                        },
                        {
                            name: 'min_risk_value',
                            in: 'query',
                            description: 'Minimum risk seviyesi (1-7)',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 7
                            }
                        },
                        {
                            name: 'max_risk_value',
                            in: 'query',
                            description: 'Maksimum risk seviyesi (1-7)',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 7
                            }
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'Sıralama alanı',
                            schema: {
                                type: 'string',
                                enum: [
                                    // Fund temel alanları
                                    'code',
                                    'title',
                                    'tefas',
                                    'risk_value',
                                    'purchase_value_day',
                                    'sale_value_day',

                                    // FundYield alanları
                                    'yield_1d',
                                    'yield_1w',
                                    'yield_1m',
                                    'yield_3m',
                                    'yield_6m',
                                    'yield_ytd',
                                    'yield_1y',
                                    'yield_3y',
                                    'yield_5y',

                                    // FundHistoricalValue alanları
                                    'last_historical_value.value',
                                    'last_historical_value.aum',
                                    'last_historical_value.shares_active',
                                    'last_historical_value.cumulative_cashflow',
                                    'last_historical_value.investor_count',

                                    // FundManagementCompany alanları
                                    'management_company.code',
                                    'management_company.title',

                                    // FundType alanları
                                    'fund_type.type',
                                    'fund_type.short_name',
                                    'fund_type.long_name',
                                    'fund_type.group_name'
                                ],
                                default: 'code'
                            }
                        },
                        {
                            name: 'order',
                            in: 'query',
                            description: 'Sıralama yönü',
                            schema: {
                                type: 'string',
                                enum: ['ASC', 'DESC']
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/PaginatedFundList'
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ValidationError'
                        }
                    }
                }
            },
            '/funds/top-performing': {
                get: {
                    tags: ['Fonlar'],
                    summary: 'En iyi performans gösteren fonları listeler',
                    description: 'Rastgele 10 adet iyi performans gösteren fon getirir. İsteğe bağlı olarak referans fonlar belirterek, bu fonlara benzer performans gösteren fonları bulabilirsiniz.',
                    parameters: [
                        {
                            name: 'funds',
                            in: 'query',
                            description: 'Referans fon kodları (virgülle ayrılmış)',
                            schema: {
                                type: 'string'
                            },
                            example: 'AAK,DAH',
                            required: false
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            $ref: '#/components/schemas/FundYield'
                                        }
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Fon bulunamadı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: {
                                                type: 'string',
                                                example: 'En iyi performans gösteren fonlar bulunamadı'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/funds/compare': {
                get: {
                    tags: ['Fonlar'],
                    summary: 'Fonları karşılaştırır',
                    description: 'Belirtilen fonları karşılaştırır (en az 2, en fazla 5 fon)',
                    parameters: [
                        {
                            name: 'codes',
                            in: 'query',
                            required: true,
                            description: 'Karşılaştırılacak fon kodları (virgülle ayrılmış)',
                            schema: {
                                type: 'string'
                            },
                            example: 'AAK,DAH'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    description: 'Fon kodu',
                                                    example: 'AAK'
                                                },
                                                title: {
                                                    type: 'string',
                                                    description: 'Fon adı',
                                                    example: 'ATA PORTFÖY ÇOKLU VARLIK DEĞİŞKEN FON'
                                                },
                                                tefas: {
                                                    type: 'boolean',
                                                    description: "TEFAS'ta işlem görme durumu",
                                                    example: true
                                                },
                                                management_fee: {
                                                    type: 'float',
                                                    description: 'Risk seviyesi (1-7)',
                                                    example: 1.5,
                                                    nullable: true
                                                },                                                
                                                risk_value: {
                                                    type: 'integer',
                                                    description: 'Risk seviyesi (1-7)',
                                                    example: 4,
                                                    nullable: true
                                                },
                                                purchase_value_day: {
                                                    type: 'integer',
                                                    description: 'Alım valör günü',
                                                    example: 1,
                                                    nullable: true
                                                },
                                                sale_value_day: {
                                                    type: 'integer',
                                                    description: 'Satım valör günü',
                                                    example: 2,
                                                    nullable: true
                                                },
                                                yield_1d: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 günlük getiri (%)',
                                                    example: 0.15,
                                                    nullable: true
                                                },
                                                yield_1w: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 haftalık getiri (%)',
                                                    example: 1.23,
                                                    nullable: true
                                                },
                                                yield_1m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 aylık getiri (%)',
                                                    example: 5.67,
                                                    nullable: true
                                                },
                                                yield_3m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '3 aylık getiri (%)',
                                                    example: 15.89,
                                                    nullable: true
                                                },
                                                yield_6m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '6 aylık getiri (%)',
                                                    example: 32.45,
                                                    nullable: true
                                                },
                                                yield_ytd: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Yıl başından bugüne getiri (%)',
                                                    example: 28.90,
                                                    nullable: true
                                                },
                                                yield_1y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 yıllık getiri (%)',
                                                    example: 45.67,
                                                    nullable: true
                                                },
                                                yield_3y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '3 yıllık getiri (%)',
                                                    example: 125.89,
                                                    nullable: true
                                                },
                                                yield_5y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '5 yıllık getiri (%)',
                                                    example: 234.56,
                                                    nullable: true
                                                },
                                                type: {
                                                    type: 'string',
                                                    description: 'Fon tipi',
                                                    example: 'Değişken Fon'
                                                },
                                                management_company: {
                                                    type: 'object',
                                                    properties: {
                                                        code: {
                                                            type: 'string',
                                                            description: 'Şirket kodu',
                                                            example: 'APY'
                                                        },
                                                        title: {
                                                            type: 'string',
                                                            description: 'Şirket adı',
                                                            example: 'ATA PORTFÖY YÖNETİMİ A.Ş.'
                                                        },
                                                        logo: {
                                                            type: 'string',
                                                            description: 'Şirket logosu URL',
                                                            example: 'https://fonparam.apimapi.net/public/logos/ata_portfoy_icon.png'
                                                        }
                                                    }
                                                },
                                                fund_type: {
                                                    type: 'object',
                                                    properties: {
                                                        type: {
                                                            type: 'string',
                                                            description: 'Fon tipi kodu',
                                                            example: 'degisken'
                                                        },
                                                        short_name: {
                                                            type: 'string',
                                                            description: 'Fon tipi kısa adı',
                                                            example: 'Değişken Fon'
                                                        },
                                                        long_name: {
                                                            type: 'string',
                                                            description: 'Fon tipi uzun adı',
                                                            example: 'Değişken Şemsiye Fonu'
                                                        },
                                                        group_name: {
                                                            type: 'string',
                                                            description: 'Fon grubu adı',
                                                            example: 'Değişken Fonlar'
                                                        }
                                                    }
                                                },
                                                last_historical_value: {
                                                    type: 'object',
                                                    properties: {
                                                        date: {
                                                            type: 'string',
                                                            format: 'date',
                                                            description: 'Tarih',
                                                            example: '2024-03-19'
                                                        },
                                                        value: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Birim pay değeri',
                                                            example: 12.345678
                                                        },
                                                        aum: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Toplam portföy büyüklüğü',
                                                            example: 123456789.12,
                                                            nullable: true
                                                        },
                                                        yield: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Günlük getiri (%)',
                                                            example: 1.23,
                                                            nullable: true
                                                        },
                                                        cumulative_cashflow: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Kümülatif nakit akışı',
                                                            example: -12345.67,
                                                            nullable: true
                                                        },
                                                        investor_count: {
                                                            type: 'integer',
                                                            description: 'Yatırımcı sayısı',
                                                            example: 1234,
                                                            nullable: true
                                                        },
                                                        risk_value: {
                                                            type: 'integer',
                                                            description: 'Risk seviyesi (1-7)',
                                                            example: 4,
                                                            nullable: true
                                                        },
                                                        purchase_value_day: {
                                                            type: 'integer',
                                                            description: 'Alım valör günü',
                                                            example: 1,
                                                            nullable: true
                                                        },
                                                        sale_value_day: {
                                                            type: 'integer',
                                                            description: 'Satım valör günü',
                                                            example: 2,
                                                            nullable: true
                                                        },
                                                        shares_active: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Aktif pay sayısı',
                                                            example: 1234567.89,
                                                            nullable: true
                                                        },
                                                        shares_total: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Toplam pay sayısı',
                                                            example: 2345678.90,
                                                            nullable: true
                                                        },
                                                        occupancy_rate: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Doluluk oranı (%)',
                                                            example: 85.50,
                                                            nullable: true
                                                        },
                                                        market_share: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Pazar payı (%)',
                                                            example: 2.75,
                                                            nullable: true
                                                        },
                                                        management_fee: {
                                                            type: 'number',
                                                            format: 'float',
                                                            description: 'Yönetim ücreti (%)',
                                                            example: 1.50,
                                                            nullable: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Geçersiz istek',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: {
                                                type: 'string',
                                                example: 'En az 2, en fazla 5 fon karşılaştırılabilir'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '404': {
                            description: 'Fon bulunamadı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: {
                                                type: 'string',
                                                example: 'Bazı fonlar bulunamadı'
                                            },
                                            missing_codes: {
                                                type: 'array',
                                                items: {
                                                    type: 'string'
                                                },
                                                example: ['ABC', 'XYZ']
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/funds/{code}/analyze': {
                get: {
                    tags: ['Fonlar'],
                    summary: 'Fon için yatırım analizi yapar',
                    description: 'Belirtilen fon için geçmiş verileri kullanarak yatırım analizi yapar',
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            description: 'Fon kodu',
                            schema: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 10
                            },
                            example: 'AAK'
                        },
                        {
                            name: 'startDate',
                            in: 'query',
                            required: true,
                            description: 'Başlangıç tarihi',
                            schema: {
                                type: 'string',
                                enum: ['last_1_day',
                                    'last_1_week',
                                    'last_1_month',
                                    'last_3_months',
                                    'last_6_months',
                                    'year_start',
                                    'last_1_year',
                                    'last_3_years',
                                    'last_5_years'
                                ]
                            },
                            example: 'year_start'
                        },
                        {
                            name: 'initialInvestment',
                            in: 'query',
                            required: true,
                            description: 'Başlangıç yatırımı',
                            schema: {
                                type: 'number',
                                minimum: 0
                            },
                            example: 10000
                        },
                        {
                            name: 'monthlyInvestment',
                            in: 'query',
                            required: false,
                            description: 'Aylık yatırım tutarı',
                            schema: {
                                type: 'number',
                                minimum: 0,
                                default: 0
                            },
                            example: 1000
                        },
                        {
                            name: 'yearlyIncrease.type',
                            in: 'query',
                            required: false,
                            description: 'Yıllık artış tipi',
                            schema: {
                                type: 'string',
                                enum: ['percentage', 'amount']
                            },
                            example: 'percentage'
                        },
                        {
                            name: 'yearlyIncrease.value',
                            in: 'query',
                            required: false,
                            description: 'Yıllık artış değeri',
                            schema: {
                                type: 'number',
                                minimum: 0
                            },
                            example: 10
                        },
                        {
                            name: 'includeMonthlyDetails',
                            in: 'query',
                            required: false,
                            description: 'Aylık detayları getir',
                            schema: {
                                type: 'boolean',
                                default: true
                            },
                            example: true
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            code: {
                                                type: 'string',
                                                description: 'Fon kodu',
                                                example: 'AAK'
                                            },
                                            management_company_id: {
                                                type: 'string',
                                                description: 'Portföy yönetim şirketi kodu',
                                                example: 'ATA'
                                            },
                                            title: {
                                                type: 'string',
                                                description: 'Fon adı',
                                                example: 'ATA PORTFÖY ÇOKLU VARLIK DEĞİŞKEN FONU'
                                            },
                                            summary: {
                                                type: 'object',
                                                properties: {
                                                    totalInvestment: {
                                                        type: 'number',
                                                        description: 'Toplam yatırım',
                                                        example: 21000
                                                    },
                                                    currentValue: {
                                                        type: 'number',
                                                        description: 'Güncel değer',
                                                        example: 27265.0760933796
                                                    },
                                                    totalYield: {
                                                        type: 'number',
                                                        description: 'Toplam getiri (tutar)',
                                                        example: 6265.076093379601
                                                    },
                                                    totalYieldPercentage: {
                                                        type: 'number',
                                                        description: 'Toplam getiri (%)',
                                                        example: 29.833695682760002
                                                    },
                                                    cumulativeInflation: {
                                                        type: 'number',
                                                        description: 'Kümülatif enflasyon',
                                                        example: 46.10242115919587
                                                    },
                                                    realTotalYield: {
                                                        type: 'number',
                                                        description: 'Gerçek toplam getiri (tutar)',
                                                        example: -2338.38174819083
                                                    },
                                                    realTotalYieldPercentage: {
                                                        type: 'number',
                                                        description: 'Gerçek toplam getiri (%)',
                                                        example: -11.135151181861096
                                                    }
                                                }
                                            },
                                            periodDetails: {
                                                type: 'array',
                                                items: {
                                                    type: 'object',
                                                    properties: {
                                                        date: {
                                                            type: 'string',
                                                            description: 'Tarih',
                                                            example: '2024-01-02'
                                                        },
                                                        investment: {
                                                            type: 'number',
                                                            description: 'O ay yapılan yatırım',
                                                            example: 0
                                                        },
                                                        totalInvestment: {
                                                            type: 'number',
                                                            description: 'O ana kadar yapılan toplam yatırım',
                                                            example: 10000
                                                        },
                                                        unitPrice: {
                                                            type: 'number',
                                                            description: 'Fon birim fiyatı',
                                                            example: 16.276826
                                                        },
                                                        units: {
                                                            type: 'number',
                                                            description: 'O ay alınan pay adedi',
                                                            example: 614.3703938347685
                                                        },
                                                        totalUnits: {
                                                            type: 'number',
                                                            description: 'Toplam pay adedi',
                                                            example: 614.3703938347685
                                                        },
                                                        value: {
                                                            type: 'number',
                                                            description: 'Yatırımın o ayki değeri',
                                                            example: 10000
                                                        },
                                                        periodChange: {
                                                            type: 'number',
                                                            description: 'O ayki değişim (tutar)',
                                                            example: 0
                                                        },
                                                        periodChangePercentage: {
                                                            type: 'number',
                                                            description: 'O ayki değişim (%)',
                                                            example: 0
                                                        },
                                                        totalYield: {
                                                            type: 'number',
                                                            description: 'O ana kadarki toplam getiri (tutar)',
                                                            example: 0
                                                        },
                                                        totalYieldPercentage: {
                                                            type: 'number',
                                                            description: 'O ana kadarki toplam getiri (%)',
                                                            example: 0
                                                        },
                                                        monthlyInflation: {
                                                            type: 'number',
                                                            description: 'Aylık enflasyon oranı (%)',
                                                            example: 6.7
                                                        },
                                                        cumulativeInflation: {
                                                            type: 'number',
                                                            description: 'Kümülatif enflasyon',
                                                            example: 6.699999999999989
                                                        },
                                                        realPeriodChange: {
                                                            type: 'number',
                                                            description: 'Gerçek o ayki değişim (tutar)',
                                                            example: 868.1654684122489
                                                        },
                                                        realPeriodChangePercentage: {
                                                            type: 'number',
                                                            description: 'Gerçek o ayki değişim (%)',
                                                            example: 3.6141517270277923
                                                        },
                                                        realTotalYield: {
                                                            type: 'number',
                                                            description: 'Gerçek o ayki getiri (tutar)',
                                                            example: -392.61637150465504
                                                        },
                                                        realTotalYieldPercentage: {
                                                            type: 'number',
                                                            description: 'Gerçek o ayki getiri (%)',
                                                            example: -3.5692397409514096
                                                        }
                                                    }
                                                },
                                                example: [
                                                    {
                                                        date: '2024-01-02',
                                                        investment: 0,
                                                        totalInvestment: 10000,
                                                        unitPrice: 16.276826,
                                                        units: 614.3703938347685,
                                                        totalUnits: 614.3703938347685,
                                                        value: 10000,
                                                        periodChange: 0,
                                                        periodChangePercentage: 0,
                                                        totalYield: 0,
                                                        totalYieldPercentage: 0,
                                                        monthlyInflation: 6.7,
                                                        cumulativeInflation: 6.699999999999989,
                                                        realPeriodChange: 0,
                                                        realPeriodChangePercentage: 0,
                                                        realTotalYield: 0,
                                                        realTotalYieldPercentage: 0
                                                    },
                                                    {
                                                        date: '2024-02-02',
                                                        investment: 1000,
                                                        totalInvestment: 11000,
                                                        unitPrice: 17.629084,
                                                        units: 56.724444673359095,
                                                        totalUnits: 671.0948385081276,
                                                        value: 11830.787280026216,
                                                        periodChange: 907.4933641313237,
                                                        periodChangePercentage: 8.307872800262158,
                                                        totalYield: 830.7872800262157,
                                                        totalYieldPercentage: 7.552611636601961,
                                                        monthlyInflation: 4.53,
                                                        cumulativeInflation: 11.533509999999978,
                                                        realPeriodChange: 868.1654684122489,
                                                        realPeriodChangePercentage: 3.6141517270277923,
                                                        realTotalYield: -392.61637150465504,
                                                        realTotalYieldPercentage: -3.5692397409514096
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            $ref: '#/components/responses/ValidationError'
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/funds/{code}/historical': {
                get: {
                    tags: ['Fonlar'],
                    summary: 'Fonun geçmiş değerlerini getirir',
                    description: 'Belirtilen fonun geçmiş değerlerini listeler',
                    parameters: [
                        {
                            name: 'code',
                            in: 'path',
                            required: true,
                            description: 'Fon kodu',
                            schema: {
                                type: 'string'
                            },
                            example: 'AAK'
                        },
                        {
                            name: 'start_date',
                            in: 'query',
                            description: 'Başlangıç tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            },
                            example: '2024-01-01'
                        },
                        {
                            name: 'end_date',
                            in: 'query',
                            description: 'Bitiş tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            },
                            example: '2024-03-19'
                        },
                        {
                            name: 'interval',
                            in: 'query',
                            description: 'Veri aralığı (daily ve weekly sadece API key sahipleri ve izin verilen IP adresleri için kullanılabilir)',
                            schema: {
                                type: 'string',
                                enum: ['daily', 'weekly', 'monthly'],
                                default: 'monthly'
                            }
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'Sıralama alanı',
                            schema: {
                                type: 'string',
                                enum: [
                                    'date',
                                    'value',
                                    'aum',
                                    'shares_active',
                                    'shares_total',
                                    'yield',
                                    'cumulative_cashflow',
                                    'investor_count',
                                    'risk_value',
                                    'purchase_value_day',
                                    'sale_value_day',
                                    'occupancy_rate',
                                    'market_share',
                                    'management_fee'
                                ],
                                default: 'date'
                            }
                        },
                        {
                            name: 'order',
                            in: 'query',
                            description: 'Sıralama yönü',
                            schema: {
                                type: 'string',
                                enum: ['ASC', 'DESC'],
                                default: 'DESC'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                code: {
                                                    type: 'string',
                                                    description: 'Fon kodu'
                                                },
                                                date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    description: 'Tarih',
                                                    example: '2024-03-19'
                                                },
                                                value: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Birim pay değeri',
                                                    example: 12.345678
                                                },
                                                aum: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Toplam portföy büyüklüğü',
                                                    example: 123456789.12,
                                                    nullable: true
                                                },
                                                yield: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Günlük getiri (%)',
                                                    example: 1.23,
                                                    nullable: true
                                                },
                                                cumulative_cashflow: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Kümülatif nakit akışı',
                                                    example: -12345.67,
                                                    nullable: true
                                                },
                                                investor_count: {
                                                    type: 'integer',
                                                    description: 'Yatırımcı sayısı',
                                                    example: 1234,
                                                    nullable: true
                                                },
                                                risk_value: {
                                                    type: 'integer',
                                                    description: 'Risk seviyesi (1-7)',
                                                    example: 4,
                                                    nullable: true
                                                },
                                                purchase_value_day: {
                                                    type: 'integer',
                                                    description: 'Alım valör günü',
                                                    example: 1,
                                                    nullable: true
                                                },
                                                sale_value_day: {
                                                    type: 'integer',
                                                    description: 'Satım valör günü',
                                                    example: 2,
                                                    nullable: true
                                                },
                                                shares_active: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Aktif pay sayısı',
                                                    example: 1234567.89,
                                                    nullable: true
                                                },
                                                shares_total: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Toplam pay sayısı',
                                                    example: 2345678.90,
                                                    nullable: true
                                                },
                                                occupancy_rate: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Doluluk oranı (%)',
                                                    example: 85.50,
                                                    nullable: true
                                                },
                                                market_share: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Pazar payı (%)',
                                                    example: 2.75,
                                                    nullable: true
                                                },
                                                management_fee: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Yönetim ücreti (%)',
                                                    example: 1.50,
                                                    nullable: true
                                                }
                                            }
                                        },
                                        example: [
                                            {
                                                "code": "AAK",
                                                "date": "2024-03-19",
                                                "value": 12.345678,
                                                "aum": 123456789.12,
                                                "yield": 1.23,
                                                "cumulative_cashflow": -12345.67,
                                                "investor_count": 1234,
                                                "risk_value": 4,
                                                "purchase_value_day": 1,
                                                "sale_value_day": 2,
                                                "shares_active": 1234567.89,
                                                "shares_total": 2345678.90,
                                                "occupancy_rate": 85.50,
                                                "market_share": 2.75,
                                                "management_fee": 1.50
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/statistics': {
                get: {
                    tags: ['İstatistikler'],
                    summary: 'Günlük istatistikleri listeler',
                    description: 'Günlük bazda toplam fon, şirket, yatırımcı sayısı ve ortalama getiri istatistiklerini listeler',
                    parameters: [
                        {
                            name: 'start_date',
                            in: 'query',
                            description: 'Başlangıç tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            }
                        },
                        {
                            name: 'end_date',
                            in: 'query',
                            description: 'Bitiş tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            }
                        },
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'Sıralama alanı',
                            schema: {
                                type: 'string',
                                enum: [
                                    'date',
                                    'total_funds',
                                    'total_companies',
                                    'total_investors',
                                    'total_aum',
                                    'avg_profit',
                                    'avg_loss'
                                ],
                                default: 'date'
                            }
                        },
                        {
                            name: 'order',
                            in: 'query',
                            description: 'Sıralama yönü',
                            schema: {
                                type: 'string',
                                enum: ['ASC', 'DESC'],
                                default: 'DESC'
                            }
                        },
                        {
                            name: 'page',
                            in: 'query',
                            description: 'Sayfa numarası',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                default: 1
                            }
                        },
                        {
                            name: 'limit',
                            in: 'query',
                            description: 'Sayfa başına kayıt sayısı',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 100,
                                default: 20
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            total: {
                                                type: 'integer',
                                                description: 'Toplam kayıt sayısı'
                                            },
                                            page: {
                                                type: 'integer',
                                                description: 'Mevcut sayfa'
                                            },
                                            limit: {
                                                type: 'integer',
                                                description: 'Sayfa başına kayıt sayısı'
                                            },
                                            data: {
                                                type: 'array',
                                                items: {
                                                    $ref: '#/components/schemas/DailyStatistics'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/statistics/latest': {
                get: {
                    tags: ['İstatistikler'],
                    summary: 'Son istatistikleri getirir',
                    description: 'En son güne ait istatistikleri getirir',
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/DailyStatistics'
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/statistics/{date}': {
                get: {
                    tags: ['İstatistikler'],
                    summary: 'Belirli bir günün istatistiklerini getirir',
                    description: 'Belirtilen tarihe ait istatistikleri getirir',
                    parameters: [
                        {
                            name: 'date',
                            in: 'path',
                            required: true,
                            description: 'İstatistik tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            }
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/DailyStatistics'
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/fund-types': {
                get: {
                    tags: ['Fon Tipleri'],
                    summary: 'Fon tiplerini listeler',
                    description: 'Tüm fon tiplerini ve detaylarını listeler',
                    parameters: [
                        {
                            name: 'sort',
                            in: 'query',
                            description: 'Sıralama alanı',
                            schema: {
                                type: 'string',
                                enum: [
                                    'type',
                                    'short_name',
                                    'long_name',
                                    'group_name'
                                ],
                                default: 'type'
                            }
                        },
                        {
                            name: 'order',
                            in: 'query',
                            description: 'Sıralama yönü',
                            schema: {
                                type: 'string',
                                enum: ['ASC', 'DESC'],
                                default: 'ASC'
                            }
                        },
                        {
                            name: 'min_total_funds',
                            in: 'query',
                            description: 'Minimum fon sayısı',
                            schema: {
                                type: 'integer',
                                minimum: 0
                            },
                            example: 50
                        },
                        {
                            name: 'max_total_funds',
                            in: 'query',
                            description: 'Maksimum fon sayısı',
                            schema: {
                                type: 'integer',
                                minimum: 0
                            },
                            example: 150
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                type: {
                                                    type: 'string',
                                                    enum: Object.values(FundTypeEnum),
                                                    description: 'Fon tipi kodu',
                                                    example: 'hisse_senedi'
                                                },
                                                short_name: {
                                                    type: 'string',
                                                    description: 'Fon tipi kısa adı',
                                                    example: 'Hisse Senedi Fonu'
                                                },
                                                long_name: {
                                                    type: 'string',
                                                    description: 'Fon tipi uzun adı',
                                                    example: 'Hisse Senedi Şemsiye Fonu'
                                                },
                                                group_name: {
                                                    type: 'string',
                                                    description: 'Fon grubu adı',
                                                    example: 'Hisse Senedi Fonları'
                                                },
                                                yield_1d: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 günlük getiri (%)',
                                                    example: 0.197,
                                                    nullable: true
                                                },
                                                yield_1w: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 haftalık getiri (%)',
                                                    example: 1.183,
                                                    nullable: true
                                                },
                                                yield_1m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 aylık getiri (%)',
                                                    example: 8.685,
                                                    nullable: true
                                                },
                                                yield_3m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '3 aylık getiri (%)',
                                                    example: 8.124,
                                                    nullable: true
                                                },
                                                yield_6m: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '6 aylık getiri (%)',
                                                    example: 2.9334,
                                                    nullable: true
                                                },
                                                yield_ytd: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Yıl başından bugüne getiri (%)',
                                                    example: 46.0666,
                                                    nullable: true
                                                },
                                                yield_1y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '1 yıllık getiri (%)',
                                                    example: 45.2268,
                                                    nullable: true
                                                },
                                                yield_3y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '3 yıllık getiri (%)',
                                                    example: 509.718,
                                                    nullable: true
                                                },
                                                yield_5y: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: '5 yıllık getiri (%)',
                                                    example: 1166.1549,
                                                    nullable: true
                                                },
                                                total_funds: {
                                                    type: 'integer',
                                                    description: 'Toplam fon sayısı',
                                                    example: 130
                                                },
                                                total_aum: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Toplam portföy büyüklüğü',
                                                    example: 179311081590,
                                                    nullable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/fund-types/{type}': {
                get: {
                    tags: ['Fon Tipleri'],
                    summary: 'Belirli bir fon tipinin detaylarını getirir',
                    description: 'Belirtilen fon tipinin detaylarını getirir',
                    parameters: [
                        {
                            name: 'type',
                            in: 'path',
                            required: true,
                            description: 'Fon tipi kodu',
                            schema: {
                                type: 'string',
                                enum: Object.values(FundTypeEnum)
                            },
                            example: 'hisse_senedi'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            type: {
                                                type: 'string',
                                                enum: Object.values(FundTypeEnum),
                                                description: 'Fon tipi kodu',
                                                example: 'hisse_senedi'
                                            },
                                            short_name: {
                                                type: 'string',
                                                description: 'Fon tipi kısa adı',
                                                example: 'Hisse Senedi Fonu'
                                            },
                                            long_name: {
                                                type: 'string',
                                                description: 'Fon tipi uzun adı',
                                                example: 'Hisse Senedi Şemsiye Fonu'
                                            },
                                            group_name: {
                                                type: 'string',
                                                description: 'Fon grubu adı',
                                                example: 'Hisse Senedi Fonları'
                                            },
                                            yield_1d: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 günlük getiri (%)',
                                                example: 0.197,
                                                nullable: true
                                            },
                                            yield_1w: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 haftalık getiri (%)',
                                                example: 1.183,
                                                nullable: true
                                            },
                                            yield_1m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 aylık getiri (%)',
                                                example: 8.685,
                                                nullable: true
                                            },
                                            yield_3m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '3 aylık getiri (%)',
                                                example: 8.124,
                                                nullable: true
                                            },
                                            yield_6m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '6 aylık getiri (%)',
                                                example: 2.9334,
                                                nullable: true
                                            },
                                            yield_ytd: {
                                                type: 'number',
                                                format: 'float',
                                                description: 'Yıl başından bugüne getiri (%)',
                                                example: 46.0666,
                                                nullable: true
                                            },
                                            yield_1y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 yıllık getiri (%)',
                                                example: 45.2268,
                                                nullable: true
                                            },
                                            yield_3y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '3 yıllık getiri (%)',
                                                example: 509.718,
                                                nullable: true
                                            },
                                            yield_5y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '5 yıllık getiri (%)',
                                                example: 1166.1549,
                                                nullable: true
                                            },
                                            total_funds: {
                                                type: 'integer',
                                                description: 'Toplam fon sayısı',
                                                example: 130
                                            },
                                            total_aum: {
                                                type: 'number',
                                                format: 'float',
                                                description: 'Toplam portföy büyüklüğü',
                                                example: 179311081590,
                                                nullable: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            $ref: '#/components/responses/ValidationError'
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/inflation': {
                get: {
                    tags: ['Enflasyon'],
                    summary: 'Enflasyon verilerini listeler',
                    description: 'Belirtilen tarih aralığındaki tüm enflasyon verilerini listeler',
                    parameters: [
                        {
                            name: 'start_date',
                            in: 'query',
                            description: 'Başlangıç tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            },
                            example: '2024-01-01'
                        },
                        {
                            name: 'end_date',
                            in: 'query',
                            description: 'Bitiş tarihi (YYYY-MM-DD)',
                            schema: {
                                type: 'string',
                                format: 'date'
                            },
                            example: '2024-03-19'
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'array',
                                        items: {
                                            type: 'object',
                                            properties: {
                                                date: {
                                                    type: 'string',
                                                    format: 'date',
                                                    description: 'Tarih',
                                                    example: '2024-03-01'
                                                },
                                                monthly_rate: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Aylık enflasyon oranı (%)',
                                                    example: 4.53
                                                },
                                                yearly_rate: {
                                                    type: 'number',
                                                    format: 'float',
                                                    description: 'Yıllık enflasyon oranı (%)',
                                                    example: 67.07
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Geçersiz istek',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: {
                                                type: 'string',
                                                example: 'Geçersiz tarih aralığı'
                                            },
                                            message: {
                                                type: 'string',
                                                example: 'Başlangıç tarihi, bitiş tarihinden büyük olamaz'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/inflation/latest': {
                get: {
                    tags: ['Enflasyon'],
                    summary: 'Son enflasyon verisini getirir',
                    description: 'En son aya ait enflasyon verilerini getirir',
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/InflationRate'
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            },
            '/inflation/{year}/{month}': {
                get: {
                    tags: ['Enflasyon'],
                    summary: 'Belirli bir ay ve yıldaki enflasyon verisini getirir',
                    description: 'Belirtilen ay ve yıla ait enflasyon verilerini getirir (ayın son günü)',
                    parameters: [
                        {
                            name: 'year',
                            in: 'path',
                            required: true,
                            description: 'Yıl',
                            schema: {
                                type: 'integer',
                                minimum: 2000
                            },
                            example: 2023
                        },
                        {
                            name: 'month',
                            in: 'path',
                            required: true,
                            description: 'Ay (1-12)',
                            schema: {
                                type: 'integer',
                                minimum: 1,
                                maximum: 12
                            },
                            example: 12
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Başarılı',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/InflationRate'
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Geçersiz istek',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            error: {
                                                type: 'string',
                                                example: 'Ay ve yıl parametreleri gerekli'
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        '404': {
                            $ref: '#/components/responses/NotFound'
                        },
                        '500': {
                            $ref: '#/components/responses/ServerError'
                        }
                    }
                }
            }
        },
        components: {
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Hata mesajı',
                            example: 'Geçersiz fon kodu'
                        }
                    }
                },
                ValidationError: {
                    type: 'object',
                    properties: {
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    param: {
                                        type: 'string',
                                        description: 'Hatalı parametre',
                                        example: 'code'
                                    },
                                    msg: {
                                        type: 'string',
                                        description: 'Hata mesajı',
                                        example: 'Fon kodu geçerli değil'
                                    },
                                    value: {
                                        type: 'string',
                                        description: 'Gönderilen değer',
                                        example: 'INVALID'
                                    }
                                }
                            }
                        }
                    }
                },
                FundManagementCompany: {
                    type: 'object',
                    required: ['code', 'title'],
                    properties: {
                        code: {
                            type: 'string',
                            description: 'Şirket kodu',
                            example: 'APY'
                        },
                        title: {
                            type: 'string',
                            description: 'Şirket adı',
                            example: 'ATA PORTFÖY YÖNETİMİ A.Ş.'
                        },
                        logo: {
                            type: 'string',
                            description: 'Şirket logosu URL',
                            example: 'https://fonparam.apimapi.net/public/logos/ata_portfoy_icon.png'
                        },
                        total_funds: {
                            type: 'integer',
                            description: 'Toplam fon sayısı',
                            example: 42
                        },
                        avg_yield_1d: {
                            type: 'number',
                            format: 'float',
                            description: '1 günlük ortalama getiri',
                            example: 0.45,
                            nullable: true
                        },
                        avg_yield_1w: {
                            type: 'number',
                            format: 'float',
                            description: '1 haftalık ortalama getiri',
                            example: 1.23,
                            nullable: true
                        },
                        avg_yield_1m: {
                            type: 'number',
                            format: 'float',
                            description: '1 aylık ortalama getiri',
                            example: 2.45,
                            nullable: true
                        },
                        avg_yield_3m: {
                            type: 'number',
                            format: 'float',
                            description: '3 aylık ortalama getiri',
                            example: 5.67,
                            nullable: true
                        },
                        avg_yield_6m: {
                            type: 'number',
                            format: 'float',
                            description: '6 aylık ortalama getiri',
                            example: 15.67,
                            nullable: true
                        },
                        avg_yield_ytd: {
                            type: 'number',
                            format: 'float',
                            description: 'Yıl başından bugüne ortalama getiri',
                            example: 12.34,
                            nullable: true
                        },
                        avg_yield_1y: {
                            type: 'number',
                            format: 'float',
                            description: '1 yıllık ortalama getiri',
                            example: 28.91,
                            nullable: true
                        },
                        avg_yield_3y: {
                            type: 'number',
                            format: 'float',
                            description: '3 yıllık ortalama getiri',
                            example: 95.67,
                            nullable: true
                        },
                        avg_yield_5y: {
                            type: 'number',
                            format: 'float',
                            description: '5 yıllık ortalama getiri',
                            example: 156.78,
                            nullable: true
                        }
                    }
                },
                Fund: {
                    type: 'object',
                    required: ['code', 'management_company_id', 'title', 'type', 'has_historical_data'],
                    properties: {
                        code: {
                            type: 'string',
                            description: 'Fon kodu',
                            example: 'AAK'
                        },
                        management_company_id: {
                            type: 'string',
                            description: 'Portföy yönetim şirketi kodu',
                            example: 'APY'
                        },
                        title: {
                            type: 'string',
                            description: 'Fon adı',
                            example: 'ATA PORTFÖY BİRİNCİ HİSSE SENEDİ FONU'
                        },
                        type: {
                            type: 'string',
                            enum: Object.values(FundTypeEnum),
                            description: 'Fon tipi',
                            example: 'hisse_senedi'
                        },
                        tefas: {
                            type: 'boolean',
                            description: 'TEFAS\'ta işlem görüyor mu?',
                            example: true,
                            nullable: true
                        },
                        has_historical_data: {
                            type: 'boolean',
                            description: 'Geçmiş verisi var mı?',
                            example: true
                        },
                        historical_data_check_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Geçmiş veri kontrol tarihi',
                            example: '2023-12-14T10:00:00.000Z',
                            nullable: true
                        },
                        risk_value: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 7,
                            description: 'Fonun risk seviyesi (1: En düşük risk, 7: En yüksek risk)',
                            example: 4,
                            nullable: true
                        },
                        purchase_value_day: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Alım valör günü',
                            example: 1,
                            nullable: true
                        },
                        sale_value_day: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Satım valör günü',
                            example: 2,
                            nullable: true
                        }
                    }
                },
                FundType: {
                    type: 'object',
                    required: ['type', 'short_name', 'long_name', 'group_name'],
                    properties: {
                        type: {
                            type: 'string',
                            enum: Object.values(FundTypeEnum),
                            description: 'Fon tipi kodu',
                            example: 'hisse_senedi'
                        },
                        short_name: {
                            type: 'string',
                            description: 'Fon tipi kısa adı',
                            example: 'Hisse Senedi Fonu'
                        },
                        long_name: {
                            type: 'string',
                            description: 'Fon tipi uzun adı',
                            example: 'Hisse Senedi Şemsiye Fonu'
                        },
                        group_name: {
                            type: 'string',
                            description: 'Fon grubu adı',
                            example: 'Hisse Senedi Fonları'
                        }
                    }
                },
                FundTypeYields: {
                    type: 'object',
                    required: ['type', 'total_funds'],
                    properties: {
                        type: {
                            type: 'string',
                            enum: Object.values(FundTypeEnum),
                            description: 'Fon tipi',
                            example: 'hisse_senedi'
                        },
                        yield_1d: {
                            type: 'number',
                            format: 'float',
                            description: '1 günlük getiri (%)',
                            example: 0.197,
                            nullable: true
                        },
                        yield_1w: {
                            type: 'number',
                            format: 'float',
                            description: '1 haftalık getiri (%)',
                            example: 1.183,
                            nullable: true
                        },
                        yield_1m: {
                            type: 'number',
                            format: 'float',
                            description: '1 aylık getiri (%)',
                            example: 8.685,
                            nullable: true
                        },
                        yield_3m: {
                            type: 'number',
                            format: 'float',
                            description: '3 aylık getiri (%)',
                            example: 8.124,
                            nullable: true
                        },
                        yield_6m: {
                            type: 'number',
                            format: 'float',
                            description: '6 aylık getiri (%)',
                            example: 2.9334,
                            nullable: true
                        },
                        yield_ytd: {
                            type: 'number',
                            format: 'float',
                            description: 'Yıl başından bugüne getiri (%)',
                            example: 46.0666,
                            nullable: true
                        },
                        yield_1y: {
                            type: 'number',
                            format: 'float',
                            description: '1 yıllık getiri (%)',
                            example: 45.2268,
                            nullable: true
                        },
                        yield_3y: {
                            type: 'number',
                            format: 'float',
                            description: '3 yıllık getiri (%)',
                            example: 509.718,
                            nullable: true
                        },
                        yield_5y: {
                            type: 'number',
                            format: 'float',
                            description: '5 yıllık getiri (%)',
                            example: 1166.1549,
                            nullable: true
                        },
                        total_funds: {
                            type: 'integer',
                            description: 'Toplam fon sayısı',
                            example: 130
                        },
                        total_aum: {
                            type: 'number',
                            format: 'float',
                            description: 'Toplam portföy büyüklüğü',
                            example: 179311081590,
                            nullable: true
                        }
                    }
                },
                FundYield: {
                    type: 'object',
                    required: ['code'],
                    properties: {
                        code: {
                            type: 'string',
                            description: 'Fon kodu',
                            example: 'AAK'
                        },
                        risk_value: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 7,
                            description: 'Fonun risk seviyesi (1: En düşük risk, 7: En yüksek risk)',
                            example: 4,
                            nullable: true
                        },
                        yield_1d: {
                            type: 'number',
                            format: 'float',
                            description: '1 günlük getiri (%)',
                            example: 0.197,
                            nullable: true
                        },
                        yield_1w: {
                            type: 'number',
                            format: 'float',
                            description: '1 haftalık getiri (%)',
                            example: 1.183,
                            nullable: true
                        },
                        yield_1m: {
                            type: 'number',
                            format: 'float',
                            description: '1 aylık getiri (%)',
                            example: 8.685,
                            nullable: true
                        },
                        yield_3m: {
                            type: 'number',
                            format: 'float',
                            description: '3 aylık getiri (%)',
                            example: 8.124,
                            nullable: true
                        },
                        yield_6m: {
                            type: 'number',
                            format: 'float',
                            description: '6 aylık getiri (%)',
                            example: 2.9334,
                            nullable: true
                        },
                        yield_ytd: {
                            type: 'number',
                            format: 'float',
                            description: 'Yıl başından bugüne getiri (%)',
                            example: 46.0666,
                            nullable: true
                        },
                        yield_1y: {
                            type: 'number',
                            format: 'float',
                            description: '1 yıllık getiri (%)',
                            example: 45.2268,
                            nullable: true
                        },
                        yield_3y: {
                            type: 'number',
                            format: 'float',
                            description: '3 yıllık getiri (%)',
                            example: 509.718,
                            nullable: true
                        },
                        yield_5y: {
                            type: 'number',
                            format: 'float',
                            description: '5 yıllık getiri (%)',
                            example: 1166.1549,
                            nullable: true
                        }
                    }
                },
                FundHistoricalValue: {
                    type: 'object',
                    required: ['code', 'date', 'value'],
                    properties: {
                        code: {
                            type: 'string',
                            description: 'Fon kodu',
                            example: 'AAK'
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Değer tarihi',
                            example: '2023-12-14'
                        },
                        value: {
                            type: 'number',
                            format: 'float',
                            description: 'Fon birim pay değeri',
                            example: 12.345678
                        },
                        aum: {
                            type: 'number',
                            format: 'float',
                            description: 'Portföy büyüklüğü',
                            example: 123456789.12,
                            nullable: true
                        },
                        yield: {
                            type: 'number',
                            format: 'float',
                            description: 'Günlük getiri (%)',
                            example: 1.23,
                            nullable: true
                        },
                        cumulative_cashflow: {
                            type: 'number',
                            format: 'float',
                            description: 'Kümülatif nakit akışı',
                            example: -12345.67,
                            nullable: true
                        },
                        investor_count: {
                            type: 'integer',
                            description: 'Yatırımcı sayısı',
                            example: 1234,
                            nullable: true
                        },
                        risk_value: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 7,
                            description: 'Fonun risk seviyesi (1: En düşük risk, 7: En yüksek risk)',
                            example: 4,
                            nullable: true
                        },
                        purchase_value_day: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Alım valör günü',
                            example: 1,
                            nullable: true
                        },
                        sale_value_day: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Satım valör günü',
                            example: 2,
                            nullable: true
                        },
                        shares_active: {
                            type: 'number',
                            format: 'float',
                            description: 'Dolaşımdaki pay sayısı',
                            example: 1234567.89,
                            nullable: true
                        },
                        shares_total: {
                            type: 'number',
                            format: 'float',
                            description: 'Toplam pay sayısı',
                            example: 2345678.90,
                            nullable: true
                        },
                        occupancy_rate: {
                            type: 'number',
                            format: 'float',
                            description: 'Doluluk oranı (%)',
                            example: 85.50,
                            nullable: true
                        },
                        market_share: {
                            type: 'number',
                            format: 'float',
                            description: 'Pazar payı (%)',
                            example: 2.75,
                            nullable: true
                        }
                    }
                },
                DailyStatistics: {
                    type: 'object',
                    required: ['date', 'total_funds', 'total_companies', 'total_investors', 'total_aum', 'avg_profit', 'avg_loss'],
                    properties: {
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'İstatistik tarihi',
                            example: '2023-12-14'
                        },
                        total_funds: {
                            type: 'integer',
                            description: 'Toplam fon sayısı',
                            example: 1250
                        },
                        total_companies: {
                            type: 'integer',
                            description: 'Toplam şirket sayısı',
                            example: 45
                        },
                        total_investors: {
                            type: 'integer',
                            description: 'Toplam yatırımcı sayısı',
                            example: 250000
                        },
                        total_aum: {
                            type: 'number',
                            format: 'float',
                            description: 'Toplam portföy büyüklüğü',
                            example: 123456789.12
                        },
                        avg_profit: {
                            type: 'number',
                            format: 'float',
                            description: 'Ortalama kazanç (%)',
                            example: 1.2345
                        },
                        avg_loss: {
                            type: 'number',
                            format: 'float',
                            description: 'Ortalama kayıp (%)',
                            example: -0.5678
                        }
                    }
                },
                PaginatedFundList: {
                    type: 'object',
                    properties: {
                        total: {
                            type: 'integer',
                            description: 'Toplam fon sayısı',
                            example: 1
                        },
                        page: {
                            type: 'integer',
                            description: 'Mevcut sayfa',
                            example: 1
                        },
                        limit: {
                            type: 'integer',
                            description: 'Sayfa başına fon sayısı',
                            example: 20
                        },
                        data: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    code: {
                                        type: 'string',
                                        description: 'Fon kodu',
                                        example: 'AAK'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Fon adı',
                                        example: 'ATA PORTFÖY ÇOKLU VARLIK DEĞİŞKEN FONU'
                                    },
                                    tefas: {
                                        type: 'boolean',
                                        description: 'TEFAS\'ta işlem görüyor mu?',
                                        example: true
                                    },
                                    management_fee: {
                                        type: 'float',
                                        description: 'Risk seviyesi (1-7)',
                                        example: 1.5,
                                        nullable: true
                                    },                                       
                                    risk_value: {
                                        type: 'integer',
                                        minimum: 1,
                                        maximum: 7,
                                        description: 'Fonun risk seviyesi (1: En düşük risk, 7: En yüksek risk)',
                                        example: 4,
                                        nullable: true
                                    },
                                    purchase_value_day: {
                                        type: 'integer',
                                        minimum: 0,
                                        description: 'Alım valör günü',
                                        example: 1,
                                        nullable: true
                                    },
                                    sale_value_day: {
                                        type: 'integer',
                                        minimum: 0,
                                        description: 'Satım valör günü',
                                        example: 2,
                                        nullable: true
                                    },
                                    yield_1d: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 günlük getiri (%)',
                                        example: 0.1068,
                                        nullable: true
                                    },
                                    yield_1w: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 haftalık getiri (%)',
                                        example: 0.4476,
                                        nullable: true
                                    },
                                    yield_1m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 aylık getiri (%)',
                                        example: 3.7074,
                                        nullable: true
                                    },
                                    yield_3m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '3 aylık getiri (%)',
                                        example: 12.6185,
                                        nullable: true
                                    },
                                    yield_6m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '6 aylık getiri (%)',
                                        example: 10.4941,
                                        nullable: true
                                    },
                                    yield_ytd: {
                                        type: 'number',
                                        format: 'float',
                                        description: 'Yıl başından bugüne getiri (%)',
                                        example: 4.5401,
                                        nullable: true
                                    },
                                    yield_1y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 yıllık getiri (%)',
                                        example: 45.501,
                                        nullable: true
                                    },
                                    yield_3y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '3 yıllık getiri (%)',
                                        example: 331.3934,
                                        nullable: true
                                    },
                                    yield_5y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '5 yıllık getiri (%)',
                                        example: 599.1105,
                                        nullable: true
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Fon tipi',
                                        example: 'Değişken Fon'
                                    },
                                    management_company: {
                                        type: 'object',
                                        properties: {
                                            code: {
                                                type: 'string',
                                                description: 'Şirket kodu',
                                                example: 'APY'
                                            },
                                            title: {
                                                type: 'string',
                                                description: 'Şirket adı',
                                                example: 'ATA PORTFÖY YÖNETİMİ A.Ş.'
                                            },
                                            logo: {
                                                type: 'string',
                                                description: 'Şirket logosu URL',
                                                example: 'https://fonparam.apimapi.net/public/logos/ata_portfoy_icon.png'
                                            }
                                        }
                                    },
                                    fund_type: {
                                        type: 'object',
                                        properties: {
                                            type: {
                                                type: 'string',
                                                description: 'Fon tipi kodu',
                                                example: 'degisken'
                                            },
                                            short_name: {
                                                type: 'string',
                                                description: 'Fon tipi kısa adı',
                                                example: 'Değişken Fon'
                                            },
                                            long_name: {
                                                type: 'string',
                                                description: 'Fon tipi uzun adı',
                                                example: 'Değişken Şemsiye Fonu'
                                            },
                                            group_name: {
                                                type: 'string',
                                                description: 'Fon grubu adı',
                                                example: 'Değişken Fonlar'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                CompanyStatistics: {
                    type: 'object',
                    properties: {
                        total_funds: {
                            type: 'integer',
                            description: 'Toplam fon sayısı'
                        },
                        avg_yield_1m: {
                            type: 'number',
                            nullable: true,
                            description: '1 aylık ortalama getiri'
                        },
                        avg_yield_6m: {
                            type: 'number',
                            nullable: true,
                            description: '6 aylık ortalama getiri'
                        },
                        avg_yield_ytd: {
                            type: 'number',
                            nullable: true,
                            description: 'Yıl başından bugüne ortalama getiri'
                        },
                        avg_yield_1y: {
                            type: 'number',
                            nullable: true,
                            description: '1 yıllık ortalama getiri'
                        },
                        avg_yield_3y: {
                            type: 'number',
                            nullable: true,
                            description: '3 yıllık ortalama getiri'
                        },
                        avg_yield_5y: {
                            type: 'number',
                            nullable: true,
                            description: '5 yıllık ortalama getiri'
                        },
                        best_performing_funds: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/FundYield'
                            },
                            description: 'En iyi performans gösteren fonlar'
                        }
                    }
                },
                CompanyList: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            code: {
                                type: 'string',
                                description: 'Şirket kodu'
                            },
                            title: {
                                type: 'string',
                                description: 'Şirket adı'
                            },
                            logo: {
                                type: 'string',
                                description: 'Şirket logosu'
                            },
                            total_funds: {
                                type: 'integer',
                                description: 'Toplam fon sayısı'
                            },
                            avg_yield_1m: {
                                type: 'number',
                                nullable: true,
                                description: '1 aylık ortalama getiri'
                            },
                            avg_yield_6m: {
                                type: 'number',
                                nullable: true,
                                description: '6 aylık ortalama getiri'
                            },
                            avg_yield_ytd: {
                                type: 'number',
                                nullable: true,
                                description: 'Yıl başından bugüne ortalama getiri'
                            },
                            avg_yield_1y: {
                                type: 'number',
                                nullable: true,
                                description: '1 yıllık ortalama getiri'
                            },
                            avg_yield_3y: {
                                type: 'number',
                                nullable: true,
                                description: '3 yıllık ortalama getiri'
                            },
                            avg_yield_5y: {
                                type: 'number',
                                nullable: true,
                                description: '5 yıllık ortalama getiri'
                            }
                        }
                    },
                    example: [
                        {
                            code: 'APY',
                            title: 'ATA PORTFÖY YÖNETİMİ A.Ş.',
                            logo: 'https://fonparam.apimapi.net/public/logos/ata_portfoy_icon.png',
                            total_funds: 22,
                            avg_yield_1d: -0.0042,
                            avg_yield_1w: 1.0066,
                            avg_yield_1m: 5.4131,
                            avg_yield_6m: 10.8271,
                            avg_yield_ytd: 43.3379,
                            avg_yield_1y: 45.65,
                            avg_yield_3y: 313.4222,
                            avg_yield_5y: 1750.9015,
                        }
                    ]
                },
                CompanyDetails: {
                    type: 'object',
                    properties: {
                        company: {
                            $ref: '#/components/schemas/FundManagementCompany'
                        },
                        best_performing_funds: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    code: {
                                        type: 'string',
                                        description: 'Fon kodu',
                                        example: 'AAK'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Fon adı',
                                        example: 'ATA PORTFÖY ÇOKLU VARLIK DEĞİŞKEN FONU'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Fon tipi',
                                        example: 'degisken'
                                    },
                                    yield_1d: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 günlük getiri',
                                        example: 0.45
                                    },
                                    yield_1w: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 haftalık getiri',
                                        example: 1.23
                                    },
                                    yield_1m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 aylık getiri',
                                        example: 3.45
                                    },
                                    yield_3m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '3 aylık getiri',
                                        example: 8.90
                                    },
                                    yield_6m: {
                                        type: 'number',
                                        format: 'float',
                                        description: '6 aylık getiri',
                                        example: 18.23
                                    },
                                    yield_ytd: {
                                        type: 'number',
                                        format: 'float',
                                        description: 'Yıl başından bugüne getiri',
                                        example: 15.67
                                    },
                                    yield_1y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '1 yıllık getiri',
                                        example: 32.45
                                    },
                                    yield_3y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '3 yıllık getiri',
                                        example: 102.34
                                    },
                                    yield_5y: {
                                        type: 'number',
                                        format: 'float',
                                        description: '5 yıllık getiri',
                                        example: 178.90
                                    }
                                }
                            }
                        },
                        funds: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    code: {
                                        type: 'string',
                                        description: 'Fon kodu'
                                    },
                                    title: {
                                        type: 'string',
                                        description: 'Fon adı'
                                    },
                                    type: {
                                        type: 'string',
                                        description: 'Fon tipi'
                                    },
                                    yield: {
                                        type: 'object',
                                        properties: {
                                            yield_1d: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 günlük getiri'
                                            },
                                            yield_1w: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 haftalık getiri'
                                            },
                                            yield_1m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 aylık getiri'
                                            },
                                            yield_3m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '3 aylık getiri'
                                            },
                                            yield_6m: {
                                                type: 'number',
                                                format: 'float',
                                                description: '6 aylık getiri'
                                            },
                                            yield_ytd: {
                                                type: 'number',
                                                format: 'float',
                                                description: 'Yıl başından bugüne getiri'
                                            },
                                            yield_1y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '1 yıllık getiri'
                                            },
                                            yield_3y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '3 yıllık getiri'
                                            },
                                            yield_5y: {
                                                type: 'number',
                                                format: 'float',
                                                description: '5 yıllık getiri'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                InflationRate: {
                    type: 'object',
                    properties: {
                        date: {
                            type: 'string',
                            format: 'date',
                            description: 'Enflasyon tarihi',
                            example: '2024-01-01'
                        },
                        monthly_rate: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Aylık enflasyon oranı (%)',
                            example: 3.43
                        },
                        yearly_rate: {
                            type: 'number',
                            format: 'decimal',
                            description: 'Yıllık enflasyon oranı (%)',
                            example: 64.77
                        }
                    }
                }
            },
            parameters: {
                FundCode: {
                    name: 'code',
                    in: 'path',
                    description: 'Fon kodu',
                    required: true,
                    schema: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 10
                    },
                    example: 'AAK'
                },
                StartDate: {
                    name: 'start_date',
                    in: 'query',
                    description: 'Başlangıç tarihi (YYYY-MM-DD)',
                    schema: {
                        type: 'string',
                        format: 'date'
                    },
                    example: '2023-01-01'
                },
                EndDate: {
                    name: 'end_date',
                    in: 'query',
                    description: 'Bitiş tarihi (YYYY-MM-DD)',
                    schema: {
                        type: 'string',
                        format: 'date'
                    },
                    example: '2023-12-31'
                },
                Interval: {
                    name: 'interval',
                    in: 'query',
                    description: 'Veri aralığı',
                    schema: {
                        type: 'string',
                        enum: ['daily', 'weekly', 'monthly']
                    },
                    example: 'daily'
                }
            },
            responses: {
                NotFound: {
                    description: 'İstenilen kayıt bulunamadı',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                ValidationError: {
                    description: 'Geçersiz istek parametreleri',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ValidationError'
                            }
                        }
                    }
                },
                ServerError: {
                    description: 'Sunucu hatası',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: {
                                        type: 'string',
                                        description: 'Hata mesajı',
                                        example: 'Analiz hesaplanırken bir hata oluştu'
                                    },
                                    message: {
                                        type: 'string',
                                        description: 'Detaylı hata mesajı',
                                        example: 'Fon için veri bulunamadı'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/routes/*.ts']
};

export default swaggerJsdoc(options); 