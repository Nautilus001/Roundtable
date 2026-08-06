import { supabase } from "./supabase"

export interface ProfileUpdateType {
    first_name?: string
    last_name?: string
    email?: string
    username?: string
}

export async function updateProfile(userID: string, payload: ProfileUpdateType) {
    const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userID)
        .select()
    return { data, error }
}

export async function fetchProfile(userID: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userID)
        .maybeSingle()
    return { data, error }
}

export async function fetchEventAttendeesWithRoles(eventID: string) {
    const { data, error } = await supabase.rpc('get_event_members', {
        p_event_id: eventID
    });
    
    return { data, error }
}

export async function deleteProfile(userID: string) {
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userID) 
    return { error }
}