import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface ResearchReport {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content?: string;
  image: string;
  author?: string;
  tags?: string[];
}

export function useMutualFundScreener() {
  return useQuery({
    queryKey: ['/api/finance/mutual-fund-screener'],
    queryFn: () => apiRequest<any[]>('GET', '/api/finance/mutual-fund-screener'),
  });
}

export function useETFHoldings(symbol: string) {
  return useQuery({
    queryKey: ['/api/finance/etf-holdings', symbol],
    queryFn: () => apiRequest<any[]>('GET', `/api/finance/etf-holdings/${symbol}`),
    enabled: !!symbol,
  });
}

export function useStockTimeSeries(symbol: string, interval = 'daily') {
  return useQuery({
    queryKey: ['/api/finance/time-series', symbol, interval],
    queryFn: () => apiRequest<any>('GET', `/api/finance/time-series/${symbol}?interval=${interval}`),
    enabled: !!symbol,
  });
}

export function useFinancialRatios(symbol: string) {
  return useQuery({
    queryKey: ['/api/finance/financial-ratios', symbol],
    queryFn: () => apiRequest<any[]>('GET', `/api/finance/financial-ratios/${symbol}`),
    enabled: !!symbol,
  });
}

export function useTopETFs() {
  return useQuery({
    queryKey: ['/api/finance/top-etfs'],
    queryFn: () => apiRequest<any[]>('GET', '/api/finance/top-etfs'),
  });
}

export function useResearchReports() {
  return useQuery({
    queryKey: ['/api/finance/research-reports'],
    queryFn: () => apiRequest<ResearchReport[]>('GET', '/api/finance/research-reports'),
  });
}