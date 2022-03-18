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
import GlucoseInputComponent from '../../components/GlucoseInputComponent';
import InjectionInputComponent from "../../components/InjectionInputComponent";
import DateTimePicker from '@react-native-community/datetimepicker';
import YoutubePlayer from "react-native-youtube-iframe";
import { glucose_diary_entry } from '../../global_structures';


export default function GlucoseDiary({ navigation, route }) {
    const [diary_entry, setDiaryEntry] = useState(glucose_diary_entry)

    // number of glucose inputs to render
    const [n_glucose_inputs, setNGlucoseInputs] = useState(0);
    const [glucose_input_components_data, setGlucoseComponentsData] = useState([]);

    // number of injection inputs to render
    const [n_injections, setNInjections] = useState(0);
    const [injections_data, setInjectionsData] = useState([]);

    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    const [renderInjections, setRenderInjections] = useState(route.params?.health_type == 3);

    useEffect(() => {

    }, [renderInjections]);

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

    // this effect hook ensures that a default date is set for the current diary entry,
    // as well as setting the diary_entry state or creating a new diary if one doesn't exist    
    useEffect(() => {
        getOrCreateGlucoseDiary();
        setDiaryEntry(state => ({ ...state, ["date"]: date }), [])
        findVideoIndex("Glucose Diary"); // CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
    }, []);

    // effect hook for appending a new glucose entry to the list of entries
    useEffect(() => {
        setGlucoseComponentsData(state => ([...state, {index:n_glucose_inputs, time: new Date(), reading: ""}]) )
    }, [n_glucose_inputs]);

    // effect hook for appending a new injection entry to the list of entries
    useEffect(() => {
        setInjectionsData(state => ([...state, {index:n_injections, time: new Date(), type: "", units: ""}]) )
    }, [n_injections]);

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
    
    // this async function uses AsyncStorage to retreive an existing glucose diary entry,
    // or it creates a new one if one isn't found.    
    const getOrCreateGlucoseDiary = async () => {
        try {
            const glucose_diary = await AsyncStorage.getItem('GlucoseDiary');
            if (glucose_diary == null) {
                AsyncStorage.setItem("GlucoseDiary", JSON.stringify([]));
            }
        } catch (error) {
            console.log("glucose diary getItem error");
            console.log(error);
        }
    }

    // this function appends the glucose data to an existing diary if there is one, or creates a new one and appends it to that
    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const diary = JSON.parse(await AsyncStorage.getItem('GlucoseDiary'))

                let final_entry = {
                    key: diary_entry.date.toLocaleDateString('en-GB'),
                    date: diary_entry.date,
                    glucose_readings: [...glucose_input_components_data],
                    injections: [...injections_data],
                }

                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);

                // removes existing diary entry from diary and concatenates it with the new entry
                if (existing_diary_entry != undefined) {
                    diary.splice(diary.indexOf(existing_diary_entry), 1); // this removes the old diary entry
                    final_entry.glucose_readings = final_entry.glucose_readings.concat(existing_diary_entry.glucose_readings);
                    final_entry.injections = final_entry.injections.concat(existing_diary_entry.injections);
                }

                // deletes unnecessary index field
                for (let i = 0; i < final_entry.glucose_readings.length; i++) {
                    delete final_entry.glucose_readings[i].index;
                }
                for (let i = 0; i < final_entry.injections.length; i++) {
                    delete final_entry.injections[i].index;
                }

                diary.push(final_entry);
                await AsyncStorage.setItem("GlucoseDiary", JSON.stringify(diary));
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
        }
    }

    // function to increment number of glucose input components rendered
    function addGlucoseInputComponent() {
        setNGlucoseInputs(n_glucose_inputs + 1);
    }

    // function to increment number of injection input components rendered
    function addInjectionInputComponent() {
        setNInjections(n_injections + 1);
    }

    return (
        <SafeAreaView style={GlobalStyle.BodyGeneral}>
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
                <View style={GlobalStyle.BodyGeneral}>
                    <Header/>

                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Blue]}>
                        Glucose Diary
                    </Text>

                    {/* button to show the help section */}
                    <CustomButton
                        title="Help"
                        onPressFunction={() => toggleHelp()}
                        color='#761076'
                    />
                </View>

                {/* help section */}
                <View styles={styles.video_style}>
                    {(help === true && notFound === false) && showHelp()}
                </View>
                    
                {/* date picker */}
                <View style={GlobalStyle.BodyGeneral}>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            style={{minWidth: 200}}
                            display="default"
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
                    />
                    
                    {/* maps glucose inputs array to glucose input components */}
                    {glucose_input_components_data.map((input_component, i) => <GlucoseInputComponent key={i} id={input_component.index} setGlucoseComponentsData={setGlucoseComponentsData} glucoseReadings={glucose_input_components_data}/>)}
                    
                    {/* button to increment number of glucose input components */}
                    <CustomButton 
                        onPressFunction={() => addGlucoseInputComponent()}
                        title="Enter another reading"
                        color="#6495ED"
                    />

                    {/* only renders injection input components if the user selected the mode of treatment where they inject */}
                    {/* maps the array of injection data to injection input components */}
                    {(renderInjections) && (
                        <View style={[GlobalStyle.BodyGeneral, {marginBottom: 100}]}>
                            <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Blue, {marginTop: 100}]}>
                                Injections
                            </Text>
                            {injections_data.map((input_component, i) => <InjectionInputComponent key={i} id={input_component.index} setInjectionsData={setInjectionsData} injectionsData={injections_data} medicine_list={route.params?.medicine_list}/>)}
                            <CustomButton 
                                onPressFunction={() => addInjectionInputComponent()}
                                title="Enter another insulin value"
                                color="#6495ED"
                            />
                        </View>
                    )}

                    {/* button to append to diary */}
                    {(!renderInjections || (renderInjections && injections_data.every(entry => entry.type != ""))) ? 
                        <CustomButton
                            style={{marginTop: 40}}
                            title='Add to diary'
                            color='#1eb900'
                            onPressFunction={() => {
                                appendToDiary();
                            }}
                        />:
                        <Text style={[GlobalStyle.CustomFont, GlobalStyle.ErrorColor, {marginHorizontal: 10}]}>
                            Please specify the medicine used in your insulin injections, to be able to add to the diary
                        </Text>
                    }

                </View>
                <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100, marginTop: 10}}>
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
    text: {
        fontSize: 30,
        marginBottom: 45,
        marginTop: 15,
        textAlign: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 20,
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        margin: 8,
    },
    video_style: {
        flex: 1,
        alignItems: 'center',
    }
})