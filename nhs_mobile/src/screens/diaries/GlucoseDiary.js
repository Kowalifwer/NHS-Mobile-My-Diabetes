import React, { useState, useEffect } from 'react';
import ReactDOM, { render } from "react-dom";
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
import user_struct from '../../global_structures.js';
// import {glucose_diary_entry} from '../../global_structures.js'; // for some reason this is just giving undefined for the useState
import GlucoseInputComponent from '../../components/GlucoseInputComponent';
import InjectionInputComponent from "../../components/InjectionInputComponent";
import DateTimePicker from '@react-native-community/datetimepicker';
import temp from '../temp';


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

    const [renderInjections, setRenderInjections] = useState(false);

    // if user injects, render injection input components
    AsyncStorage.getItem('UserData').then(value => {
        if (JSON.parse(value).health_type == "3") {
            setRenderInjections(true);
        }
    });

    useEffect(() => {
        getOrCreateGlucoseDiary();
    }, []);

    useEffect(() => {
        setGlucoseComponentsData(state => ([...state, {index: n_glucose_inputs, time: new Date(), reading: "", hypo: false, hypoReason: "", feelSick: false}]) )
    }, [n_glucose_inputs]);

    useEffect(() => {
        setInjectionsData(state => ([...state, {index: n_injections, time: new Date(), type: "", units: ""}]) )
    }, [n_injections]);

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
                    injections: [...injections_data]
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

                console.log("final_entry: ", final_entry);
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

                    <Text style={[GlobalStyle.CustomFont, styles.text]}>
                        Glucose Diary - Readings
                    </Text>

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
                                    setDiaryEntry(state => ({ ...state, ["date"]:date.toLocaleDateString('en-GB') }), [])
                                }
                            }}
                        />
                    )}

                    <CustomButton
                        onPressFunction={() => setShowDatePicker(true)}
                        title="Enter Date"
                    />
                    
                    {glucose_input_components_data.map((input_component) => <GlucoseInputComponent key={input_component.index} id={input_component.index} setGlucoseComponentsData={setGlucoseComponentsData} glucoseReadings={glucose_input_components_data}/>)}
                    
                    <CustomButton 
                        onPressFunction={() => addGlucoseInputComponent()}
                        title="Enter another reading"
                        color="#f96a3e"
                    />

                    {renderInjections && (
                        <View>
                            <Text style={[GlobalStyle.CustomFont, styles.text]}>
                                Injections
                            </Text>
                            {injections_data.map((input_component) => <InjectionInputComponent key={input_component.index} id={input_component.index} setInjectionsData={setInjectionsData} injectionsData={injections_data}/>)}
                            <CustomButton 
                                onPressFunction={() => addInjectionInputComponent()}
                                title="Enter another insulin value"
                                color="#008c8c"
                            />
                        </View>
                    )}

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
})