import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import * as MailComposer from 'expo-mail-composer';
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

export default function Email0({navigation}) {
    return (
        <SafeAreaView>
            <ScrollView>
                <Button
                    onPress={() => MailComposer.composeAsync({
                        body: "this is a test",
                        recipients: ["c@llens.email"],
                    })}
                    color="#ff0f00"
                    title="Compose Email"
                />

                <StatusBar style="auto" />


                <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                    <CustomButton
                        title='Navigate to Homepage directly'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Home")}
                    />
                    <CustomButton
                        title='Go to Authentication'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Authentication")}
                        />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
