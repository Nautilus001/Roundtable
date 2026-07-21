import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

interface CountdownWidgetProps {
    time: Date
}

export const CountdownWidget: React.FC<CountdownWidgetProps> = ({time}) => {  
    const targetDate = new Date(time)
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        const difference = targetDate.getTime() - Date.now()
        
        if (difference <= 0) {
            return { days: '00', hours: '00', minutes: '00', seconds: '00' }
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        return {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    const renderDigitGroup = (timeValue: string) => {
        return (
            <View style={styles.groupContainer}>
                {timeValue.split('').map((digit, index) => (
                    <View key={index} style={styles.digitRectangle}>
                        <Text style={styles.digitText}>{digit}</Text>
                    </View>
                ))}
            </View>
        )
    }

    return (
        <View style={styles.eventTile}>
            <View style={styles.countdownContainer}>
                {renderDigitGroup(timeLeft.days)}
                <Text style={styles.colon}>:</Text>
                
                {renderDigitGroup(timeLeft.hours)}
                <Text style={styles.colon}>:</Text>
                
                {renderDigitGroup(timeLeft.minutes)}
                <Text style={styles.colon}>:</Text>
                
                {renderDigitGroup(timeLeft.seconds)}
            </View>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>Days</Text>
                <Text style={styles.label}>Hrs</Text>
                <Text style={styles.label}>Min</Text>
                <Text style={styles.label}>Sec</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    eventTile: {
        backgroundColor: '#1e1e1e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupContainer: {
        flexDirection: 'row',
    },
    digitRectangle: {
        backgroundColor: '#333333',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 6,
        marginHorizontal: 2,
        minWidth: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#444444',
    },
    digitText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'monospace',
    },
    colon: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 4,
        paddingBottom: 4, 
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 6,
        marginTop: 6,
    },
    label: {
        color: '#888888',
        fontSize: 10,
        fontWeight: '600',
        textTransform: 'uppercase',
        textAlign: 'center',
        width: 60, 
    },
})

export default CountdownWidget