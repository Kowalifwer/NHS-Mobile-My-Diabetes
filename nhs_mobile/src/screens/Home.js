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
import HomePageButton from '../components/HomePageButton';
import GlobalStyle from '../styles/GlobalStyle';
import Header from '../components/Header';
import {user_struct} from '../global_structures.js';
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

    return (
        <SafeAreaView style={styles.outerContainer}>
            <Header></Header>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                    Welcome {stored_user.name}!
            </Text>

            <View style={styles.innerContainer}>

                {/* Column 1 of buttons */}
                <View style={styles.button}>
                    
                    <HomePageButton
                        title='My Profile'
                        onPressFunction={() => navigation.navigate("MyProfile")}
                    />
                    <HomePageButton
                        title='Email my Results'
                        onPressFunction={() => navigation.navigate("Email", {
                            stored_user: stored_user,
                        })}
                    />
                    <HomePageButton
                        title='Resources'
                        onPressFunction={() => navigation.navigate("Resources")}
                    />

                   

                </View>

                {/* Column 2 of buttons */}
                <View style={styles.button}>
                    <HomePageButton
                            title="My Diaries"
                            onPressFunction={() => navigation.navigate("Diaries")}
                    />       
                    <HomePageButton
                            title="Videos"
                            onPressFunction={() => navigation.navigate("Videos")}
                    />   
                    <HomePageButton
                            title="My Care Processes"
                            onPressFunction={() => navigation.navigate("CareProcess")}
                    />   
                    <HomePageButton
                            title="Settings"
                            onPressFunction={() => navigation.navigate("Settings")}
                    />                   

                </View>

            </View>   

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    innerContainer: {
        flex: 1,
        //alignItems: 'center',
        backgroundColor: '#e9c5b4',
        flexDirection: 'row',
    },
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e9c5b4',
        flexDirection: 'column',
    },
    text: {
        fontSize: 35,
        marginTop: 1,
        marginBottom: 20,
        textAlign: 'center',
    },
    button : {
        display: 'flex',
        flexDirection: 'column',
        paddingBottom : 100,
    },
    
})