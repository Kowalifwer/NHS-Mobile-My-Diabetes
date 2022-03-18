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

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import { compute_glucose_metrics } from '../global_functions';


export default function MyProfile({ navigation }) {
    
    useEffect(() => {
        compute_glucose_metrics();
    }, [])

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Cyan, {marginTop: 40}]}>
                        My Profile Page
                    </Text>

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Blue]}>
                        Used to show user key statistics from Blood Pressure and Glucose Diaries. NEED TO IMPLEMENT
                    </Text>

                    <CustomButton
                        title='Homepage'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Home")}
                    />

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