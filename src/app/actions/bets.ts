'use server'

import { createClient } from '@/utils/supabase/server'
import { Bet } from '@/types/schema'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getBets(race_id?: string) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  let query = supabase.from('bets').select(`
    *,
    clients:client_id (name),
    horses:horse_id (name),
    races:race_id (name)
  `).order('created_at', { ascending: false })
  
  if (race_id) {
    query = query.eq('race_id', race_id)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching bets:', error)
    return []
  }

  return data
}

export async function createBetAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const race_id = formData.get('race_id') as string
  const horse_id = formData.get('horse_id') as string
  const client_id = formData.get('client_id') as string
  const bet_type = formData.get('bet_type') as string
  const odds = parseFloat(formData.get('odds') as string)
  const stake = parseFloat(formData.get('stake') as string)

  const { error } = await supabase
    .from('bets')
    .insert([{
      race_id,
      horse_id,
      client_id,
      bet_type,
      odds,
      stake,
      result: 'Pending'
    }])

  if (error) {
    console.error('Error creating bet:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/bets')
  return { success: true }
}

export async function updateBetResult(id: string, result: 'Pending' | 'Win' | 'Lose') {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const { error } = await supabase
    .from('bets')
    .update({ result })
    .eq('id', id)

  if (error) {
    console.error('Error updating bet result:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/bets')
  revalidatePath('/clients') // To update balances
  return { success: true }
}
