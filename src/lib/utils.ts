import { BetRow } from "@/types";

export function createEmptyRows(count: number): BetRow[] {
  return Array.from({ length: count }).map((_, index) => ({
    serialNo: index + 1,
    clientName: "",
    horse: "",
    betType: "",
    stake: null,
    odds: null,
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
