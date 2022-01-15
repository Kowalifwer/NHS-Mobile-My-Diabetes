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
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import user_struct from '../global_structures.js'


export default function FoodDiary({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        try {
            AsyncStorage.getItem('FoodDiary')
                .then(value => {
                    if (value == null) { //in case user profile is already setup.
                        console.log("food diary does not exist yet");
                    }
                })
        } catch (error) {
            console.log("food diary getItem error");
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
      
      const [blood_type_open, setOpen] = useState(false);
      const [blood_type_value, setValue] = useState(null);
      const [blood_type, setBloodType] = useState([
        {label: 'A', value: 'A'},
        {label: 'B', value: 'B'},
        {label: 'O', value: 'O'},
        {label: 'AB', value: 'AB'}
      ])

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Profile setup page.
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
                    <DropDownPicker
                        dropDownDirection="BOTTOM"
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
                        placeholder="Select your blood group"
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
                        title='Setup your profile!'
                        color='#1eb900'
                        onPressFunction={setData}
                    />

                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100}}>
                        <CustomButton
                            title='Go to Homepage directly'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Home")}
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
        fontSize: 30,
        marginBottom: 130,
        textAlign: "center",
    },
})