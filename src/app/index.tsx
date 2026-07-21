import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuthContext } from '@/hooks/use-auth-context'
import LogoFork from '@/components/visual/logo-fork'
import LogoDrink from '@/components/visual/logo-drink'
import LogoFork2 from '@/components/visual/logo-fork-2'
import LogoNegFork from '@/components/visual/logo-fork-negative'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isRegister, setIsRegister] = useState(false)
  const [logo, setLogo] = useState(0)
  const { login, register} = useAuthContext()
  const logos = [<LogoDrink />, <LogoFork />, <LogoFork2 />, <LogoNegFork />]

  const router = useRouter()

  const handleRotate = () => {
    setLogo((logo + 1) % logos.length)
  }

  const handleSubmit = async () => {
    setError(null)
    if(isRegister){
      try {
        await register(email, password)
        setIsRegister(false)
        router.replace("/getting-started")
      } catch (error: any) {
        setError(error.message)
        setIsRegister(true)
      }
    } else {
      try {
        await login(email, password)
        router.replace("/account")
      } catch (error: any) {
        setError(error.message)
      }
    }
  }

  function handleSwitch() {
    setIsRegister(!isRegister)
    setError(null)
    setEmail("")
    setPassword("")
  }

  return (
    <SafeAreaView  style={styles.container}>
      <View>

        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={handleRotate}>
            {logos[logo]}
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>{isRegister ? "Sign Up" : "Login"}</Text>
          </TouchableOpacity>

          {error &&
          <View style={styles.buttonSecondary}>
          <Text style= {styles.errorText}>An error has occurred: {error}</Text>
          </View>}

          
          <TouchableOpacity style={styles.buttonSecondary} onPress={handleSwitch}>
            <Text> {isRegister ? "Been here before?" : "New here?" } </Text>
            <Text style={styles.buttonSecondaryText}>{isRegister ? "Login" : "Sign Up!"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    padding: 20      
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSecondary: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  errorText: {
    color: '#d61d1d',
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
  }
})