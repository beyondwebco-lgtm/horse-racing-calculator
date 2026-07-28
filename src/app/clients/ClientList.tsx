'use client';

import { useState } from 'react';
import { Client } from '@/types/schema';
import { updateClientStatus } from '@/app/actions/clients';
import { resetClientsAction } from '@/app/actions/db';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function ClientList({ initialClients }: { initialClients: Client[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = initialClients.filter(client => {
    const s = searchTerm.toLowerCase();
    return (
      client.client_id.toString().includes(s) ||
      client.name.toLowerCase().includes(s) ||
      (client.mobile_number && client.mobile_number.toLowerCase().includes(s)) ||
      client.status.toLowerCase().includes(s)
    );
  });

  const handleExportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFontSize(18);
    pdf.text('Client Master Report', 14, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 27);
    pdf.setTextColor(0);
    
    const startY = 35;
    pdf.setFont('helvetica', 'bold');
    pdf.text('ID', 14, startY);
    pdf.text('Name', 30, startY);
    pdf.text('Mobile', 80, startY);
    pdf.text('Opening Bal', 120, startY);
    pdf.text('Current Bal', 150, startY);
    pdf.text('Status', 180, startY);
    
    pdf.line(14, startY + 2, 200, startY + 2);
    
    pdf.setFont('helvetica', 'normal');
    let currentY = startY + 8;
    
    filteredClients.forEach((client) => {
      if (currentY > 280) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.text(client.client_id.toString(), 14, currentY);
      pdf.text(client.name.substring(0, 20), 30, currentY);
      pdf.text(client.mobile_number || '-', 80, currentY);
      pdf.text(`$${client.opening_balance.toFixed(2)}`, 120, currentY);
      pdf.text(`$${client.current_balance.toFixed(2)}`, 150, currentY);
      pdf.text(client.status, 180, currentY);
      
      currentY += 8;
    });
    
    pdf.save('clients-report.pdf');
  };

  const handleResetClients = async () => {
    if (confirm('Are you sure you want to delete all clients? This will also wipe out all bets associated with them.')) {
      await resetClientsAction();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'Active' | 'Inactive') => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    await updateClientStatus(id, newStatus);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-slate-50 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Registered Clients</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="text" 
            placeholder="Search clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <button 
            onClick={handleExportPDF} 
            className="bg-slate-200 text-slate-800 hover:bg-slate-300 px-4 py-1.5 rounded-md text-sm font-semibold"
          >
            Export PDF
          </button>
          <button 
            onClick={handleResetClients} 
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-md text-sm font-semibold"
          >
            Reset Clients
          </button>
        </div>
      </div>
      <div className="overflow-x-auto" id="clients-table-container">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Opening Bal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Current Bal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{client.client_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{client.mobile_number || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${client.opening_balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-bold">${client.current_balance.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  <button 
                    onClick={() => handleToggleStatus(client.id, client.status as 'Active' | 'Inactive')} 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full hover:opacity-85 ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.status}
                  </button>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
