import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    SafeAreaView, 
    ScrollView,
    Keyboard,
} from 'react-native';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import GlobalStyle from '../../styles/GlobalStyle';
import {new_food_diary_entry, health_type_reverse_lookup} from '../../global_structures.js'
import MealInputComponent from '../../components/MealInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import YoutubePlayer from "react-native-youtube-iframe";

export default function NewFoodDiary({ navigation, route }) {
    // diary entry defaults to an empty food diary entry
    const [diary_entry, setDiaryEntry] = useState(new_food_diary_entry)

    // number of meals and meals list
    const [nMeals, setNMeals] = useState(0);
    const [meals, setMeals] = useState([]);

    // date and boolean to control rendering of date picker component
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    // video-related states
    const [help, setHelp] = useState(false)
    const [playing, setPlaying] = useState(false);
    const [videoIndex, setVideoIndex] = useState();
    const [notFound, setNotFound] = useState(false);

    // Used to tell user video has finished. Currently commented as not needed. If by code freeze still not needed then will delete from app
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    // this effect hook ensures that a default date is set for the current diary entry,
    // as well as setting the diary_entry state or creating a new diary if one doesn't exist
    useEffect(() => {
        getOrCreateNewFoodDiary();
        setDiaryEntry(state => ({ ...state, ["date"]: date }), [])
        findVideoIndex("Food Diary Video"); // CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
    }, []);

    // this effect hook adds a new empty meal input component to the list when nMeals increases
    useEffect(() => {
        setMeals(state => ([...state, {index: nMeals, time: new Date(), meal: "", water: "", food: []}])) // increment number of inputs and then the n_inputs listener in the useEffect above will be triggered and do the necessary side effects
    }, [nMeals]);

    // Set the video id that matches the video name passed into this function.
    const findVideoIndex = (videoName) => {
        for (var index=0; index < route.params.videos.length; index++) {
            if (route.params.videos[index].name == videoName) {
                setVideoIndex(index);
                return
            }
        }
        setNotFound(true);
    }

    // function to render the help section
    const showHelp = () => {
        return <View styles={styles.video_style}>
                    <Text style={styles.video_text}>{route.params.videos[videoIndex].name}</Text>
                    <YoutubePlayer
                        webViewStyle={ {opacity:0.99} }
                        height={300}
                        play={playing}
                        videoId={route.params.videos[videoIndex].id}
                    />
                </View>
    }

    // function to toggle visibility of the help section
    const toggleHelp = () => {
        if (notFound === false) {
            if (help === true) {
                setHelp(false);
            } else {
                setHelp(true);
            }
        } else {
            Alert.alert("Help Video Not Found. Please contact clinician")
        }
    }

    // this async function uses AsyncStorage to retreive an existing food diary entry,
    // or it creates a new one if one isn't found.
    const getOrCreateNewFoodDiary = async () => {
        try {
            const food_diary = await AsyncStorage.getItem('NewFoodDiary');
            if (food_diary == null) {
                AsyncStorage.setItem("NewFoodDiary", JSON.stringify([]));
            }
        } catch (error) {
            console.log("NewFoodDiary getItem error");
            console.log(error);
        }
    }

    // this function calculates the actual quantities of nutrition info from the per 100g data the user enters
    // it then checks for an existing diary entry, and appends to that if one exists
    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const diary = JSON.parse(await AsyncStorage.getItem('NewFoodDiary'));
                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);
                // loop for calculating actual nutrition info
                for (let i = 0; i < meals.length; i++) {
                    let food = meals[i].food
                    for (let j = 0; j < food.length; j++) {
                        let foodstuff = food[j]
                        foodstuff.energy = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.energy) / 100)
                        foodstuff.carb = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.carb) / 100)
                        foodstuff.fat = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.fat) / 100)
                        foodstuff.sugar = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.sugar) / 100)
                        foodstuff.protein = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.protein) / 100)
                    }
                }
                // this is the object which will be appended to the user's diary
                let final_entry = {
                    key: diary_entry.date.toLocaleDateString('en-GB'),
                    date: diary_entry.date,
                    meals: meals
                }
                // if there is an existing diary entry, append its meal data to the new diary entry
                if (existing_diary_entry != null) {
                    final_entry.meals.concat(existing_diary_entry.meals)
                }
                diary.push(final_entry);
                await AsyncStorage.setItem("NewFoodDiary", JSON.stringify(diary))
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
        }
    }

    // used to increment the number of meal input components rendered
    function addMealInputComponent() {
        setNMeals(nMeals + 1);
    }

    return (
        <SafeAreaView style={GlobalStyle.BodyGeneral}>
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
                <View style={GlobalStyle.BodyGeneral}>
                    <Header/>
                    <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginBottom:45, marginTop:15}]}>Food Diary</Text>
                    
                    {/* button to show the help section */}
                    <CustomButton
                        title="Help"
                        onPressFunction={() => toggleHelp()}
                        color='#761076'
                    />
                </View>

                {/* this renders the help section if help == true */}
                <View styles={styles.video_style}>
                    {(help === true && notFound === false) && showHelp()}
                </View>

                <View style={GlobalStyle.BodyGeneral}>

                    {/* date picker */}
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
                                    setDiaryEntry(state => ({ ...state, ["date"]: date }), [])
                                }
                            }}
                        />
                    )}

                    {/* date picker button */}
                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                        color="#008c8c"
                    />

                    {/* maps the meals array to mealInputComponents */}
                    {meals.map((input_component, i) => <MealInputComponent key={i} id={input_component.index} meals={meals} setMeals={setMeals}/>)}

                    {/* button to increment number of mealInputComponents rendered */}
                    <CustomButton
                        style={{marginTop: 80}}
                        onPressFunction={() => addMealInputComponent()}
                        title="Add another meal"
                        color="#f96a3e"    
                    />

                    {/* button to append diary entry to user's diary */}
                    <CustomButton
                        title='Add to diary'
                        color='#1eb900'
                        onPressFunction={() => {
                            appendToDiary();
                        }}
                    />

                    {/* return to home button */}
                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100, marginTop:80}}>
                        <CustomButton
                            title='Homepage'
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