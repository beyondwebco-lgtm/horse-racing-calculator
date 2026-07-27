"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { SheetData } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useEffect } from "react";

export default function Summary() {
  const { control, setValue } = useFormContext<SheetData>();
  
  // Watch all rows to calculate the summary
  const rows = useWatch({
    control,
    name: "rows",
  });

  useEffect(() => {
    let totalBets = 0;
    let totalStake = 0;
    let totalReturn = 0;
    let totalProfit = 0;
    let sumOdds = 0;
    let oddsCount = 0;

    rows?.forEach((row) => {
      if (row.stake && row.stake > 0) {
        totalBets++;
        totalStake += Number(row.stake);
        
        if (row.returnAmt) {
          totalReturn += Number(row.returnAmt);
        }
        
        if (row.profit) {
          totalProfit += Number(row.profit);
        }

        if (row.odds && row.odds > 0) {
          sumOdds += Number(row.odds);
          oddsCount++;
        }
      }
    });

    const avgOdds = oddsCount > 0 ? sumOdds / oddsCount : 0;

    setValue("summary", {
      totalBets,
      totalStake,
      totalReturn,
      totalProfit,
      avgOdds,
    });
  }, [rows, setValue]);

  // Read the calculated summary values to display
  const summary = useWatch({
    control,
    name: "summary",
  });

  if (!summary) return null;

  return (
    <div className="bg-white border-t border-slate-200 px-6 py-4 flex gap-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Bets</span>
        <span className="text-xl font-bold text-slate-800">{summary.totalBets}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Stake</span>
        <span className="text-xl font-bold text-slate-800">{formatCurrency(summary.totalStake)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Return</span>
        <span className="text-xl font-bold text-blue-600">{formatCurrency(summary.totalReturn)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Profit/Loss</span>
        <span className={`text-xl font-bold ${summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {summary.totalProfit >= 0 ? '+' : ''}{formatCurrency(summary.totalProfit)}
        </span>
      </div>
      <div className="w-px bg-slate-200 my-1"></div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Odds</span>
        <span className="text-xl font-bold text-slate-800">{formatNumber(summary.avgOdds)}</span>
      </div>
    </div>
  );
}
