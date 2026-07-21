export type EventRole = 'OWNER' | 'JUDGE' | 'VOTER'
export type Attire = 'BLACK TIE' | 'CASUAL'

export interface Gathering {
    id?: string
    created_at?: string
    name: string
    start_time: Date
    location: any
    attire: Attire
    event_code?: string
    role?: EventRole
    active?: boolean
}