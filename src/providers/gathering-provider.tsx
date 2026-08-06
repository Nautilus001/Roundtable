import React, { useEffect, useState } from 'react'
import { GatheringContext } from '@/contexts/gathering-context'
import { useAuthContext } from '@/hooks/use-auth-context'
import { getGatherings, postGathering, putGathering, deleteGathering, joinEventByCode } from '@/services/gathering'
import { EventRole, Gathering } from '@/models/gathering'
import { fetchEventAttendeesWithRoles } from '@/services/profiles'
import { Profile } from '@/models/profile'
import { Item } from '@/models/item'
import { deleteItem, getItems, postItem, putItem } from '@/services/items'

export const GatheringProvider = ({ children }: { children: React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [gatherings, setGatherings] = useState<Gathering[]>([])
    const [items, setItems] = useState<Item[]>([])
    const [activeGathering, setActiveGathering] = useState<Gathering | null>(null)

    const { profile } = useAuthContext()

    async function fetchGatherings() {
        setIsLoading(true)
        try { 
            if(profile) {
                const { data, error } = (await getGatherings(profile.id))
                if (error || !data) throw Error()
                if (Array.isArray(data)) setGatherings(data)
            }
        } catch (error: any) {
            console.error("Unexpected error in fetchGatherings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchItems() {
        setIsLoading(true)
        try { 
            if(activeGathering) {
                const { data, error } = (await getItems(activeGathering.id ?? ""))
                if (error || !data) throw Error()
                if (Array.isArray(data)) setItems(data)
            }
        } catch (error: any) {
            console.error("Unexpected error in fetchGatherings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGatherings()
        fetchItems()
    }, [])


    const setActive = (gathering_id: string) => {
        const g = gatherings.find(item => item.id === gathering_id) ?? null
        console.log(g)
        setActiveGathering(g)
    }

    const createGathering = async (payload: Gathering) => {
        setIsLoading(true)
        try {
            const {data, error} = await postGathering(payload)
            if (error || !data) throw Error()
            if (Array.isArray(data)) {
                setActive(data[0].id ?? "")
            } else {
                setActive(data.id ?? "")
            }
        } catch (error: any) {
            console.error("Error on createGathering: ", error)
        } finally {
            fetchGatherings()
            setIsLoading(false)
        }
    }

    const updateGathering = async (payload: Gathering) => {
        setIsLoading(true)
        try {
            const {data, error} = await putGathering(payload)
            if (error || !data) throw Error()
            if (Array.isArray(data)) {
                setActive(data[0].id ?? "")
            } else {
                setActive(data.id ?? "")
            }
        } catch (error: any) {
            console.error("Error on updateGathering: ", error)
        } finally {
            fetchGatherings()
            setIsLoading(false)
        }
    }

    const removeGathering = async (payload: Gathering) => {
        setIsLoading(true)
        try {
            const {error} = await deleteGathering(payload)
            if (error) throw Error()
            setActive("")
        } catch (error: any) {
            console.error("Error on createGathering: ", error)
        } finally {
            fetchGatherings()
            setIsLoading(false)
        }
    }

    const createItem = async (payload: Item) => {
        setIsLoading(true)
        try {
            const {data, error} = await postItem(payload)
            if (error || !data) throw Error()
            if (Array.isArray(data)) {
                setActive(data[0].id ?? "")
            } else {
                setActive(data.id ?? "")
            }
        } catch (error: any) {
            console.error("Error on createItem: ", error)
        } finally {
            getItems(activeGathering?.id ?? "")
            setIsLoading(false)
        }
    }

    const updateItem = async (payload: Item) => {
        setIsLoading(true)
        try {
            const {data, error} = await putItem(payload)
            if (error || !data) throw Error()
            if (Array.isArray(data)) {
                setActive(data[0].id ?? "")
            } else {
                setActive(data.id ?? "")
            }
        } catch (error: any) {
            console.error("Error on updateItem: ", error)
        } finally {
            getItems(activeGathering?.id ?? "")
            setIsLoading(false)
        }
    }

    const removeItem = async (payload: Item) => {
        setIsLoading(true)
        try {
            const {error} = await deleteItem(payload)
            if (error) throw Error()
        } catch (error: any) {
            console.error("Error on createItem: ", error)
        } finally {
            getItems(activeGathering?.id ?? "")
            setIsLoading(false)
        }
    }

    const getGatheringAttendees = async (payload: string) => {
        setIsLoading(true)
        try {
            const {data, error} = await fetchEventAttendeesWithRoles(payload)

            if (error || !data) {
                console.error(error);
                return;
            }          
              
            const formattedAttendees = data?.map((row: { profiles: Profile[]; role: EventRole }) => {
                const profile = Array.isArray(row.profiles) 
                    ? row.profiles[0] 
                    : row.profiles;
                    
                return {
                    first_name: profile?.first_name ?? 'Unknown',
                    last_name: profile?.last_name ?? 'Attendee',
                    role: row.role
                }
            }) || []

            return formattedAttendees;

        } catch (error: any) {
            console.error("Error on getGatheringAttendees: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <GatheringContext.Provider value={{
            isLoading, 
            gatherings, 
            items,
            activeGathering, 
            setActive, 
            fetchGatherings, 
            createGathering, 
            updateGathering, 
            removeGathering,
            fetchItems, 
            createItem, 
            updateItem, 
            removeItem,
            getGatheringAttendees,
        }}>
            {children}
        </GatheringContext.Provider>
    )
}