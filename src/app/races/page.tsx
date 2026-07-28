import { getRaces, createRaceAction } from '@/app/actions/races'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import RaceList from './RaceList'

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

      <RaceList initialRaces={races} horses={horses || []} />
    </div>
  )
}
