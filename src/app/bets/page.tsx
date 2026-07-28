import { getClients } from '@/app/actions/clients';
import { getRaces } from '@/app/actions/races';
import { getBets } from '@/app/actions/bets';
import { createClient } from '@/utils/supabase/server';
import BetEntryForm from './BetEntryForm';
import { cookies } from 'next/headers';

export default async function BetsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const clients = await getClients();
  const races = await getRaces();
  
  // Need to fetch horses directly here since the server action takes a race_id and we want all horses for the dropdown logic
  const { data: horses } = await supabase.from('horses').select('*');
  const bets = await getBets();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Bet Entry & Settlement</h1>
      </div>

      <BetEntryForm 
        clients={clients} 
        races={races} 
        horses={horses || []} 
        bets={bets as any} 
      />
    </div>
  );
}
