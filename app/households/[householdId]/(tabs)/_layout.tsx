import { getHousehold, getMembership } from '@/api/households'
import { useAuthContext } from '@/hooks/use-auth-context'
import { HouseholdContext, HouseholdDetails, MembershipDetails } from '@/hooks/use-household-context'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'

export default function HouseholdLayout() {
    const { householdId } = useLocalSearchParams<{ householdId: string }>()
    const { profile } = useAuthContext()

    const [household, setHousehold] = useState<HouseholdDetails | null>(null)
    const [membership, setMembership] = useState<MembershipDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!profile) return

        const fetchHouseholdData = async () => {
            try {
                const [householdData, membershipData] = await Promise.all([
                    getHousehold(householdId),
                    getMembership(profile.profileId, householdId)
                ])
                setHousehold(householdData)
                setMembership(membershipData)
            } catch (error) {
                console.error('Failed to fetch household data', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHouseholdData()
    }, [householdId, profile])

    return (
        <HouseholdContext.Provider value={{ household, membership, isLoading, setHousehold }}>
            <Stack screenOptions={{ headerShown: false }} />
        </HouseholdContext.Provider>
    )
}