import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>peepeepoopoo</Text>
      <Button color="#ff0000" title="Hello"/>
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
  }
});
