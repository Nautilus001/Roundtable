import React, { useState } from 'react'
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native'
import { router } from 'expo-router'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { useAuthContext } from '@/hooks/use-auth-context' 

export default function WelcomeIndex() {
    const [eventCode, setEventCode] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    
    const { joinGathering } = useGatheringContext()
    const { profile } = useAuthContext() 

    const handleTextChange = (text: string) => {
        setErrorMsg('')
        const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
        
        if (cleaned.length <= 4) {
        setEventCode(cleaned)
        } else {
        setEventCode(`${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`)
        }
    }

    const handleJoin = async () => {
        console.log(eventCode);
        setIsLoading(true);
        setErrorMsg('');

        try {
            const { data, error } = await joinGathering(eventCode);

            if (error) {
                console.error('Database error:', error.message);
                setErrorMsg(error.message || 'We couldn’t find that event. Double-check your code.');
                return;
            }

            if (!data || data.length === 0) {
                setErrorMsg('Something went wrong. Please try again.');
                return;
            }

            const joinedEvent = data[0];
            router.push({
                pathname: '/(tabs)/(dashboard)/dashboard',
                params: { id: joinedEvent.id }
            });

        } catch (unexpectedError) {
            console.error('App-level unexpected crash:', unexpectedError);
            setErrorMsg('Unexpected error, please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
        >
        <View style={styles.card}>
            <Text style={styles.title}>Gatherings</Text>
            <Text style={styles.subtitle}>Enter a code to hop in, or start your own event.</Text>

            <View style={styles.inputSection}>
            <Text style={styles.label}>Join Event</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. ABCD-1234"
                placeholderTextColor="#9ca3af"
                value={eventCode}
                onChangeText={handleTextChange}
                maxLength={9}
                autoCapitalize="characters"
                autoCorrect={false}
            />
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            
            <TouchableOpacity 
                style={[styles.primaryButton, isLoading && styles.disabledButton]} 
                onPress={handleJoin}
                disabled={isLoading}
            >
                {isLoading ? (
                <ActivityIndicator color="#ffffff" />
                ) : (
                <Text style={styles.primaryButtonText}>Join</Text>
                )}
            </TouchableOpacity>
            </View>

            <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => router.push('/create-gathering')}
            >
            <Text style={styles.secondaryButtonText}>Create Event</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 20,
    },
    inputSection: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#111827',
        backgroundColor: '#f9fafb',
        fontWeight: '500',
        letterSpacing: 1.5,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 13,
        marginTop: 6,
    },
    primaryButton: {
        backgroundColor: '#ff385c',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    disabledButton: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '500',
    },
    secondaryButton: {
        borderWidth: 1.5,
        borderColor: '#e5e7eb',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    secondaryButtonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '700',
    },
})