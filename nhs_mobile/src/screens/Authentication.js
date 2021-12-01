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
  Alert,
  ScrollView,
  StatusBar as RnStatusBar,
} from 'react-native';

import * as LocalAuthentication from 'expo-local-authentication';

export default function Authentication({ navigation, route }) {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // Check if hardware supports biometrics
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
      console.log(mess);
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable)
    //   navigation.navigate("ProfileSetup") - uncomment if testing on browser and u want to be taken to profile setup screeen
      return alertComponent(
        'Please enter your password',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth()
      )

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics)
      return alertComponent(
        'Biometric record not found',
        'Please login with your password',
        'OK',
        () => fallBackToDefaultAuth()
      );

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });
    // Log the user in on success
    if (biometricAuth) navigation.navigate("ProfileSetup");

    console.log({ isBiometricAvailable });
    console.log({ supportedBiometrics });
    console.log({ savedBiometrics });
    console.log({ biometricAuth });
  };

  return (
    <SafeAreaView style={styles.body}>
        <ScrollView>
            <Header></Header>
            <View style={styles.body}>
                <Text style={[GlobalStyle.CustomFont,styles.text,{fontSize: 50, color: "lime"}]}>
                      Authentication page
                </Text>
                <Text style={[GlobalStyle.CustomFont,styles.text]}>
                {isBiometricSupported
                    ? 'Your device is compatible with Biomeeeeeeeetrics'
                    : 'Face or Fingerprint scanner is available on this device'}
                </Text>

                <TouchableHighlight
                style={{
                    height: 60,
                }}
            >
                <CustomButton
                  title="Login with Biometrics"
                  color="#fe7005"
                  onPressFunction={handleBiometricAuth}
                />
            </TouchableHighlight>

            <StatusBar style="auto" />
            

            <Text style={[GlobalStyle.CustomFont, styles.text, {marginTop: 40, fontSize: 20, marginHorizontal: 20}]}>IF Authentication does not work - use button below to bypass authentication</Text>
            <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                <CustomButton
                  title='Go to Profile Setup page directly'
                  color='#761076'
                  onPressFunction={() => navigation.navigate("Home")}
                />
            </View>
          </View>
        </ScrollView>
  </SafeAreaView>


    // <View style={styles.body}>
    //   <Text style={styles.text}>peepeepoopoo</Text>
    //   <Button 
    //   color="#ff0000" 
    //   title="Click for biometric"
    //   onPress={handleBiometric}/>
    //   <StatusBar style="auto" />
    // </View>
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
})