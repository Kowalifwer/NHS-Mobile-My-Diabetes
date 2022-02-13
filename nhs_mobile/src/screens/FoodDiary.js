import React, { useState, useEffect } from 'react';
import ReactDOM from "react-dom";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
    Button,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import user_struct from '../global_structures.js';
import food_diary_entry from '../global_structures.js';
import FoodInputComponent from '../components/FoodInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function FoodDiary({ navigation }) {
    const [diary_entry, setDiaryEntry] = useState(food_diary_entry)
    const [food_input_components, setFoodInputComponents] = useState([new FoodInputComponent()]); // this part makes it so when you edit food_inputs it gets re-rendered instantly
    
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(date)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    useEffect(() => {
        getOrCreateFoodDiary();
    }, []); // don't know what this is doing

    const getOrCreateFoodDiary = async () => {
        try {
            const food_diary = await AsyncStorage.getItem('FoodDiary');
            if (food_diary == null) {
                console.log("food diary does not exist yet, creating...");
                AsyncStorage.setItem("FoodDiary", JSON.stringify([]));
            }
            else {
                console.log("food diary: ", food_diary);
            }
        } catch (error) {
            console.log("food diary getItem error");
            console.log(error);
        }
    }

    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                diary_entry["food"] = food_input_components.map((component) => component.dict)
                const diary = JSON.parse(await AsyncStorage.getItem('FoodDiary'))
                diary.push(diary_entry);
                await AsyncStorage.setItem("FoodDiary", JSON.stringify(diary))
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
            console.log("empty field in form")
        }
    }

    function addFoodInputComponent() {
        setFoodInputComponents(food_input_components => [...food_input_components, new FoodInputComponent()]);
    } // maybe this will work ??

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="handheld">
                <View style={styles.body} key={"????"}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont, styles.text]}>
                        Food Diary page
                    </Text>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                setDate(date)
                                setDiaryEntry(state => ({ ...state, ["date"]:date.toLocaleDateString('en-GB') }), [])
                            }}
                        />
                    )}
                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                        color="#008c8c"
                    />

                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={time}
                            display="default"
                            mode="time"
                            onChange={(event, time) => {
                                setShowTimePicker(false);
                                setTime(time)
                                const time_string = `${time.getHours()}:${time.getMinutes()}`;
                                setDiaryEntry(state => ({ ...state, ["time"]:time_string }), [])
                            }}
                        />
                    )}
                    <CustomButton
                        onPressFunction={() => setShowTimePicker(true)}
                        title="Enter Time"
                        color="#008c8c"
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Meal'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["meal"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Water (ml)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["water"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Calories (kcal)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["kcal"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Fat (g)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["fat"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Carbohydrates (g)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["carb"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Sugar (g)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["sugar"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Protein (g)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["protein"]:value.trim() }), [])}
                        multiline={true}
                        numberOfLines={1}
                    />

                    <Text>Food</Text>

                    {food_input_components.map((input_component) => input_component.render())}
                    <CustomButton 
                        onPressFunction={addFoodInputComponent}
                        title="Add another food"
                        color="#008c8c"    
                    />

                    <CustomButton
                        style={{marginTop: 40}}
                        title='add to diary'
                        color='#1eb900'
                        onPressFunction={() => {
                            appendToDiary();
                        }}
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