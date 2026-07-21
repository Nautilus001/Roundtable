import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { GatheringForm } from '@/components/gathering/gathering-form'
import { Gathering } from '@/models/gathering'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyle } from '@/styles'
import CountdownWidget from '@/components/gathering/countdown-widget'
import AttendeeTile from '@/components/gathering/attendee-tile'

interface Attendee {
    first_name: string
    last_name: string
    role: string
}

const GatheringDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { activeGathering, updateGathering, setActive, getGatheringAttendees } = useGatheringContext()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [attendees, setAttendees] = useState<Attendee[]>([])
    
    const isHost = activeGathering?.role === "OWNER"

    useEffect(() => { 
        if (id && (activeGathering?.id !== id)) {
            setActive(id)
        }
    }, [id])

    useEffect(() => {
        const fetchAttendees = async () => {
            if (id) {
                setIsLoading(true)
                const data = await getGatheringAttendees(id)
                if (data) {
                    setAttendees(data)
                }
                setIsLoading(false)
            }
        }
        fetchAttendees()
    }, [id, activeGathering])

    const handleSubmit = async (payload: Gathering) => {
        setIsLoading(true)
        await updateGathering(payload)
        setIsLoading(false)
    }

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        )
    }

    if (!activeGathering) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>No active gathering found.</Text>
            </View>
        )
    }

    return (
        <SafeAreaView style={[globalStyle.container, styles.container]}>
            <View style={[styles.headerRow]}>
                <View>
                    {isHost && !isEdit && 
                        <TouchableOpacity 
                            style={[
                                styles.button, 
                                isHost ? styles.activeButton : styles.inactiveButton
                            ]} 
                            onPress={() => setIsEdit(prev => !prev)}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.buttonText, 
                                isHost ? styles.activeText : styles.inactiveText
                            ]}>
                                {"Edit"}
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitleText}> {activeGathering.name} </Text>
                </View>
                <View>
                    <TouchableOpacity 
                        style={[
                            styles.button, 
                            isHost ? styles.activeButton : styles.inactiveButton
                        ]} 
                        onPress={() => router.replace("/(tabs)/dashboard")}
                        activeOpacity={0.8}
                    >
                        <Text style={[
                            styles.buttonText, 
                            isHost ? styles.activeText : styles.inactiveText
                        ]}>
                            {"LEAVE"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CountdownWidget time={activeGathering.start_time} />
            
            <GatheringForm 
                initialData={activeGathering}
                onSubmit={handleSubmit} 
                isEdit={isEdit}
                isNew={false}
            />

            <Text style={styles.sectionTitle}>Attendees</Text>

            {attendees && attendees.length > 0 ? (
                <FlatList
                    data={attendees}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={styles.tileWrapper}>
                            <AttendeeTile 
                                name={`${item.first_name} ${item.last_name}`} 
                                role={item.role} 
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => `${item.first_name}-${index}`}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.noAttendeesText}>No attendees registered yet.</Text>
            )}
        </SafeAreaView>
    )
}

export default GatheringDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',         
        height: '100%',  
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,    
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
    },
    headerRow: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        maxHeight: 100,
        marginVertical: 10,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    errorText: {
        color: '#6b7280',
        fontSize: 16,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.41,
        elevation: 1,
    },
    activeButton: {
        backgroundColor: '#ff385c', 
        borderColor: '#ff385c',
    },
    inactiveButton: {
        backgroundColor: 'transparent',
        borderColor: '#555555',
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeText: {
        color: '#ffffff',
    },
    inactiveText: {
        color: '#555555',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        alignSelf: 'flex-start',
        marginTop: 24,
        marginBottom: 12,
    },
    listContainer: {
        paddingBottom: 32,
        width: '100%',
    },
    tileWrapper: {
        width: '100%',
        marginBottom: 8,
    },
    noAttendeesText: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 16,
        textAlign: 'center',
    },
})