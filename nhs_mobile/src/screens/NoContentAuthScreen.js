import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Alert,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NoContentAuthScreen({ navigation, route }) {
    const [authenticate_attempts, setAuthenticateAttempts] = React.useState(0); //-1 MEANS ACCESS GRANTED
    const relevant_redirect = () => {
        AsyncStorage.getItem('UserData')
        .then(value => {
            if (value != null) { //in case user profile is already setup.
                return navigation.navigate('Home');
            }
            return navigation.navigate('ProfileSetup');
        })
    }

    useEffect(() => {
        const auth = async () => {
            console.log("Authenticating...")
            let compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) throw 'This device is not compatible for biometric authentication';
        
            // let enrolled = await LocalAuthentication.isEnrolledAsync();
            // if (!enrolled) return relevant_redirect();
            
            let auth_prompt = (authenticate_attempts == 0) ? 'Welcome back!\n Please authenticate to access the app.' : `Attempt ${authenticate_attempts} of 5. \nPlease authenticate yourself.`;
            let result = await LocalAuthentication.authenticateAsync({
                promptMessage: auth_prompt
            })

            if(result.success){
                setAuthenticateAttempts(-1);
                relevant_redirect();
            } else {
                setAuthenticateAttempts(authenticate_attempts + 1);
                return false;
            }
        }
        console.log("Authentication Attempts: " + authenticate_attempts);
        if (authenticate_attempts >= 5) return;
        if (authenticate_attempts != -1) auth();
    }
    , [authenticate_attempts])

    return (
        <SafeAreaView style={GlobalStyle.BodyGeneral}>

            <ScrollView>

                <View style={GlobalStyle.BodyGeneral}>

                    <Header></Header>

                    {(authenticate_attempts >= 5) && 
                        <Text style={[GlobalStyle.CustomFont, GlobalStyle.ErrorColor, {marginHorizontal: 10, textAlign:"center"}]}> You have failed to authenticate 5 times. Please restart the App and try again! </Text>
                    }
                    
                </View>

            </ScrollView>

        </SafeAreaView>
    )
}