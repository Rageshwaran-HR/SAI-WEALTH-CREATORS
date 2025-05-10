import { Router } from 'express';
import {
  getFinancialNews,
  getMarketNews,
  getMutualFundData,
  getMutualFundScreener,
  getETFHoldings,
  getStockTimeSeries,
  getFinancialRatios,
  getTopETFs,
  getResearchReports
} from '../services/financeService';

const router = Router();

// Get financial news from Alpha Vantage
router.get('/news/financial', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const news = await getFinancialNews(limit);
    res.json(news);
  } catch (error) {
    console.error('Error in financial news route:', error);
    res.status(500).json({ error: 'Failed to fetch financial news' });
  }
});

// Get market news from Financial Modeling Prep
router.get('/news/market', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const news = await getMarketNews(limit);
    res.json(news);
  } catch (error) {
    console.error('Error in market news route:', error);
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

// Get mutual fund data
router.get('/mutual-fund/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    const data = await getMutualFundData(symbol);
    res.json(data);
  } catch (error) {
    console.error('Error in mutual fund data route:', error);
    res.status(500).json({ error: 'Failed to fetch mutual fund data' });
  }
});

// Get mutual fund screener
router.get('/mutual-fund-screener', async (req, res) => {
  try {
    const data = await getMutualFundScreener();
    res.json(data);
  } catch (error) {
    console.error('Error in mutual fund screener route:', error);
    res.status(500).json({ error: 'Failed to fetch mutual fund screener data' });
  }
});

// Get ETF holdings
router.get('/etf-holdings/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    const data = await getETFHoldings(symbol);
    res.json(data);
  } catch (error) {
    console.error('Error in ETF holdings route:', error);
    res.status(500).json({ error: 'Failed to fetch ETF holdings' });
  }
});

// Get stock time series
router.get('/time-series/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const interval = req.query.interval as string || 'daily';
    const outputSize = req.query.outputSize as string || 'compact';
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    
    const data = await getStockTimeSeries(symbol, interval, outputSize);
    res.json(data);
  } catch (error) {
    console.error('Error in stock time series route:', error);
    res.status(500).json({ error: 'Failed to fetch stock time series' });
  }
});

// Get financial ratios
router.get('/financial-ratios/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol is required' });
    }
    const data = await getFinancialRatios(symbol);
    res.json(data);
  } catch (error) {
    console.error('Error in financial ratios route:', error);
    res.status(500).json({ error: 'Failed to fetch financial ratios' });
  }
});

// Get top ETFs
router.get('/top-etfs', async (req, res) => {
  try {
    const data = await getTopETFs();
    res.json(data);
  } catch (error) {
    console.error('Error in top ETFs route:', error);
    res.status(500).json({ error: 'Failed to fetch top ETFs' });
  }
});

// Get research reports
router.get('/research-reports', async (req, res) => {
  try {
    const reports = await getResearchReports();
    res.json(reports);
  } catch (error) {
    console.error('Error in research reports route:', error);
    res.status(500).json({ error: 'Failed to fetch research reports' });
  }
});

export default router;