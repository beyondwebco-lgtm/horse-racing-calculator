'use client';

import { useState } from 'react';
import { Race, Horse } from '@/types/schema';
import { updateRaceStatus } from '@/app/actions/races';
import { createHorseAction } from '@/app/actions/horses';
import { resetRacesAction } from '@/app/actions/db';

export default function RaceList({ 
  initialRaces, 
  horses 
}: { 
  initialRaces: Race[]; 
  horses: Horse[]; 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRaces = initialRaces.filter(race => {
    const s = searchTerm.toLowerCase();
    return (
      race.race_id.toString().includes(s) ||
      race.name.toLowerCase().includes(s) ||
      (race.location && race.location.toLowerCase().includes(s)) ||
      race.status.toLowerCase().includes(s)
    );
  });

  const handleExportPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica', 'normal');
    
    pdf.setFontSize(18);
    pdf.text('Race & Horse Master Report', 14, 20);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 27);
    pdf.setTextColor(0);
    
    let currentY = 35;
    
    filteredRaces.forEach((race) => {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(`${race.name} (${race.status})`, 14, currentY);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Date: ${race.date} | Location: ${race.location || 'N/A'}`, 14, currentY + 5);
      
      const raceHorses = horses?.filter(h => h.race_id === race.id) || [];
      const horseNames = raceHorses.map(h => `${h.horse_id}. ${h.name}`).join(', ');
      
      pdf.text(`Horses: ${horseNames || 'None'}`, 14, currentY + 10);
      pdf.line(14, currentY + 13, 200, currentY + 13);
      
      currentY += 22;
    });
    
    pdf.save('races-report.pdf');
  };

  const handleResetRaces = async () => {
    if (confirm('Are you sure you want to delete all races? This will also wipe out all horses and bets associated with them.')) {
      await resetRacesAction();
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Upcoming' ? 'Running' : currentStatus === 'Running' ? 'Completed' : 'Upcoming';
    await updateRaceStatus(id, nextStatus as any);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold">Race List</h2>
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="text" 
            placeholder="Search races..." 
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
            onClick={handleResetRaces} 
            className="bg-red-600 text-white hover:bg-red-700 px-4 py-1.5 rounded-md text-sm font-semibold"
          >
            Reset Races
          </button>
        </div>
      </div>

      <div className="space-y-8" id="races-list-container">
        {filteredRaces.map(race => {
          const raceHorses = horses?.filter(h => h.race_id === race.id) || [];
          return (
            <div key={race.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">
                    {race.name} 
                    <span className="text-sm font-normal text-slate-500 ml-2">
                      ({race.date}) - {race.location || 'No Location'}
                    </span>
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleToggleStatus(race.id, race.status)}
                    className={`px-3 py-1 text-sm font-semibold rounded-full hover:opacity-85 ${
                      race.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                      race.status === 'Running' ? 'bg-green-100 text-green-800' : 
                      'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {race.status}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold mb-2">Horses ({raceHorses.length})</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {raceHorses.map(horse => (
                    <span key={horse.id} className="bg-slate-100 px-3 py-1 rounded-md text-sm border">
                      {horse.horse_id}. {horse.name}
                    </span>
                  ))}
                  {raceHorses.length === 0 && <p className="text-sm text-slate-500">No horses added yet.</p>}
                </div>

                <form 
                  action={async (formData) => {
                    await createHorseAction(formData);
                  }} 
                  className="flex gap-2 max-w-sm"
                >
                  <input type="hidden" name="race_id" value={race.id} />
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Horse Name" 
                    required 
                    className="flex-1 rounded-md border-slate-300 shadow-sm p-2 border text-sm" 
                  />
                  <button 
                    type="submit" 
                    className="bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 text-sm font-medium"
                  >
                    Add Horse
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {filteredRaces.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-slate-500">
            No races found.
          </div>
        )}
      </div>
    </div>
  );
}
