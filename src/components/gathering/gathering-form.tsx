import { Attire, Gathering } from '@/models/gathering'
import { getAttireTypes } from '@/services/enums'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native'
import { DateForm } from '../utility/date-form'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { router } from 'expo-router'

interface GatheringFormProps {
    initialData?: Gathering
    onSubmit: (payload: Gathering) => Promise<void>
    isEdit: boolean
    isNew?: boolean
}

export const GatheringForm: React.FC<GatheringFormProps> = ({ onSubmit, isEdit, initialData, isNew = true }) => {
    const [name, setName] = useState(initialData?.name ?? "")
    const [locationName, setLocationName] = useState(initialData?.location ?? "")
    const [date, setDate] = useState(initialData?.start_time ?? new Date())
    const [attire, setAttire] = useState<Attire>(initialData?.attire ?? 'CASUAL')
    const [attireOptions, setAttireOptions] = useState<Attire[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const { activeGathering, removeGathering } = useGatheringContext()

    useEffect(() => {
        async function fetchAttireOptions() {
            const { data, error } = await getAttireTypes()
            if (data) {
                setAttireOptions(data.map((item: { value: string }) => item.value as Attire))
            } else if (error) {
                console.error('Error fetching attire options:', error)
            }
        }
        fetchAttireOptions()
    }, [])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            await onSubmit({
                id: activeGathering?.id ?? "",
                name: name.trim(),
                start_time: date,
                location: locationName.trim(),
                attire: attire
            })
            router.replace("/dashboard")
        } catch (error) {
            console.error("Error submitting the gathering:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            if (activeGathering) await removeGathering(activeGathering)
            router.replace("/dashboard")
        } catch (error) {
            console.error("Error deleting the gathering:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isEdit) {
        return (
            <ScrollView 
                style={[styles.scrollView]}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Gathering Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Gala Dinner"
                        placeholderTextColor="#9ca3af"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location / Venue</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Metropolitan Hall"
                        placeholderTextColor="#9ca3af"
                        value={locationName}
                        onChangeText={setLocationName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <DateForm date={date} onChange={setDate} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Attire Requirement</Text>
                    <View style={styles.segmentedControl}>
                        {attireOptions.map((option) => {
                            const isActive = attire === option;
                            return (
                                <TouchableOpacity
                                    key={option}
                                    style={[
                                        styles.segmentButton,
                                        isActive && styles.segmentButtonActive
                                    ]}
                                    onPress={() => setAttire(option)}
                                >
                                    <Text style={[
                                        styles.segmentText,
                                        isActive && styles.segmentTextActive
                                    ]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.submitButton} 
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <ActivityIndicator size="small" color="#ffffff" /> :
                        <Text style={styles.submitButtonText}>
                            {isNew ? "Create" : "Update"} Gathering
                        </Text>
                    }
                </TouchableOpacity>

                {!isNew &&
                    <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={handleDelete}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <ActivityIndicator size="small" color="#ffffff" /> :
                            <Text style={styles.deleteButtonText}>
                                Delete Gathering
                            </Text>
                        }
                    </TouchableOpacity>
                }
            </ScrollView>
        )
    }

    return (
        <ScrollView 
            style={[styles.scrollView]}
            contentContainerStyle={[styles.scrollContainer, {alignItems: 'center'}]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Gathering Name</Text>
                <Text style={styles.readOnlyText}>{name || "Unnamed Gathering"}</Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Location / Venue</Text>
                <Text style={styles.readOnlyText}>{locationName || "No venue specified"}</Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date & Time</Text>
                <Text style={styles.readOnlyText}>
                    {date ? new Date(date).toLocaleDateString(undefined, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }) : "No date set"}
                </Text>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Attire Requirement</Text>
                <View style={styles.segmentedControlReadOnly}>
                    <View style={[styles.segmentButtonReadOnly, styles.segmentButtonActive]}>
                        <Text style={styles.segmentTextActive}>{attire}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        width: '100%',
        height: '100%',
        maxWidth: 750
    },
    scrollContainer: {
        paddingHorizontal: 4,
        paddingTop: 16,
        paddingBottom: 40,
        width: '100%',
    },
    inputGroup: {
        marginBottom: 24,
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#f9fafb',
        width: '100%',
    },
    segmentedControl: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    segmentButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#d1d5db',
        backgroundColor: '#ffffff',
    },
    segmentButtonActive: {
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4b5563',
    },
    segmentTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        width: '100%',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        width: '100%',
    },
    deleteButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    readOnlyText: {
        fontSize: 16,
        color: '#1f2937', 
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6', 
        width: '100%',
    },
    segmentedControlReadOnly: {
        flexDirection: 'row',
        width: '100%',
    },
    segmentButtonReadOnly: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
})