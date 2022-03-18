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
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../../styles/DropdownStyle';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import GlobalStyle from '../../styles/GlobalStyle';
import {new_food_diary_entry, health_type_reverse_lookup} from '../../global_structures.js'
import MealInputComponent from '../../components/MealInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';
import YoutubePlayer from "react-native-youtube-iframe";

export default function NewFoodDiary({ navigation, route }) {
    const [diary_entry, setDiaryEntry] = useState(new_food_diary_entry)

    const [nMeals, setNMeals] = useState(0);
    const [meals, setMeals] = useState([]); //stores a list of objects, each object storing the data for all the fields in a BPInput component. This is also passed as prop to the component to manipulate the state of this scopre.

    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    const [help, setHelp] = useState(false)
    const [playing, setPlaying] = useState(false);
    const [videoIndex, setVideoIndex] = useState();
    const [notFound, setNotFound] = useState(false);

    // Used to tell user video has finished. Currently commented as not needed. If by code freeze still not needed then will delete from app
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            //Alert.alert("video has finished playing!");
        }
    }, []);

    useEffect(() => {
        getOrCreateNewFoodDiary();
        setDiaryEntry(state => ({ ...state, ["date"]: date }), [])
        findVideoIndex("Food Diary Video"); //CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
    }, []);

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
                // console.log("diary_entry.date: ", diary_entry.date)
                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);
                // console.log("existing diary entry:\n", existing_diary_entry);

                // ...

                for (let i = 0; i < meals.length; i++) {
                    let food = meals[i].food
                    for (let j = 0; j < food.length; j++) {
                        let foodstuff = food[j]
                        console.log("foodstuff: ", foodstuff)

                        console.log("foodstuff.energy: ", foodstuff.energy)
                        foodstuff.energy = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.energy) / 100) // for some reason this cuts off the last digit before doing calculation
                        foodstuff.carb = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.carb) / 100)
                        foodstuff.fat = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.fat) / 100)
                        foodstuff.sugar = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.sugar) / 100)
                        foodstuff.protein = parseFloat(foodstuff.amount) * (parseFloat(foodstuff.protein) / 100)
                    }
                }

                let final_entry = {}

                if (existing_diary_entry == null) {
                    final_entry = {
                        date: diary_entry.date,
                        meals: meals
                    }
                } else {
                    final_entry = {
                        date: diary_entry.date,
                        meals: meals.concat(existing_diary_entry.meals),
                    }
                }

                // console.log("what was created:")
                // console.log(final_entry)

                // ...
                
                diary.push(final_entry);
                console.log("diary: ", diary)
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
                    <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginBottom:45, marginTop:15}]}>Food Diary</Text>
                    
                    <CustomButton
                        title="Help"
                        onPressFunction={() => toggleHelp()}
                        color='#761076'
                    />
                </View>

                <View styles={styles.video_style}>
                    {(help === true && notFound === false) && showHelp()}
                </View>

                <View style={GlobalStyle.BodyGeneral}>

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

                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                        color="#008c8c"
                    />

                    {meals.map((input_component, i) => <MealInputComponent key={i} id={input_component.index} meals={meals} setMeals={setMeals}/>)}

                    <CustomButton
                        style={{marginTop: 80}}
                        onPressFunction={() => addMealInputComponent()}
                        title="Add another meal"
                        color="#f96a3e"    
                    />

                    <CustomButton
                        title='Add entry to diary!'
                        color='#1eb900'
                        onPressFunction={() => {
                            appendToDiary();
                        }}
                    />

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