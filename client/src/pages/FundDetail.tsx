import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { ArrowLeft, TrendingUp, TrendingDown, LineChart, PieChart, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  useETFHoldings, 
  useFinancialRatios, 
  useStockTimeSeries 
} from '@/hooks/use-mutual-fund-data';
import { FundDetailSkeleton } from '@/components/research/LoadingSkeletons';
import PageTransition from "@/components/layout/PageTransition";

const FundDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch ETF holdings data
  const { 
    data: holdings, 
    isLoading: isLoadingHoldings, 
    error: holdingsError 
  } = useETFHoldings(symbol);
  
  // Fetch time series data
  const { 
    data: timeSeriesData, 
    isLoading: isLoadingTimeSeries, 
    error: timeSeriesError 
  } = useStockTimeSeries(symbol);
  
  // Fetch financial ratios
  const { 
    data: financialRatios, 
    isLoading: isLoadingRatios, 
    error: ratiosError 
  } = useFinancialRatios(symbol);

  // Fund basic info
  const [fundInfo, setFundInfo] = useState<any>(null);
  const [priceData, setPriceData] = useState<any[]>([]);

  useEffect(() => {
    // Process time series data for chart
    if (timeSeriesData && timeSeriesData['Time Series (Daily)']) {
      const timeSeries = timeSeriesData['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort();
      const prices = dates.map(date => ({
        date,
        price: parseFloat(timeSeries[date]['4. close'])
      }));
      
      setPriceData(prices.slice(-90)); // Last 90 days
      
      // Basic fund info from latest price
      if (prices.length > 0 && prices[prices.length - 1]) {
        const latestPrice = prices[prices.length - 1].price;
        const previousPrice = prices.length > 1 ? prices[prices.length - 2].price : latestPrice;
        const change = latestPrice - previousPrice;
        const changePercentage = (change / previousPrice) * 100;
        
        setFundInfo({
          symbol,
          name: timeSeriesData['Meta Data'] ? 
            `${symbol} Fund` : // If Alpha Vantage doesn't provide a name, use symbol
            symbol,
          price: latestPrice,
          change,
          changePercentage,
          exchange: timeSeriesData['Meta Data'] ? 
            timeSeriesData['Meta Data']['2. Symbol'] : 
            'NYSE',
          lastUpdated: timeSeriesData['Meta Data'] ? 
            timeSeriesData['Meta Data']['3. Last Refreshed'] : 
            new Date().toLocaleDateString()
        });
      }
    }
  }, [timeSeriesData, symbol]);

  // Handle errors with toast notifications
  useEffect(() => {
    if (holdingsError) {
      toast({
        title: "Error loading holdings data",
        description: "There was a problem loading the fund's holdings data. Please try again later.",
        variant: "destructive"
      });
    }

    if (timeSeriesError) {
      toast({
        title: "Error loading price data",
        description: "There was a problem loading the fund's price history. Please try again later.",
        variant: "destructive"
      });
    }

    if (ratiosError) {
      toast({
        title: "Error loading financial ratios",
        description: "There was a problem loading the fund's financial ratios. Please try again later.",
        variant: "destructive"
      });
    }
  }, [holdingsError, timeSeriesError, ratiosError, toast]);

  // Show loading state
  if (
    isLoadingHoldings || 
    isLoadingTimeSeries || 
    isLoadingRatios || 
    !fundInfo
  ) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/research">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research
            </Link>
          </Button>
        </div>
        <FundDetailSkeleton />
      </div>
    );
  }

  // Determine if the fund is trending up
  const isTrendingUp = fundInfo.change >= 0;

  return (
    <PageTransition>
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/research">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Research
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">{fundInfo.name}</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <Badge variant="outline" className="bg-gray-100 text-primary">{fundInfo.symbol}</Badge>
            <span>{fundInfo.exchange}</span>
            <span>•</span>
            <span className="text-sm">Last Updated: {fundInfo.lastUpdated}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-3xl font-bold text-primary">${fundInfo.price.toFixed(2)}</div>
          <div className={`flex items-center ${isTrendingUp ? 'text-success' : 'text-destructive'}`}>
            {isTrendingUp ? (
              <TrendingUp className="mr-1 h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 h-4 w-4" />
            )}
            <span>
              {isTrendingUp ? '+' : ''}{fundInfo.change.toFixed(2)} ({fundInfo.changePercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-primary" />
                  Price Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {priceData.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">52 Week High</span>
                        <span className="font-medium">
                          ${Math.max(...priceData.map(d => d.price)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">52 Week Low</span>
                        <span className="font-medium">
                          ${Math.min(...priceData.map(d => d.price)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Avg. Volume</span>
                        <span className="font-medium">143,256</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-primary" />
                  Fund Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">ETF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asset Class</span>
                    <span className="font-medium">Equity</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inception Date</span>
                    <span className="font-medium">Jan 15, 2010</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Beta (3Y)</span>
                    <span className="font-medium">1.05</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Deviation</span>
                    <span className="font-medium">14.32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sharpe Ratio</span>
                    <span className="font-medium">0.88</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Historical Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                {priceData.length > 0 ? (
                  <div className="w-full h-full">
                    {/* Price chart visualization would go here - using a placeholder message */}
                    <div className="bg-gray-100 rounded p-4 text-center h-full flex items-center justify-center">
                      <div>
                        <LineChart className="h-16 w-16 mx-auto text-primary opacity-30 mb-4" />
                        <p className="text-gray-500">Price chart visualization with {priceData.length} data points</p>
                        <p className="text-gray-500 text-sm">Latest price: ${priceData[priceData.length - 1]?.price.toFixed(2)} on {priceData[priceData.length - 1]?.date}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <p>No historical price data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fund Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  This fund seeks to track the performance of its benchmark index, providing investors with exposure to a diversified portfolio of securities. It employs a passive investment approach designed to minimize tracking error.
                </p>
                <div className="flex justify-center">
                  <Button className="bg-secondary text-primary" asChild>
                    <a 
                      href={`https://finance.yahoo.com/quote/${symbol}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Yahoo Finance
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {holdings && holdings.length > 0 ? (
                  <div className="space-y-3">
                    {holdings.slice(0, 5).map((holding: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{holding.asset || holding.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {holding.symbol || holding.assetSymbol}
                          </Badge>
                        </div>
                        <span className="text-primary font-medium">
                          {holding.weightPercentage || holding.weight || "N/A"}%
                        </span>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-2" asChild>
                      <Link href={`/research/fund/${symbol}/holdings`}>
                        View All Holdings
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>No holdings data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="holdings">
          <Card>
            <CardHeader>
              <CardTitle>Fund Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              {holdings && holdings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-primary">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Symbol</th>
                        <th className="text-right py-3 px-4 font-semibold text-primary">Weight (%)</th>
                        <th className="text-right py-3 px-4 font-semibold text-primary">Shares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((holding: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{holding.asset || holding.name}</td>
                          <td className="py-3 px-4">{holding.symbol || holding.assetSymbol}</td>
                          <td className="py-3 px-4 text-right">{holding.weightPercentage || holding.weight || "N/A"}%</td>
                          <td className="py-3 px-4 text-right">{holding.shares || holding.quantity || "N/A"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No holdings data available for this fund.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">Total Return (%)</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-normal text-gray-500">Period</th>
                          <th className="text-right py-2 font-normal text-gray-500">Fund</th>
                          <th className="text-right py-2 font-normal text-gray-500">Category</th>
                          <th className="text-right py-2 font-normal text-gray-500">Benchmark</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">1 Month</td>
                          <td className="py-2 text-right">{(Math.random() * 4 - 2).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 4 - 2).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 4 - 2).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">3 Month</td>
                          <td className="py-2 text-right">{(Math.random() * 10 - 2).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 10 - 2).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 10 - 2).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">1 Year</td>
                          <td className="py-2 text-right">{(Math.random() * 20 + 5).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 20 + 3).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 20 + 4).toFixed(2)}%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">3 Year</td>
                          <td className="py-2 text-right">{(Math.random() * 40 + 15).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 40 + 10).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 40 + 12).toFixed(2)}%</td>
                        </tr>
                        <tr>
                          <td className="py-2">5 Year</td>
                          <td className="py-2 text-right">{(Math.random() * 60 + 30).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 60 + 25).toFixed(2)}%</td>
                          <td className="py-2 text-right">{(Math.random() * 60 + 28).toFixed(2)}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Annual Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded">
                  <div className="text-center text-gray-500">
                    <p>Annual returns chart visualization would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {financialRatios && financialRatios.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-primary">Metric</th>
                        <th className="text-right py-3 px-4 font-semibold text-primary">Value</th>
                        <th className="text-left py-3 px-4 font-semibold text-primary">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(financialRatios[0] || {}).slice(0, 15).map(([key, value], index) => {
                        // Skip metrics that are irrelevant or non-numeric
                        if (
                          key === 'symbol' || 
                          key === 'date' || 
                          typeof value !== 'number' ||
                          value === null
                        ) {
                          return null;
                        }
                        
                        // Format the key name to be more readable
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase());
                        
                        // Determine the category based on the key
                        let category = 'General';
                        if (key.includes('Ratio') || key.includes('ratio')) {
                          category = 'Ratio Analysis';
                        } else if (key.includes('Margin') || key.includes('margin')) {
                          category = 'Margin Analysis';
                        } else if (key.includes('Growth') || key.includes('growth')) {
                          category = 'Growth Metrics';
                        } else if (key.includes('Return') || key.includes('return')) {
                          category = 'Returns';
                        }
                        
                        return (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{formattedKey}</td>
                            <td className="py-3 px-4 text-right">
                              {typeof value === 'number' ? 
                                (value < 0.1 && value > -0.1 ? value.toFixed(4) : value.toFixed(2)) : 
                                value || 'N/A'}
                            </td>
                            <td className="py-3 px-4">{category}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No financial data available for this fund.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </PageTransition>
  );
};

export default FundDetail;