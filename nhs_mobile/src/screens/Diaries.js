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
import { NavigationContainer } from '@react-navigation/native';
import FoodDiary from './FoodDiary';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import ConditionalProfileView from '../components/ConditionalProfileView';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import {diary_list} from '../global_structures.js'

export default function Diaries({ navigation }) {
    console.log(diary_list)
    const diary_buttons = diary_list.map((item, i) =>
        <CustomButton
            key={i}
            onPressFunction={() => {
                navigation.navigate(item.screen_name)
            }}
            color="#761076"
            title={item.verbose_name}
            style={GlobalStyle.button_style}
        />
    )
    console.log(diary_buttons)

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header/>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        My Diaries Page
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Here you can view your diaries and make changes to them.
                    </Text>
                    {diary_buttons}
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