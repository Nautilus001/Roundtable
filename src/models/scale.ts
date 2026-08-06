export interface Scale {
    id?: string
    name: string
    description: string
    parameters?: {min_value: string, max_value: string, step_size: number }
    custom_values?: string[]
}