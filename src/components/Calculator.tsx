"use client";

import { useForm, FormProvider } from "react-hook-form";
import { SheetData } from "@/types";
import { createEmptyRows } from "@/lib/utils";
import Header from "./Header";
import BetTable from "./BetTable";
import Summary from "./Summary";

export default function Calculator() {
  const methods = useForm<SheetData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      raceName: "",
      operatorName: "",
      rows: createEmptyRows(50),
      summary: {
        totalBets: 0,
        totalStake: 0,
        totalReturn: 0,
        totalProfit: 0,
        avgOdds: 0,
      },
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col h-screen bg-slate-50" id="calculator-container">
        <Header />
        <div className="flex-1 overflow-auto bg-white shadow-sm mx-4 mb-4 rounded-lg border border-slate-200">
          <BetTable />
        </div>
        <Summary />
      </div>
    </FormProvider>
  );
}
