'use client';

import { useState } from 'react';
import { createBetAction, updateBetResult } from '@/app/actions/bets';
import { Client, Race, Horse, Bet } from '@/types/schema';

export default function BetEntryForm({
  clients,
  races,
  horses,
  bets,
}: {
  clients: Client[];
  races: Race[];
  horses: Horse[];
  bets: (Bet & { clients: { name: string }, horses: { name: string }, races: { name: string } })[];
}) {
  const [selectedRace, setSelectedRace] = useState('');
  
  const filteredHorses = horses.filter(h => h.race_id === selectedRace);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6 border-t-4 border-slate-900">
        <h2 className="text-xl font-semibold mb-4">New Bet Entry</h2>
        <form action={async (formData) => { await createBetAction(formData); }} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Race</label>
            <select name="race_id" required value={selectedRace} onChange={(e) => setSelectedRace(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border">
              <option value="">Select Race</option>
              {races.filter(r => r.status !== 'Completed').map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Horse</label>
            <select name="horse_id" required disabled={!selectedRace} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border disabled:bg-slate-100">
              <option value="">Select Horse</option>
              {filteredHorses.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Client</label>
            <select name="client_id" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border">
              <option value="">Select Client</option>
              {clients.filter(c => c.status === 'Active').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Bet Type</label>
            <select name="bet_type" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border">
              <option value="Win">Win</option>
              <option value="Place">Place</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Odds</label>
            <input type="number" step="0.01" name="odds" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700">Stake</label>
            <input type="number" step="0.01" name="stake" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>

          <div className="md:col-span-6 flex justify-end mt-2">
            <button type="submit" className="bg-slate-900 text-white px-8 py-2 rounded-md hover:bg-slate-800 font-bold">
              Submit Bet
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-slate-50 border-b">
          <h2 className="text-xl font-semibold">Recent Bets & Settlement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Race & Horse</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 uppercase">Odds</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 uppercase">Stake</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 uppercase">Return</th>
                <th className="px-4 py-3 text-right font-medium text-slate-500 uppercase">Profit</th>
                <th className="px-4 py-3 text-center font-medium text-slate-500 uppercase">Result</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {bets.map(bet => (
                <tr key={bet.id} className={bet.result === 'Win' ? 'bg-green-50' : bet.result === 'Lose' ? 'bg-red-50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{bet.bet_id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold">{bet.races.name}</span> <br/>
                    <span className="text-xs text-slate-500">{bet.horses.name}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{bet.clients.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{bet.bet_type}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">{bet.odds.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">${bet.stake.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right font-semibold">${bet.return_amount?.toFixed(2)}</td>
                  <td className={`px-4 py-3 whitespace-nowrap text-right font-bold ${bet.profit > 0 ? 'text-green-600' : bet.profit < 0 ? 'text-red-600' : ''}`}>
                    ${bet.profit?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    {bet.result === 'Pending' ? (
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => updateBetResult(bet.id, 'Win')} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold hover:bg-green-200">W</button>
                        <button onClick={() => updateBetResult(bet.id, 'Lose')} className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold hover:bg-red-200">L</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${bet.result === 'Win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bet.result}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {bets.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-slate-500">No bets recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
