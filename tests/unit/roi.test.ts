import { describe, it, expect } from "vitest";
import { calculateEconomics } from "@/lib/business/roi-calculator";

describe("ROI and Unit Economics Calculator (cfo.ai model)", () => {
  it("calculates expected financial metrics for standard inputs", () => {
    const result = calculateEconomics({
      customers: 100,
      runsPerMonth: 500,
      laborCostPerHour: 60,
      minutesSavedPerRun: 15,
      pricePerMonth: 200,
    });

    expect(result.monthlyRevenue).toBe(20000);
    expect(result.annualizedMrr).toBe(240000);
    expect(result.totalMonthlyRuns).toBe(50000);
    expect(result.customerMonthlyHoursSaved).toBe(125);
    expect(result.customerMonthlyLaborSavings).toBe(7500);
    expect(result.customerRoiMultiple).toBe(37.5);
    expect(result.grossMarginPercentage).toBeGreaterThan(90);
  });

  it("handles zero revenue without divide-by-zero errors", () => {
    const result = calculateEconomics({
      customers: 0,
      runsPerMonth: 500,
      laborCostPerHour: 60,
      minutesSavedPerRun: 15,
      pricePerMonth: 0,
    });

    expect(result.monthlyRevenue).toBe(0);
    expect(result.annualizedMrr).toBe(0);
    expect(result.grossMarginPercentage).toBeNull();
    expect(result.customerRoiMultiple).toBeNull();
  });

  it("handles zero price with positive runs safely", () => {
    const result = calculateEconomics({
      customers: 10,
      runsPerMonth: 100,
      laborCostPerHour: 50,
      minutesSavedPerRun: 10,
      pricePerMonth: 0,
    });

    expect(result.monthlyRevenue).toBe(0);
    expect(result.grossMarginPercentage).toBeNull();
    expect(result.customerRoiMultiple).toBeNull();
    expect(result.customerMonthlyLaborSavings).toBeGreaterThan(0);
  });
});
