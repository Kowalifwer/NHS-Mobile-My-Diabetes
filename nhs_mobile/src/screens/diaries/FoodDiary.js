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
    Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import GlobalStyle from '../../styles/GlobalStyle';
import DropdownStyle from '../../styles/DropdownStyle';
import user_struct from '../../global_structures.js'
import {food_diary_entry, health_type_reverse_lookup} from '../../global_structures.js'
import FoodInputComponent from '../../components/FoodInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import BarcodeScanner from '../BarcodeScanner';

export default function FoodDiary({ navigation, route }) {
    const [diary_entry, setDiaryEntry] = useState(food_diary_entry)

    const [n_inputs, setNInputs] = useState(0);
    
    const [food_input_components_data, setFoodInputComponentsData] = useState([]); //stores a list of objects, each object storing the data for all the fields in a FoodInput component. This is also passed as prop to the component to manipulate the state of this scope.
    
    const [barcode_scanner_open, setBarcodeScannerOpen] = useState([false, 0]); //first element is a boolean, second element is the index of the component that is currently open for barcode scanning.

    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)

    useEffect(() => {
        getOrCreateFoodDiary();
    }, []); // don't know what this is doing

    useEffect(() => {
        // Please make sure that these fields match the fieleds in FoodInputComponent 'render_input_components' component_update_key parameter
        setFoodInputComponentsData(state => [...state, {index:n_inputs, name:"", amount:"", energy:"", carb:"", fat:"", protein:"", sugar:"", scanned_item_object: {}}]);
    }, [n_inputs]); //when number of inputs increases, make sure we have a side effect that will increase the capacity of the input food components dictionary

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
                const diary = JSON.parse(await AsyncStorage.getItem('FoodDiary'))

                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);
                console.log("existing diary entry:\n", existing_diary_entry);

                // let current_diary_entry_data = {...diary_entry, food: food_input_components_data}
                // if (food_input_components_data.length > 0)  //update the food array inside the diary with existing food input data from the other components
                //     current_diary_entry_data.food = food_input_components_data
                //this will push the diary_entry to the diary local storagem and also update all food components

                // value * (amount / 100)
                // food_input_components_data is an ARRAY of objects structure of which is shown below
                //{index:n_inputs, name:"", amount:"", proteins:"", sugar:"", kcal:"", fat:"", carbohydrates:"", scanned_item_object: {}}

                for (let i = 0; i < food_input_components_data.length; i++) {
                    let x = food_input_components_data[i]
                    x.energy = parseInt(x.amount) * (parseInt(x.energy) / 100)
                    x.carb = parseInt(x.amount) * (parseInt(x.carb) / 100)
                    x.fat = parseInt(x.amount) * (parseInt(x.fat) / 100)
                    x.sugar = parseInt(x.amount) * (parseInt(x.sugar) / 100)
                    x.protein = parseInt(x.amount) * (parseInt(x.protein) / 100)
                }
                
                diary.push({...diary_entry, food: food_input_components_data});
                await AsyncStorage.setItem("FoodDiary", JSON.stringify(diary))
                console.log(diary);
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
        setNInputs(n_inputs + 1); //increment number of inputs and then the n_inputs listener in the useEffect above will be triggered and do the necessary side effects
    }

    return (
        <SafeAreaView style={styles.body}> 
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        {/* how you can fetch parameters from the navigator */}
                        Food Diary page. Your daily injections: {route.params?.daily_injections}.
                        Your selected status: {health_type_reverse_lookup[route.params?.health_type]}
                    </Text>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date != undefined) {
                                    setDate(date)
                                    setDiaryEntry(state => ({ ...state, ["date"]:date.toLocaleDateString('en-GB') }), [])
                                }
                            }}
                        />
                    )}
                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                    />

                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={time}
                            display="default"
                            mode="time"
                            onChange={(event, time) => {
                                setShowTimePicker(false);
                                if (time != undefined) {
                                    setTime(time)
                                    const time_string = `${time.getHours()}:${time.getMinutes()}`;
                                    setDiaryEntry(state => ({ ...state, ["time"]:time_string }), [])
                                }
                            }}
                        />
                    )}
                    <CustomButton
                        onPressFunction={() => setShowTimePicker(true)}
                        title="Enter Time"
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Meal'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["meal"]:value.trim() }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Water (ml)'
                        keyboardType = 'numeric'
                        onChangeText={value => setDiaryEntry(state => ({ ...state, ["water"]:value.trim() }), [])}
                    />

                    <Text>Food</Text>

                    {food_input_components_data.map((input_component) => <FoodInputComponent key={input_component.index} id={input_component.index} food_input_components_data={food_input_components_data} setFoodInputComponentsData={setFoodInputComponentsData} barcode_scanner_open={barcode_scanner_open} setBarcodeScannerOpen={setBarcodeScannerOpen}/>)}

                    <CustomButton 
                        onPressFunction={addFoodInputComponent}
                        title="Add another food"
                    />

                    <CustomButton
                        style={{marginTop: 40}}
                        title='add to diary'
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