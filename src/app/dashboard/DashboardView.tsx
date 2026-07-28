'use client';

import { resetAllAction } from '@/app/actions/db';

interface ClientData {
  id: string;
  status: string;
}

interface RaceData {
  id: string;
  status: string;
}

interface BetData {
  id: string;
  stake: number | string;
  profit: number | string;
  return_amount: number | string;
  result: string;
}

export default function DashboardView({
  clients,
  races,
  bets,
}: {
  clients: ClientData[];
  races: RaceData[];
  bets: BetData[];
}) {
  const activeClients = clients?.filter(c => c.status === 'Active').length || 0;
  const totalBets = bets?.length || 0;
  const totalStake = bets?.reduce((sum, bet) => sum + Number(bet.stake), 0) || 0;
  
  // Calculate Profit/Loss
  const completedBets = bets?.filter(b => b.result !== 'Pending') || [];
  const totalProfit = completedBets.reduce((sum, bet) => sum + Number(bet.profit), 0);
  const totalPayout = completedBets.filter(b => b.result === 'Win').reduce((sum, bet) => sum + Number(bet.return_amount), 0);

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFontSize(22);
    pdf.text('Bookmaker Summary Report', 14, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 27);
    pdf.setTextColor(0);
    
    pdf.line(14, 32, 200, 32);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Key Performance Indicators', 14, 42);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Active Clients: ${activeClients}`, 14, 52);
    pdf.text(`Total Bets Placed: ${totalBets}`, 14, 60);
    pdf.text(`Total Stake Volume: $${totalStake.toFixed(2)}`, 14, 68);
    pdf.text(`Total Net Profit: $${totalProfit.toFixed(2)}`, 14, 76);
    
    pdf.line(14, 84, 200, 84);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text("Today's Summary", 14, 94);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total Payouts: $${totalPayout.toFixed(2)}`, 14, 104);
    pdf.text(`Active Races: ${races?.filter(r => r.status === 'Running').length || 0}`, 14, 112);
    pdf.text(`Upcoming Races: ${races?.filter(r => r.status === 'Upcoming').length || 0}`, 14, 120);
    
    pdf.save('dashboard-summary.pdf');
  };

  const handleResetAll = async () => {
    if (confirm('CRITICAL WARNING: This will permanently delete ALL clients, races, horses, and bets. Are you absolutely sure?')) {
      const res = await resetAllAction();
      if (res.success) {
        alert('All database tables successfully wiped.');
      } else {
        alert('Error resetting data: ' + res.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Bookmaker Dashboard</h1>
        <button 
          onClick={handleExportPDF} 
          className="bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-md text-sm font-semibold shadow-sm"
        >
          Export Summary PDF
        </button>
      </div>

      <div id="dashboard-content" className="space-y-6 bg-slate-50 p-2 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Active Clients</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{activeClients}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Bets Placed</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalBets}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Stake Volume</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">${totalStake.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-b-4 border-slate-900">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Net Profit</p>
            <p className={`mt-2 text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow overflow-hidden border">
             <div className="p-4 bg-slate-50 border-b">
               <h2 className="text-lg font-semibold text-slate-800">Today's Summary</h2>
             </div>
             <div className="p-6 space-y-2">
               <p className="text-slate-700">Total Payouts: <strong className="text-slate-900">${totalPayout.toFixed(2)}</strong></p>
               <p className="text-slate-700">Active Races: <strong className="text-slate-900">{races?.filter(r => r.status === 'Running').length || 0}</strong></p>
               <p className="text-slate-700">Upcoming Races: <strong className="text-slate-900">{races?.filter(r => r.status === 'Upcoming').length || 0}</strong></p>
             </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden border">
             <div className="p-4 bg-slate-50 border-b">
               <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
             </div>
             <div className="p-6 flex flex-wrap gap-4">
                <a href="/bets" className="bg-slate-950 text-white px-4 py-2 rounded-md hover:bg-slate-800 text-sm font-medium">Record New Bet</a>
                <a href="/clients" className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300 text-sm font-medium">Add Client</a>
                <a href="/races" className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300 text-sm font-medium">Manage Races</a>
             </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6">
        <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
        <p className="text-sm text-red-700 mt-1">Permanently erase all system records. Wipes all databases and starts from scratch.</p>
        <button 
          onClick={handleResetAll}
          className="mt-4 bg-red-600 text-white hover:bg-red-700 font-bold px-6 py-2.5 rounded-md text-sm shadow-sm"
        >
          Reset All Database Data
        </button>
      </div>
    </div>
  );
}
