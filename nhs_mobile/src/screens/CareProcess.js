import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, 
    ScrollView,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';

export default function CareProcess({ navigation }) {
    
    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        My Care Processes
                    </Text>

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        Shows user key dates and information about their medical life. TO BE IMPLEMENTED.
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