import React, { useEffect, useState } from 'react'
import { GatheringContext } from '@/contexts/gathering-context'
import { useAuthContext } from '@/hooks/use-auth-context'
import { getGatherings, postGathering, putGathering, deleteGathering, joinEventByCode } from '@/services/gathering'
import { Gathering } from '@/models/gathering'
import { fetchEventAttendeesWithRoles } from '@/services/profiles'

export const GatheringProvider = ({ children }: { children: React.ReactNode }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [gatherings, setGatherings] = useState<Gathering[]>([])
    const [activeGathering, setActiveGathering] = useState<Gathering | null>(null)

    const { profile } = useAuthContext()

    async function fetchGatherings() {
        setIsLoading(true)
        try { 
            if(profile) {
                const { data, error } = (await getGatherings(profile.id))
                if (error || !data) throw Error()
                if (data) setGatherings(data)
            }
        } catch (error: any) {
            console.error("Unexpected error in fetchGatherings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGatherings()
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
            setActive(data[0].id ?? "")
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
            setActive(data[0].id ?? "")
        } catch (error: any) {
            console.error("Error on createGathering: ", error)
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

    const joinGathering = async (payload: string) => {
        if(!profile) throw Error()
        setIsLoading(true)
        try {
            const { data, error } = await joinEventByCode(payload)
            if (error || !data) throw Error()
            setActive(data.event_id ?? "")
        } catch (error: any) {
            console.error("Error on joinGathering: ", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getGatheringAttendees = async (payload: string) => {
        setIsLoading(true)
        try {
            const { data, error } = await fetchEventAttendeesWithRoles(payload)
            if (error) throw Error()
            const formattedAttendees = data?.map(row => {
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
            activeGathering, 
            setActive, 
            fetchGatherings, 
            createGathering, 
            updateGathering, 
            removeGathering,
            getGatheringAttendees,
            joinGathering,
        }}>
            {children}
        </GatheringContext.Provider>
    )
}