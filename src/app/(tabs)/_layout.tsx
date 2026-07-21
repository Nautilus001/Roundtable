import { StyleSheet} from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { useAuthContext } from '@/hooks/use-auth-context'
import Ionicons from '@react-native-vector-icons/ionicons'

const TabsLayout = () => {
    const { claims } = useAuthContext()
    return (
        <Tabs 
            initialRouteName='(dashboard)'
            screenOptions={{headerShown: false, tabBarShowLabel: false}}
        >
            <Tabs.Protected guard={!!claims}>
                <Tabs.Screen 
                    name="(gathering-mgmt)"
                    options={{
                        tabBarIcon: (tabInfo) => {
                            return (
                                <Ionicons
                                    name="calendar"
                                    size={24}
                                    color={tabInfo.focused ? "#006600" : "#8e8e93"}
                                />
                            )
                        },
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name="(dashboard)"
                    options={{
                        tabBarIcon: (tabInfo) => {
                            return (
                                <Ionicons
                                    name="home"
                                    size={24}
                                    color={tabInfo.focused ? "#006600" : "#8e8e93"}
                                />
                            )
                        },
                        headerShown: false
                    }}
                />
                <Tabs.Screen 
                name="account" 
                options={{
                        tabBarIcon: (tabInfo) => {
                            return (
                                <Ionicons
                                    name="person"
                                    size={24}
                                    color={tabInfo.focused ? "#006600" : "#8e8e93"}
                                />
                            )
                        },
                        headerShown: false
                    }}
                />
            </Tabs.Protected>
        </Tabs>
    )
    }

export default TabsLayout

const styles = StyleSheet.create({})