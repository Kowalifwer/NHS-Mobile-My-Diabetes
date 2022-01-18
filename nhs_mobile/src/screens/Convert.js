import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import CustomButton from '../components/CustomButton';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button,
  SafeAreaView, 
  TouchableHighlight, 
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StatusBar as RnStatusBar,
} from 'react-native';

import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';


export default function Convert({ navigation, route }) {
    
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
useEffect(() => {
    (async () => {
      const { uri } = await Print.printToFileAsync({ htmlContent });
      setFilePath(uri);
    })()
}, []);
*/
/*
const printToFile = async () => {
  // On iOS/android prints the given html. On web prints the HTML from the current page.
  const { uri } = await Print.printToFileAsync({
    htmlContent
  });
  console.log('File has been saved to:', uri);
  return uri;
  //await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
}

printToFile().then((value) => console.log(value))
*/

const composeMail = async() => {
        
  const { uri } = await FileSystem.downloadAsync(
    'http://techslides.com/demos/sample-videos/small.mp4',
    FileSystem.documentDirectory + 'small.mp4'
  )

  console.log('File has been saved to:', uri);
  try{

      let emailResult = await MailComposer.composeAsync({
          //recipients: [selected],
          subject: "Test email",
          attachments: [uri],
      });
      console.log('File2 has been saved to:', uri);
  } catch (e) {
      console.log(e);
  }
}

composeMail();

  return (
    <SafeAreaView style={styles.body}>
        <ScrollView>
            <Header></Header>
            <View style={styles.body}>
                <Text style={[GlobalStyle.CustomFont,styles.text,{fontSize: 50, color: "lime"}]}>
                      Convert page
                </Text>
            </View>

            <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                    <CustomButton
                    title='Go to Home'
                    color='#761076'
                    onPressFunction={() => navigation.navigate("Home")}
                    />
            </View>

        </ScrollView>
  </SafeAreaView>
  );
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
      textAlign: 'center',
  },
  textStyle: {
    fontSize: 18,
    padding: 10,
    color: 'black',
    textAlign: 'center',
  },
})