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
import food_diary_entry from '../../global_structures.js';
import BPInputComponent from '../../components/BPInputComponent';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function BPDiary({ navigation }) {
    const [diary_entry, setDiaryEntry] = useState(bp_diary_entry)
    const [bp_input_components, setBPInputComponents] = useState([new BPInputComponent()]);
    
    const [date, setDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)

    useEffect(() => {
        getOrCreateBPDiary();
    }, []); // don't know what this is doing

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
        if (Object.values(diary_entry).some(x => x !== '')) {
            try {
                const readings = bp_input_components.map((component) => component.dict);
                diary_entry["readings"] = readings
                // diary_entry["systolic_avg"] = readings.map((entry) => entry["systolic"])
                console.log(readings.map((entry) => entry["systolic"]))
                const diary = JSON.parse(await AsyncStorage.getItem('BPDiary'))
                diary.push(diary_entry);
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
        setBPInputComponents(bp_input_components => [...bp_input_components, new BPInputComponent()]);
    } // maybe this will work ??

    return (
        <SafeAreaView key={"BPDiary_key"}>
            <ScrollView keyboardShouldPersistTaps="handheld">
                <View style={styles.body}>
                    <Header></Header>
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

                    {bp_input_components.map((input_component) => input_component.render())}
                    <CustomButton 
                        onPressFunction={addBPInputComponent}
                        title="Enter another reading"
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