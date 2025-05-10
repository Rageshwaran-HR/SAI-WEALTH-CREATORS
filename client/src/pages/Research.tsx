import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { ArrowRight, LineChart, BarChart, PieChart, TrendingUp, TrendingDown, Clock, Search, Filter } from 'lucide-react';
import { useTopETFs, useMutualFundScreener, useResearchReports, ResearchReport } from '@/hooks/use-mutual-fund-data';
import { FundCard } from '@/components/research/FundCard';
import { 
  FundListSkeleton, 
  MarketInsightsSkeleton,
  ResearchReportsSkeleton
} from '@/components/research/LoadingSkeletons';
import { useToast } from '@/hooks/use-toast';
import PageTransition from "@/components/layout/PageTransition";

const Research = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('fund-screener');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showOnlyTopPerformers, setShowOnlyTopPerformers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleReports, setVisibleReports] = useState(3);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const itemsPerPage = 12;
  
  // Fetch ETF data using the hooks
  const { 
    data: topETFs, 
    isLoading: isLoadingTopETFs, 
    error: topETFsError 
  } = useTopETFs();
  
  const { 
    data: fundScreenerData, 
    isLoading: isLoadingScreener, 
    error: screenerError 
  } = useMutualFundScreener();

  // Combine and use the appropriate data based on the view
  const funds = activeTab === 'top-performers' ? topETFs : fundScreenerData;
  const isLoading = isLoadingTopETFs || isLoadingScreener;

  // Categories
  const fundCategories = [
    { id: 'all', name: 'All Categories' },
    { id: 'equity', name: 'Equity' },
    { id: 'fixed-income', name: 'Fixed Income' },
    { id: 'mixed-allocation', name: 'Mixed Allocation' },
    { id: 'sector', name: 'Sector' },
    { id: 'index', name: 'Index' }
  ];

  // Filter and sort the funds
  const filteredFunds = (funds || [])
    .filter((fund: any) => {
      // Multiple filters - we'll check each condition separately and combine them
      
      // Check category filter
      let passesCategory = true;
      if (selectedCategory !== 'all') {
        const category = fund.assetClass?.toLowerCase();
        passesCategory = category && category.includes(selectedCategory.toLowerCase());
      }
      
      // Check search query filter
      let passesSearch = true;
      if (searchQuery) {
        const name = fund.name?.toLowerCase() || '';
        const symbol = fund.symbol?.toLowerCase() || '';
        passesSearch = name.includes(searchQuery.toLowerCase()) || 
                      symbol.includes(searchQuery.toLowerCase());
      }
      
      // Check performance filter
      let passesPerformance = true;
      if (showOnlyTopPerformers) {
        passesPerformance = fund.changesPercentage > 0;
      }
      
      // Fund must pass ALL active filters
      return passesCategory && passesSearch && passesPerformance;
    })
    .sort((a: any, b: any) => {
      // Sort based on selected sort criteria
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'symbol') {
        return (a.symbol || '').localeCompare(b.symbol || '');
      } else if (sortBy === 'price') {
        return (b.price || 0) - (a.price || 0);
      } else if (sortBy === 'performance') {
        return (b.changesPercentage || 0) - (a.changesPercentage || 0);
      }
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredFunds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedFunds = filteredFunds.slice(startIndex, endIndex);
  
  // Handle pagination navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch research reports
  const {
    data: researchReports,
    isLoading: isLoadingReports,
    error: reportsError
  } = useResearchReports();
  
  // Set default research reports if data is loading or has error
  const allResearchReports = researchReports || [];

  // Show error toast when API calls fail
  useEffect(() => {
    if (topETFsError || screenerError || reportsError) {
      toast({
        title: "Error fetching data",
        description: "There was a problem loading data. Please try again later.",
        variant: "destructive"
      });
    }
  }, [topETFsError, screenerError, reportsError, toast]);

  return (
    <PageTransition>
    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">Mutual Fund Research</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Access our comprehensive mutual fund research, analysis, and recommendations to make informed investment decisions.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="flex justify-center mb-10">
            <TabsTrigger value="fund-screener">Fund Screener</TabsTrigger>
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="research-reports">Research Reports</TabsTrigger>
            <TabsTrigger value="market-insights">Market Insights</TabsTrigger>
          </TabsList>
          
          {/* Fund Screener Tab */}
          <TabsContent value="fund-screener">
            <div className="mb-8">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Mutual Fund Screener</h2>
              
              {/* Filters and search */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by fund name or symbol"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap md:flex-nowrap">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="symbol">Symbol</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="top-performers" 
                    checked={showOnlyTopPerformers}
                    onCheckedChange={setShowOnlyTopPerformers}
                  />
                  <label htmlFor="top-performers" className="text-sm text-gray-600 cursor-pointer">
                    Show only positive performers
                  </label>
                </div>
              </div>
              
              {/* Fund list */}
              {isLoading ? (
                <FundListSkeleton count={9} />
              ) : displayedFunds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedFunds.map((fund: any) => (
                    <FundCard key={fund.symbol} fund={fund} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Filter className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No funds match your filters</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or category selection</p>
                </div>
              )}
              
              {filteredFunds.length > 0 && (
                <div className="mt-8 text-center">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Display a sliding window of pages centered around current page
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button 
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        className={`mr-2 ${currentPage === pageNumber ? 'bg-primary text-white' : ''}`}
                        onClick={() => handlePageClick(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                  
                  <Button 
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
            
            <div className="mt-12 bg-gray-100 p-8 rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-8">
                  <h3 className="font-montserrat font-bold text-xl text-primary mb-3">Need Help Selecting Funds?</h3>
                  <p className="text-gray-600">
                    Our team of experts can help you build a diversified mutual fund portfolio tailored to your financial goals and risk tolerance.
                  </p>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90 text-primary font-bold" asChild>
                  <Link href="/contact">Schedule a Consultation</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Top Performers Tab */}
          <TabsContent value="top-performers">
            <div className="mb-8">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Top Performing Funds</h2>
              
              {isLoading ? (
                <FundListSkeleton count={6} />
              ) : topETFs && topETFs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {topETFs.slice(0, 6).map((fund: any) => (
                    <FundCard key={fund.symbol} fund={fund} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No top performers data available</h3>
                  <p className="text-gray-500">Please try again later or check another category</p>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Performance by Category</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg text-primary">Equity Funds</h4>
                        <Badge className="bg-success text-white">+15.2% Avg</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Equity funds have shown strong performance over the past year, with technology and healthcare sectors leading the gains.
                      </p>
                      <Button variant="link" className="text-primary p-0" asChild>
                        <Link href="/research?category=equity">
                          View Equity Funds <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-lg text-primary">Fixed Income Funds</h4>
                        <Badge className="bg-warning text-primary">+7.4% Avg</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Fixed income funds have provided stable returns despite interest rate fluctuations, with corporate bonds outperforming.
                      </p>
                      <Button variant="link" className="text-primary p-0" asChild>
                        <Link href="/research?category=fixed-income">
                          View Fixed Income Funds <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Research Reports Tab */}
          <TabsContent value="research-reports">
            <div className="mb-8">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Latest Research Reports</h2>
              
              {isLoadingReports ? (
                <ResearchReportsSkeleton count={3} />
              ) : allResearchReports.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {allResearchReports.slice(0, visibleReports).map((report) => (
                      <Card key={report.id} className="overflow-hidden">
                        <div className="h-48 bg-gray-200 relative">
                          <img 
                            src={report.image} 
                            alt={report.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center mb-2">
                            <Badge variant="secondary" className="bg-primary text-white mr-2">{report.category}</Badge>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {report.date}
                            </div>
                          </div>
                          <h3 className="font-montserrat font-bold text-xl text-primary mb-2">
                            {report.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {report.excerpt}
                          </p>
                          <Button variant="link" className="text-secondary p-0 h-auto font-bold">
                            Read Full Report <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="text-center mt-10">
                    {visibleReports < allResearchReports.length ? (
                      <Button 
                        className="bg-primary hover:bg-primary/90 text-white font-bold"
                        onClick={() => setVisibleReports(allResearchReports.length)}
                      >
                        View All Research Reports
                      </Button>
                    ) : (
                      <Button 
                        className="bg-secondary hover:bg-secondary/90 text-primary font-bold"
                        onClick={() => setVisibleReports(3)}
                      >
                        Show Less Reports
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No research reports available</h3>
                  <p className="text-gray-500">Our team is working on new analysis. Please check back soon.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Market Insights Tab */}
          <TabsContent value="market-insights">
            <div className="mb-8">
              <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Market Insights</h2>
              
              {isLoading ? (
                <MarketInsightsSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-montserrat font-bold text-xl text-primary">Equity Market Outlook</h3>
                        <LineChart className="h-6 w-6 text-secondary" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        The Indian equity market maintains a positive long-term outlook despite near-term volatility. Strong corporate earnings, economic reforms, and robust domestic consumption are expected to drive market growth.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-100 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-1">Opportunities</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>Banking & Financial Services</li>
                            <li>Information Technology</li>
                            <li>Consumer Discretionary</li>
                          </ul>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-1">Challenges</h4>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            <li>Global Inflation</li>
                            <li>Rising Interest Rates</li>
                            <li>Geopolitical Tensions</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-montserrat font-bold text-xl text-primary">Debt Market Analysis</h3>
                        <BarChart className="h-6 w-6 text-secondary" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        The debt market is experiencing a period of adjustment due to changing monetary policy. Investors should focus on short to medium duration funds while maintaining adequate liquidity in portfolios.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-100 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-1">Yield Curve</h4>
                          <p className="text-sm text-gray-600">Flattening with short-term rates rising faster than long-term rates.</p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-1">Credit Spreads</h4>
                          <p className="text-sm text-gray-600">Widening slightly, indicating increased caution in the credit markets.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div className="mt-8">
                <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Expert Analysis</h3>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12 flex items-center justify-center">
                        <PieChart className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-montserrat font-bold text-lg text-primary mb-2">Asset Allocation Strategy</h4>
                        <p className="text-gray-600 mb-4">
                          Given current market conditions, we recommend a balanced approach to asset allocation with a slight overweight to equities. Within equities, quality large-caps and select mid-caps offer better risk-adjusted returns. For fixed income, maintain a barbell strategy with a mix of short-term and long-term instruments.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-100 p-3 rounded-md text-center">
                            <h5 className="font-medium text-primary text-sm mb-1">Equities</h5>
                            <p className="text-base font-bold text-secondary">55%</p>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-md text-center">
                            <h5 className="font-medium text-primary text-sm mb-1">Fixed Income</h5>
                            <p className="text-base font-bold text-secondary">35%</p>
                          </div>
                          <div className="bg-gray-100 p-3 rounded-md text-center">
                            <h5 className="font-medium text-primary text-sm mb-1">Cash/Alternatives</h5>
                            <p className="text-base font-bold text-secondary">10%</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                        >
                          {showFullAnalysis ? 'Hide Full Analysis' : 'Read Full Analysis'}
                        </Button>
                        
                        {showFullAnalysis && (
                          <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                            <h4 className="font-montserrat font-bold text-lg text-primary mb-2">Full Asset Allocation Analysis</h4>
                            <p className="text-gray-600 mb-4">
                              Given the current volatility in global markets, we recommend a balanced approach to asset allocation with a slight overweight to equities. Our analysis suggests that in the near term, there may be increased volatility due to geopolitical tensions and inflation concerns. However, we believe that strong fundamentals and continued economic growth will support equities over the medium to long term.
                            </p>
                            <p className="text-gray-600 mb-4">
                              Within equities, we favor quality large-caps and select mid-caps that offer better risk-adjusted returns. Sectors to focus on include technology, healthcare, and financial services. For fixed income, we suggest a barbell strategy with a mix of short-term instruments to manage interest rate risk and longer-term bonds for yield enhancement.
                            </p>
                            <p className="text-gray-600">
                              For investors with a higher risk tolerance, we recommend a 60% allocation to equities, 30% to fixed income, and 10% to alternatives/cash. For those with moderate risk tolerance, we suggest 50% equities, 40% fixed income, and 10% alternatives/cash. Conservative investors may prefer a 35% equity, 55% fixed income, and 10% alternatives/cash allocation.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </PageTransition>
  );
};

export default Research;