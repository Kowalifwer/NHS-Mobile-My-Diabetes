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
  StatusBar as RnStatusBar,
} from 'react-native';

export default function Email() {
    return (
        <View>
        <Button
            onPress={() => MailComposer.composeAsync({
    body: "this is a test",
    recipients: ["c@llens.email"],
    })}
    color="#ff0f00"
    title="Compose Email"
    />

    <StatusBar
        style="auto"
    />
    </View>
        )
}
