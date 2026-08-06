import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { GatheringForm } from '@/components/gathering/gathering-form'
import { Gathering } from '@/models/gathering'
import { Item } from '@/models/item'
import { SafeAreaView } from 'react-native-safe-area-context'
import { globalStyle } from '@/styles'
import CountdownWidget from '@/components/gathering/countdown-widget'
import AttendeeTile from '@/components/gathering/attendee-tile'
import ItemTile from '@/components/item/item-tile'
import { getItems } from '@/services/items'
import { AddItemModal } from '@/components/item/add-item-modal'

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
    const [items, setItems] = useState<Item[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    
    const isHost = activeGathering?.role === "OWNER"

    useEffect(() => { 
        if (id && (activeGathering?.id !== id)) {
            setActive(id)
        }
    }, [id])

    useEffect(() => {
        const fetchGatheringData = async () => {
            if (id) {
                setIsLoading(true)
                
                const [attendeesData, itemsResponse] = await Promise.all([
                    getGatheringAttendees(id),
                    getItems(id)
                ])

                if (attendeesData) {
                    setAttendees(attendeesData)
                }

                if (itemsResponse.data) {
                    const fetchedItems = Array.isArray(itemsResponse.data) 
                        ? itemsResponse.data 
                        : [itemsResponse.data]
                    setItems(fetchedItems)
                }
                
                setIsLoading(false)
            }
        }
        fetchGatheringData()
    }, [id, activeGathering])

    const handleSubmit = async (payload: Gathering) => {
        setIsLoading(true)
        await updateGathering(payload)
        setIsLoading(false)
    }

    const handleItemAdded = (newItem: Item) => {
        setItems(prev => [...prev, newItem])
    }

    const handleItemUpdated = (updatedItem: Item) => {
        setItems(prevItems => 
            prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
        )
    }

    const handleItemRemoved = (removedItemId: string) => {
        setItems(prevItems => prevItems.filter(item => item.id !== removedItemId))
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

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CountdownWidget time={activeGathering.start_time} />
                
                <GatheringForm 
                    initialData={activeGathering}
                    onSubmit={handleSubmit} 
                    isEdit={isEdit}
                    isNew={false}
                />

                <Text style={styles.sectionTitle}>Attendees</Text>
                {attendees && attendees.length > 0 ? (
                    attendees.map((item, index) => (
                        <View key={`attendee-${index}`} style={styles.tileWrapper}>
                            <AttendeeTile 
                                name={`${item.first_name} ${item.last_name}`} 
                                role={item.role} 
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyStateText}>No attendees registered yet.</Text>
                )}

                <Text style={styles.sectionTitle}>Items</Text>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Items</Text>
                    {isHost && <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => setIsAddModalOpen(true)}
                    >
                        <Text style={styles.addButtonText}>+ Add Item</Text>
                    </TouchableOpacity>}
                </View>
                {items && items.length > 0 ? (
                    items.map((item, index) => (
                        <View key={`item-${item.id || index}`} style={styles.tileWrapper}>
                        <ItemTile 
                            item={item} 
                            onItemUpdated={handleItemUpdated}
                            onItemRemoved={() => handleItemRemoved(item.id ?? "")}
                            canEdit={isHost}
                        />
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyStateText}>No items added yet.</Text>
                )}
            </ScrollView>
            {activeGathering?.id && (
                <AddItemModal 
                    visible={isAddModalOpen} 
                    gatheringId={activeGathering.id}
                    onClose={() => setIsAddModalOpen(false)}
                    onItemAdded={handleItemAdded}
                />
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
    scrollView: {
        width: '100%',
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        alignSelf: 'flex-start',
        marginTop: 24,
        marginBottom: 12,
    },
    tileWrapper: {
        width: '100%',
        marginBottom: 8,
    },
    emptyStateText: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
})