import React, { useState, useEffect, useCallback } from 'react';
import { WebView } from 'react-native-webview';
import { Alert, StyleSheet, View} from 'react-native';
import Constants from 'expo-constants';
import HomePageButton from '../components/HomePageButton';
import HomePageButtonSlim from '../components/HomePageButtonSlim';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as LocalAuthentication from 'expo-local-authentication';

export default function PDF({ navigation, route}) {
    
    const [pdfURI,setPDFURI] = useState()

    useEffect( async() => {
        setPDFURI(await createPDF())
        console.log(pdfURI);
    }, []);

    const createPDF = async() => {
        
        //makes html code to pdf and saves to Filesystem Cache Directory, sizes are for A4 paper in pixels
        const file_object = await Print.printToFileAsync({
            html: route.params.HTML,
            height: 842,
            width: 595,
        });

        //renames the file to its diary name with the current date by replacing the string after the last slash with diary name (with spaces taken out) and current date (slash / between the number replaced with a dash -)
        const pdfName = `${file_object.uri.slice(
            0,
            file_object.uri.lastIndexOf('/') + 1)}Diary.pdf`

        await FileSystem.moveAsync({
            from: file_object.uri,
            to: pdfName,
        })

        return pdfName;
    }

    const sharePDF = async() => {
        try {

            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) throw 'This device is not compatible for biometric authentication';

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) throw 'This device does not have biometric authentication enabled';

            const result = await LocalAuthentication.authenticateAsync();

            if (result.success) {
                await Sharing.shareAsync(pdfURI, { UTI: '.pdf', mimeType: 'application/pdf'})
            } else {
                Alert.alert("Failure!", "Could not share pdf.")
            }
        } catch (e) {
            console.log(e);
        }
    }

  return (
    <View style={styles.outerContainer}>

        <View style={styles.container}>
            
            <View style={{alignItems:'center'}}>
                <HomePageButtonSlim
                    title="Go Back"
                    color='#761076'
                    onPressFunction={() => navigation.goBack()}
                />
            </View>

            <WebView 
                style={styles.webview}
                source={{ html: route.params.HTML}}
                originWhitelist={['*']}
            />

            <View style={styles.bottomButtons}>

                <View>

                    <HomePageButton
                        title="Send Email"
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Email", {
                            video: route.params.videos,
                            stored_user: route.params.stored_user
                        })}
                    />

                </View>

                <View>

                    <HomePageButton
                        title="Share"
                        color='#761076'
                        onPressFunction={() => sharePDF()}
                    />

                </View>

            </View>

        </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    margin: 5,
  },
  outerContainer: {
    backgroundColor: '#e9c5b4',
    flex:1
  },
  bottomButtons: {
    alignItems:'center',
    marginBottom:20,
    flexDirection: 'row'
  }
});