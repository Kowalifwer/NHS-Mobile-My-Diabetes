import * as MailComposer from 'expo-mail-composer';
import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
    StatusBar
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import user_struct from '../global_structures.js'

export default function Email({navigation}) {
    const [selected, setSelectedRecipient] = useState("")

    const [email_open, setOpen] = useState(false);
    const [email_value, setValue] = useState(null);
    const [email, setEmail] = useState([])

    useEffect(() => {
        getUserData();
    }, []);

    const getData = async () => {
        try {
          const jsonValue = await AsyncStorage.getItem('EmailData')
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

    const getUserData = async () => {
        try {
            var recipients = await getData();
            console.log(recipients)
            setEmail([]);
            for (var i = 0; i < recipients.length; i++) {
                setEmail(state => [...state, {label: recipients[i], value: recipients[i]}])
            }
        } catch(e) {
        // error reading value
        }
    }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Send and email to a doctor from your doctors list
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
                        placeholder="Select from doctors list!"
                        open={email_open}
                        value={email_value}
                        items={email}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setEmail}
                        onChangeValue={value => setSelectedRecipient(value)}
                    />

                    <CustomButton
                        onPressFunction={() => MailComposer.composeAsync({
                            recipients: [selected],
                            subject: "Test email"
                        })}
                        color="#ff0f00"
                        title="Compose Email"
                    />

                    <StatusBar style="auto" />

                    <Text style={[GlobalStyle.CustomFont, {marginTop: 40, fontSize: 20, marginHorizontal: 20}]}>If you didnt set up any doctors, you can do so using the button below</Text>

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                        <CustomButton
                            title='Setup email recipients'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("EmailSetup")}
                        />
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
        fontSize: 25,
        margin: 10,
        textAlign: 'center',
    },
})
