import {EventRole, Gathering} from "@/models/gathering"
import { supabase } from "./supabase"

interface GatheringsReturnType {
    data: Gathering[] | null
    error: Error | null
}

interface JoinEventReturnType {
    data: {
        success: boolean,
        message: string
        role?: EventRole
        event_id?: string
    } | null
    error: Error | null
}


export async function getGatherings(profile_id: string): Promise<GatheringsReturnType> {

    const { data, error } = await supabase
        .from('roles')
        .select(`
            role, 
            events (
                id,
                created_at,
                name,
                start_time,
                location,
                attire,
                event_code,
                active
            )
        `)
        .eq('profile_id', profile_id)

    if (error || !data) {
        console.error('Error fetching gatherings:', error.message)
        return { data: null, error }
    }
        
    return { 
        data: data
            .filter(item=>item.events != null) 
            .map(item=> {
                const gathering = item.events as any
    
                return {
                    id: gathering.id,
                    created_at: gathering.created_at,
                    name: gathering.name,
                    start_time: gathering.start_time,
                    location: gathering.location,
                    attire: gathering.attire,
                    event_code: gathering.event_code,
                    role: item.role,
                    active: gathering.active
                }
            }),
        error: null
    }
}

export async function joinEventByCode(eventCode: string) : Promise<JoinEventReturnType>{
    const { data, error } = await supabase.rpc('join_event_by_code', {
        p_event_code: eventCode
    });

    if (error) {
        console.error('RPC Error:', error.message);
    } else if (!data?.success) {
        console.warn('Action failed:', data.message);
    } else {
        console.log('Successfully joined event:', data.event_id);
    }
    
    return { data, error }
}

export async function postGathering(payload: Gathering) : Promise<GatheringsReturnType>{
    const { data, error } = await supabase
        .rpc('create_event_with_owner', { 
            p_name: payload.name,
            p_start_time: payload.start_time,
            p_location: payload.location,
            p_attire: payload.attire,
        })
    if (error || !data) {
        console.error('Error creating gathering via RPC', error)
        return { data: null, error }
    }
    return { data, error: null }
}

export async function putGathering(payload: Gathering) : Promise<GatheringsReturnType>{
    const { data, error } = await supabase
        .from('events')
        .update({ 
            id: payload.id,
            name: payload.name,
            start_time: payload.start_time,
            location: payload.location,
            attire: payload.attire
        })
        .eq('id', payload.id)
        .select()

    if(error || !data) {
        console.error('Error updating gathering')
        return {data: null, error}
    }
    return {data, error: null}
}

export async function deleteGathering(payload: Gathering) : Promise<GatheringsReturnType>{
    const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', payload.id ?? "")

    if(error) {
        console.error('Error deleting gathering')
        return {data: null, error}
    }
    return {data: null, error: null}
}



 