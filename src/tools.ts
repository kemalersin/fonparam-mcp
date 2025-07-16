import { z } from 'zod';
import { FonParamApiClient } from './api-client.js';
import { FundTypeEnum } from './types.js';

// Zod şemaları - parametre doğrulaması için
const ListFundsSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  type: z.nativeEnum(FundTypeEnum).optional(),
  search: z.string().optional(),
  code: z.string().optional(),
  management_company: z.string().optional(),
  tefas: z.boolean().optional(),
  min_risk_value: z.number().min(1).max(7).optional(),
  max_risk_value: z.number().min(1).max(7).optional(),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional()
});

const CompareFundsSchema = z.object({
  codes: z.array(z.string()).min(2).max(5)
});

const AnalyzeFundSchema = z.object({
  code: z.string(),
  startDate: z.enum(['last_1_day', 'last_1_week', 'last_1_month', 'last_3_months', 'last_6_months', 'year_start', 'last_1_year', 'last_3_years', 'last_5_years']),
  initialInvestment: z.number().min(0),
  monthlyInvestment: z.number().min(0).optional(),
  yearlyIncreaseType: z.enum(['percentage', 'amount']).optional(),
  yearlyIncreaseValue: z.number().min(0).optional(),
  includeMonthlyDetails: z.boolean().optional()
});

const HistoricalDataSchema = z.object({
  code: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  interval: z.enum(['daily', 'weekly', 'monthly']).optional(),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional()
});

const ListCompaniesSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
  min_total_funds: z.number().min(0).optional(),
  max_total_funds: z.number().min(0).optional(),
  search: z.string().optional()
});

const CompanyDetailsSchema = z.object({
  code: z.string(),
  include_funds: z.boolean().optional()
});

const StatisticsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional()
});

const FundTypesSchema = z.object({
  sort: z.string().optional(),
  order: z.enum(['ASC', 'DESC']).optional(),
  min_total_funds: z.number().min(0).optional(),
  max_total_funds: z.number().min(0).optional()
});

const InflationSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional()
});

export class FonParamTools {
  private apiClient: FonParamApiClient;

  constructor(apiClient: FonParamApiClient) {
    this.apiClient = apiClient;
  }

  // MCP tool tanımları
  getTools() {
    return [
      {
        name: 'list_funds',
        description: 'Yatırım fonlarını listeler ve filtreleme imkanı sunar',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Sayfa numarası (varsayılan: 1)',
              minimum: 1
            },
            limit: {
              type: 'number',
              description: 'Sayfa başına kayıt sayısı (varsayılan: 20, maksimum: 100)',
              minimum: 1,
              maximum: 100
            },
            type: {
              type: 'string',
              description: 'Fon tipi',
              enum: Object.values(FundTypeEnum)
            },
            search: {
              type: 'string',
              description: 'Fon adı, kodu, şirket adı ile arama'
            },
            code: {
              type: 'string',
              description: 'Fon kodu veya kodları (virgülle ayrılmış)'
            },
            management_company: {
              type: 'string',
              description: 'Portföy yönetim şirketi kodu'
            },
            tefas: {
              type: 'boolean',
              description: 'TEFAS\'ta işlem görme durumu'
            },
            min_risk_value: {
              type: 'number',
              description: 'Minimum risk seviyesi (1-7)',
              minimum: 1,
              maximum: 7
            },
            max_risk_value: {
              type: 'number',
              description: 'Maksimum risk seviyesi (1-7)',
              minimum: 1,
              maximum: 7
            },
            sort: {
              type: 'string',
              description: 'Sıralama alanı (code, title, yield_1y, vb.)'
            },
            order: {
              type: 'string',
              description: 'Sıralama yönü',
              enum: ['ASC', 'DESC']
            }
          }
        }
      },
      {
        name: 'top_performing_funds',
        description: 'En iyi performans gösteren fonları getirir',
        inputSchema: {
          type: 'object',
          properties: {
            reference_funds: {
              type: 'string',
              description: 'Referans fon kodları (virgülle ayrılmış, opsiyonel)'
            }
          }
        }
      },
      {
        name: 'compare_funds',
        description: 'Fonları karşılaştırır (2-5 fon)',
        inputSchema: {
          type: 'object',
          properties: {
            codes: {
              type: 'array',
              description: 'Karşılaştırılacak fon kodları',
              items: {
                type: 'string'
              },
              minItems: 2,
              maxItems: 5
            }
          },
          required: ['codes']
        }
      },
      {
        name: 'analyze_fund',
        description: 'Fon için yatırım analizi yapar',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Fon kodu'
            },
            startDate: {
              type: 'string',
              description: 'Başlangıç tarihi',
              enum: ['last_1_day', 'last_1_week', 'last_1_month', 'last_3_months', 'last_6_months', 'year_start', 'last_1_year', 'last_3_years', 'last_5_years']
            },
            initialInvestment: {
              type: 'number',
              description: 'Başlangıç yatırımı (TL)',
              minimum: 0
            },
            monthlyInvestment: {
              type: 'number',
              description: 'Aylık yatırım tutarı (TL, opsiyonel)',
              minimum: 0
            },
            yearlyIncreaseType: {
              type: 'string',
              description: 'Yıllık artış tipi (opsiyonel)',
              enum: ['percentage', 'amount']
            },
            yearlyIncreaseValue: {
              type: 'number',
              description: 'Yıllık artış değeri (opsiyonel)',
              minimum: 0
            },
            includeMonthlyDetails: {
              type: 'boolean',
              description: 'Aylık detayları getir (varsayılan: true)'
            }
          },
          required: ['code', 'startDate', 'initialInvestment']
        }
      },
      {
        name: 'fund_historical_data',
        description: 'Fonun geçmiş değerlerini getirir',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Fon kodu'
            },
            start_date: {
              type: 'string',
              description: 'Başlangıç tarihi (YYYY-MM-DD)'
            },
            end_date: {
              type: 'string',
              description: 'Bitiş tarihi (YYYY-MM-DD)'
            },
            interval: {
              type: 'string',
              description: 'Veri aralığı',
              enum: ['daily', 'weekly', 'monthly']
            },
            sort: {
              type: 'string',
              description: 'Sıralama alanı'
            },
            order: {
              type: 'string',
              description: 'Sıralama yönü',
              enum: ['ASC', 'DESC']
            }
          },
          required: ['code']
        }
      },
      {
        name: 'list_companies',
        description: 'Portföy yönetim şirketlerini listeler',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Sayfa numarası',
              minimum: 1
            },
            limit: {
              type: 'number',
              description: 'Sayfa başına kayıt sayısı',
              minimum: 1,
              maximum: 100
            },
            sort: {
              type: 'string',
              description: 'Sıralama alanı'
            },
            order: {
              type: 'string',
              description: 'Sıralama yönü',
              enum: ['ASC', 'DESC']
            },
            min_total_funds: {
              type: 'number',
              description: 'Minimum fon sayısı',
              minimum: 0
            },
            max_total_funds: {
              type: 'number',
              description: 'Maksimum fon sayısı',
              minimum: 0
            },
            search: {
              type: 'string',
              description: 'Şirket adı veya kodu ile arama'
            }
          }
        }
      },
      {
        name: 'company_details',
        description: 'Portföy yönetim şirketi detaylarını getirir',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Şirket kodu'
            },
            include_funds: {
              type: 'boolean',
              description: 'Şirketin fonlarını da getir (varsayılan: true)'
            }
          },
          required: ['code']
        }
      },
      {
        name: 'statistics',
        description: 'Günlük istatistikleri listeler',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: {
              type: 'string',
              description: 'Başlangıç tarihi (YYYY-MM-DD)'
            },
            end_date: {
              type: 'string',
              description: 'Bitiş tarihi (YYYY-MM-DD)'
            },
            sort: {
              type: 'string',
              description: 'Sıralama alanı'
            },
            order: {
              type: 'string',
              description: 'Sıralama yönü',
              enum: ['ASC', 'DESC']
            },
            page: {
              type: 'number',
              description: 'Sayfa numarası',
              minimum: 1
            },
            limit: {
              type: 'number',
              description: 'Sayfa başına kayıt sayısı',
              minimum: 1,
              maximum: 100
            }
          }
        }
      },
      {
        name: 'latest_statistics',
        description: 'Son istatistikleri getirir',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'statistics_by_date',
        description: 'Belirli bir günün istatistiklerini getirir',
        inputSchema: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'İstatistik tarihi (YYYY-MM-DD)'
            }
          },
          required: ['date']
        }
      },
      {
        name: 'list_fund_types',
        description: 'Fon tiplerini listeler',
        inputSchema: {
          type: 'object',
          properties: {
            sort: {
              type: 'string',
              description: 'Sıralama alanı'
            },
            order: {
              type: 'string',
              description: 'Sıralama yönü',
              enum: ['ASC', 'DESC']
            },
            min_total_funds: {
              type: 'number',
              description: 'Minimum fon sayısı',
              minimum: 0
            },
            max_total_funds: {
              type: 'number',
              description: 'Maksimum fon sayısı',
              minimum: 0
            }
          }
        }
      },
      {
        name: 'fund_type_details',
        description: 'Belirli bir fon tipinin detaylarını getirir',
        inputSchema: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              description: 'Fon tipi kodu',
              enum: Object.values(FundTypeEnum)
            }
          },
          required: ['type']
        }
      },
      {
        name: 'inflation_rates',
        description: 'Enflasyon verilerini listeler',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: {
              type: 'string',
              description: 'Başlangıç tarihi (YYYY-MM-DD)'
            },
            end_date: {
              type: 'string',
              description: 'Bitiş tarihi (YYYY-MM-DD)'
            }
          }
        }
      },
      {
        name: 'latest_inflation_rate',
        description: 'Son enflasyon verisini getirir',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'inflation_rate_by_month',
        description: 'Belirli bir ay ve yıldaki enflasyon verisini getirir',
        inputSchema: {
          type: 'object',
          properties: {
            year: {
              type: 'number',
              description: 'Yıl',
              minimum: 2000
            },
            month: {
              type: 'number',
              description: 'Ay (1-12)',
              minimum: 1,
              maximum: 12
            }
          },
          required: ['year', 'month']
        }
      }
    ];
  }

  // Tool handler fonksiyonları
  async handleToolCall(name: string, args: any) {
    try {
      switch (name) {
        case 'list_funds':
          const fundsParams = ListFundsSchema.parse(args);
          return await this.apiClient.listFunds(fundsParams);

        case 'top_performing_funds':
          return await this.apiClient.getTopPerformingFunds(args.reference_funds);

        case 'compare_funds':
          const compareParams = CompareFundsSchema.parse(args);
          return await this.apiClient.compareFunds(compareParams.codes);

        case 'analyze_fund':
          const analyzeParams = AnalyzeFundSchema.parse(args);
          const yearlyIncrease = analyzeParams.yearlyIncreaseType && analyzeParams.yearlyIncreaseValue
            ? { type: analyzeParams.yearlyIncreaseType, value: analyzeParams.yearlyIncreaseValue }
            : undefined;
          
          return await this.apiClient.analyzeFund({
            code: analyzeParams.code,
            startDate: analyzeParams.startDate,
            initialInvestment: analyzeParams.initialInvestment,
            monthlyInvestment: analyzeParams.monthlyInvestment,
            yearlyIncrease,
            includeMonthlyDetails: analyzeParams.includeMonthlyDetails
          });

        case 'fund_historical_data':
          const historicalParams = HistoricalDataSchema.parse(args);
          const { code, ...histParams } = historicalParams;
          return await this.apiClient.getFundHistoricalData(code, histParams);

        case 'list_companies':
          const companiesParams = ListCompaniesSchema.parse(args);
          return await this.apiClient.listCompanies(companiesParams);

        case 'ompany_details':
          const companyParams = CompanyDetailsSchema.parse(args);
          return await this.apiClient.getCompanyDetails(companyParams.code, companyParams.include_funds);

        case 'statistics':
          const statsParams = StatisticsSchema.parse(args);
          return await this.apiClient.getStatistics(statsParams);

        case 'latest_statistics':
          return await this.apiClient.getLatestStatistics();

        case 'statistics_by_date':
          return await this.apiClient.getStatisticsByDate(args.date);

        case 'list_fund_types':
          const fundTypesParams = FundTypesSchema.parse(args);
          return await this.apiClient.listFundTypes(fundTypesParams);

        case 'fund_type_details':
          return await this.apiClient.getFundTypeDetails(args.type);

        case 'inflation_rates':
          const inflationParams = InflationSchema.parse(args);
          return await this.apiClient.getInflationRates(inflationParams);

        case 'latest_inflation_rate':
          return await this.apiClient.getLatestInflationRate();

        case 'inflation_rate_by_month':
          return await this.apiClient.getInflationRateByMonth(args.year, args.month);

        default:
          throw new Error(`Bilinmeyen araç: ${name}`);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Parametre hatası: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`);
      }
      throw error;
    }
  }
} 