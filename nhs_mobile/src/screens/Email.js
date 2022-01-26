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
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

export default function Email({navigation}) {

    DropDownPicker.setListMode("SCROLLVIEW");
    const [selected, setSelectedRecipient] = useState(null)

    const [email_open, setOpen] = useState(false);
    const [email_value, setValue] = useState(null);
    const [email, setEmail] = useState([])

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" >
        <meta http-equiv="content-type" content = "attachment; filename=somecustomname.pdf">
        <title>Pdf Content</title>
        <style>
            body {
                font-size: 16px;
                color: rgb(255, 196, 0);
            }
            h1 {
                text-align: center;
            }
        </style>
    </head>
    <body>
        <h1>Hello, UppLabs!</h1>
    </body>
    </html>
    `
/*
    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({
          htmlContent
        });
        console.log('File has been saved to:', uri);
        
        //await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        return uri;
      }
    */

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

    const composeMail = async() => {

        //makes html code to pdf and saves to Filesystem Cache Directory
        
        const file_object = await Print.printToFileAsync({
            html: htmlContent,
        });
       
        try{
            // console.log(file_object.base64);
            let emailResult = await MailComposer.composeAsync({
                recipients: (selected != null) ? [selected] : [],
                subject: 'Test email',
                attachments: [file_object.uri],
            });
            (emailResult.status === 'sent') ? Alert.alert(`Email sent successfully to ${selected}` ) : Alert.alert('Email has not been sent')
        } catch (e) {
            console.log(e);
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
                        onPressFunction={() => composeMail()}
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
