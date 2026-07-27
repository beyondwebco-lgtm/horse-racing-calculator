"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { SheetData, BetRow } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Trash2, Plus, Copy } from "lucide-react";

// Helper component for table cells
const EditableCell = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: any) => {
  const { register, setValue, watch } = useFormContext<SheetData>();
  const fieldName = `rows.${index}.${id}` as const;
  
  // Need to watch values for automatic calculation
  const stake = watch(`rows.${index}.stake`);
  const odds = watch(`rows.${index}.odds`);
  
  // Real-time calculation effect
  useEffect(() => {
    // Only calculate if stake and odds exist
    if (stake && odds) {
      const numStake = Number(stake) || 0;
      const numOdds = Number(odds) || 0;
      
      const returnAmt = numStake * numOdds;
      const profit = returnAmt - numStake;
      const percentage = numStake > 0 ? (profit / numStake) * 100 : 0;
      
      setValue(`rows.${index}.returnAmt`, Number(returnAmt.toFixed(2)));
      setValue(`rows.${index}.profit`, Number(profit.toFixed(2)));
      setValue(`rows.${index}.percentage`, Number(percentage.toFixed(2)));
    } else {
      // Clear if empty
      setValue(`rows.${index}.returnAmt`, null);
      setValue(`rows.${index}.profit`, null);
      setValue(`rows.${index}.percentage`, null);
    }
  }, [stake, odds, index, setValue]);

  // Non-editable fields (Calculated ones)
  if (id === "serialNo") {
    return <div className="text-center text-slate-500 font-medium py-2">{index + 1}</div>;
  }
  
  if (["returnAmt", "profit", "percentage"].includes(id)) {
    const val = watch(fieldName as any);
    const isNegative = id === "profit" && val !== null && val < 0;
    const isPositive = id === "profit" && val !== null && val > 0;
    
    return (
      <div className={`px-2 py-2 text-right ${isNegative ? "text-red-600" : isPositive ? "text-green-600" : "text-slate-700"}`}>
        {val !== null ? (id === "percentage" ? `${val}%` : formatCurrency(val)) : ""}
      </div>
    );
  }

  // Handle inputs based on type
  const isNumber = ["stake", "odds"].includes(id);

  if (id === "betType") {
    return (
      <select
        {...register(fieldName as any)}
        className="w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-md transition-colors bg-transparent focus:bg-white text-sm text-slate-700"
      >
        <option value=""></option>
        <option value="Win">Win</option>
        <option value="Place">Place</option>
      </select>
    );
  }
  
  return (
    <input
      {...register(fieldName as any, { 
        valueAsNumber: isNumber,
        setValueAs: (v) => v === "" ? null : parseFloat(v)
      })}
      type={isNumber ? "number" : "text"}
      step={isNumber ? "any" : undefined}
      className={`w-full px-2 py-1.5 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none rounded-md transition-colors bg-transparent focus:bg-white text-sm ${isNumber ? 'text-right' : 'text-left'}`}
      placeholder={id === "clientName" ? "Client" : id === "horse" ? "Horse" : ""}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Find next input in same column or next row
          const inputs = document.querySelectorAll('input');
          const index = Array.from(inputs).indexOf(e.currentTarget);
          if (index > -1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
          }
        }
      }}
    />
  );
};

export default function BetTable() {
  const { control, getValues } = useFormContext<SheetData>();
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "rows",
  });

  const columns = useMemo<ColumnDef<BetRow>[]>(
    () => [
      { accessorKey: "serialNo", header: "S.No", size: 50 },
      { accessorKey: "clientName", header: "Client Name", size: 150 },
      { accessorKey: "horse", header: "Horse", size: 150 },
      { accessorKey: "betType", header: "Bet Type", size: 100 },
      { accessorKey: "stake", header: "Stake", size: 100 },
      { accessorKey: "odds", header: "Odds", size: 80 },
      { accessorKey: "result", header: "Results (manual Input)", size: 150 },
      { accessorKey: "profit", header: "Profit/Loss", size: 120 },
      { accessorKey: "percentage", header: "Percentage", size: 100 },
      { accessorKey: "returnAmt", header: "Returns", size: 120 },
      {
        id: "actions",
        header: "",
        size: 70,
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => {
                const currentRow = getValues(`rows.${row.index}`);
                insert(row.index + 1, {
                  ...currentRow,
                  serialNo: fields.length + 1, // Will be recalculated or visually just index + 1
                  stake: null,
                  odds: null,
                  result: "",
                  profit: null,
                  percentage: null,
                  returnAmt: null
                });
              }}
              className="p-1 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors no-print"
              title="Duplicate row for same client"
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              onClick={() => remove(row.index)}
              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors no-print"
              title="Remove row"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [remove, insert, getValues, fields.length]
  );

  const table = useReactTable({
    data: fields as any, // Type coercion for useFieldArray fields
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      cell: EditableCell,
    },
  });

  const addRow = () => {
    append({
      serialNo: fields.length + 1,
      clientName: "",
      horse: "",
      race: "",
      betType: "",
      stake: null,
      odds: null,
      deductionPercent: null,
      netOdds: null,
      result: "",
      profit: null,
      percentage: null,
      returnAmt: null,
    });
  };

  return (
    <div className="flex flex-col relative w-full h-full">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className="px-2 py-3 font-semibold text-slate-600 border-r border-slate-200 last:border-0"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-slate-100">
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-r border-slate-100 last:border-0 p-1">
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="p-4 border-t border-slate-200 no-print flex justify-center sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>
    </div>
  );
}
