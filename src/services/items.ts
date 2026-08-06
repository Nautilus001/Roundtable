import { Item } from "@/models/item"
import { supabase } from "./supabase"

interface ItemsReturnType {
    data: Item[] | Item | null
    error: Error | null
}

export async function getItems(gathering_id: string): Promise<ItemsReturnType> {
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('gathering_id', gathering_id)

    if (error) {
        console.error('Error fetching items:', error.message)
        return { data: null, error }
    }
        
    return { data, error: null }
}

export async function postItem(payload: Item): Promise<ItemsReturnType> {
    const { data, error } = await supabase
        .from('items')
        .insert({
            name: payload.name,
            category_id: payload.category_id,
            gathering_id: payload.gathering_id
        })
        .select()
        .single()

    if (error || !data) {
        console.error('Error creating item:', error?.message ?? "No data")
        return { data: null, error }
    }
    
    return { data, error: null }
}

export async function putItem(payload: Item): Promise<ItemsReturnType> {
    if (!payload.id) {
        return { data: null, error: new Error("Item ID is required for updating.") }
    }

    const { data, error } = await supabase
        .from('items')
        .update({ 
            name: payload.name,
            category_id: payload.category_id
        })
        .eq('id', payload.id)
        .select()
        .single()

    if (error || !data) {
        console.error('Error updating item:', error?.message ?? "No data")
        return { data: null, error }
    }
    
    return { data, error: null }
}

export async function deleteItem(payload: Item): Promise<ItemsReturnType> {
    if (!payload.id) {
        return { data: null, error: new Error("Item ID is required for deletion.") }
    }

    const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', payload.id)

    if (error) {
        console.error('Error deleting item:', error.message)
        return { data: null, error }
    }
    
    return { data: null, error: null }
}