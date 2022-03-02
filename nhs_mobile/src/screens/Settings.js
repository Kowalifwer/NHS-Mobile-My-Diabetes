import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import {user_struct} from '../global_structures.js';


export default function Settings({ navigation }) {
    
    const [stored_user, setStoredUser] = useState(user_struct)

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        try {
            AsyncStorage.getItem('UserData')
                .then(value => {
                    if (value != null) {
                        let user = JSON.parse(value);
                        console.log(user);
                        setStoredUser(user)
                        return user
                    }
                    else {
                        console.log("Profile not set up - redirected to setup page")
                        navigation.navigate("ProfileSetup")
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    var clearAll = async () => {
        try {
          await AsyncStorage.clear()
          console.log('Cleared.')
        } catch(e) {
          // clear error
        }
        
        Alert.alert('All local data wiped. You need to setup profile again.')
        getUserData()
      }

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Settings Page
                    </Text>

                    <CustomButton
                            title='View/Update your profile'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("ProfileUpdate", {
                                stored_user: stored_user,
                            })}
                    />

                    <CustomButton
                            title='Setup email recipients'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("EmailSetup")}
                    />

                    <CustomButton
                            title='Wipe all local data (warning)'
                            color='red'
                            onPressFunction={clearAll}
                    />

                    <CustomButton
                            title='Go to Homepage directly'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Home")}
                    />

                </View>

            </ScrollView>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e9c5b4',
    },
    text: {
        fontSize: 30,
        marginBottom: 130,
        textAlign: "center",
    },
})