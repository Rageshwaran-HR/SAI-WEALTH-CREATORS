// Financial calculation functions

/**
 * Calculate SIP (Systematic Investment Plan) returns
 * @param amount Monthly investment amount
 * @param rate Annual interest rate (in percentage)
 * @param years Investment period in years
 * @returns Object containing investedAmount, estimatedReturns, totalValue, and yearlyData
 */
export function calculateSIP(amount: number, rate: number, years: number) {
  if (amount <= 0 || rate <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers");
  }

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  const investedAmount = amount * months;
  
  // Formula: FV = P * ((1 + r)^n - 1) / r * (1 + r)
  const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const estimatedReturns = futureValue - investedAmount;
  
  // Calculate values for each year for the chart
  const yearlyData = Array.from({ length: years }, (_, i) => {
    const yearMonths = (i + 1) * 12;
    const yearlyInvestedAmount = amount * yearMonths;
    const yearlyFutureValue = amount * ((Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const yearlyReturns = yearlyFutureValue - yearlyInvestedAmount;
    
    return {
      year: i + 1,
      invested: Math.round(yearlyInvestedAmount),
      returns: Math.round(yearlyReturns),
      total: Math.round(yearlyFutureValue),
      percentage: Math.round((yearlyFutureValue / futureValue) * 100)
    };
  });
  
  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(futureValue),
    yearlyData
  };
}

/**
 * Calculate Lumpsum investment returns
 * @param amount Principal amount
 * @param rate Annual interest rate (in percentage)
 * @param years Investment period in years
 * @returns Object containing investedAmount, estimatedReturns, totalValue, and yearlyData
 */
export function calculateLumpsum(amount: number, rate: number, years: number) {
  if (amount <= 0 || rate <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers");
  }

  const annualRate = rate / 100;
  const futureValue = amount * Math.pow(1 + annualRate, years);
  const estimatedReturns = futureValue - amount;
  
  // Calculate values for each year for the chart
  const yearlyData = Array.from({ length: years }, (_, i) => {
    const yearValue = amount * Math.pow(1 + annualRate, i + 1);
    const yearReturns = yearValue - amount;
    
    return {
      year: i + 1,
      invested: Math.round(amount),
      returns: Math.round(yearReturns),
      total: Math.round(yearValue),
      percentage: Math.round((yearValue / futureValue) * 100)
    };
  });
  
  return {
    investedAmount: Math.round(amount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(futureValue),
    yearlyData
  };
}

/**
 * Calculate retirement corpus required
 * @param currentAge Current age in years
 * @param retirementAge Expected retirement age in years
 * @param lifeExpectancy Expected life expectancy in years
 * @param monthlyExpense Monthly expenses at retirement (current value)
 * @param inflation Expected inflation rate (in percentage)
 * @param returnRate Expected return rate during retirement (in percentage)
 * @returns Object containing corpusRequired and yearlyData
 */
export function calculateRetirement(
  currentAge: number,
  retirementAge: number,
  lifeExpectancy: number,
  monthlyExpense: number,
  inflation: number,
  returnRate: number
) {
  if (
    currentAge <= 0 ||
    retirementAge <= currentAge ||
    lifeExpectancy <= retirementAge ||
    monthlyExpense <= 0 ||
    inflation <= 0 ||
    returnRate <= 0
  ) {
    throw new Error("All input values must be valid and positive numbers");
  }

  const yearsToRetirement = retirementAge - currentAge;
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Adjust monthly expense for inflation till retirement
  const inflationFactor = Math.pow(1 + inflation / 100, yearsToRetirement);
  const futureMonthlyExpense = monthlyExpense * inflationFactor;
  const annualExpenseAtRetirement = futureMonthlyExpense * 12;
  
  // Calculate corpus required using PMT formula adjusted for present value
  const r = returnRate / 100;
  const discountFactor = (1 - Math.pow(1 + r, -yearsInRetirement)) / r;
  const corpusRequired = annualExpenseAtRetirement * discountFactor;
  
  // Calculate yearly data for corpus required
  const yearlyData = Array.from({ length: yearsInRetirement }, (_, i) => {
    const year = i + 1;
    const age = retirementAge + year;
    // Remaining corpus at the beginning of the year
    const remainingCorpus = corpusRequired * (1 - (discountFactor - (1 - Math.pow(1 + r, -(yearsInRetirement - i))) / r) / discountFactor);
    
    return {
      year,
      age,
      corpus: Math.round(remainingCorpus),
      expense: Math.round(annualExpenseAtRetirement * Math.pow(1 + inflation / 100, year)),
      percentage: Math.round((remainingCorpus / corpusRequired) * 100)
    };
  });
  
  return {
    corpusRequired: Math.round(corpusRequired),
    yearlyData
  };
}

/**
 * Calculate EMI for a loan
 * @param principal Loan amount
 * @param rate Annual interest rate (in percentage)
 * @param years Loan period in years
 * @returns Object containing emi, totalInterest, totalPayment, and yearlyData
 */
export function calculateEMI(principal: number, rate: number, years: number) {
  if (principal <= 0 || rate <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers");
  }

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  
  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = emi * months;
  const totalInterest = totalPayment - principal;
  
  // Calculate amortization schedule for yearly data
  let balance = principal;
  let yearlyPrincipalPaid = 0;
  let yearlyInterestPaid = 0;
  
  const yearlyData = [];
  
  for (let month = 1; month <= months; month++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    
    balance -= principalForMonth;
    yearlyPrincipalPaid += principalForMonth;
    yearlyInterestPaid += interestForMonth;
    
    if (month % 12 === 0 || month === months) {
      yearlyData.push({
        year: Math.ceil(month / 12),
        principalPaid: Math.round(yearlyPrincipalPaid),
        interestPaid: Math.round(yearlyInterestPaid),
        remainingBalance: Math.max(0, Math.round(balance)),
        percentage: Math.round(((principal - balance) / principal) * 100)
      });
      
      yearlyPrincipalPaid = 0;
      yearlyInterestPaid = 0;
    }
  }
  
  return {
    emi: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    yearlyData
  };
}

/**
 * Calculate Public Provident Fund (PPF) investment
 * @param amount Annual investment amount
 * @param rate Annual interest rate (in percentage)
 * @param years Investment period in years (usually 15 for PPF)
 * @returns Object containing totalInvestment, totalInterest, maturityAmount, and yearlyData
 */
export function calculatePPF(amount: number, rate: number, years: number) {
  if (amount <= 0 || rate <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers");
  }

  let balance = 0;
  let totalInvestment = 0;
  let totalInterest = 0;
  const yearlyData = [];
  
  for (let year = 1; year <= years; year++) {
    totalInvestment += amount;
    const interestForYear = (balance + amount) * (rate / 100);
    balance += amount + interestForYear;
    totalInterest += interestForYear;
    
    yearlyData.push({
      year,
      investment: Math.round(amount),
      interest: Math.round(interestForYear),
      balance: Math.round(balance),
      percentage: Math.round((year / years) * 100)
    });
  }
  
  return {
    totalInvestment: Math.round(totalInvestment),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyData
  };
}

/**
 * Calculate education planning corpus
 * @param currentAge Current age of child in years
 * @param educationAge Age at which education expenses start
 * @param courseDuration Duration of the course in years
 * @param annualExpense Annual education expense (current value)
 * @param inflation Expected inflation rate (in percentage)
 * @param returnRate Expected investment return rate (in percentage)
 * @returns Object containing corpusRequired, monthlyInvestment, and yearlyData
 */
export function calculateEducation(
  currentAge: number,
  educationAge: number,
  courseDuration: number,
  annualExpense: number,
  inflation: number,
  returnRate: number
) {
  if (
    currentAge < 0 ||
    educationAge <= currentAge ||
    courseDuration <= 0 ||
    annualExpense <= 0 ||
    inflation <= 0 ||
    returnRate <= 0
  ) {
    throw new Error("All input values must be valid and positive numbers");
  }

  const yearsToEducation = educationAge - currentAge;
  
  // Calculate future education expenses with inflation
  let totalFutureExpense = 0;
  const yearlyExpenses = [];
  
  for (let year = 1; year <= courseDuration; year++) {
    const inflationFactor = Math.pow(1 + inflation / 100, yearsToEducation + year - 1);
    const futureExpense = annualExpense * inflationFactor;
    totalFutureExpense += futureExpense;
    
    yearlyExpenses.push({
      year: yearsToEducation + year,
      expense: Math.round(futureExpense)
    });
  }
  
  // Calculate corpus required at education start
  const presentValueFactors = yearlyExpenses.map((item, index) => {
    return 1 / Math.pow(1 + returnRate / 100, index);
  });
  
  const corpusRequired = yearlyExpenses.reduce((sum, item, index) => {
    return sum + item.expense * presentValueFactors[index];
  }, 0);
  
  // Calculate monthly investment required to reach the corpus
  const monthlyRate = returnRate / 12 / 100;
  const months = yearsToEducation * 12;
  
  // Formula for future value of regular payment: PMT * ((1 + r)^n - 1) / r
  const monthlyInvestment = corpusRequired / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  
  // Generate yearly data for visualization
  const yearlyData = Array.from({ length: yearsToEducation }, (_, i) => {
    const year = i + 1;
    const yearlyInvestment = monthlyInvestment * 12;
    const accumulated = yearlyInvestment * ((Math.pow(1 + monthlyRate, year * 12) - 1) / monthlyRate);
    
    return {
      year,
      age: currentAge + year,
      investment: Math.round(yearlyInvestment),
      accumulated: Math.round(accumulated),
      percentage: Math.round((accumulated / corpusRequired) * 100)
    };
  });
  
  return {
    corpusRequired: Math.round(corpusRequired),
    monthlyInvestment: Math.round(monthlyInvestment),
    yearlyData
  };
}

/**
 * Calculate inflation impact on a current amount
 * @param amount Current amount
 * @param rate Inflation rate (in percentage)
 * @param years Number of years
 * @returns Object containing futureValue and yearlyData
 */
export function calculateInflation(amount: number, rate: number, years: number) {
  if (amount <= 0 || rate <= 0 || years <= 0) {
    throw new Error("All input values must be positive numbers");
  }

  const futureValue = amount * Math.pow(1 + rate / 100, years);
  
  const yearlyData = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    const value = amount * Math.pow(1 + rate / 100, year);
    
    return {
      year,
      value: Math.round(value),
      percentage: Math.round((value / futureValue) * 100)
    };
  });
  
  return {
    futureValue: Math.round(futureValue),
    yearlyData
  };
}
