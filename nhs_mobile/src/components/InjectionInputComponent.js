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


const InjectionInputComponent = props => {
    let {setInjectionsData, injectionsData, id} = props

    const [show_time_picker, setShowTimePicker] = useState(false);

    return (
        <View>
            
            <Text style={[GlobalStyle.CustomFont]}>
                Injection {id+1}
            </Text>

            {show_time_picker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    value={ injectionsData[id]["time"] }
                    onChange={(event, new_time) => {
                        setShowTimePicker(false);
                        if (new_time != undefined) {
                            setInjectionsData(state => (state.map(val => {
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
                placeholder="Insulin type (long/fast)"
                onChangeText={(value) => {
                    setInjectionsData(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['type']: value.trim()}
                        } return val;
                    })))
                }}
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder="Units"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setInjectionsData(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['units']: value.trim()}
                        } return val;
                    })))
                }}
            />

        </View>
    )

}

export default InjectionInputComponent