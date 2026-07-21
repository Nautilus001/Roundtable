import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useState } from 'react'
import AccountField from '@/components/account/account-field'
import { useAuthContext } from '@/hooks/use-auth-context'
import { router } from 'expo-router'
import { updateProfile } from '@/services/profiles'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const GettingStarted = () => {
    const { profile, refreshProfile } = useAuthContext()
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [error, setError] = useState<boolean>(false)

    async function handleSubmit() {
        if(firstName === "" || lastName === "") {
            setError(true)
        } else {
            const payload = {
                first_name: firstName,
                last_name: lastName
            }
            const { data, error } = await updateProfile(profile.id, payload)
            if(data) {
                await refreshProfile()
                router.replace("/(tabs)/account")
            }
            if (error) throw Error(error.message)
        }
    }

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Let's get to know each other!</Text>
                    <Text style={styles.subtitle}>Before we get started, please tell us your name.</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.label}>First Name</Text>
                        <AccountField 
                            placeholder={'Enter your first name'} 
                            value={firstName} 
                            setValue={setFirstName} 
                            isEdit={true}
                        />
                    </View>

                    <View style={styles.fieldWrapper}>
                        <Text style={styles.label}>Last Name</Text>
                        <AccountField 
                            placeholder={'Enter your last name'} 
                            value={lastName} 
                            setValue={setLastName} 
                            isEdit={true}
                        />
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Please do not leave fields blank.</Text>
                        </View>
                    )}
                </View>

                <View style={styles.footerContainer}>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={handleSubmit}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.buttonText}>Let's Go!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default GettingStarted

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingBottom: 40,
    },
    headerContainer: {
        marginTop: 20,
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 24,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    fieldWrapper: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    errorText: {
        color: '#b91c1c',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    footerContainer: {
        marginTop: 'auto',
    },
    button: {
        backgroundColor: '#4f46e5',
        borderRadius: 12,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
        width: width - 48,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
})