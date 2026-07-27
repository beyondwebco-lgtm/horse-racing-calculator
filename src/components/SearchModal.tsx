"use client";

import { useEffect, useState } from "react";
import { X, Search } from "lucide-react";
import { getSheets } from "@/lib/api";

interface SheetRecord {
  id: number;
  created_at: string;
  date: string;
  race_name: string;
  operator_name: string;
  rows: any[];
  summary: any;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (sheet: SheetRecord) => void;
}

export default function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [sheets, setSheets] = useState<SheetRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getSheets().then((res) => {
        if (res.success) {
          setSheets(res.data);
        }
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSheets = sheets.filter(
    (sheet) =>
      (sheet.race_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sheet.operator_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sheet.date || "").includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">Saved Sheets</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by race name, operator, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Loading saved sheets...
            </div>
          ) : filteredSheets.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No sheets found.
            </div>
          ) : (
            <ul className="space-y-1">
              {filteredSheets.map((sheet) => (
                <li key={sheet.id}>
                  <button
                    onClick={() => {
                      onSelect(sheet);
                      onClose();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-200 flex justify-between items-center group"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {sheet.race_name || "Unnamed Race"}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Operator: {sheet.operator_name || "N/A"} | Date:{" "}
                        {sheet.date || "N/A"}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 group-hover:text-blue-600 font-medium">
                      Load Sheet &rarr;
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
