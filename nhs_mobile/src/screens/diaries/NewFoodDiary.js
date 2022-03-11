import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    SafeAreaView, 
    ScrollView,
    Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import GlobalStyle from '../../styles/GlobalStyle';
import {new_food_diary_entry, health_type_reverse_lookup} from '../../global_structures.js'
import MealInputComponent from '../../components/MealInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function NewFoodDiary({ navigation, route }) {
    const [diary_entry, setDiaryEntry] = useState(new_food_diary_entry)

    const [nMeals, setNMeals] = useState(0);
    const [meals, setMeals] = useState([]); //stores a list of objects, each object storing the data for all the fields in a BPInput component. This is also passed as prop to the component to manipulate the state of this scopre.

    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    useEffect(() => {
        getOrCreateNewFoodDiary();
    }, []);

    useEffect(() => {
        setMeals(state => ([...state, {index: nMeals, time: new Date(), meal: "", water: "", food: []}])) // increment number of inputs and then the n_inputs listener in the useEffect above will be triggered and do the necessary side effects
    }, [nMeals]);

    const getOrCreateNewFoodDiary = async () => {
        try {
            const food_diary = await AsyncStorage.getItem('NewFoodDiary');
            if (food_diary == null) {
                console.log("NewFoodDiary does not exist yet, creating...");
                AsyncStorage.setItem("NewFoodDiary", JSON.stringify([]));
            }
            else {
                // console.log("NewFoodDiary: ", food_diary);
            }
        } catch (error) {
            console.log("NewFoodDiary getItem error");
            console.log(error);
        }
    }

    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const diary = JSON.parse(await AsyncStorage.getItem('NewFoodDiary'));
                console.log("diary_entry.date: ", diary_entry.date)
                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);
                console.log("existing diary entry:\n", existing_diary_entry);

                // ...

                for (let i = 0; i < meals.length; i++) {
                    let food = meals[i].food
                    for (let j = 0; j < food.length; j++) {
                        let foodstuff = food[j]
                        console.log("foodstuff: ", foodstuff)
                        // console.log(parseInt(foodstuff.amount) * (parseInt(foodstuff.energy) / 100))
                        // console.log(foodstuff.carb = parseInt(foodstuff.amount) * (parseInt(foodstuff.carb) / 100))
                        // console.log(foodstuff.fat = parseInt(foodstuff.amount) * (parseInt(foodstuff.fat) / 100))
                        // console.log(foodstuff.sugar = parseInt(foodstuff.amount) * (parseInt(foodstuff.sugar) / 100))
                        // console.log(foodstuff.protein = parseInt(foodstuff.amount) * (parseInt(foodstuff.protein) / 100))

                        console.log("foodstuff.energy: ", foodstuff.energy)
                        foodstuff.energy = parseInt(foodstuff.amount) * (parseInt(foodstuff.energy) / 100) // for some reason this cuts off the last digit before doing calculation
                        foodstuff.carb = parseInt(foodstuff.amount) * (parseInt(foodstuff.carb) / 100)
                        foodstuff.fat = parseInt(foodstuff.amount) * (parseInt(foodstuff.fat) / 100)
                        foodstuff.sugar = parseInt(foodstuff.amount) * (parseInt(foodstuff.sugar) / 100)
                        foodstuff.protein = parseInt(foodstuff.amount) * (parseInt(foodstuff.protein) / 100)
                    }
                }

                let final_entry = {
                    date: date,
                    meals: meals
                }
                console.log("what was created:")
                console.log(final_entry)

                // ...
                
                diary.push(final_entry);
                await AsyncStorage.setItem("NewFoodDiary", JSON.stringify(diary))
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
            console.log("empty field in form")
        }
    }

    function addMealInputComponent() {
        setNMeals(nMeals + 1);
    }

    return (
        <SafeAreaView style={GlobalStyle.BodyGeneral}>
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
                <View style={GlobalStyle.BodyGeneral}>
                    <Header/>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            // display="default"
                            mode="date"
                            style={{minWidth: 200}}
                            onChange={(event, date) => {
                                if (Platform.OS !== 'ios') setShowDatePicker(false);
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
                        color="#008c8c"
                    />

                    {meals.map((input_component) => <MealInputComponent key={input_component.index} id={input_component.index} meals={meals} setMeals={setMeals}/>)}

                    <CustomButton 
                        onPressFunction={() => addMealInputComponent()}
                        title="Add another meal"
                        color="#f96a3e"    
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
    text: {
        fontSize: 30,
        marginBottom: 130,
        textAlign: "center",
    },
})