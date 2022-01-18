import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TextInput,
    SafeAreaView,
    ScrollView,
    StatusBar
} from 'react-native';
import CustomButton from '../components/CustomButton';
import GlobalStyle from '../styles/GlobalStyle';
import Header from '../components/Header';
import user_struct from '../global_structures.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';

export default function Home({ navigation, route }) {
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
        navigation.navigate("Authentication")
      }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text,{fontSize: 50, color: "lime"}]}>
                        Homepage
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Welcome {stored_user.name} !
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        What would you like to do ?
                    </Text>

                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100}}>
                        <CustomButton
                            title='View/Update your profile'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("ProfileUpdate")}
                        />
                        <CustomButton
                            title='Setup email recipients'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("EmailSetup")}
                        />
                        <CustomButton
                            title='Send an email'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Email")}
                        />
                        <CustomButton
                            title='Authenticate yourself'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Authentication")}
                        />
                        <CustomButton
                            title='Read a barcode'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("BarcodeScanner")}
                        />
                        <CustomButton
                            title='Wipe all local data (warning)'
                            color='red'
                            onPressFunction={clearAll}
                        />
                    </View>
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
        fontSize: 25,
        margin: 10,
        textAlign: 'center',
    },
})