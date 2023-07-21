import * as React from 'react'
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import OnboardingScreen from '../OnboardingScreen'
import Profile from '../Profile'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator();

export default function RootNavigators() {

    return (
        <Stack.Navigator>
            <Stack.Screen name='Onboarding' component={OnboardingScreen} />
            <Stack.Screen name='Profile' component={Profile} />
        </Stack.Navigator>
    )
}