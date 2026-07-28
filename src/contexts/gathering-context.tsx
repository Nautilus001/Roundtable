import { Gathering } from '@/models/gathering'
import { createContext } from 'react'

export type GatheringContextType = {
  gatherings: Gathering[] | null
  activeGathering: Gathering | null
  isLoading: boolean
  setActive: (gathering_id: string) => void
  fetchGatherings: () => Promise<any>
  createGathering: (payload: Gathering) => Promise<any>
  updateGathering: (payload: Gathering) => Promise<any>
  removeGathering: (payload: Gathering) => Promise<any>
  getGatheringAttendees: (payload: string) => Promise<any>
}

export const GatheringContext = createContext<GatheringContextType>({
  gatherings: [],
  activeGathering: null,
  isLoading: false,
  setActive: () => {},
  fetchGatherings:  async () => {},
  createGathering: async () => {},
  updateGathering: async () => {},
  removeGathering: async () => {},
  getGatheringAttendees: async () => {},
})