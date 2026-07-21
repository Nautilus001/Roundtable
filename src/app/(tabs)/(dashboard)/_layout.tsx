import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'
import { useGatheringContext } from '@/hooks/use-gathering-context'
 
function DashboardNavigator() {
  return (
      <Stack initialRouteName="dashboard" screenOptions={{headerShown: false}}>
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
            <Stack.Screen 
                name="[id]" 
                options={{ 
                    headerShown: false,
                    title: "Gathering Details" 
                }} 
            />
      </Stack>
  )
}

export default DashboardNavigator

const styles = StyleSheet.create({})