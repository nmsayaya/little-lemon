import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ActivityIndicator, View, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigators from './screens/navigators/RootNavigators';
import { AuthContext } from './components/Context';

import OnboardingScreen from './screens/OnboardingScreen';
import Profile from './screens/Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { INITIAL_STATE, stateReducer } from './components/ReducerFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator()


export default function App() {

  const [state, dispatch] = React.useReducer(stateReducer, INITIAL_STATE)
  const [firstName, setFirstName] = React.useState('')
  const [email, setEmail] = React.useState('')

  const authContext = React.useMemo(() => ({
    signIn: async(firstName, email) => {
      // setIsLoading(false)
      // setUserToken('nms')
      let userToken;
      userToken = null;
      
        if (firstName === 'Najeeb' && email === 'nmsayaya@gmail.com') {
          try {
            userToken = 'nms'
          const myUser = {
                userToken: userToken,
                firstName: firstName,
                email: email
            }
            
            await AsyncStorage.setItem('user', JSON.stringify(myUser))
          } catch (e) {
           console.error(e)
          }
    }
      dispatch({ type: 'SIGNIN', firstName: firstName, email: email, token: userToken})
    },
    signOut: async () => {
      try {
        await AsyncStorage.removeItem('user')
      } catch (e) {
        console.error(e)
      }
      dispatch({ type: 'SIGNOUT'})
    },
  }))

  // const [isLoading, setIsLoading] = React.useState(true)
  // const [userToken, setUserToken] = React.useState(null)

  React.useEffect(() => {
    setTimeout( async () => {
      // setIsLoading(false)
      let userData;
      userData = null;
      let userToken = null;
      try {
        const getUserToken = await AsyncStorage.getItem('user')
        const userTokenParse = JSON.parse(getUserToken) 
        userData = userTokenParse
        userToken = userData.userToken
        setFirstName(userData.firstName)
        setEmail(userData.email)
        // console.log(userData)
      } catch (e) {
        console.error(e)
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken})
    }, 1000)
  }, [state.firstName, state.email])

  if (state.isLoading) {
    return (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator size={'large'}/>
        <Text style={{ color: '#495E57'}}>Loading your Little Lemon...</Text>
      </View>
    )
  }
   return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {
            state.userToken === null 
            ? 
            (
              <Stack.Screen name='Onboarding' component={OnboardingScreen}/>
            )
            :
            (
              <Stack.Screen name='Profile' >
                {(props) => <Profile {...props} firstName={firstName} email={email}/>}
              </Stack.Screen>
            )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
   )

}

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F8F7',
  },
  indicatorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
