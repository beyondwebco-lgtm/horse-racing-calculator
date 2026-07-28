'use server'

import { createClient } from '@/utils/supabase/server'
import { Client } from '@/types/schema'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function getClients() {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching clients:', error)
    return []
  }

  return data as Client[]
}

export async function createClientAction(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const name = formData.get('name') as string
  const mobile_number = formData.get('mobile_number') as string
  const opening_balance = parseFloat(formData.get('opening_balance') as string) || 0

  const { error } = await supabase
    .from('clients')
    .insert([{
      name,
      mobile_number,
      opening_balance,
      current_balance: opening_balance,
      status: 'Active'
    }])

  if (error) {
    console.error('Error creating client:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/clients')
  return { success: true }
}

export async function updateClientStatus(id: string, status: 'Active' | 'Inactive') {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)
  
  const { error } = await supabase
    .from('clients')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating client status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/clients')
  return { success: true }
}
