'use server'

import { createClient } from '@/utils/supabase/server'
import { Horse } from '@/types/schema'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getHorsesByRace(race_id: string) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data, error } = await supabase
    .from('horses')
    .select('*')
    .eq('race_id', race_id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching horses:', error)
    return []
  }

  return data as Horse[]
}

export async function createHorseAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const race_id = formData.get('race_id') as string
  const name = formData.get('name') as string

  const { error } = await supabase
    .from('horses')
    .insert([{
      race_id,
      name
    }])

  if (error) {
    console.error('Error creating horse:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/races')
  return { success: true }
}
