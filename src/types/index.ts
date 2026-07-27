export interface BetRow {
  serialNo: number;
  clientName: string;
  horse: string;
  betType: string;
  stake: number | null;
  odds: number | null;
  returnAmt: number | null;
  profit: number | null;
  remarks: string;
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
