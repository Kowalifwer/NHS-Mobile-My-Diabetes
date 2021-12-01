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


export default function EmailSetup({ navigation }) {

    const [add_recipient, setAddRecipient] = useState("")
    const [remove_recipient, setRemoveRecipient] = useState("")

    const [email_open, setOpen] = useState(false);
    const [email_value, setValue] = useState(null);
    const [email, setEmail] = useState([])

    useEffect(() => {
        getCurrentList();
    }, []);

    var getCurrentList = () => {
        try {
            AsyncStorage.getItem('EmailData')
                .then(value => {
                    console.log(value)
                    if (value != null) {
                        let x_recipients = JSON.parse(value);
                        setEmail([])
                        for (var i = 0; i < x_recipients.length; i++) {
                            setEmail(state => [...state, {label: x_recipients[i], value: x_recipients[i]}])
                        }
                    }
                    else {
                        console.log("NO EMAIL DATA")
                    }  
                })
        } catch (error) {
            console.log(error);
        }
    }

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('EmailData')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('EmailData', jsonValue)
        } catch (e) {
          // saving error
        }
    }

    const addItem = async () => {
        try {
            var current_list = await getData()
            if (current_list == null)
                current_list = []
            console.log(current_list)
            console.log(add_recipient)
            if (add_recipient.length > 0)
                current_list.push(add_recipient)
            console.log(current_list)
            Alert.alert(add_recipient + "Added succesfully")
            storeData(current_list)
        } catch (error) {
            console.log(error);
        }
        setAddRecipient("")
        getCurrentList()
    }
    
    const removeItem = async (item) => {
        try {
            var current_list = await getData()
            if (current_list == null)
                return
            current_list = current_list.filter(function(e) { return e !== item })
            console.log(current_list)
            storeData(current_list)
        } catch (e) {
            // saving error
        }
        getCurrentList()
    }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Setup your doctors' emails here
                    </Text>
                    <TextInput
                        style={[GlobalStyle.InputField, {marginBottom: 5}]}
                        placeholder='Input doctors email'
                        value={add_recipient}
                        onChangeText={value => setAddRecipient(value)}
                    />
                    <CustomButton
                        style={{marginBottom: 40}}
                        title='Add email to list!'
                        color='#1eb900'
                        onPressFunction={addItem}
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
                        placeholder="Select doctors email"
                        open={email_open}
                        value={email_value}
                        items={email}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setEmail}
                        onChangeValue={value => setRemoveRecipient(value)}
                    />
                    <CustomButton
                        style={{marginBottom: 40}}
                        title='Remove selected list doctor'
                        color='red'
                        onPressFunction={() => {removeItem(remove_recipient)}}
                    />

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                        <CustomButton
                            title='Return to Homepage'
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