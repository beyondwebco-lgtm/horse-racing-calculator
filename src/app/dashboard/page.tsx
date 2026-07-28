import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Fetch data for KPIs
  const { data: clients } = await supabase.from('clients').select('*');
  const { data: races } = await supabase.from('races').select('*');
  const { data: bets } = await supabase.from('bets').select('*');

  const activeClients = clients?.filter(c => c.status === 'Active').length || 0;
  const totalBets = bets?.length || 0;
  const totalStake = bets?.reduce((sum, bet) => sum + Number(bet.stake), 0) || 0;
  
  // Calculate Profit/Loss
  const completedBets = bets?.filter(b => b.result !== 'Pending') || [];
  const totalProfit = completedBets.reduce((sum, bet) => sum + Number(bet.profit), 0);
  const totalPayout = completedBets.filter(b => b.result === 'Win').reduce((sum, bet) => sum + Number(bet.return_amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bookmaker Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Active Clients</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{activeClients}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Bets Placed</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalBets}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Stake Volume</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">${totalStake.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 border-b-4 border-slate-900">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Net Profit</p>
          <p className={`mt-2 text-3xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalProfit.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="p-4 bg-slate-50 border-b">
             <h2 className="text-lg font-semibold">Today's Summary</h2>
           </div>
           <div className="p-6">
             <p className="text-slate-700">Total Payouts: <strong className="text-slate-900">${totalPayout.toFixed(2)}</strong></p>
             <p className="text-slate-700 mt-2">Active Races: <strong className="text-slate-900">{races?.filter(r => r.status === 'Running').length || 0}</strong></p>
             <p className="text-slate-700 mt-2">Upcoming Races: <strong className="text-slate-900">{races?.filter(r => r.status === 'Upcoming').length || 0}</strong></p>
           </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
           <div className="p-4 bg-slate-50 border-b">
             <h2 className="text-lg font-semibold">Quick Actions</h2>
           </div>
           <div className="p-6 flex flex-wrap gap-4">
              <a href="/bets" className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">Record New Bet</a>
              <a href="/clients" className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300">Add Client</a>
              <a href="/races" className="bg-slate-200 text-slate-900 px-4 py-2 rounded-md hover:bg-slate-300">Manage Races</a>
           </div>
        </div>
      </div>

    </div>
  );
}
