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
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import GlobalStyle from '../../styles/GlobalStyle';
import DropdownStyle from '../../styles/DropdownStyle';
import user_struct from '../../global_structures.js';
import {bp_diary_entry} from '../../global_structures.js';
import BPInputComponent from '../../components/BPInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function BPDiary({ navigation }) {
    const [diary_entry, setDiaryEntry] = useState(bp_diary_entry)

    const [n_inputs, setNInputs] = useState(0);
    const [bp_input_components_data, setBPComponentsData] = useState([]); //stores a list of objects, each object storing the data for all the fields in a BPInput component. This is also passed as prop to the component to manipulate the state of this scopre.

    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    useEffect(() => {
        getOrCreateBPDiary();
    }, []); // don't know what this is doing

    useEffect(() => {
        setBPComponentsData(state => ([...state, {index:n_inputs, time: new Date(), arm: "", systolic: "", diastolic: ""}]) ) //increment number of inputs and then the n_inputs listener in the useEffect above will be triggered and do the necessary side effects
    }, [n_inputs]);

    const getOrCreateBPDiary = async () => {
        try {
            const bp_diary = await AsyncStorage.getItem('BPDiary');
            if (bp_diary == null) {
                console.log("bp diary does not exist yet, creating...");
                AsyncStorage.setItem("BPDiary", JSON.stringify([]));
            }
            else {
                console.log("bp diary: ", bp_diary);
            }
        } catch (error) {
            console.log("bp diary getItem error");
            console.log(error);
        }
    }

    const appendToDiary = async () => {
        console.log(diary_entry)
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                let systolic_avg = bp_input_components_data.reduce((total, next) => total + next.systolic, 0) / bp_input_components_data.length
                let diastolic_avg = bp_input_components_data.reduce((total,next) => total + next.diastolic, 0) / bp_input_components_data.length
                let final_entry = {...diary_entry, systolic_avg: systolic_avg, diastolic_avg: diastolic_avg, readings: bp_input_components_data}
                console.log("systolic avg: ", systolic_avg);
                console.log("diastolic avg: ", diastolic_avg);
                console.log(final_entry)
                const diary = JSON.parse(await AsyncStorage.getItem('BPDiary'))
                diary.push(final_entry);
                console.log(diary)
                await AsyncStorage.setItem("BPDiary", JSON.stringify(diary))
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            Alert.alert("Diary entry cannot be empty, please put data")
            console.log("empty field in form")
        }
    }

    function addBPInputComponent() {
        console.log(bp_input_components_data)
        setNInputs(n_inputs + 1);
    } // maybe this will work ??

    return (
        <SafeAreaView>
            <ScrollView keyboardShouldPersistTaps="never">
                <View style={styles.body}>
                    <Header/>
                    <Text style={[GlobalStyle.CustomFont, styles.text]}>
                        Blood Pressure Diary page
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

                    <Text>Blood Pressure</Text>

                    {/* {console.log(bp_input_components_data)} */}
                    {bp_input_components_data.map((input_component) => <BPInputComponent key={input_component.index} id={input_component.index} bp_input_components_data={bp_input_components_data} setBPComponentsData={setBPComponentsData}/>)}

                    <CustomButton 
                        onPressFunction={() => addBPInputComponent()}
                        title="Enter another reading"
                        color="#008c8c"    
                    />

                    <CustomButton
                        style={{marginTop: 40}}
                        title='add to diary'
                        color='#1eb900'
                        onPressFunction={() => {
                            console.log(diary_entry);
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