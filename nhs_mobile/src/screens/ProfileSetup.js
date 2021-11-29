import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';

import user_struct from '../global_structures.js'


export default function ProfileSetup({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        try {
            AsyncStorage.getItem('UserData')
                .then(value => {
                    if (value != null) { //in case user profile is already setup.
                        navigation.navigate('Home');
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const setData = async () => {
        if (Object.values(dynamic_user).every(x => x !== '')) {
            try {
                console.log(dynamic_user)
                await AsyncStorage.setItem('UserData', JSON.stringify(dynamic_user));
                navigation.navigate('Home');
            } catch (error) {
                console.log(error);
            }

        } else {
            Alert.alert('Warning!', 'Please write your data.')
            console.log('You have an empty field!')
        }
    }


    return (
        <View style={styles.body} >
            <Header></Header>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                Async Storage Test...
            </Text>
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Enter your name'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Enter your age'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Enter your height (cm)'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Enter your weight (kg)'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Enter your blood typet'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["blood_type"]:value }), [])}
            />
            <CustomButton
                title='Setup your profile!'
                color='#1eb900'
                onPressFunction={setData}
            />

            <Text style={[GlobalStyle.CustomFont, {marginTop: 40, fontSize: 20}]}>Navigation section (testing)</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <CustomButton
                    title='Navigate to Homepage directly'
                    color='#761076'
                    onPressFunction={() => navigation.navigate("Home")}
                />
                <CustomButton
                    title='Go to Authentication'
                    color='#761076'
                    onPressFunction={() => navigation.navigate("Authentication")}
                    />
            </View>
            
        </View>
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
    },
})