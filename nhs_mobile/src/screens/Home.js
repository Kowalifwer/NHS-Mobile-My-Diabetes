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
} from 'react-native';
import CustomButton from '../components/CustomButton';
import GlobalStyle from '../styles/GlobalStyle';
import Header from '../components/Header';
import user_struct from '../global_structures.js';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';


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
                    else {
                        console.log("Profile not set up - redirected to setup page")
                        navigation.navigate("ProfileSetup")
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
                    console.log(key)
                    if (key in dynamic_user && dynamic_user[key].length > 0) 
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

    const [blood_type_open, setOpen] = useState(false);
    const [blood_type_value, setValue] = useState(null);
    const [blood_type, setBloodType] = useState([
        {label: 'A', value: 'A'},
        {label: 'B', value: 'B'},
        {label: 'O', value: 'O'},
        {label: 'AB', value: 'AB'}
    ])

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
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
                        placeholder= {"Update your name"}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])} //updating the dict
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder={"Update your age"}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder={"Update your height"}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder={"Update your weight"}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                    />
                    <DropDownPicker
                        style={DropdownStyle.style}
                        containerStyle={DropdownStyle.containerStyle}
                        placeholderStyle={DropdownStyle.placeholderStyle}
                        textStyle={DropdownStyle.textStyle}
                        labelStyle={DropdownStyle.labelStyle}
                        listItemContainerStyle={DropdownStyle.itemContainerStyle}
                        selectedItemLabelStyle={DropdownStyle.selectedItemLabelStyle}
                        selectedItemContainerStyle={DropdownStyle.selectedItemContainerStyle}
                        showArrowIcon={true}
                        showTickIcon={true}
                        placeholder="Update your blood type"
                        open={blood_type_open}
                        value={blood_type_value}
                        items={blood_type}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setBloodType}
                        onChangeValue={(value) => setDynamicUser(state => ({ ...state, ["blood_type"]:value }), [])}
                    />
                    <CustomButton
                        style={{marginTop: 40}}
                        title='Update'
                        color='#ff7f00'
                        onPressFunction={updateUserData}
                    />
                    <CustomButton
                        title='Delete Profile'
                        color='#f40100'
                        onPressFunction={removeUserData}
                    />

                    <Text style={[GlobalStyle.CustomFont, {marginTop: 40, fontSize: 20}]}>Navigation section (testing)</Text>
                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100}}>
                        <CustomButton
                            title='Go to Profile Setup page directly'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("ProfileSetup")}
                        />
                        <CustomButton
                            title='Go to Authentication'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Authentication")}
                        />
                        <CustomButton
                            title='Go to Email'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Email")}
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
        fontSize: 40,
        margin: 10,
    },
})