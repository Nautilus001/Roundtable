import { StyleSheet} from 'react-native'
import React from 'react'
import { router, Tabs } from 'expo-router'
import { useAuthContext } from '@/hooks/use-auth-context'
import Ionicons from '@react-native-vector-icons/ionicons'

const GatheringNavigator = () => {
    const { claims } = useAuthContext()
    return (
        <Tabs 
            initialRouteName='dashboard'
            screenOptions={{headerShown: false, tabBarShowLabel: false}}
        >
            <Tabs.Protected guard={!!claims}>
                <Tabs.Screen 
                    name="exit-gathering"
                    options={{
                        tabBarIcon: (tabInfo) => (
                            <Ionicons 
                                name="return-up-back" 
                                size={24} 
                                color={tabInfo.focused ? "#006600" : "#8e8e93"} 
                            />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            
                            router.replace('/(tabs)/dashboard');
                        },
                    }}
                />
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        tabBarIcon: (tabInfo) => {
                            return (
                                <Ionicons name="speedometer-outline" size={24} color={tabInfo.focused ? "#006600" : "#8e8e93"}  />
                            )
                        },
                        headerShown: false
                    }}
                />
            </Tabs.Protected>
        </Tabs>
    )
}

export default GatheringNavigator

const styles = StyleSheet.create({})