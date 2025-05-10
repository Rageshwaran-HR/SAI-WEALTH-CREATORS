import { Request, Response } from 'express';

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const FINANCIAL_MODELING_PREP_API_KEY = process.env.FINANCIAL_MODELING_PREP_API_KEY;

// Types for research reports
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

// Alpha Vantage API for news
export async function getFinancialNews(limit = 10) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${ALPHA_VANTAGE_API_KEY}&limit=${limit}&sort=LATEST`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    return data.feed || [];
  } catch (error) {
    console.error('Error fetching financial news:', error);
    throw error;
  }
}

// Financial Modeling Prep API for market news
export async function getMarketNews(limit = 10) {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=${limit}&apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Financial Modeling Prep API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("FMP News Raw Response:", data);

    if (Array.isArray(data)) {
      return data;
    }

    // If it's an object that wraps the actual array
    if (data.articles && Array.isArray(data.articles)) {
      return data.articles;
    }

    // Return an empty array as fallback
    return [];
  } catch (error) {
    console.error('Error fetching market news:', error);
    throw error;
  }
}


// Alpha Vantage API for mutual fund data
export async function getMutualFundData(symbol: string) {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error(`Error fetching mutual fund data for ${symbol}:`, error);
    throw error;
  }
}

// Financial Modeling Prep API for mutual fund screener
export async function getMutualFundScreener() {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/api/v3/etf/list?apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Financial Modeling Prep API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching mutual fund screener data:', error);
    throw error;
  }
}

// Financial Modeling Prep API for ETF holdings
export async function getETFHoldings(symbol: string) {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/stable/search-symbol?query=${symbol}}&apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Financial Modeling Prep API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(`Error fetching ETF holdings for ${symbol}:`, error);
    throw error;
  }
}

// Alpha Vantage API for stock time series
export async function getStockTimeSeries(symbol: string, interval = 'daily', outputSize = 'compact') {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_${interval.toUpperCase()}&symbol=${symbol}&outputsize=${outputSize}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Alpha Vantage API error: ${response.status}`);
    }

    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error(`Error fetching stock time series for ${symbol}:`, error);
    throw error;
  }
}

// Financial Modeling Prep API for financial ratios
export async function getFinancialRatios(symbol: string) {
  try {
const response = await fetch(
  `https://financialmodelingprep.com/stable/ratios?symbol=AAPL&apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
);


    if (!response.ok) {
      throw new Error(`Financial Modeling Prep API error: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(`Error fetching financial ratios for ${symbol}:`, error);
    throw error;
  }
}

// Financial Modeling Prep API for top performing ETFs
export async function getTopETFs() {
  try {
    const response = await fetch(
      `https://financialmodelingprep.com/stable/biggest-gainers?apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Financial Modeling Prep API error: ${response.status}`);
    }

    const data = await response.json();
    // Return only the first 20 ETFs as the top ones (the API doesn't have a specific ranking endpoint)
    return (data || []).slice(0, 20);
  } catch (error) {
    console.error('Error fetching top ETFs:', error);
    throw error;
  }
}

// Generate research reports using Financial Modeling Prep API data and market insights
export async function getResearchReports(limit = 10): Promise<ResearchReport[]> {
  try {
    // Get market data from FMP API to use as the basis for our research reports
    const etfResponse = await fetch(
      `https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=${limit}&apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );
    
    const stockNewsResponse = await fetch(
      `https://financialmodelingprep.com/stable/financial-reports-dates?symbol=AAPL&apikey=${FINANCIAL_MODELING_PREP_API_KEY}`
    );

    if (!etfResponse.ok || !stockNewsResponse.ok) {
      throw new Error('Error fetching data for research reports');
    }

    const etfs = await etfResponse.json();
    const news = await stockNewsResponse.json();
    
    // Use the financial data to create research reports
    const reports: ResearchReport[] = [];
    
    // Create equity reports based on ETF data
    if (Array.isArray(etfs) && etfs.length > 0) {
      // Group ETFs by asset class
      const equityETFs = etfs.filter(etf => 
        etf.assetClass?.toLowerCase().includes('equity') || 
        etf.assetClass?.toLowerCase().includes('stock')
      ).slice(0, 3);
      
      const bondETFs = etfs.filter(etf => 
        etf.assetClass?.toLowerCase().includes('bond') || 
        etf.assetClass?.toLowerCase().includes('fixed') ||
        etf.assetClass?.toLowerCase().includes('debt')
      ).slice(0, 2);
      
      const sectorETFs = etfs.filter(etf => 
        etf.assetClass?.toLowerCase().includes('sector')
      ).slice(0, 2);
      
      // Create equity report
      if (equityETFs.length > 0) {
        equityETFs.forEach((etf, index) => {
          reports.push({
            id: reports.length + 1,
            title: `${etf.name} Analysis and Outlook`,
            category: 'Equity',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            excerpt: `Comprehensive analysis of ${etf.name} (${etf.symbol}), examining performance trends, risk metrics, and future outlook.`,
            image: `https://images.unsplash.com/photo-${1560000000000 + index * 10000}-${Math.floor(Math.random() * 10000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
            author: 'Research Team',
            tags: ['Equity', 'ETF', 'Analysis', etf.symbol]
          });
        });
      }
      
      // Create fixed income report
      if (bondETFs.length > 0) {
        bondETFs.forEach((etf, index) => {
          reports.push({
            id: reports.length + 1,
            title: `Fixed Income Strategy: ${etf.name}`,
            category: 'Debt',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            excerpt: `Strategic approaches to fixed income investing through ${etf.name} (${etf.symbol}) in the current interest rate environment.`,
            image: `https://images.unsplash.com/photo-${1550000000000 + index * 10000}-${Math.floor(Math.random() * 10000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
            author: 'Fixed Income Research Team',
            tags: ['Fixed Income', 'ETF', 'Interest Rates', etf.symbol]
          });
        });
      }
      
      // Create sector report
      if (sectorETFs.length > 0) {
        sectorETFs.forEach((etf, index) => {
          reports.push({
            id: reports.length + 1,
            title: `Sector Analysis: ${etf.name}`,
            category: 'Sectoral',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            excerpt: `In-depth review of ${etf.name} (${etf.symbol}), examining growth drivers, key holdings, and potential risks.`,
            image: `https://images.unsplash.com/photo-${1540000000000 + index * 10000}-${Math.floor(Math.random() * 10000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
            author: 'Sector Analysis Team',
            tags: ['Sector', 'ETF', 'Industry', etf.symbol]
          });
        });
      }
    }
    
    // Create market commentary based on news
    if (Array.isArray(news) && news.length > 0) {
      // Group news by topic/category
      const topNews = news.slice(0, 3);
      
      topNews.forEach((newsItem, index) => {
        reports.push({
          id: reports.length + 1,
          title: `Market Commentary: ${newsItem.title.slice(0, 50)}...`,
          category: 'Market',
          date: new Date(newsItem.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          excerpt: newsItem.text.slice(0, 150) + '...',
          image: newsItem.image || `https://images.unsplash.com/photo-${1530000000000 + index * 10000}-${Math.floor(Math.random() * 10000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80`,
          author: 'Market Research Team',
          tags: ['Market', 'Commentary', 'Analysis']
        });
      });
    }
    
    // If we couldn't get any reports from the APIs, return some default reports
    if (reports.length === 0) {
      console.warn('No data available to create research reports, using fallbacks');
      
      // Return fallback reports
      return [
        {
          id: 1,
          title: 'Mid & Small Cap Outlook 2023',
          category: 'Equity',
          date: 'June 15, 2023',
          excerpt: 'Comprehensive analysis of mid and small cap segments, highlighting potential outperformers for the coming year.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1115&q=80'
        },
        {
          id: 2,
          title: 'Fixed Income Strategies in Rising Rate Environment',
          category: 'Debt',
          date: 'June 8, 2023',
          excerpt: 'Strategic approaches to navigate the debt market during periods of increasing interest rates.',
          image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'
        },
        {
          id: 3,
          title: 'Sectoral Analysis: Banking & Financial Services',
          category: 'Sectoral',
          date: 'May 25, 2023',
          excerpt: 'In-depth review of banking and financial services sector, examining growth drivers and potential risks.',
          image: 'https://images.unsplash.com/photo-1556741533-411cf82e4e2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'
        }
      ];
    }
    
    return reports;
  } catch (error) {
    console.error('Error generating research reports:', error);
    
    // Return fallback reports in case of error
    return [
      {
        id: 1,
        title: 'Mid & Small Cap Outlook 2023',
        category: 'Equity',
        date: 'June 15, 2023',
        excerpt: 'Comprehensive analysis of mid and small cap segments, highlighting potential outperformers for the coming year.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1115&q=80'
      },
      {
        id: 2,
        title: 'Fixed Income Strategies in Rising Rate Environment',
        category: 'Debt',
        date: 'June 8, 2023',
        excerpt: 'Strategic approaches to navigate the debt market during periods of increasing interest rates.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'
      },
      {
        id: 3,
        title: 'Sectoral Analysis: Banking & Financial Services',
        category: 'Sectoral',
        date: 'May 25, 2023',
        excerpt: 'In-depth review of banking and financial services sector, examining growth drivers and potential risks.',
        image: 'https://images.unsplash.com/photo-1556741533-411cf82e4e2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'
      }
    ];
  }
}
