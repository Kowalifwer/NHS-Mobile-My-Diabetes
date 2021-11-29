import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    TextInput,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import GlobalStyle from '../styles/GlobalStyle';
import Header from '../components/Header';
import user_struct from '../global_structures.js'


export default function Home({ navigation, route }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)
    const [stored_user, setStoredUser] = useState(user_struct)

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        console.log(dynamic_user)
        
        try {
            AsyncStorage.getItem('UserData')
                .then(value => {
                    if (value != null) {
                        let user = JSON.parse(value);
                        console.log(user);
                        setStoredUser(user)
                        return user
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const updateUserData = async () => {
        console.log("UPDATE DATA")
        console.log(dynamic_user)
        if (Object.values(dynamic_user).every(x => x === null || x === '')) {
            Alert.alert('Warning!', 'Please write your data.')
            console.log("All fields empty!")
        } else {
            try {
                console.log(dynamic_user)
                var user = {...stored_user} //create a safe copy of the local storage user object
                for (const key of Object.keys(user)) { //go over every existing record, and replace it ONLY if the current form input is NOT empty.
                    if (key in dynamic_user && dynamic_user[key].length > 1) 
                        user[key] = dynamic_user[key]
                }

                await AsyncStorage.mergeItem('UserData', JSON.stringify(user));
                getUserData()
                console.log("Data updated")
                Alert.alert('Success!', 'Your data has been updated.');
            } catch (error) {
                console.log(error);
            }
        }
    }

    const removeUserData = async () => {
        try {
            console.log("CLEARED UserData - output below")
            getUserData()
            await AsyncStorage.removeItem("UserData");
            navigation.navigate('ProfileSetup');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.body}>
            <Header></Header>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                Welcome {stored_user.name} !
            </Text>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                You are {stored_user.age} years old.
            </Text>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                Your height is {stored_user.height} cm
            </Text>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                Your weight is {stored_user.weight} kg
            </Text>
            <Text style={[GlobalStyle.CustomFont,styles.text]}>
                Your blood type is {stored_user.blood_type}
            </Text>
            <TextInput
                style={GlobalStyle.InputField}
                placeholder= {"Update your name (currently: '" + stored_user.name + "')"}
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])} //updating the dict
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder={"Update your age (currently: " + stored_user.age + " years old)"}
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder={"Update your height (currently: " + stored_user.height + " cm)"}
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder={"Update your weight (currently: " + stored_user.weight + " kg)"}
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Update your blood typet'
                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["blood_type"]:value }), [])}
            />
            <CustomButton
                title='Update'
                color='#ff7f00'
                onPressFunction={updateUserData}
            />
            <CustomButton
                title='Remove'
                color='#f40100'
                onPressFunction={removeUserData}
            />

            <Text style={[GlobalStyle.CustomFont, {marginTop: 40, fontSize: 20}]}>Navigation section (testing)</Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
                <CustomButton
                    title='Navigate to Profile Setup page directly'
                    color='#761076'
                    onPressFunction={() => navigation.navigate("ProfileSetup")}
                />
                <CustomButton
                    title='Dummy button'
                    color='#761076'
                    onPressFunction={() => console.log("D U M M Y")}
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
        fontSize: 40,
        margin: 10,
    },
})