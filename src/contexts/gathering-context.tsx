import { Gathering } from '@/models/gathering'
import { Item } from '@/models/item'
import { createContext } from 'react'

interface GatheringContextType {
  gatherings: Gathering[] | null
  items: Item[] | null
  activeGathering: Gathering | null
  isLoading: boolean
  setActive: (gathering_id: string) => void
  fetchGatherings: () => Promise<any>
  createGathering: (payload: Gathering) => Promise<any>
  updateGathering: (payload: Gathering) => Promise<any>
  removeGathering: (payload: Gathering) => Promise<any>
  fetchItems: (gathering_id: string) => Promise<any>
  createItem: (payload: Item) => Promise<any>
  updateItem: (payload: Item) => Promise<any>
  removeItem: (payload: Item) => Promise<any>
  getGatheringAttendees: (payload: string) => Promise<any>
}

export const GatheringContext = createContext<GatheringContextType>({
  gatherings: [],
  items: [],
  activeGathering: null,
  isLoading: false,
  setActive: () => {},
  fetchGatherings:  async () => {},
  createGathering: async () => {},
  updateGathering: async () => {},
  removeGathering: async () => {},
  fetchItems:  async () => {},
  createItem: async () => {},
  updateItem: async () => {},
  removeItem: async () => {},
  getGatheringAttendees: async () => {},
})