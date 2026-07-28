import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import DashboardView from './DashboardView';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Fetch data for KPIs
  const { data: clients } = await supabase.from('clients').select('*');
  const { data: races } = await supabase.from('races').select('*');
  const { data: bets } = await supabase.from('bets').select('*');

  return (
    <DashboardView 
      clients={clients || []} 
      races={races || []} 
      bets={bets || []} 
    />
  );
}
