'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// Reset only bets
export async function resetBetsAction() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  // 1. Delete all bets
  const { error: deleteError } = await supabase.from('bets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Error deleting bets:', deleteError)
    return { success: false, error: deleteError.message }
  }

  // 2. Reset clients current_balance back to their opening_balance
  // First fetch all clients
  const { data: clients, error: fetchError } = await supabase.from('clients').select('id, opening_balance')
  if (fetchError) {
    console.error('Error fetching clients for reset:', fetchError)
    return { success: false, error: fetchError.message }
  }

  if (clients) {
    for (const client of clients) {
      await supabase
        .from('clients')
        .update({ current_balance: client.opening_balance })
        .eq('id', client.id)
    }
  }

  revalidatePath('/bets')
  revalidatePath('/clients')
  revalidatePath('/dashboard')
  return { success: true }
}

// Reset only clients (cascades to bets)
export async function resetClientsAction() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) {
    console.error('Error deleting clients:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/clients')
  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

// Reset only races (cascades to horses and bets)
export async function resetRacesAction() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { error } = await supabase.from('races').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) {
    console.error('Error deleting races:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/races')
  revalidatePath('/bets')
  revalidatePath('/dashboard')
  return { success: true }
}

// Reset everything
export async function resetAllAction() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  // Due to foreign key cascades, deleting races and clients will wipe horses and bets too
  const { error: betsErr } = await supabase.from('bets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: horsesErr } = await supabase.from('horses').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: racesErr } = await supabase.from('races').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: clientsErr } = await supabase.from('clients').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (racesErr || clientsErr || betsErr || horsesErr) {
    console.error('Error resetting all data:', { racesErr, clientsErr, betsErr, horsesErr })
    return { success: false, error: 'Failed to reset all tables' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/clients')
  revalidatePath('/races')
  revalidatePath('/bets')
  return { success: true }
}
