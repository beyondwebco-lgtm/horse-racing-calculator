'use server'

import { createClient } from '@/utils/supabase/server'
import { Race } from '@/types/schema'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getRaces() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data, error } = await supabase
    .from('races')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching races:', error)
    return []
  }

  return data as Race[]
}

export async function createRaceAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const date = formData.get('date') as string
  const status = formData.get('status') as string || 'Upcoming'

  const { error } = await supabase
    .from('races')
    .insert([{
      name,
      location,
      date,
      status
    }])

  if (error) {
    console.error('Error creating race:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/races')
  return { success: true }
}

export async function updateRaceStatus(id: string, status: 'Upcoming' | 'Running' | 'Completed') {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const { error } = await supabase
    .from('races')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating race status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/races')
  return { success: true }
}
