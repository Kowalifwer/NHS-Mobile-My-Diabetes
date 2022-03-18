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
// import {glucose_diary_entry} from '../../global_structures.js'; // for some reason this is just giving undefined for the useState
import GlucoseInputComponent from '../../components/GlucoseInputComponent';
import InjectionInputComponent from "../../components/InjectionInputComponent";
import DateTimePicker from '@react-native-community/datetimepicker';
import YoutubePlayer from "react-native-youtube-iframe";
import { render } from 'react-dom';
import { TextInput } from 'react-native-gesture-handler';

const glucose_diary_entry = {
    date: "",
    glucose_readings: [],
    injections: [],
    feel_sick: "",
}

export default function GlucoseDiary({ navigation, route }) {
    const [diary_entry, setDiaryEntry] = useState(glucose_diary_entry)

    const [n_glucose_inputs, setNGlucoseInputs] = useState(0);
    const [glucose_input_components_data, setGlucoseComponentsData] = useState([]);

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

    useEffect(() => {
        getOrCreateGlucoseDiary();
        setDiaryEntry(state => ({ ...state, ["date"]: date }), [])
        findVideoIndex("Glucose Diary"); //CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
    }, []); // don't know what this is doing

    useEffect(() => {
        setGlucoseComponentsData(state => ([...state, {index:n_glucose_inputs, time: new Date(), reading: ""}]) )
    }, [n_glucose_inputs]);

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
    
    const getOrCreateGlucoseDiary = async () => {
        try {
            const glucose_diary = await AsyncStorage.getItem('GlucoseDiary');
            if (glucose_diary == null) {
                console.log("glucose diary does not exist yet, creating...");
                AsyncStorage.setItem("GlucoseDiary", JSON.stringify([]));
            }
            else {
                // console.log("glucose diary: ", glucose_diary);
            }
        } catch (error) {
            console.log("glucose diary getItem error");
            console.log(error);
        }
    }

    const appendToDiary = async () => {
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const diary = JSON.parse(await AsyncStorage.getItem('GlucoseDiary'))

                let final_entry = {
                    date: diary_entry.date,
                    glucose_readings: [...glucose_input_components_data],
                    injections: [...injections_data],
                }

                let existing_diary_entry = diary.find(x => x.date === diary_entry.date);

                if (existing_diary_entry != undefined) {
                    console.log("there is an existing glucose diary entry");
                    diary.splice(diary.indexOf(existing_diary_entry), 1); // this removes the old diary entry
                    final_entry.glucose_readings = final_entry.glucose_readings.concat(existing_diary_entry.glucose_readings);
                    final_entry.injections = final_entry.injections.concat(existing_diary_entry.injections);
                }

                for (let i = 0; i < final_entry.glucose_readings.length; i++) {
                    delete final_entry.glucose_readings[i].index;
                }

                for (let i = 0; i < final_entry.injections.length; i++) {
                    delete final_entry.injections[i].index;
                }

                // console.log(final_entry);
                diary.push(final_entry);
                console.log("glucose diary: ", diary);
                await AsyncStorage.setItem("GlucoseDiary", JSON.stringify(diary));
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
            console.log("empty field in form")
        }
    }

    const checkForHypo = () => {
        for (let i = 0; i < glucose_input_components_data.length; i++) {
            let value = glucose_input_components_data[i]["reading"];
            try {
                if (parseInt(value) < 4) {
                    console.log("hypo found");
                    setHypo(true);
                    return true
                }
            } catch (error) {
                console.log("error in function checkForHypo in GlucoseDiary: ", error);
            }
        }
        return false
    }

    function addGlucoseInputComponent() {
        setNGlucoseInputs(n_glucose_inputs + 1);
    }

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

                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                    />
                    
                    {glucose_input_components_data.map((input_component, i) => <GlucoseInputComponent key={i} id={input_component.index} setGlucoseComponentsData={setGlucoseComponentsData} glucoseReadings={glucose_input_components_data}/>)}
                    
                    <CustomButton 
                        onPressFunction={() => addGlucoseInputComponent()}
                        title="Enter another reading"
                        color="#6495ED"
                    />

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

                    {console.log(injections_data)}
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
    // checkbox: {
    //     alignSelf: "center",
    // },
    label: {
        margin: 8,
    },
    video_style: {
        flex: 1,
        alignItems: 'center',
    }
})