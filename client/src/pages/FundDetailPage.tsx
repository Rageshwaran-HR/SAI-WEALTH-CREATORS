import React, { useState } from 'react';
import { useRoute } from 'wouter';
import { useParams } from 'wouter';
import { ArrowLeft, PieChart, TrendingUp, BarChart3, DollarSign, Clock, Calendar, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useETFHoldings, useStockTimeSeries, useFinancialRatios } from '@/hooks/use-mutual-fund-data';
import { FundDetailSkeleton } from '@/components/research/LoadingSkeletons';
import { Link } from 'wouter';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import PageTransition from "@/components/layout/PageTransition";

export default function FundDetailPage() {
  // Get the symbol from the URL parameter
  const params = useParams<{ symbol: string }>();
  const symbol = params?.symbol || '';
  
  // State for the active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Fetch data for this fund
  const { 
    data: holdingsData, 
    isLoading: isLoadingHoldings,
    error: holdingsError
  } = useETFHoldings(symbol);
  
  const { 
    data: timeSeriesData, 
    isLoading: isLoadingTimeSeries,
    error: timeSeriesError 
  } = useStockTimeSeries(symbol);
  
  const { 
    data: ratiosData, 
    isLoading: isLoadingRatios,
    error: ratiosError 
  } = useFinancialRatios(symbol);
  
  const isLoading = isLoadingHoldings || isLoadingTimeSeries || isLoadingRatios;
  
  // Create a placeholder fund object if we don't have the data yet
  const fund = holdingsData?.[0] || {
    symbol: symbol,
    name: symbol ? `${symbol} Fund` : 'Fund Details',
    price: 0,
    changes: 0,
    changesPercentage: 0,
    exchange: '',
    assetClass: ''
  };
  
  if (isLoading) {
    return <FundDetailSkeleton />;
  }

  return (
    <PageTransition>
    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="mb-8">
          <Button variant="ghost" className="flex items-center text-primary mb-6" asChild>
            <Link href="/research">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Mutual Fund Research
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-montserrat font-bold text-2xl md:text-4xl text-primary">{fund.name}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <span className="text-lg font-semibold mr-2">{fund.symbol}</span>
                {fund.exchange && (
                  <>
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <span>{fund.exchange}</span>
                  </>
                )}
                {fund.assetClass && (
                  <>
                    <Separator orientation="vertical" className="h-4 mx-2" />
                    <span>{fund.assetClass}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold">{formatCurrency(fund.price || 0)}</div>
              <div className={`flex items-center ${fund.changes && fund.changes > 0 ? 'text-green-600' : 'text-red-500'}`}>
                <span className="font-medium mr-1">
                  {fund.changes && fund.changes > 0 ? '+' : ''}{formatCurrency(fund.changes || 0)}
                </span>
                <span className="text-sm">
                  ({fund.changesPercentage && fund.changesPercentage > 0 ? '+' : ''}{formatPercentage(fund.changesPercentage || 0)})
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mb-8">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-sm"
              asChild
            >
              <a 
                href={`https://finance.yahoo.com/quote/${symbol}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Yahoo Finance
              </a>
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              className="text-sm text-primary"
            >
              Add to Watchlist
            </Button>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="risk">Risk & Ratings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <PieChart className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Fund Basics</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Asset Class</p>
                        <p className="font-medium">{fund.assetClass || 'Equity'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fund Category</p>
                        <p className="font-medium">Large-Cap Growth</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fund Family</p>
                        <p className="font-medium">Vanguard</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Fund Size</p>
                        <p className="font-medium">$25.8 Billion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Fees & Expenses</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Expense Ratio</p>
                        <p className="font-medium">0.04%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Minimum Investment</p>
                        <p className="font-medium">₹5,000</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Entry Load</p>
                        <p className="font-medium">None</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Exit Load</p>
                        <p className="font-medium">1% if redeemed within 1 year</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Important Dates</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Inception Date</p>
                        <p className="font-medium">Jan 15, 2010</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last NAV Update</p>
                        <p className="font-medium">May 1, 2023</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Dividend Date</p>
                        <p className="font-medium">Mar 20, 2023</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Settlement Period</p>
                        <p className="font-medium">T+3 days</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Fund Overview</h3>
                <p className="text-gray-700 mb-4">
                  {fund.name} is a {fund.assetClass || 'mutual fund'} that seeks to track the performance of the S&P 500 Index, 
                  which measures the investment return of large-capitalization U.S. stocks. The fund employs an indexing 
                  investment approach designed to track the performance of the index, which represents approximately 75% 
                  of the investable U.S. equity market.
                </p>
                <p className="text-gray-700">
                  The fund attempts to replicate the target index by investing all, or substantially all, of its assets in 
                  the stocks that make up the index, holding each stock in approximately the same proportion as its weighting 
                  in the index. The fund remains fully invested and seeks to maintain a level of risk similar to that of its 
                  benchmark index.
                </p>
              </div>
              
              <div>
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Investment Strategy</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ul className="space-y-3">
                    <li className="flex">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                      <span>The fund employs an indexing investment approach designed to track the performance of the benchmark index.</span>
                    </li>
                    <li className="flex">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                      <span>It invests in a diversified portfolio of stocks across various sectors with a focus on growth and stability.</span>
                    </li>
                    <li className="flex">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                      <span>The fund maintains a long-term investment approach and does not engage in market timing or sector rotation.</span>
                    </li>
                    <li className="flex">
                      <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                      <span>Portfolio rebalancing occurs periodically to maintain alignment with the benchmark index composition.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            {/* Performance Tab */}
            <TabsContent value="performance">
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Performance Chart</h3>
                <div className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center">
                  <p className="text-gray-500">Performance chart visualization would appear here</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Historical Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-4 font-medium">Time Period</th>
                        <th className="text-right p-4 font-medium">Fund Return</th>
                        <th className="text-right p-4 font-medium">Category Avg.</th>
                        <th className="text-right p-4 font-medium">Benchmark</th>
                        <th className="text-right p-4 font-medium">Rank in Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4">1 Month</td>
                        <td className="p-4 text-right text-green-600">+2.5%</td>
                        <td className="p-4 text-right">+1.8%</td>
                        <td className="p-4 text-right">+2.3%</td>
                        <td className="p-4 text-right">15/120</td>
                      </tr>
                      <tr>
                        <td className="p-4">3 Months</td>
                        <td className="p-4 text-right text-green-600">+6.2%</td>
                        <td className="p-4 text-right">+5.1%</td>
                        <td className="p-4 text-right">+5.9%</td>
                        <td className="p-4 text-right">22/118</td>
                      </tr>
                      <tr>
                        <td className="p-4">1 Year</td>
                        <td className="p-4 text-right text-green-600">+18.7%</td>
                        <td className="p-4 text-right">+15.2%</td>
                        <td className="p-4 text-right">+18.4%</td>
                        <td className="p-4 text-right">10/115</td>
                      </tr>
                      <tr>
                        <td className="p-4">3 Years</td>
                        <td className="p-4 text-right text-green-600">+45.3%</td>
                        <td className="p-4 text-right">+37.8%</td>
                        <td className="p-4 text-right">+44.5%</td>
                        <td className="p-4 text-right">8/95</td>
                      </tr>
                      <tr>
                        <td className="p-4">5 Years</td>
                        <td className="p-4 text-right text-green-600">+78.6%</td>
                        <td className="p-4 text-right">+65.4%</td>
                        <td className="p-4 text-right">+76.9%</td>
                        <td className="p-4 text-right">5/80</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-2">* Returns greater than 1 year are annualized</p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Calendar Year Returns</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-4 font-medium">Year</th>
                        <th className="text-right p-4 font-medium">Fund Return</th>
                        <th className="text-right p-4 font-medium">Category Avg.</th>
                        <th className="text-right p-4 font-medium">Benchmark</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4">2023 (YTD)</td>
                        <td className="p-4 text-right text-green-600">+12.4%</td>
                        <td className="p-4 text-right">+10.2%</td>
                        <td className="p-4 text-right">+12.1%</td>
                      </tr>
                      <tr>
                        <td className="p-4">2022</td>
                        <td className="p-4 text-right text-red-500">-18.1%</td>
                        <td className="p-4 text-right">-19.6%</td>
                        <td className="p-4 text-right">-18.5%</td>
                      </tr>
                      <tr>
                        <td className="p-4">2021</td>
                        <td className="p-4 text-right text-green-600">+28.5%</td>
                        <td className="p-4 text-right">+25.1%</td>
                        <td className="p-4 text-right">+28.2%</td>
                      </tr>
                      <tr>
                        <td className="p-4">2020</td>
                        <td className="p-4 text-right text-green-600">+18.2%</td>
                        <td className="p-4 text-right">+15.8%</td>
                        <td className="p-4 text-right">+17.9%</td>
                      </tr>
                      <tr>
                        <td className="p-4">2019</td>
                        <td className="p-4 text-right text-green-600">+31.7%</td>
                        <td className="p-4 text-right">+28.9%</td>
                        <td className="p-4 text-right">+31.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            
            {/* Holdings Tab */}
            <TabsContent value="holdings">
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Top 10 Holdings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-4 font-medium">Company</th>
                        <th className="text-left p-4 font-medium">Sector</th>
                        <th className="text-right p-4 font-medium">Weight</th>
                        <th className="text-right p-4 font-medium">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4">Apple Inc (AAPL)</td>
                        <td className="p-4">Technology</td>
                        <td className="p-4 text-right">7.2%</td>
                        <td className="p-4 text-right">$1.85B</td>
                      </tr>
                      <tr>
                        <td className="p-4">Microsoft Corp (MSFT)</td>
                        <td className="p-4">Technology</td>
                        <td className="p-4 text-right">6.5%</td>
                        <td className="p-4 text-right">$1.68B</td>
                      </tr>
                      <tr>
                        <td className="p-4">Amazon.com Inc (AMZN)</td>
                        <td className="p-4">Consumer Discretionary</td>
                        <td className="p-4 text-right">3.1%</td>
                        <td className="p-4 text-right">$800M</td>
                      </tr>
                      <tr>
                        <td className="p-4">NVIDIA Corp (NVDA)</td>
                        <td className="p-4">Technology</td>
                        <td className="p-4 text-right">2.8%</td>
                        <td className="p-4 text-right">$722M</td>
                      </tr>
                      <tr>
                        <td className="p-4">Alphabet Inc Class A (GOOGL)</td>
                        <td className="p-4">Communication Services</td>
                        <td className="p-4 text-right">2.0%</td>
                        <td className="p-4 text-right">$516M</td>
                      </tr>
                      <tr>
                        <td className="p-4">Alphabet Inc Class C (GOOG)</td>
                        <td className="p-4">Communication Services</td>
                        <td className="p-4 text-right">1.8%</td>
                        <td className="p-4 text-right">$464M</td>
                      </tr>
                      <tr>
                        <td className="p-4">Meta Platforms Inc (META)</td>
                        <td className="p-4">Communication Services</td>
                        <td className="p-4 text-right">1.3%</td>
                        <td className="p-4 text-right">$336M</td>
                      </tr>
                      <tr>
                        <td className="p-4">Tesla Inc (TSLA)</td>
                        <td className="p-4">Consumer Discretionary</td>
                        <td className="p-4 text-right">1.2%</td>
                        <td className="p-4 text-right">$310M</td>
                      </tr>
                      <tr>
                        <td className="p-4">Berkshire Hathaway Inc Class B (BRK.B)</td>
                        <td className="p-4">Financials</td>
                        <td className="p-4 text-right">1.0%</td>
                        <td className="p-4 text-right">$258M</td>
                      </tr>
                      <tr>
                        <td className="p-4">UnitedHealth Group Inc (UNH)</td>
                        <td className="p-4">Healthcare</td>
                        <td className="p-4 text-right">0.9%</td>
                        <td className="p-4 text-right">$232M</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Sector Allocation</h3>
                  <div className="bg-gray-100 rounded-lg p-4 h-72 flex items-center justify-center">
                    <p className="text-gray-500">Sector allocation chart would appear here</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Technology</span>
                      <span className="font-medium text-sm">28.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Financials</span>
                      <span className="font-medium text-sm">14.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Healthcare</span>
                      <span className="font-medium text-sm">13.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Consumer Discretionary</span>
                      <span className="font-medium text-sm">10.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Communication Services</span>
                      <span className="font-medium text-sm">8.7%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Asset Allocation</h3>
                  <div className="bg-gray-100 rounded-lg p-4 h-72 flex items-center justify-center">
                    <p className="text-gray-500">Asset allocation chart would appear here</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Stocks</span>
                      <span className="font-medium text-sm">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Bonds</span>
                      <span className="font-medium text-sm">0.0%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cash</span>
                      <span className="font-medium text-sm">1.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Other</span>
                      <span className="font-medium text-sm">0.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Risk Tab */}
            <TabsContent value="risk">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Risk Statistics</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Volatility (3Y)</p>
                        <p className="font-medium">18.2%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sharpe Ratio (3Y)</p>
                        <p className="font-medium">0.92</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Beta (3Y)</p>
                        <p className="font-medium">1.02</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Alpha (3Y)</p>
                        <p className="font-medium">0.8%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Risk Measures</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Maximum Drawdown (3Y)</p>
                        <p className="font-medium">-23.6%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Information Ratio (3Y)</p>
                        <p className="font-medium">0.18</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Treynor Ratio (3Y)</p>
                        <p className="font-medium">0.14</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">R-Squared (3Y)</p>
                        <p className="font-medium">0.96</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <PieChart className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-montserrat font-bold text-lg">Ratings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Morningstar Rating</p>
                        <div className="flex">★★★★★</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">CRISIL Rating</p>
                        <p className="font-medium">5 Star</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Value Research Rating</p>
                        <p className="font-medium">Gold</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Risk Grade</p>
                        <p className="font-medium">Average</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Risk Analysis</h3>
                <p className="text-gray-700 mb-4">
                  {fund.name} has demonstrated a consistent risk profile aligned with its benchmark index. 
                  The fund has a beta of 1.02, indicating it tends to move slightly more than the market, 
                  but still maintains a very high correlation with its benchmark as evidenced by the R-squared value of 0.96.
                </p>
                <p className="text-gray-700">
                  With a Sharpe ratio of 0.92, the fund shows good risk-adjusted performance over the past three years. 
                  The maximum drawdown of -23.6% during market downturns is in line with expectations for an equity fund 
                  of this type. Overall, the fund exhibits moderate risk characteristics suitable for long-term investors 
                  seeking market-like returns with minimal tracking error.
                </p>
              </div>
              
              <div className="mb-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Risk vs Return (5 Years)</h3>
                <div className="bg-gray-100 rounded-lg p-4 h-80 flex items-center justify-center">
                  <p className="text-gray-500">Risk vs Return chart would appear here</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-3">Interested in this Fund?</h3>
              <p className="text-gray-600">
                Our team of experts can help you understand if this fund aligns with your financial goals and risk tolerance.
              </p>
            </div>
            <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold" asChild>
              <Link href="/contact">Schedule a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}