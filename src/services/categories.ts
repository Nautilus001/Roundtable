import { supabase } from "./supabase";

export interface Category {
  id: string
  name: string
  scale_id?: string
}

export async function getCategories(): Promise<{ data: Category[] | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error.message)
    return { data: null, error }
  }

  return { data, error: null }
}