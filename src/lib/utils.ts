import { BetRow } from "@/types";

export function createEmptyRows(count: number): BetRow[] {
  return Array.from({ length: count }).map((_, index) => ({
    serialNo: index + 1,
    clientName: "",
    horse: "",
    race: "",
    betType: "",
    stake: null,
    odds: null,
    deductionPercent: null,
    netOdds: null,
    returnAmt: null,
    profit: null,
    remarks: "",
  }));
}

export function formatCurrency(value: number | null): string {
  if (value === null || isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number | null): string {
  if (value === null || isNaN(value)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
