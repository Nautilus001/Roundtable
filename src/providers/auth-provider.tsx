import React, { useEffect, useState } from 'react'
import { AuthContext } from '@/contexts/auth-context'
import { supabase } from '@/services/supabase'
import { fetchProfile } from '@/services/profiles'
import { getAuthSessionData, signInWithEmail, signUpWithEmail, signOutUser } from '@/services/auth'
import { Alert } from 'react-native'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [claims, setClaims] = useState<Record<string, any> | null | undefined>(null)
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)

    async function fetchUserDataAndClaims(isFirstRun=false) {
        setLoading(true)

        const { data, error } = (await getAuthSessionData())

        if(error) {
            console.error("Get Session Data failed: ", error)
            setClaims(null)
            setProfile(null)
            return
        }

        if (data && data.claims) {
            setClaims(data.claims)

            const { data: profileData, error } = await fetchProfile(data.claims.sub)
            
            if (error) {
                console.error("Error fetching profile:", error)
            }
            
            setProfile(profileData)
        }

        if (isFirstRun) setIsInitialized(true)
        setLoading(false)
    }

    useEffect(() => {
        fetchUserDataAndClaims(true)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchUserDataAndClaims(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    async function register(emailParam: string, passwordParam: string) {
            setLoading(true)
            const {data, error} = await signUpWithEmail(emailParam, passwordParam)
            if(error) console.error("Error in register signing up with email")
            const {data: d, error: e} = await signInWithEmail(emailParam, passwordParam)
            if(error) console.error("Error in register signing in with email")
            setLoading(false)
            return { d, error: null }
    }

    async function login(emailParam: string, passwordParam: string) {
        try {
            setLoading(true)
            const data = await signInWithEmail(emailParam, passwordParam)
            return { data, error: null }
        } catch (e: any) {
            throw Error(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function signout() {
        try {
            setLoading(true)
            await signOutUser()
        } catch (e: any) {
            console.error("Error signing out: ", e.message)
            Alert.alert(e.message)
        } finally {
            setLoading(false)
        }
    }

    async function refreshProfile() {
        if (claims?.sub) {
            setLoading(true)
            try {
                const { data: profileData, error } = await fetchProfile(claims.sub)
                if (error) console.error("Error refreshing profile:", error)
                setProfile(profileData)
            } catch (error) {
                console.error("Unexpected error refreshing profile:", error)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <AuthContext.Provider value={{ claims, profile, isLoading, isInitialized, login, register, signout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}