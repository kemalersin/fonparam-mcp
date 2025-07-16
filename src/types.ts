// FonParam API TypeScript Types

export enum FundTypeEnum {
  ALTIN = 'altin',
  BORCLANMA_ARACLARI = 'borclanma_araclari',
  DEGISKEN = 'degisken',
  FON_SEPETI = 'fon_sepeti',
  GUMUS = 'gumus',
  HISSE_SENEDI = 'hisse_senedi',
  HISSE_SENEDI_YOGUN = 'hisse_senedi_yogun',
  KARMA = 'karma',
  KATILIM = 'katilim',
  KIYMETLI_MADENLER = 'kiymetli_madenler',
  PARA_PIYASASI = 'para_piyasasi',
  SERBEST = 'serbest',
  YABANCI = 'yabanci',
  DIGER = 'diger'
}

export interface FundManagementCompany {
  code: string;
  title: string;
  logo?: string;
  total_funds?: number;
  avg_yield_1d?: number | null;
  avg_yield_1w?: number | null;
  avg_yield_1m?: number | null;
  avg_yield_3m?: number | null;
  avg_yield_6m?: number | null;
  avg_yield_ytd?: number | null;
  avg_yield_1y?: number | null;
  avg_yield_3y?: number | null;
  avg_yield_5y?: number | null;
}

export interface FundType {
  type: FundTypeEnum;
  short_name: string;
  long_name: string;
  group_name: string;
}

export interface FundYield {
  code: string;
  title?: string;
  type?: string;
  risk_value?: number | null;
  yield_1d?: number | null;
  yield_1w?: number | null;
  yield_1m?: number | null;
  yield_3m?: number | null;
  yield_6m?: number | null;
  yield_ytd?: number | null;
  yield_1y?: number | null;
  yield_3y?: number | null;
  yield_5y?: number | null;
}

export interface FundHistoricalValue {
  code: string;
  date: string;
  value: number;
  aum?: number | null;
  yield?: number | null;
  cumulative_cashflow?: number | null;
  investor_count?: number | null;
  risk_value?: number | null;
  purchase_value_day?: number | null;
  sale_value_day?: number | null;
  shares_active?: number | null;
  shares_total?: number | null;
  occupancy_rate?: number | null;
  market_share?: number | null;
  management_fee?: number | null;
}

export interface Fund {
  code: string;
  management_company_id: string;
  title: string;
  type: FundTypeEnum;
  tefas?: boolean | null;
  has_historical_data: boolean;
  historical_data_check_date?: string | null;
  risk_value?: number | null;
  purchase_value_day?: number | null;
  sale_value_day?: number | null;
  management_fee?: number | null;
  // İlişkili veriler
  management_company?: FundManagementCompany;
  fund_type?: FundType;
  last_historical_value?: FundHistoricalValue;
  // Getiri verileri
  yield_1d?: number | null;
  yield_1w?: number | null;
  yield_1m?: number | null;
  yield_3m?: number | null;
  yield_6m?: number | null;
  yield_ytd?: number | null;
  yield_1y?: number | null;
  yield_3y?: number | null;
  yield_5y?: number | null;
}

export interface DailyStatistics {
  date: string;
  total_funds: number;
  total_companies: number;
  total_investors: number;
  total_aum: number;
  avg_profit: number;
  avg_loss: number;
}

export interface InflationRate {
  date: string;
  monthly_rate: number;
  yearly_rate: number;
}

export interface FundTypeYields extends FundType {
  yield_1d?: number | null;
  yield_1w?: number | null;
  yield_1m?: number | null;
  yield_3m?: number | null;
  yield_6m?: number | null;
  yield_ytd?: number | null;
  yield_1y?: number | null;
  yield_3y?: number | null;
  yield_5y?: number | null;
  total_funds: number;
  total_aum?: number | null;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

export interface CompanyStatistics {
  total_funds: number;
  avg_yield_1m?: number | null;
  avg_yield_6m?: number | null;
  avg_yield_ytd?: number | null;
  avg_yield_1y?: number | null;
  avg_yield_3y?: number | null;
  avg_yield_5y?: number | null;
  best_performing_funds?: FundYield[];
}

export interface CompanyDetails {
  company: FundManagementCompany;
  stats?: CompanyStatistics;
}

export interface FundAnalysisParams {
  code: string;
  startDate: 'last_1_day' | 'last_1_week' | 'last_1_month' | 'last_3_months' | 'last_6_months' | 'year_start' | 'last_1_year' | 'last_3_years' | 'last_5_years';
  initialInvestment: number;
  monthlyInvestment?: number;
  yearlyIncrease?: {
    type: 'percentage' | 'amount';
    value: number;
  };
  includeMonthlyDetails?: boolean;
}

export interface FundAnalysisResult {
  code: string;
  management_company_id: string;
  title: string;
  summary: {
    totalInvestment: number;
    currentValue: number;
    totalYield: number;
    totalYieldPercentage: number;
    cumulativeInflation: number;
    realTotalYield: number;
    realTotalYieldPercentage: number;
  };
  periodDetails?: Array<{
    date: string;
    investment: number;
    totalInvestment: number;
    unitPrice: number;
    units: number;
    totalUnits: number;
    value: number;
    periodChange: number;
    periodChangePercentage: number;
    totalYield: number;
    totalYieldPercentage: number;
    monthlyInflation: number;
    cumulativeInflation: number;
    realPeriodChange: number;
    realPeriodChangePercentage: number;
    realTotalYield: number;
    realTotalYieldPercentage: number;
  }>;
}

// API isteği için parametreler
export interface ListFundsParams {
  page?: number;
  limit?: number;
  type?: FundTypeEnum;
  search?: string;
  code?: string;
  management_company?: string;
  tefas?: boolean;
  min_risk_value?: number;
  max_risk_value?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface ListCompaniesParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  min_total_funds?: number;
  max_total_funds?: number;
  search?: string;
}

export interface HistoricalDataParams {
  start_date?: string;
  end_date?: string;
  interval?: 'daily' | 'weekly' | 'monthly';
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface StatisticsParams {
  start_date?: string;
  end_date?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface FundTypesParams {
  sort?: string;
  order?: 'ASC' | 'DESC';
  min_total_funds?: number;
  max_total_funds?: number;
}

export interface InflationParams {
  start_date?: string;
  end_date?: string;
} 