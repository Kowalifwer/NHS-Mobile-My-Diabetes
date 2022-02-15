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
import ConditionalProfileView from '../components/ConditionalProfileView';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import {user_struct} from '../global_structures.js'

export default function ProfileSetup({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)
    console.log("xd")

    DropDownPicker.setListMode("SCROLLVIEW");
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
        try {
            console.log(dynamic_user)
            await AsyncStorage.setItem('UserData', JSON.stringify(dynamic_user));
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }

    }
      
      const [health_type_open, setOpen] = useState(false);
      const [health_type_value, setValue] = useState(null);
      const [health_type, setHealthType] = useState([
        {label: 'I manage my diabetes through diet only or I have pre-diabetes', value: '1'},
        {label: 'I only take tablets for my diabetes', value: '2'},
        {label: 'I inject insulin for my diabetes', value: '3'},
        {label: '--Deselect--', value: '4'},
      ])

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Profile setup page.
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Note that you do not need to fill all the fields. It is recommended though since it will allow us to prefil data for you in other places,
                        such as any documents or diaries that you create within the app.
                    </Text>

                    <Text style={{fontSize: 20, margin: 5, color: "#FF00FF"}}> Please enter your NHS number. If you dont have an NHS number - leave this blank please :)</Text>

                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Enter your NHS Number'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["nhs_number"]:value }), [])}
                    />

                    <Text style={{fontSize: 20, margin: 5, color: "#FF00FF"}}>
                        Please describe which of the options from the list below applies to you the most.
                        Please try to give the most accurate answer, as this decision will tailor how the application will assist you with your diabetes.
                    </Text>

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
                        placeholder="Please select what applies to you the most"
                        open={health_type_open}
                        value={health_type_value}
                        items={health_type}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setHealthType}
                        onChangeValue={(value) => setDynamicUser(state => ({ ...state, ["health_type"]:value }), [])}
                    />

                    <ConditionalProfileView style={styles.body} account_type = {health_type_value} setData={setData} setDynamicUser={setDynamicUser}/>

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 200}}>
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