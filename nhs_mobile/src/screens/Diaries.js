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
import {user_struct} from '../global_structures.js'

export default function Diaries({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)
    console.log("xd")

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
                    <CustomButton
                            title="Food Diary"
                            color="#761076"
                            onPressFunction={() => navigation.navigate("FoodDiary")}
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