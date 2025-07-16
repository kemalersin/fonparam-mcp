import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  Fund,
  FundManagementCompany,
  FundYield,
  FundHistoricalValue,
  DailyStatistics,
  InflationRate,
  FundTypeYields,
  PaginatedResponse,
  CompanyDetails,
  FundAnalysisParams,
  FundAnalysisResult,
  ListFundsParams,
  ListCompaniesParams,
  HistoricalDataParams,
  StatisticsParams,
  FundTypesParams,
  InflationParams
} from './types.js';

export class FonParamApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'https://api.fonparam.com') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'FonParam-MCP/1.0.0'
      }
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new Error(`API Error ${error.response.status}: ${error.response.data?.error || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('API request failed: No response received');
        } else {
          throw new Error(`API request failed: ${error.message}`);
        }
      }
    );
  }

  /**
   * Tüm fonları listeler
   */
  async listFunds(params: ListFundsParams = {}): Promise<PaginatedResponse<Fund>> {
    const response: AxiosResponse<PaginatedResponse<Fund>> = await this.client.get('/funds', { params });
    return response.data;
  }

  /**
   * En iyi performans gösteren fonları getirir
   */
  async getTopPerformingFunds(referenceFunds?: string): Promise<FundYield[]> {
    const params = referenceFunds ? { funds: referenceFunds } : {};
    const response: AxiosResponse<FundYield[]> = await this.client.get('/funds/top-performing', { params });
    return response.data;
  }

  /**
   * Fonları karşılaştırır
   */
  async compareFunds(codes: string[]): Promise<Fund[]> {
    if (codes.length < 2 || codes.length > 5) {
      throw new Error('2-5 arasında fon kodu belirtmelisiniz');
    }
    const params = { codes: codes.join(',') };
    const response: AxiosResponse<Fund[]> = await this.client.get('/funds/compare', { params });
    return response.data;
  }

  /**
   * Fon analizi yapar
   */
  async analyzeFund(params: FundAnalysisParams): Promise<FundAnalysisResult> {
    const { code, ...queryParams } = params;
    
    // Nested object'i düzleştir
    const flatParams: Record<string, any> = {
      ...queryParams,
      'yearlyIncrease.type': params.yearlyIncrease?.type,
      'yearlyIncrease.value': params.yearlyIncrease?.value
    };

    const response: AxiosResponse<FundAnalysisResult> = await this.client.get(`/funds/${code}/analyze`, {
      params: flatParams
    });
    return response.data;
  }

  /**
   * Fonun geçmiş değerlerini getirir
   */
  async getFundHistoricalData(code: string, params: HistoricalDataParams = {}): Promise<FundHistoricalValue[]> {
    const response: AxiosResponse<FundHistoricalValue[]> = await this.client.get(`/funds/${code}/historical`, { params });
    return response.data;
  }

  /**
   * Tüm portföy yönetim şirketlerini listeler
   */
  async listCompanies(params: ListCompaniesParams = {}): Promise<PaginatedResponse<FundManagementCompany>> {
    const response: AxiosResponse<PaginatedResponse<FundManagementCompany>> = await this.client.get('/companies', { params });
    return response.data;
  }

  /**
   * Portföy yönetim şirketi detaylarını getirir
   */
  async getCompanyDetails(code: string, includeFunds: boolean = true): Promise<CompanyDetails> {
    const params = { include_funds: includeFunds };
    const response: AxiosResponse<CompanyDetails> = await this.client.get(`/companies/${code}`, { params });
    return response.data;
  }

  /**
   * Günlük istatistikleri listeler
   */
  async getStatistics(params: StatisticsParams = {}): Promise<PaginatedResponse<DailyStatistics>> {
    const response: AxiosResponse<PaginatedResponse<DailyStatistics>> = await this.client.get('/statistics', { params });
    return response.data;
  }

  /**
   * Son istatistikleri getirir
   */
  async getLatestStatistics(): Promise<DailyStatistics> {
    const response: AxiosResponse<DailyStatistics> = await this.client.get('/statistics/latest');
    return response.data;
  }

  /**
   * Belirli bir günün istatistiklerini getirir
   */
  async getStatisticsByDate(date: string): Promise<DailyStatistics> {
    const response: AxiosResponse<DailyStatistics> = await this.client.get(`/statistics/${date}`);
    return response.data;
  }

  /**
   * Fon tiplerini listeler
   */
  async listFundTypes(params: FundTypesParams = {}): Promise<FundTypeYields[]> {
    const response: AxiosResponse<FundTypeYields[]> = await this.client.get('/fund-types', { params });
    return response.data;
  }

  /**
   * Belirli bir fon tipinin detaylarını getirir
   */
  async getFundTypeDetails(type: string): Promise<FundTypeYields> {
    const response: AxiosResponse<FundTypeYields> = await this.client.get(`/fund-types/${type}`);
    return response.data;
  }

  /**
   * Enflasyon verilerini listeler
   */
  async getInflationRates(params: InflationParams = {}): Promise<InflationRate[]> {
    const response: AxiosResponse<InflationRate[]> = await this.client.get('/inflation', { params });
    return response.data;
  }

  /**
   * Son enflasyon verisini getirir
   */
  async getLatestInflationRate(): Promise<InflationRate> {
    const response: AxiosResponse<InflationRate> = await this.client.get('/inflation/latest');
    return response.data;
  }

  /**
   * Belirli bir ay ve yıldaki enflasyon verisini getirir
   */
  async getInflationRateByMonth(year: number, month: number): Promise<InflationRate> {
    const response: AxiosResponse<InflationRate> = await this.client.get(`/inflation/${year}/${month}`);
    return response.data;
  }

  /**
   * API bağlantısını test eder
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/fund-types?limit=1');
      return true;
    } catch (error) {
      return false;
    }
  }
} 