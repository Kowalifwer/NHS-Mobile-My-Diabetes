import React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';


const GlucoseInputComponent = props => {
    let {setGlucoseComponentsData, glucoseReadings, id} = props

    const [show_time_picker, setShowTimePicker] = useState(false);

    return (
        <View>
            
            <Text style={[GlobalStyle.CustomFont]}>
                Blood Glucose Reading {id+1}
            </Text>

            {show_time_picker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    value={ glucoseReadings[id]["time"] }
                    onChange={(event, new_time) => {
                        setShowTimePicker(false);
                        if (new_time != undefined) {
                            setGlucoseComponentsData(state => (state.map(val => {
                                if (val.index == id) {
                                    return {...val, ['time']: new_time}
                                } return val;
                            })))
                        }
                        }
                    }
                />
            )}

            <CustomButton
                onPressFunction={() => {
                    setShowTimePicker(true);
                }}
                title="Enter Time"
                color="#008c8c"
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder="Reading (mmol/L)"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setGlucoseComponentsData(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['reading']: value.trim()}
                        } return val;
                    })))
                }}
            />

        </View>
    )

}

export default GlucoseInputComponent