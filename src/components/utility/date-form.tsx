import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native'
import DatePicker from '@/components/utility/date-picker'

interface DateFormProps {
    date: Date
    onChange: (newDate: Date) => void
    label?: string
}

export const DateForm: React.FC<DateFormProps> = ({ date, onChange, label = "Date & Time" }) => {
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false)

    const parsedDate = date ? new Date(date) : null;

    if (!parsedDate || isNaN(parsedDate.getTime())) return '';

    const onDateChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false)
        }
        if (selectedDate) {
            const newDate = new Date(parsedDate)
            newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
            onChange(newDate)
        }
    }

    const onTimeChange = (event: any, selectedTime?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false)
        }
        if (selectedTime) {
            const newDate = new Date(parsedDate)
            newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
            onChange(newDate)
        }
    }

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            {Platform.OS === 'ios' ? (
                <View style={styles.iosPickerContainer}>
                    <DatePicker value={parsedDate} mode="date" onChange={onDateChange} />
                    <DatePicker value={parsedDate} mode="time" onChange={onTimeChange} />
                </View>
            ) : Platform.OS === 'android' ? (
                <View style={styles.androidPickerContainer}>
                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.pickerButtonText}>
                            {parsedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.pickerButton} onPress={() => setShowTimePicker(true)}>
                        <Text style={styles.pickerButtonText}>
                            {parsedDate.toLocaleTimeString(undefined, { timeStyle: 'short' })}
                        </Text>
                    </TouchableOpacity>

                    {showDatePicker && <DatePicker value={parsedDate} mode="date" onChange={onDateChange} />}
                    {showTimePicker && <DatePicker value={parsedDate} mode="time" onChange={onTimeChange} />}
                </View>
            ) : (
                <View style={styles.webPickerContainer}>
                    <DatePicker value={parsedDate} mode="date" onChange={onDateChange} />
                    <DatePicker value={parsedDate} mode="time" onChange={onTimeChange} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    iosPickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
    },
    androidPickerContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    webPickerContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    pickerButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
})