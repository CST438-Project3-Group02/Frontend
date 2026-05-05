import { createContext, useContext } from 'react'

export interface HouseholdDetails {
    householdId: number
    householdName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    rentCost: number
    numOfBedrooms: number
}

export interface MembershipDetails {
    profileHouseholdId: number
    privs: number
    payInterval: number
}

export interface HouseholdContextType {
    household: HouseholdDetails | null
    membership: MembershipDetails | null
    isLoading: boolean
    setHousehold: (household: HouseholdDetails) => void
}

export const HouseholdContext = createContext<HouseholdContextType>({
    household: null,
    membership: null,
    isLoading: true,
    setHousehold: () => {},
})

export function useHouseholdContext() {
    return useContext(HouseholdContext)
}