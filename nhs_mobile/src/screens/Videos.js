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


export default function Videos({ navigation }) {
    

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Videos Page
                    </Text>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Thumbnails of videos to watch. TO BE IMPLEMENTED
                    </Text>

                    <CustomButton
                            title='Go to Homepage directly'
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