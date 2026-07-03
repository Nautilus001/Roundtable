import { StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthContext } from '@/hooks/use-auth-context'
import AccountField from '@/components/account/account-field'
import SignOutButton from '@/components/auth/sign-out-button'
import Spacer from '@/components/utility/spacer'
import { supabase } from '@/services/supabase'
import { router } from 'expo-router'
import { deleteProfile, ProfileUpdateType, updateProfile } from '@/services/profiles'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

const AccountView = () => {
    const { profile } = useAuthContext()
    const [firstName, setFirstName] = useState<string>(profile?.first_name ?? "")
    const [lastName, setLastName] = useState<string>(profile?.last_name ?? "")
    const [username, setUserName] = useState<string>(profile?.username ?? "")
    const [fieldError, setFieldError] = useState<boolean>(false)
    const [requestError, setRequestError] = useState<boolean>(false)
    const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false)

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name)
            setLastName(profile.last_name)
            setUserName(profile.username)
        }
        setIsUpdateMode(false)
    }, [profile])

    async function handleUpdate() {
        setFieldError(false)
        setRequestError(false)

        if(isUpdateMode) {
            if(firstName === "" || lastName === "" || username === "") {
                setFieldError(true)
                return
            }
        }

        setIsUpdateMode(!isUpdateMode)

        const payload: ProfileUpdateType = {
            first_name: firstName, 
            last_name: lastName, 
            username: username
        }

        try {
            await updateProfile(profile.id, payload)
        } catch (error: any) {
            setRequestError(true)
        }  
    }

    async function handleDelete() {
        try {
            deleteProfile(profile.id)
            supabase.auth.signOut()
        } catch (error: any) {
            setRequestError(true)
        } 
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.welcomeLabel}>Welcome,</Text>
                <Text style={styles.emailText}>{profile?.email ?? "Anonymous"}</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>Username</Text>
                    <AccountField 
                        placeholder="Username"
                        value={username}
                        setValue={setUserName}
                        isEdit={isUpdateMode}
                    />
                </View>

                <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>First Name</Text>
                    <AccountField 
                        placeholder="First Name"
                        value={firstName}
                        setValue={setFirstName}
                        isEdit={isUpdateMode}
                    />
                </View>

                <View style={styles.fieldWrapper}>
                    <Text style={styles.fieldLabel}>Last Name</Text>
                    <AccountField 
                        placeholder="Last Name"
                        value={lastName}
                        setValue={setLastName}
                        isEdit={isUpdateMode}
                    />
                </View>
            </View>
            {fieldError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Please do not leave fields blank.</Text>
                </View>
            )}
            {requestError && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error handling request. Try again soon.</Text>
                </View>
            )}
            
            <Spacer />

            <View style={styles.footerActions}>
                <TouchableOpacity 
                    style={[styles.actionButton, isUpdateMode ? styles.saveButton : styles.editButton]} 
                    onPress={handleUpdate}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.actionButtonText, isUpdateMode ? styles.saveButtonText : styles.editButtonText]}>
                        {isUpdateMode ? "Update :)" : "Make Changes"}
                    </Text>
                </TouchableOpacity>
                {isUpdateMode && 
                    <TouchableOpacity 
                        style={styles.errorContainer} 
                        onPress={handleDelete}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.errorText}>
                            {"Delete Account"}
                        </Text>
                    </TouchableOpacity>
                }
                
                <SignOutButton />
            </View>
        </SafeAreaView>
    )
}

export default AccountView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 32,
    },
    headerContainer: {
        marginBottom: 32,
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    welcomeLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    emailText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    fieldWrapper: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4b5563',
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
    footerActions: {
        gap: 12,
        marginTop: 'auto',
    },
    actionButton: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 48,
    },
    editButton: {
        backgroundColor: '#4f46e5',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    saveButton: {
        backgroundColor: '#10b981',
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    editButtonText: {
        color: '#ffffff',
    },
    saveButtonText: {
        color: '#ffffff',
    },
})