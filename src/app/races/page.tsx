import { getRaces, createRaceAction, updateRaceStatus } from '@/app/actions/races'
import { createHorseAction } from '@/app/actions/horses'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function RacesPage() {
  const races = await getRaces()
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  // Fetch horses for all races
  const { data: horses } = await supabase.from('horses').select('*')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Race & Horse Master</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Race</h2>
        <form action={async (formData) => {
          'use server';
          await createRaceAction(formData);
        }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Race Name</label>
            <input type="text" name="name" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Location</label>
            <input type="text" name="location" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Date</label>
            <input type="date" name="date" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-slate-800">Add Race</button>
          </div>
        </form>
      </div>

      <div className="space-y-8">
        {races.map(race => {
          const raceHorses = horses?.filter(h => h.race_id === race.id) || []
          return (
            <div key={race.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">{race.name} <span className="text-sm font-normal text-slate-500 ml-2">({race.date}) - {race.location}</span></h3>
                </div>
                <div className="flex items-center gap-4">
                  <form action={async () => {
                    'use server';
                    const nextStatus = race.status === 'Upcoming' ? 'Running' : race.status === 'Running' ? 'Completed' : 'Upcoming';
                    await updateRaceStatus(race.id, nextStatus);
                  }}>
                    <button type="submit" className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      race.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                      race.status === 'Running' ? 'bg-green-100 text-green-800' : 
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {race.status}
                    </button>
                  </form>
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

                <form action={async (formData) => {
                  'use server';
                  await createHorseAction(formData);
                }} className="flex gap-2 max-w-sm">
                  <input type="hidden" name="race_id" value={race.id} />
                  <input type="text" name="name" placeholder="Horse Name" required className="flex-1 rounded-md border-slate-300 shadow-sm p-2 border text-sm" />
                  <button type="submit" className="bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 text-sm font-medium">Add Horse</button>
                </form>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
