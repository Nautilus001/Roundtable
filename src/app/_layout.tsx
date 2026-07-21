import { SplashScreenController } from '@/components/splash-screen-controller'
import { useAuthContext } from '@/hooks/use-auth-context'
import { AuthProvider } from '@/providers/auth-provider'
import { GatheringProvider } from '@/providers/gathering-provider'
import { SplashScreen, Stack, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

SplashScreen.preventAutoHideAsync()


function RootNavigator() {
  const { claims } = useAuthContext()
  
  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Protected guard={!claims}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!claims}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(gathering)/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="getting-started"/>
        </Stack.Protected>
      </Stack>
  )
}

function AppShell() {
  const { isInitialized } = useAuthContext()

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync()
    }
  }, [isInitialized])

  return <RootNavigator/>
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <GatheringProvider>
        <SafeAreaProvider>
            <AppShell/>
        </SafeAreaProvider>
      </GatheringProvider>
    </AuthProvider>
  )
}

export default RootLayout
