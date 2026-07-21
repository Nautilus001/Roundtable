import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {GatheringForm} from '@/components/gathering/gathering-form'
import { Gathering } from '@/models/gathering'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { globalStyle } from '@/styles'

const CreateGathering = () => {

    const { createGathering } = useGatheringContext()

    const handleSubmit = async (payload: Gathering) => {
        try {
            await createGathering(payload)
        } catch (error: any) {
            console.error("Womp womp")
        }
    }

    return (
        <SafeAreaView style={[globalStyle.container, styles.container]}>
            <View style={styles.innerContainer}>
                <GatheringForm onSubmit={handleSubmit} isEdit={true}/>
            </View>
        </SafeAreaView>
    )
}

export default CreateGathering

const styles = StyleSheet.create({
    container: {
        flex: 1,    
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    innerContainer: {
        flex: 1,    
        width: '100%',
        maxWidth: 750,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})