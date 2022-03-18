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


// component for injection info
const InjectionInputComponent = props => {
    // props passed in from GlucoseDiary.js
    let {setInjectionsData, injectionsData, id, medicine_list} = props

    // boolean to render the time picker or not
    const [show_time_picker, setShowTimePicker] = useState(false);

    // states for rendering the insulin or not
    const [insulin_open, setOpen] = useState(false);
    const [insulin_value, setValue] = useState(null);
    
    const [insulin_type, setType] = useState(medicine_list.map((medicine_name) => {
        return {label: medicine_name , value: medicine_name}
    }))

    return (
        <View style={GlobalStyle.BodyGeneral}>
            
            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Cyan]}>
                Injection {id+1}
            </Text>

            {/* date picker */}
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

            {/* button to show the date picker */}
            <CustomButton
                onPressFunction={() => {
                    setShowTimePicker(true);
                }}
                title="Enter Time"
                color="#008c8c"
            />

            {/* dropdown to select the medication used */}
            <CustomDropDownPicker
                placeholder="Medication used"
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

            {/* numeric input for number of units */}
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