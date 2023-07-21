import * as React from 'react'
import { Text, View, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image, TextInput, Button, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'

import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import CheckBox from 'expo-checkbox'
import { MaskedTextInput } from 'react-native-mask-text'

import { AuthContext } from '../components/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import OnboardingScreen from './OnboardingScreen'
// import AsyncStorage from '@react-native-async-storage/async-storage'

// Initial states for checkboxes
const initialState = {
    orderStatuses: false,
    passwordChanges: false,
    specialOffers: false,
    newsletter: false
}


export default function Profile (props) {
    
    const [imagePath, setImagePath ] = React.useState(null)
    const [state, setState ] = React.useState(initialState)
    const [firstName, setFirstName] = React.useState('')
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [lastName, setLastName] = React.useState(null)

    const [isLoading, setIsLoading] = React.useState(true)

    const { signOut } = React.useContext(AuthContext)
    
    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        imagePath: imagePath
    }

    const initialStateData = {
        orderStatuses: state.orderStatuses,
        passwordChanges: state.passwordChanges,
        specialOffers: state.specialOffers,
        newsletter: state.newsletter
    }
    const firstData = ['user', JSON.stringify(userData)]
    const secondData = ['checkbox', JSON.stringify(initialStateData)]

    // function setValueFunc (value, setValue) {
    //     return setValue(value)
    // }

    const getData = async () => {
        try {
            const user = await AsyncStorage.multiGet(['user', 'checkbox'])
            const userPersonalData = JSON.parse(user[0][1])
            const userCheckbox = JSON.parse(user[1][1])
            // console.log(userPersonalData.lastName)

            if (userPersonalData.lastName != undefined) {
                setLastName(userPersonalData.lastName)
            }
            if (userPersonalData.imagePath != undefined ) {
                setImagePath(userPersonalData.imagePath)
            }
            
            if (userPersonalData.phoneNumber != undefined) {
                const userPhoneNumber = userPersonalData.phoneNumber
                setPhoneNumber(userPhoneNumber)
            } 
            if (userCheckbox != null) {
                setState ({
                    orderStatuses: userCheckbox.orderStatuses,
                    passwordChanges: userCheckbox.passwordChanges,
                    specialOffers: userCheckbox.specialOffers,
                    newsletter: userCheckbox.newsletter
                })
            }
            console.log(userPersonalData)

        } catch (e) {
            Alert.alert('Failed to fetch data!')
            console.log(e)
        }
    }

    React.useEffect(() => {
        getData()
    }, [])

    const saveData = async () => {
        try {

            await AsyncStorage.multiSet([firstData, secondData])
            alert('Data successfully saved!')
        } catch {
            alert('Failed to saved data!')
        }
    }

    const removeData = async () => {
        try {
            await AsyncStorage.multiRemove(['user', 'checkbox'])
        } catch (e) {
            console.error(e)
        }
    }
    // React.useEffect(() => {
    //     saveData()
    // }, [])

        setTimeout(() => {
            setEmail(props.email)
            setFirstName(props.firstName)

            {email && firstName === '' ? setIsLoading(true) : setIsLoading(false)}
        }, 3000);

    const showImagePicker = async () =>{ 
        // Ask the user for the permission to access the media library
        const permissionResult = 
        ImagePicker.requestMediaLibraryPermissionsAsync();

        if ((await permissionResult).granted === false) {
            alert("You have refused to allow this app to access your photos!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        // explore the result
        // console.log(result)

        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
            // console.log(result.assets[0].uri)
        }
    }

    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await 
        ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('You have refused to allow this app to access your camera!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync()

        //Explore the result
        console.log(result)

        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
            // console.log(result.assets[0].uri)
        }
    }

    if (isLoading) {
        return (
          <View style={styles.indicatorContainer}>
            <ActivityIndicator size={'large'}/>
            <Text style={{ color: '#495E57'}}>Loading your profile...</Text>
          </View>
        )
      }

      const imagePlaceholder = () => {
        return (
            <View>
                <Text style={{ color: 'white', fontSize: 17 }}>
                    {firstName[0]+ (lastName !== null && lastName !== '' ? lastName[0] : '')}
                </Text>
            </View>
        )
      }

    const consoleLogger = () => {
        console.log(phoneNumber)
    }

    return (
        <KeyboardAvoidingView 
        style={ styles.container }
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView>
                <Button 
                title='Log'
                onPress={() => {consoleLogger()}}
                />
                <View style={styles.headerWrapper}>
                    <View style={ styles.backIcon}>
                        <Ionicons name='arrow-back' size={25} color={'white'}/>
                    </View>
                    <Image 
                    style={styles.logo}
                    source={require('../img/Logo.png')}
                    />
                    <View style={ styles.headerAvatar }>
                    {
                        imagePath !== null ?
                        <Image 
                        source={{ uri: imagePath}}
                        style={{ width: 40, height: 45, resizeMode: 'cover', borderRadius: 100 }}
                        /> :
                        <View style={styles.headerAvatarPlaceholder}> 
                        <Text>   
                            {imagePlaceholder()}
                        </Text>
                        </View>
                    }

                    </View>
                </View>
                <View style={styles.personalInfo}>
                    <Text style={styles.infoHeader}>Personal information</Text>
                    <Text style={styles.inputFieldsTitle}>Avatar</Text>
                    <View style={styles.personalInfoFirstRowWrapper}>
                        <View style={ styles.personalInfoAvatar }>
                        {
                            imagePath !== null ?
                            <Image 
                            source={{ uri: imagePath}}
                            style={{ width: 60, height: 63, resizeMode: 'cover', borderRadius: 100}}
                            /> :
                            <View style={styles.personalInfoAvatarPlaceholder}> 
                                <Text>   
                                    {imagePlaceholder()}
                                </Text>
                            </View>

                        }

                        </View>
                        <TouchableOpacity 
                        style={styles.changeButton}
                        onPress={() => {showImagePicker()}}
                        >
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.removeButton}>
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </View>
                        
                    <View style={styles.inputFieldWrapper}>
                        <Text style={styles.inputFieldsTitle}>First name</Text>
                        <TextInput 
                        style={styles.inputFields}
                        value={firstName}
                        onChangeText={(data) => {setFirstName(data)}}
                        editable={false}
                        />
                    </View>
                    <View style={styles.inputFieldWrapper}>
                        <Text style={styles.inputFieldsTitle}>Last name</Text>
                        <TextInput 
                        style={styles.inputFields}
                        value={lastName}
                        onChangeText={setLastName}
                        />
                    </View>
                    <View style={styles.inputFieldWrapper}>
                        <Text style={styles.inputFieldsTitle}>Email</Text>
                        <TextInput 
                        style={styles.inputFields}
                        value={email}
                        onChangeText={(data) => {setEmail(data)}}
                        editable={false}
                        />
                    </View>
                    <View style={styles.inputFieldWrapper}>
                        <Text style={styles.inputFieldsTitle}>Phone number</Text>
                        <MaskedTextInput
                        mask='+1 (999) 999-9999' 
                        style={styles.inputFields}
                        value={phoneNumber}
                        onChangeText={(phoneNumber) => {setPhoneNumber(phoneNumber)}}
                        placeholder='+1 ([000]) [000]-[0000]'
                        keyboardType='numeric'
                        />
                    </View>
                    <View>
                        <Text style={styles.emailNotificationHeader}>Email notification</Text>
                        <View style={styles.checkboxWrapper}>
                            <CheckBox 
                            value={state.orderStatuses}
                            onValueChange={value => 
                            setState({
                                ...state,
                                orderStatuses: value
                            })
                            }
                            />
                            <Text style={styles.checkboxText}>Order statuses</Text>
                        </View>
                        <View style={styles.checkboxWrapper}>
                            <CheckBox 
                            value={state.passwordChanges}
                            onValueChange={value => 
                            setState({
                                ...state,
                                passwordChanges: value
                            })
                            }
                            />
                            <Text style={styles.checkboxText}>Password changes</Text>
                        </View>
                        <View style={styles.checkboxWrapper}>
                            <CheckBox 
                            value={state.specialOffers}
                            onValueChange={value => 
                            setState({
                                ...state,
                                specialOffers: value
                            })
                            }
                            />
                            <Text style={styles.checkboxText}>Special offers</Text>
                        </View>
                        <View style={styles.checkboxWrapper}>
                            <CheckBox 
                            value={state.newsletter}
                            onValueChange={value => 
                            setState({
                                ...state,
                                newsletter: value
                            })
                            }
                            />
                            <Text style={styles.checkboxText}>Newsletter</Text>
                        </View>
                        
                    </View>
                    <TouchableOpacity 
                    style={styles.logOutButton}
                    onPress={() => {
                        signOut();
                        removeData();
                    }}
                    >
                        <Text style={styles.logOutButtonText}>Log out</Text>
                    </TouchableOpacity>
                    <View style={styles.discardAndSaveButtonsWrapper}>
                    <TouchableOpacity style={styles.discardChangesButton}>
                        <Text style={styles.removeButtonText}>Discard changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    style={styles.saveChangesButton}
                    onPress={saveData}
                    >
                        <Text style={styles.changeButtonText}>Save changes</Text>
                    </TouchableOpacity>
                    </View>
                    
                </View>

                {/* <Text>Profile Page</Text>
                <Pressable 
                    style={styles.signOutButton}
                    onPress={() => {showImagePicker()}}
                    >
                <Text style={styles.buttonText}>Pick Image</Text>
                </Pressable> */}

                {/* <View 
                style={styles.logoWrapper}
                >
                    {
                        imagePath !== null && 
                        <Image 
                        source={{ uri: imagePath}}
                        style={{ width: 100, height: 100, resizeMode: 'cover'}}
                        />
                    }
                </View> */}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerWrapper: {
        backgroundColor: 'white',
        alignItems: 'flex-start',
        paddingBottom: 10,
        paddingTop: 20,
        flexDirection: 'row'
    }, 
    logo: {
        height: 40,
        width: 185,
        marginLeft: 50,
    },
    signOutButton: {
        backgroundColor: '#C6C6C6', 
        marginTop: 50,
        width: 110,
        marginLeft: 220,
        alignItems: 'center',
        padding: 7,
        borderRadius: 4
    },
    backIcon: {
        backgroundColor: '#495E57', 
        borderRadius: 100, 
        width: 35, 
        height:35, 
        alignContent: 'center', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginLeft: 10
    },
    headerAvatar: {
        width: 40,
        height: 45,
        borderRadius: 100,
        marginLeft: 25,
        justifyContent: 'center'
    },
    personalInfoAvatar: {
        width: 60,
        height: 63,
        borderRadius: 100,
        marginTop: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'lightgrey',
        justifyContent: 'center'
    },
    headerAvatarPlaceholder: {
        width: 40,
        height: 45,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgreen'
    },
    personalInfoAvatarPlaceholder: {
        width: 60,
        height: 63,
        borderRadius: 100,
        justifyContent: 'center',
        backgroundColor: 'lightgreen',
        alignItems: 'center'
    },
    personalInfo: {
        borderStyle: 'solid',
        borderColor: 'lightgrey',
        borderWidth: 1,
        margin: 10,
        borderRadius: 10,
        paddingTop: 20,
        paddingBottom: 40,
        paddingLeft: 13,
        paddingRight: 13,
    },
    infoHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000'
    },
    inputFields: {
        borderStyle: 'solid',
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 5,
        height: 34,
        padding: 5
    },
    inputFieldWrapper: {
        marginTop: 4,
    },
    inputFieldsTitle: {
        color: '#495E57',
        fontWeight: '700',
        marginBottom: 5,
        marginTop: 20
    },
    personalInfoFirstRowWrapper: {
        flexDirection: 'row',
       alignContent: 'center',
       alignItems: 'center',
    },
    changeButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: 'lightblue',
        marginLeft: 20,
        height: 40,
        width: 95,
        backgroundColor: '#495E57'
    },
    removeButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginLeft: 20,
        height: 40,
        width: 95,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#495E57',
    },
    changeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
    },
    removeButtonText: {
        color: '#495E57',
        fontWeight: 'bold',
        fontSize: 15,
    },
    emailNotificationHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 20,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        marginTop: 20
    },
    checkboxText: {
        color: '#495E57',
        marginLeft: 10,
    },
    logOutButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 30,
        borderRadius: 10,
        height: 33,
        width: 310,
        backgroundColor: '#FACE14',
        borderWidth: 1,
        borderColor: 'orange'
    },
    logOutButtonText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,
    },
    discardChangesButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#495E57',
        marginLeft: 20,
        height: 35,
        width: 130,
    },
    saveChangesButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#495E57',
        backgroundColor: 'lightblue',
        marginLeft: 20,
        height: 35,
        width: 120,
        backgroundColor: '#495E57'
    },
    discardAndSaveButtonsWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 35,
    },
    indicatorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }
})