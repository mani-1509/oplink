export interface FinancialInputs {
  customers: number;
  runsPerMonth: number;
  laborCostPerHour: number;
  minutesSavedPerRun: number;
  pricePerMonth: number;
  nebiusCostPerRun?: number;
  crustdataCostPerRun?: number;
  awsMonthlyHosting?: number;
}

export interface FinancialOutputs {
  monthlyRevenue: number;
  annualizedMrr: number;
  totalMonthlyRuns: number;
  totalDirectCosts: number;
  grossMarginPercentage: number | null; // null if revenue is 0
  customerMonthlyLaborSavings: number;
  customerMonthlyHoursSaved: number;
  customerRoiMultiple: number | null;
}

export function calculateEconomics(inputs: FinancialInputs): FinancialOutputs {
  const {
    customers,
    runsPerMonth,
    laborCostPerHour,
    minutesSavedPerRun,
    pricePerMonth,
    nebiusCostPerRun = 0.0035,
    crustdataCostPerRun = 0.01,
    awsMonthlyHosting = 240,
  } = inputs;

  const totalMonthlyRuns = customers * runsPerMonth;
  const monthlyRevenue = customers * pricePerMonth;
  const annualizedMrr = 12 * monthlyRevenue;

  const directInferenceCosts = totalMonthlyRuns * (nebiusCostPerRun + crustdataCostPerRun);
  const totalDirectCosts = directInferenceCosts + (customers > 0 ? awsMonthlyHosting : 0);

  const grossMarginPercentage =
    monthlyRevenue > 0
      ? ((monthlyRevenue - totalDirectCosts) / monthlyRevenue) * 100
      : null;

  const customerMonthlyHoursSaved = (runsPerMonth * minutesSavedPerRun) / 60;
  const customerMonthlyLaborSavings = customerMonthlyHoursSaved * laborCostPerHour;
  const customerRoiMultiple =
    pricePerMonth > 0
      ? customerMonthlyLaborSavings / pricePerMonth
      : null;

  return {
    monthlyRevenue,
    annualizedMrr,
    totalMonthlyRuns,
    totalDirectCosts,
    grossMarginPercentage,
    customerMonthlyLaborSavings,
    customerMonthlyHoursSaved,
    customerRoiMultiple,
  };
}
