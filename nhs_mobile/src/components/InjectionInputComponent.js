import React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';
import CustomDropDownPicker from './CustomDropDownPicker';
import SmartTextInput from './SmartTextInput';

const InjectionInputComponent = props => {
    let {setInjectionsData, injectionsData, id, medicine_list} = props

    const [show_time_picker, setShowTimePicker] = useState(false);

    const [insulin_open, setOpen] = useState(false);
    const [insulin_value, setValue] = useState(null);
    const [insulin_type, setType] = useState([
        {label: "Long" , value: "long"},
        {label: "Fast" , value: "fast"},
    ])

    return (
        <View style={GlobalStyle.BodyGeneral}>
            
            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Cyan]}>
                Injection {id+1}
            </Text>

            {show_time_picker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    style={{minWidth: 200}}
                    value={ injectionsData[id]["time"] }
                    onChange={(event, new_time) => {
                        if (Platform.OS !== 'ios') setShowTimePicker(false);
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

            <CustomDropDownPicker
                placeholder="Injection type"
                open={insulin_open}
                value={insulin_value}
                items={insulin_type}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setType}
                onChangeValue={(value) => {
                    setInjectionsData(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['type']: value.trim()}
                        } return val;
                    })))
                }}
            />

            <SmartTextInput
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