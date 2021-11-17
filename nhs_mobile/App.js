import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

export default function App() {
  return (
    <View style={styles.container}>
      <Button onPress={MailComposer.composeAsync({
        body: "this is a test",
        recipients: ["c@llens.email"],
      })} color="#ff0000" title="Compose Email"/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008c8c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
  	fontSize: 50,
  	margin: "0 0 50 0",
  },
  button: {
    fontSize: 50,
  }
});
