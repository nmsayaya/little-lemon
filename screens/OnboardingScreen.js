import * as React from 'react';
import { Text, TextInput, View, StyleSheet, Image, ScrollView, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { validateEmail } from '../utils'

import { AuthContext } from '../components/Context';

export default function OnboardingScreen(props) {
    const [firstName, setFirstName] = React.useState('')
    const [email, setEmail] = React.useState('')

    const isEmailValid = validateEmail(email)

    // React.useEffect(() => {
    //     (async () => {
    //         try {
    //             const savedUserFirstName = await AsyncStorage.getItem('user');
    //             const newName = onChangeFirstName(firstName == null ? [] : JSON.parse(savedUserFirstName))
    //         } catch {}
    //     })
    // }, [])


    // React.useEffect(() => {
    //     (async () => {
    //         try {
    //             await AsyncStorage.setItem('user', JSON.stringify(firstName))
    //         } catch (e) {}
    //     })
    // }, [])

    const { signIn } = React.useContext(AuthContext)

    const loginHandler = (firstName, email) => {
        signIn(firstName, email);
    }

    return (
    <KeyboardAvoidingView style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView style={styles.container}>
            <View style={styles.logoWrapper}>
                <Image 
                style={styles.logo}
                source={require('../img/Logo.png')}
                />
            </View>
            <Text style={styles.introText}>Let us get to know you.</Text>
            <View style={styles.texInputWrapper}>
                <Text style={styles.nameText}>First Name</Text>
                <TextInput
                style={styles.TextInput}
                value={firstName}
                onChangeText={setFirstName}
                />
                <Text style={styles.nameText}>Email</Text>
                <TextInput
                style={styles.TextInput}
                value={email}
                onChangeText={setEmail}
                />
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity 
                style={ isEmailValid && firstName ? styles.nextButtonValid : styles.nextButtonInValid }
                disabled={!isEmailValid}
                onPress={() => {loginHandler(firstName, email)}}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C6C6C6',
    },
    logoWrapper: {
        backgroundColor: '#DFDDDD',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 20
    }, 
    logo: {
        height: 40,
        width: 185,
    },
    introText: {
        color: '#495E57',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 30
    },
    TextInput: {
        borderWidth: 1,
        borderColor: '#495E57',
        width: 250,
        borderRadius: 6,
        height: 40,
        padding: 5
    },
    texInputWrapper: {
        alignItems: 'center',
        marginTop: 100,
        paddingBottom: 20
    },
    nameText: {
        color: '#495E57',
        fontSize: 20,
        marginBottom: 10,
        marginTop: 10
    }, 
    nextButtonValid: {
        backgroundColor: '#C6C6C6', 
        marginTop: 50,
        width: 110,
        marginLeft: 220,
        alignItems: 'center',
        padding: 7,
        borderRadius: 4
    },
    nextButtonInValid: {
        backgroundColor: 'grey', 
        marginTop: 50,
        width: 110,
        marginLeft: 220,
        alignItems: 'center',
        padding: 7,
        borderRadius: 4
    },
    buttonText: {
        fontSize: 20,
        color: '#495E57'
    },
    buttonWrapper: {
        backgroundColor: '#E6F8F7',
        paddingBottom: 60
    }
})