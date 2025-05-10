import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { calculateSIP } from '@/lib/calculators';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FinancialCalculators = () => {
  const [activeTab, setActiveTab] = useState('sip-calculator');
  
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipTime, setSipTime] = useState(10);
  
  const [results, setResults] = useState<{
    investedAmount: number;
    estimatedReturns: number;
    totalValue: number;
    yearlyData: {
      year: number;
      invested: number;
      returns: number;
      total: number;
      percentage: number;
    }[];
  }>({
    investedAmount: 0,
    estimatedReturns: 0,
    totalValue: 0,
    yearlyData: []
  });
  
  // Calculate SIP results whenever inputs change
  useEffect(() => {
    try {
      const sipResults = calculateSIP(sipAmount, sipRate, sipTime);
      setResults({ ...sipResults });
      console.log("Updated Results:", sipResults);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  }, [sipAmount, sipRate, sipTime]);
  
  const handleAmountChange = (value: number) => {
    setSipAmount(value);
  };
  
  const handleRateChange = (value: number) => {
    setSipRate(value);
  };
  
  const handleTimeChange = (value: number) => {
    setSipTime(value);
  };
  
  return (
    <section id="calculators" className="py-16 bg-gray-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-primary mb-3">Financial Calculators</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan your financial future with our interactive tools designed to help you make informed investment decisions.
          </p>
        </div>
        
        <Tabs defaultValue="sip-calculator" onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent">
            <TabsTrigger 
              value="sip-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              SIP Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="retirement-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              Retirement
            </TabsTrigger>
            <TabsTrigger 
              value="education-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              Education
            </TabsTrigger>
            <TabsTrigger 
              value="lumpsum-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              Lumpsum
            </TabsTrigger>
            <TabsTrigger 
              value="ppf-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              PPF
            </TabsTrigger>
            <TabsTrigger 
              value="emi-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              EMI
            </TabsTrigger>
            <TabsTrigger 
              value="inflation-calculator"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 font-medium"
            >
              Inflation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sip-calculator">
            <Card className="bg-white rounded-lg shadow-md overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" className="text-primary" asChild>
                    <Link href="/calculators?calculator=sip">Full SIP Calculator</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">SIP Investment Calculator</h3>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Monthly Investment (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={sipAmount.toString()}
                          onChange={(e) => setSipAmount(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={500} 
                          max={100000} 
                          step={500} 
                          value={[sipAmount]} 
                          onValueChange={(values) => handleAmountChange(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹500</span>
                          <span>₹100,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Expected Return Rate (%)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={sipRate.toString()}
                          onChange={(e) => setSipRate(parseFloat(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={0.5} 
                          value={[sipRate]} 
                          onValueChange={(values) => handleRateChange(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1%</span>
                          <span>30%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-gray-700 font-medium mb-2">Time Period (Years)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={sipTime.toString()}
                          onChange={(e) => setSipTime(parseInt(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">Yrs</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={1} 
                          value={[sipTime]} 
                          onValueChange={(values) => handleTimeChange(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 yr</span>
                          <span>30 yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Your Investment Growth</h3>
                    
                    <div className="mb-8 grid grid-cols-2 gap-4">
                      <div className="bg-gray-100 p-4 rounded-md">
                        <p className="text-gray-600 text-sm mb-1">Invested Amount</p>
                        <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(results.investedAmount)}</p>
                      </div>
                      <div className="bg-gray-100 p-4 rounded-md">
                        <p className="text-gray-600 text-sm mb-1">Estimated Returns</p>
                        <p className="financial-figure text-[#009933] font-bold text-xl">{formatCurrency(results.estimatedReturns)}</p>
                      </div>
                      <div className="bg-primary p-4 rounded-md col-span-2">
                        <p className="text-white text-sm mb-1">Total Value</p>
                        <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(results.totalValue)}</p>
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="bg-white rounded-md p-4 border">
                      <h4 className="font-montserrat font-medium text-gray-700 mb-4">Investment Growth Chart</h4>
                      
                      {results.yearlyData?.length > 0 ? (
                        <div className="h-48 flex items-end space-x-2">
                          {results.yearlyData.map((data, index) => (
                            <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                              <div 
                                className={`chart-bar ${index === sipTime - 1 ? 'bg-secondary' : 'bg-primary'} w-full`} 
                                style={{ height: `${data.percentage}%` }}
                              ></div>
                              <span className="text-xs mt-1">Y{data.year}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No data available to display the chart.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retirement-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Retirement Calculator</h3>
              <p className="text-gray-600 mb-6">Plan for a comfortable retirement by calculating how much you need to save now.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=retirement">Explore Retirement Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="education-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Education Planning Calculator</h3>
              <p className="text-gray-600 mb-6">Calculate how much you need to save for your child's future education expenses.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=education">Explore Education Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="lumpsum-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Lumpsum Calculator</h3>
              <p className="text-gray-600 mb-6">See how your one-time investment can grow over time with the power of compounding.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=lumpsum">Explore Lumpsum Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="ppf-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">PPF Calculator</h3>
              <p className="text-gray-600 mb-6">Calculate your returns from the Public Provident Fund (PPF) investment over time.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=ppf">Explore PPF Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="emi-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">EMI Calculator</h3>
              <p className="text-gray-600 mb-6">Calculate your monthly loan payments and total interest paid over the loan period.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=emi">Explore EMI Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="inflation-calculator">
            <Card className="bg-white rounded-lg shadow-md p-8 text-center py-12">
              <h3 className="font-montserrat font-bold text-xl text-primary mb-4">Inflation Calculator</h3>
              <p className="text-gray-600 mb-6">Understand how inflation impacts your money's purchasing power over time.</p>
              <Button className="bg-primary text-white hover:bg-primary/90 font-medium" asChild>
                <Link href="/calculators?calculator=inflation">Explore Inflation Calculator</Link>
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default FinancialCalculators;
