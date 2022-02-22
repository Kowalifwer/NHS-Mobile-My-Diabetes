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
    let {setBPComponentsData, id, bp_input_components_data} = props

    const [state_dict, setStateDict] = useState({
        showTimePicker: false,
    });

    return (
        <View>
            {state_dict.showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    value={bp_input_components_data[id]["time"]}
                    onChange={(event, new_time) => {
                        setBPComponentsData(state => (state.map(val => {//#endregion
                            if (val.index == id) {
                                return {...val, ['time']: new_time}
                            } return val;
                        })))
                        }
                    }
                />
            )}
            <CustomButton
                onPressFunction={() => {
                    setStateDict(state => ({ ...state, 
                        ["showTimePicker"]:true,
                    }), [])
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
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['arm']: value.trim()}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="systolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['systolic']: value.trim()}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="diastolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['diastolic']: value.trim()}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />
        </View>
    )

}

export default BPInputComponent