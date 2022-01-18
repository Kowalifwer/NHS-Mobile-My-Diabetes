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
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import user_struct from '../global_structures.js'
import food_diary_entry from '../global_structures.js'


export default function FoodDiary({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)
    const [diary_entry, setDiaryEntry] = useState(food_diary_entry)

    useEffect(() => {
        getOrCreateFoodDiary();
    }, []); // don't know what this is doing

    const getOrCreateFoodDiary = async () => {
        try {
            const food_diary = await AsyncStorage.getItem('FoodDiary');
            if (food_diary == null) {
                console.log("food diary does not exist yet");
                AsyncStorage.setItem("FoodDiary", JSON.stringify([]));
                console.log("created empty food diary");
            }
            else {
                console.log(food_diary);
            }
        } catch (error) {
            console.log("food diary getItem error");
            console.log(error);
        }
    }

    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const diary = JSON.parse(await AsyncStorage.getItem('FoodDiary'))
                diary.push(diary_entry);
                await AsyncStorage.setItem("FoodDiary", JSON.stringify(diary))
                console.log("appended to diary: ", diary_entry);
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("put data")
            console.log("empty field in form")
        }
    }

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Food Diary page
                    </Text>
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='date'
                        onChangeText={(value) => setDiaryEntry(state => ({ ...state, ["date"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='meal'
                        onChangeText={(value) => setDiaryEntry(state => ({ ...state, ["meal"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='time'
                        onChangeText={(value) => setDiaryEntry(state => ({ ...state, ["time"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='food'
                        onChangeText={(value) => setDiaryEntry(state => ({ ...state, ["food"]:value }), [])}
                    />
                    <CustomButton
                        style={{marginTop: 40}}
                        title='add to diary'
                        color='#1eb900'
                        onPressFunction={appendToDiary}
                    />
                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100}}>
                        <CustomButton
                            title='Go to Homepage directly'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Home")}
                        />
                    </View>
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