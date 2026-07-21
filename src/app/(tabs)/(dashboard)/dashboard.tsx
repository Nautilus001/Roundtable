import { StyleSheet, Text, TouchableOpacity, View, FlatList, useWindowDimensions, ActivityIndicator} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useAuthContext } from '@/hooks/use-auth-context'
import GatheringTile from '@/components/gathering/gathering-tile'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import {router} from 'expo-router'

const Dashboard = () => {
    const { profile } = useAuthContext()
    const { gatherings, fetchGatherings, setActive } = useGatheringContext()
    const [isLoading, setIsLoading]  = useState<boolean>(true)

    const { width } = useWindowDimensions()
    const availableWidth = width - 32 
    const numColumns = Math.max(1, Math.floor(availableWidth / 150))

    const loadData = async () => {
        if(profile?.id) {
            setIsLoading(true)
            await fetchGatherings()
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    },[profile])

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <TouchableOpacity style={styles.submitButton} onPress={() => loadData()}>
                <Text style={styles.submitButtonText}>Refresh</Text>
            </TouchableOpacity>
            {(isLoading) ? (
                <ActivityIndicator size="large" color="#4f46e5" />
            ) : (gatherings && gatherings.length > 0) ? (
                <FlatList
                    key={`grid-${numColumns}`} 
                    data={gatherings}
                    numColumns={numColumns}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {
                            setActive(item.id ?? "")
                            console.log(item)
                            router.replace({
                                pathname: '/(gathering)/[id]/dashboard',
                                params: { id: item.id ?? "" }
                            })
                        }}>
                            <View style={{ 
                                width: availableWidth / numColumns, 
                                padding: 6
                            }}>
                                <GatheringTile item={item} />
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id ?? Math.random().toString()}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.title}>No events found.</Text>
            )}
        </SafeAreaView>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111827',
    },
    listContainer: {
        width: '100%',
        gap: 12,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#4f46e5',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        margin: 12,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
})