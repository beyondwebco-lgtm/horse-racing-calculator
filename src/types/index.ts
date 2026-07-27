export interface BetRow {
  serialNo: number;
  clientName: string;
  horse: string;
  race: string;
  betType: string;
  stake: number | null;
  odds: number | null;
  deductionPercent: number | null;
  netOdds: number | null;
  result: string;
  profit: number | null;
  percentage: number | null;
  returnAmt: number | null;
}

export interface SheetData {
  id?: string;
  date: string;
  raceName: string;
  operatorName: string;
  rows: BetRow[];
  summary: {
    totalBets: number;
    totalStake: number;
    totalReturn: number;
    totalProfit: number;
    avgOdds: number;
  };
}
