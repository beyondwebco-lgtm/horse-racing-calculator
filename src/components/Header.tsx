"use client";

import { useFormContext } from "react-hook-form";
import { SheetData } from "@/types";
import { Plus, Save, Printer, FileDown, Search } from "lucide-react";
import { exportToPDF } from "@/lib/pdf";
import { saveSheet } from "@/lib/api";
import { useState } from "react";
import { createEmptyRows } from "@/lib/utils";
import SearchModal from "./SearchModal";

export default function Header() {
  const { register, getValues, reset } = useFormContext<SheetData>();
  const [isSaving, setIsSaving] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const data = getValues();
    await exportToPDF(data);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const data = getValues();
    const result = await saveSheet(data);
    alert(result.message);
    setIsSaving(false);
  };

  const handleNewSheet = () => {
    if (confirm("Are you sure you want to clear the current sheet? Unsaved data will be lost.")) {
      reset({
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
      });
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSelectSheet = (sheet: any) => {
    reset({
      date: sheet.date || new Date().toISOString().split("T")[0],
      raceName: sheet.race_name || "",
      operatorName: sheet.operator_name || "",
      rows: sheet.rows || createEmptyRows(50),
      summary: sheet.summary || {
        totalBets: 0,
        totalStake: 0,
        totalReturn: 0,
        totalProfit: 0,
        avgOdds: 0,
      },
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-4 no-print sticky top-0 z-10 shadow-sm">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Horse Racing Bet Calculator</h1>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={handleNewSheet}
          >
            <Plus size={16} /> New Sheet
          </button>
          <button 
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            onClick={handleSearch}
          >
            <Search size={16} /> Search
          </button>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={handlePrint}>
            <Printer size={16} /> Print
          </button>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={handleExportPDF}>
            <FileDown size={16} /> Export PDF
          </button>
          <button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Date</label>
          <input
            type="date"
            {...register("date")}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Race Name</label>
          <input
            type="text"
            placeholder="e.g., Derby 2026"
            {...register("raceName")}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Operator</label>
          <input
            type="text"
            placeholder="Name"
            {...register("operatorName")}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={handleSelectSheet} 
      />
    </header>
  );
}
