import { StyleSheet} from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { useAuthContext } from '@/hooks/use-auth-context'

const GatheringManagementNavigator = () => {
    const { claims } = useAuthContext()
    return (
        <Stack>
            <Stack.Protected guard={!!claims}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="create-gathering" options={{ headerShown: false }} />
            </Stack.Protected>
        </Stack>
    )
}

export default GatheringManagementNavigator

const styles = StyleSheet.create({})