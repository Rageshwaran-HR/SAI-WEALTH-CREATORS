import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { 
  calculateSIP, 
  calculateLumpsum, 
  calculateRetirement, 
  calculateEMI, 
  calculatePPF, 
  calculateEducation, 
  calculateInflation 
} from '@/lib/calculators';
import PageTransition from '@/components/layout/PageTransition';

const Calculators = () => {
  // Get default tab from URL or default to SIP
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('calculator') || 'sip';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // SIP Calculator state
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipTime, setSipTime] = useState(10);
  const [sipResults, setSipResults] = useState<any>(null);
  
  // Lumpsum Calculator state
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [lumpsumRate, setLumpsumRate] = useState(10);
  const [lumpsumTime, setLumpsumTime] = useState(5);
  const [lumpsumResults, setLumpsumResults] = useState<any>(null);
  
  // Retirement Calculator state
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [inflationRate, setInflationRate] = useState(6);
  const [returnRate, setReturnRate] = useState(10);
  const [retirementResults, setRetirementResults] = useState<any>(null);
  
  // EMI Calculator state
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [interestRate, setInterestRate] = useState(9);
  const [loanTerm, setLoanTerm] = useState(20);
  const [emiResults, setEmiResults] = useState<any>(null);
  
  // PPF Calculator state
  const [ppfAmount, setPpfAmount] = useState(150000);
  const [ppfRate, setPpfRate] = useState(7.1);
  const [ppfTime, setPpfTime] = useState(15);
  const [ppfResults, setPpfResults] = useState<any>(null);
  
  // Education Calculator state
  const [childAge, setChildAge] = useState(5);
  const [educationAge, setEducationAge] = useState(18);
  const [courseDuration, setCourseDuration] = useState(4);
  const [annualExpense, setAnnualExpense] = useState(500000);
  const [educationInflation, setEducationInflation] = useState(10);
  const [educationReturnRate, setEducationReturnRate] = useState(12);
  const [educationResults, setEducationResults] = useState<any>(null);
  
  // Inflation Calculator state
  const [currentValue, setCurrentValue] = useState(100000);
  const [inflationValue, setInflationValue] = useState(6);
  const [inflationTime, setInflationTime] = useState(10);
  const [inflationResults, setInflationResults] = useState<any>(null);
  
  // Calculate SIP results
  useEffect(() => {
    try {
      const results = calculateSIP(sipAmount, sipRate, sipTime);
      setSipResults(results);
    } catch (error) {
      console.error("SIP calculation error:", error);
    }
  }, [sipAmount, sipRate, sipTime]);
  
  // Calculate Lumpsum results
  useEffect(() => {
    try {
      const results = calculateLumpsum(lumpsumAmount, lumpsumRate, lumpsumTime);
      setLumpsumResults(results);
    } catch (error) {
      console.error("Lumpsum calculation error:", error);
    }
  }, [lumpsumAmount, lumpsumRate, lumpsumTime]);
  
  // Calculate Retirement results
  useEffect(() => {
    try {
      if (currentAge < retirementAge && retirementAge < lifeExpectancy) {
        const results = calculateRetirement(
          currentAge,
          retirementAge,
          lifeExpectancy,
          monthlyExpense,
          inflationRate,
          returnRate
        );
        setRetirementResults(results);
      }
    } catch (error) {
      console.error("Retirement calculation error:", error);
    }
  }, [currentAge, retirementAge, lifeExpectancy, monthlyExpense, inflationRate, returnRate]);
  
  // Calculate EMI results
  useEffect(() => {
    try {
      const results = calculateEMI(loanAmount, interestRate, loanTerm);
      setEmiResults(results);
    } catch (error) {
      console.error("EMI calculation error:", error);
    }
  }, [loanAmount, interestRate, loanTerm]);
  
  // Calculate PPF results
  useEffect(() => {
    try {
      const results = calculatePPF(ppfAmount, ppfRate, ppfTime);
      setPpfResults(results);
    } catch (error) {
      console.error("PPF calculation error:", error);
    }
  }, [ppfAmount, ppfRate, ppfTime]);
  
  // Calculate Education results
  useEffect(() => {
    try {
      if (childAge < educationAge) {
        const results = calculateEducation(
          childAge,
          educationAge,
          courseDuration,
          annualExpense,
          educationInflation,
          educationReturnRate
        );
        setEducationResults(results);
      }
    } catch (error) {
      console.error("Education planning calculation error:", error);
    }
  }, [childAge, educationAge, courseDuration, annualExpense, educationInflation, educationReturnRate]);
  
  // Calculate Inflation results
  useEffect(() => {
    try {
      const results = calculateInflation(currentValue, inflationValue, inflationTime);
      setInflationResults(results);
    } catch (error) {
      console.error("Inflation calculation error:", error);
    }
  }, [currentValue, inflationValue, inflationTime]);

  return (
    <PageTransition>
    <div className="py-16 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-montserrat font-bold text-3xl md:text-5xl text-primary mb-4">Financial Calculators</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Use our interactive financial calculators to plan your investments, estimate returns, and make informed financial decisions.
          </p>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap justify-center mb-10">
            <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
            <TabsTrigger value="lumpsum">Lumpsum</TabsTrigger>
            <TabsTrigger value="retirement">Retirement</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="ppf">PPF</TabsTrigger>
            <TabsTrigger value="emi">EMI</TabsTrigger>
            <TabsTrigger value="inflation">Inflation</TabsTrigger>
          </TabsList>
          
          {/* SIP Calculator */}
          <TabsContent value="sip">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">SIP Investment Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate the future value of your Systematic Investment Plan (SIP) and see how small regular investments can grow over time.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Monthly Investment (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={sipAmount}
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
                          onValueChange={(values) => setSipAmount(values[0])}
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
                          value={sipRate}
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
                          onValueChange={(values) => setSipRate(values[0])}
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
                          value={sipTime}
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
                          onValueChange={(values) => setSipTime(values[0])}
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
                    
                    {sipResults && (
                      <>
                        <div className="mb-8 grid grid-cols-2 gap-4">
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Invested Amount</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(sipResults.investedAmount)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Estimated Returns</p>
                            <p className="financial-figure text-[#009933] font-bold text-xl">{formatCurrency(sipResults.estimatedReturns)}</p>
                          </div>
                          <div className="bg-primary p-4 rounded-md col-span-2">
                            <p className="text-white text-sm mb-1">Total Value</p>
                            <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(sipResults.totalValue)}</p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Investment Growth Chart</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {sipResults.yearlyData.map((data: any, index: number) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className={`chart-bar ${index === sipTime - 1 ? 'bg-secondary' : 'bg-primary'} w-full h-0`} 
                                  style={{ '--bar-height': `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Lumpsum Calculator */}
          <TabsContent value="lumpsum">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Lumpsum Investment Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate the future value of a one-time investment and see how it grows over time with compounding returns.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Investment Amount (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={lumpsumAmount}
                          onChange={(e) => setLumpsumAmount(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1000} 
                          max={10000000} 
                          step={1000} 
                          value={[lumpsumAmount]} 
                          onValueChange={(values) => setLumpsumAmount(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹1,000</span>
                          <span>₹1 Cr</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Expected Return Rate (%)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={lumpsumRate}
                          onChange={(e) => setLumpsumRate(parseFloat(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={0.5} 
                          value={[lumpsumRate]} 
                          onValueChange={(values) => setLumpsumRate(values[0])}
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
                          value={lumpsumTime}
                          onChange={(e) => setLumpsumTime(parseInt(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">Yrs</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={1} 
                          value={[lumpsumTime]} 
                          onValueChange={(values) => setLumpsumTime(values[0])}
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
                    
                    {lumpsumResults && (
                      <>
                        <div className="mb-8 grid grid-cols-2 gap-4">
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Invested Amount</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(lumpsumResults.investedAmount)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Estimated Returns</p>
                            <p className="financial-figure text-[#009933] font-bold text-xl">{formatCurrency(lumpsumResults.estimatedReturns)}</p>
                          </div>
                          <div className="bg-primary p-4 rounded-md col-span-2">
                            <p className="text-white text-sm mb-1">Total Value</p>
                            <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(lumpsumResults.totalValue)}</p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Investment Growth Chart</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {lumpsumResults.yearlyData.map((data: any, index: number) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className={`chart-bar ${index === lumpsumTime - 1 ? 'bg-secondary' : 'bg-primary'} w-full h-0`} 
                                  style={{ '--bar-height': `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Retirement Calculator */}
          <TabsContent value="retirement">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Retirement Planning Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Plan your retirement by calculating the corpus needed to maintain your desired lifestyle after retirement.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Current Age</label>
                        <Input 
                          type="number" 
                          value={currentAge}
                          onChange={(e) => setCurrentAge(parseInt(e.target.value || "0"))}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Retirement Age</label>
                        <Input 
                          type="number" 
                          value={retirementAge}
                          onChange={(e) => setRetirementAge(parseInt(e.target.value || "0"))}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Life Expectancy (Years)</label>
                      <Input 
                        type="number" 
                        value={lifeExpectancy}
                        onChange={(e) => setLifeExpectancy(parseInt(e.target.value || "0"))}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Monthly Expenses (Current Value) (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={monthlyExpense}
                          onChange={(e) => setMonthlyExpense(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Inflation Rate (%)</label>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            value={inflationRate}
                            onChange={(e) => setInflationRate(parseFloat(e.target.value || "0"))}
                            className="rounded-r-none"
                          />
                          <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Expected Return (%)</label>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            value={returnRate}
                            onChange={(e) => setReturnRate(parseFloat(e.target.value || "0"))}
                            className="rounded-r-none"
                          />
                          <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Your Retirement Plan</h3>
                    
                    {retirementResults && (
                      <>
                        <div className="mb-8 bg-gray-100 p-6 rounded-lg">
                          <div className="text-center mb-4">
                            <p className="text-gray-600 text-sm">Required Retirement Corpus</p>
                            <p className="financial-figure text-primary font-bold text-3xl">{formatCurrency(retirementResults.corpusRequired)}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-gray-600 text-sm mb-1">Years Until Retirement</p>
                              <p className="font-bold text-primary">{retirementAge - currentAge} years</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm mb-1">Retirement Duration</p>
                              <p className="font-bold text-primary">{lifeExpectancy - retirementAge} years</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Corpus Utilization Chart</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {retirementResults.yearlyData.slice(0, 10).map((data: any, index: number) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className="chart-bar bg-primary w-full h-0" 
                                  style={{ "--bar-height": `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-2">Recommendation</h4>
                          <p className="text-sm text-gray-600">
                            To build a retirement corpus of {formatCurrency(retirementResults.corpusRequired)}, consider starting a monthly SIP of approximately {formatCurrency(Math.round(retirementResults.corpusRequired / ((retirementAge - currentAge) * 12) * 0.4))}. Consult with our financial advisors for a personalized retirement plan.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Education Planning Calculator */}
          <TabsContent value="education">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Education Planning Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Plan for your child's higher education by calculating the corpus needed and the monthly investment required.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Child's Current Age</label>
                        <Input 
                          type="number" 
                          value={childAge}
                          onChange={(e) => setChildAge(parseInt(e.target.value || "0"))}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Age for Higher Education</label>
                        <Input 
                          type="number" 
                          value={educationAge}
                          onChange={(e) => setEducationAge(parseInt(e.target.value || "0"))}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Course Duration (Years)</label>
                      <Input 
                        type="number" 
                        value={courseDuration}
                        onChange={(e) => setCourseDuration(parseInt(e.target.value || "0"))}
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Annual Expense (Current Value) (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={annualExpense}
                          onChange={(e) => setAnnualExpense(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Education Inflation (%)</label>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            value={educationInflation}
                            onChange={(e) => setEducationInflation(parseFloat(e.target.value || "0"))}
                            className="rounded-r-none"
                          />
                          <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Expected Return (%)</label>
                        <div className="flex items-center">
                          <Input 
                            type="number" 
                            value={educationReturnRate}
                            onChange={(e) => setEducationReturnRate(parseFloat(e.target.value || "0"))}
                            className="rounded-r-none"
                          />
                          <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Education Planning Results</h3>
                    
                    {educationResults && (
                      <>
                        <div className="mb-8 grid grid-cols-2 gap-4">
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Required Corpus</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(educationResults.corpusRequired)}</p>
                          </div>
                          <div className="bg-primary p-4 rounded-md">
                            <p className="text-white text-sm mb-1">Monthly Investment</p>
                            <p className="financial-figure text-secondary font-bold text-xl">{formatCurrency(educationResults.monthlyInvestment)}</p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Corpus Accumulation Chart</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {educationResults.yearlyData.map((data: any, index: number) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className="chart-bar bg-primary w-full h-0" 
                                  style={{ "--bar-height": `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-2">Note</h4>
                          <p className="text-sm text-gray-600">
                            Education expenses typically increase at a higher rate than general inflation. Consider reviewing your education plan periodically to ensure you're on track.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* PPF Calculator */}
          <TabsContent value="ppf">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">PPF Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate the maturity amount of your Public Provident Fund (PPF) investment and see how it grows over time.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Annual Investment (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={ppfAmount}
                          onChange={(e) => setPpfAmount(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={500} 
                          max={150000} 
                          step={500} 
                          value={[ppfAmount]} 
                          onValueChange={(values) => setPpfAmount(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹500</span>
                          <span>₹1,50,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Interest Rate (%)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={ppfRate}
                          onChange={(e) => setPpfRate(parseFloat(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Current PPF interest rate is 7.1% p.a.</p>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-gray-700 font-medium mb-2">Investment Period (Years)</label>
                      <Select
                        value={ppfTime.toString()}
                        onValueChange={(value) => setPpfTime(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 years (Standard)</SelectItem>
                          <SelectItem value="20">20 years (With Extension)</SelectItem>
                          <SelectItem value="25">25 years (With Extension)</SelectItem>
                          <SelectItem value="30">30 years (With Extension)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">Standard PPF tenure is 15 years, extendable in blocks of 5 years.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Your PPF Investment</h3>
                    
                    {ppfResults && (
                      <>
                        <div className="mb-8 grid grid-cols-1 gap-4">
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Total Investment</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(ppfResults.totalInvestment)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Total Interest Earned</p>
                            <p className="financial-figure text-[#009933] font-bold text-xl">{formatCurrency(ppfResults.totalInterest)}</p>
                          </div>
                          <div className="bg-primary p-4 rounded-md">
                            <p className="text-white text-sm mb-1">Maturity Amount</p>
                            <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(ppfResults.maturityAmount)}</p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Year-wise Growth</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {ppfResults.yearlyData.filter((_: any, i: number) => (i % Math.ceil(ppfResults.yearlyData.length / 10)) === 0 || i === ppfResults.yearlyData.length - 1).map((data: any, index: number, arr: any[]) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className={`chart-bar ${index === arr.length - 1 ? 'bg-secondary' : 'bg-primary'} w-full h-0`} 
                                  style={{ "--bar-height": `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-blue-50 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-2">Tax Benefits</h4>
                          <p className="text-sm text-gray-600">
                            PPF investments are eligible for tax deduction under Section 80C of Income Tax Act. The interest earned and the maturity amount are also tax-free.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* EMI Calculator */}
          <TabsContent value="emi">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">EMI Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate your Equated Monthly Installment (EMI) for home loans, car loans, or personal loans.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Loan Amount (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={10000} 
                          max={10000000} 
                          step={10000} 
                          value={[loanAmount]} 
                          onValueChange={(values) => setLoanAmount(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹10,000</span>
                          <span>₹1 Cr</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Interest Rate (%)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={5} 
                          max={20} 
                          step={0.1} 
                          value={[interestRate]} 
                          onValueChange={(values) => setInterestRate(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>5%</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-gray-700 font-medium mb-2">Loan Term (Years)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(parseInt(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">Yrs</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={1} 
                          value={[loanTerm]} 
                          onValueChange={(values) => setLoanTerm(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 yr</span>
                          <span>30 yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Loan Repayment Details</h3>
                    
                    {emiResults && (
                      <>
                        <div className="mb-8 grid grid-cols-1 gap-4">
                          <div className="bg-primary p-4 rounded-md">
                            <p className="text-white text-sm mb-1">Monthly EMI</p>
                            <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(emiResults.emi)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Total Interest Payable</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(emiResults.totalInterest)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Total Payment (Principal + Interest)</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(emiResults.totalPayment)}</p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Payment Breakdown</h4>
                          
                          <div className="relative h-48 w-48 mx-auto">
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${(emiResults.totalInterest / emiResults.totalPayment) * 100}%` }}></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                              <p className="text-xs text-gray-600">Principal vs Interest</p>
                              <div className="flex items-center mt-2">
                                <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
                                <span className="text-xs mr-2">Principal: {Math.round((loanAmount / emiResults.totalPayment) * 100)}%</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
                                <span className="text-xs">Interest: {Math.round((emiResults.totalInterest / emiResults.totalPayment) * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-2">Pro Tip</h4>
                          <p className="text-sm text-gray-600">
                            Making extra payments towards your principal can significantly reduce your loan term and save on interest. Even small additional payments can make a big difference over time.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Inflation Calculator */}
          <TabsContent value="inflation">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="font-montserrat font-bold text-2xl text-primary mb-6">Inflation Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate the future value of money considering the impact of inflation over time.
                    </p>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Current Amount (₹)</label>
                      <div className="flex items-center">
                        <span className="bg-gray-200 rounded-l-md px-3 py-2 text-gray-700">₹</span>
                        <Input 
                          type="number" 
                          value={currentValue}
                          onChange={(e) => setCurrentValue(parseInt(e.target.value || "0"))}
                          className="rounded-l-none" 
                        />
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1000} 
                          max={1000000} 
                          step={1000} 
                          value={[currentValue]} 
                          onValueChange={(values) => setCurrentValue(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>₹1,000</span>
                          <span>₹10,00,000</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 font-medium mb-2">Expected Inflation Rate (%)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={inflationValue}
                          onChange={(e) => setInflationValue(parseFloat(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">%</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={15} 
                          step={0.1} 
                          value={[inflationValue]} 
                          onValueChange={(values) => setInflationValue(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1%</span>
                          <span>15%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <label className="block text-gray-700 font-medium mb-2">Time Period (Years)</label>
                      <div className="flex items-center">
                        <Input 
                          type="number" 
                          value={inflationTime}
                          onChange={(e) => setInflationTime(parseInt(e.target.value || "0"))}
                          className="rounded-r-none"
                        />
                        <span className="bg-gray-200 rounded-r-md px-3 py-2 text-gray-700">Yrs</span>
                      </div>
                      <div className="mt-2">
                        <Slider 
                          min={1} 
                          max={30} 
                          step={1} 
                          value={[inflationTime]} 
                          onValueChange={(values) => setInflationTime(values[0])}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1 yr</span>
                          <span>30 yrs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-montserrat font-bold text-xl text-primary mb-6">Impact of Inflation</h3>
                    
                    {inflationResults && (
                      <>
                        <div className="mb-8 grid grid-cols-1 gap-4">
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Current Amount</p>
                            <p className="financial-figure text-primary font-bold text-xl">{formatCurrency(currentValue)}</p>
                          </div>
                          <div className="bg-primary p-4 rounded-md">
                            <p className="text-white text-sm mb-1">Future Value (after {inflationTime} years)</p>
                            <p className="financial-figure text-secondary font-bold text-2xl">{formatCurrency(inflationResults.futureValue)}</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-md">
                            <p className="text-gray-600 text-sm mb-1">Purchasing Power Decrease</p>
                            <p className="financial-figure text-destructive font-bold text-xl">
                              {Math.round((1 - (currentValue / inflationResults.futureValue)) * 100)}%
                            </p>
                          </div>
                        </div>
                        
                        {/* Chart */}
                        <div className="bg-white rounded-md p-4 border">
                          <h4 className="font-montserrat font-medium text-gray-700 mb-4">Future Value Chart</h4>
                          
                          <div className="h-48 flex items-end space-x-2">
                            {inflationResults.yearlyData.filter((_: any, i: number) => (i % Math.ceil(inflationResults.yearlyData.length / 10)) === 0 || i === inflationResults.yearlyData.length - 1).map((data: any, index: number, arr: any[]) => (
                              <div key={index} className="chart-bar-container flex flex-col items-center flex-1">
                                <div 
                                  className={`chart-bar ${index === arr.length - 1 ? 'bg-secondary' : 'bg-primary'} w-full h-0`} 
                                  style={{ "--bar-height": `${data.percentage}%` } as React.CSSProperties}
                                ></div>
                                <span className="text-xs mt-1">Y{data.year}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                          <h4 className="font-montserrat font-medium text-primary mb-2">Insight</h4>
                          <p className="text-sm text-gray-600">
                            To maintain your purchasing power, investments should aim to beat inflation. Consider investing in assets that have historically provided returns above the inflation rate.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 bg-primary text-white rounded-lg p-10 text-center">
          <h2 className="font-montserrat font-bold text-2xl mb-4">Need Help With Your Financial Planning?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Our team of financial experts can help you create a personalized financial plan tailored to your unique needs and goals.
          </p>
          <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-primary font-bold" asChild>
            <Link href="/contact">Schedule a Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default Calculators;
