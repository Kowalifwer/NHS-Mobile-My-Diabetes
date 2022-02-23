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


// this is the food input which gets added to the page when user clicks the + button
const BPInputComponent = props => {
    let {id, setBPReadings, bp_readings} = props
    const [show_time_picker, setShowTimePicker] = useState(false);

    return (
        <View>
            {show_time_picker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    value={bp_readings[id]["time"]}
                    onChange={(event, new_time) => {
                        setBPReadings(state => (state.map(val => {//#endregion
                            if (val.index == id) {
                                return {...val, ['time']: new_time}
                            } return val;
                        })))
                        setShowTimePicker(false);
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
            <Text style={[GlobalStyle.CustomFont]}>
                Blood Pressure Reading {id+1}
            </Text>
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='arm'
                onChangeText={(value) => {
                    setBPReadings(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['arm']: value.trim()}
                        } return val;
                    })))
                }}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="systolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPReadings(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['systolic']: value.trim()}
                        } return val;
                    })))
                }}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="diastolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPReadings(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['diastolic']: value.trim()}
                        } return val;
                    })))
                }}
            />
        </View>
    )

}

export default BPInputComponent