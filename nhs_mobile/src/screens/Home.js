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
import HomePageButtonSlim from '../components/HomePageButtonSlim';
import GlobalStyle from '../styles/GlobalStyle';
import Header from '../components/Header';
import {user_struct} from '../global_structures.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';

export default function Home({ navigation, route }) {
    const [stored_user, setStoredUser] = useState(user_struct);
    const [videoJSON,setVideoJSON] = useState(null);
    
    useEffect(() => {
        getUserData();
        fetch_videos().then(result => {setVideoJSON(result)}).catch(error => Alert.alert(error.message))
    }, []);

    // uses NoCodeAPI to fetch all the video names and id's from youtube channel. 
    const fetch_videos = () => {
        var videoDetails = [];
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var requestOptions = {
            method: "get",
            headers: myHeaders,
            redirect: "follow",
        };
        
        return fetch("https://v1.nocodeapi.com/deploymenttest/yt/TComXwmzFWMJVSIK/channelVideos?maxResults=50", requestOptions) //the https link is the API Key
        .then(response => response.json())
        .then(result => {
            
            for (var entry=0; entry<result.items.length; entry++) {
                 videoDetails.push({
                        id: result.items[entry].snippet.resourceId.videoId,
                        name: result.items[entry].snippet.title,
                    })
            }
            return videoDetails;
        })
        .catch(error => {throw new Error(error)})
    }

    const validateVideo = (section) => {
        (videoJSON == null) ? Alert.alert("Videos are loading, try again") :  navigation.navigate(section, {
            video: videoJSON,
            stored_user: stored_user
        })
    }

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
            
            <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Blue]}>
                    Welcome, {stored_user.name}!
            </Text>

            

            <View style={styles.innerContainer}>

                {/* Column 1 of buttons */}
                <View>
                    
                    <HomePageButton
                        title='My Profile'
                        onPressFunction={() => navigation.navigate("MyProfile")}
                    />
                    <HomePageButton
                        title='Email my Results'
                        onPressFunction={() => validateVideo("Email")}
                    />
                    <HomePageButton
                        title='myResults'
                        onPressFunction={() => validateVideo("Results")}
                    />

                </View>

                {/* Column 2 of buttons */}
                <View>
                    <HomePageButton
                            title="My Diaries"
                            onPressFunction={() => validateVideo("Diaries")}
                    />       
                    <HomePageButton
                            title="Videos"
                            onPressFunction={() => validateVideo("Videos")}
                    />   
                    <HomePageButton
                        title='Resources'
                        onPressFunction={() => navigation.navigate("Resources")}
                    />
                </View>
            </View>  

            <View >
                <HomePageButtonSlim
                    title="Settings"
                    onPressFunction={() => navigation.navigate("Settings")}
                />   
            </View> 
            

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    innerContainer: {
        alignItems: 'center',
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
})