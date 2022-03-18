import React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';
import CustomDropDownPicker from './CustomDropDownPicker';
import SmartTextInput from './SmartTextInput';

// this is the food input which gets added to the page when user clicks the + button
const BPInputComponent = props => {
    let {id, setBPReadings, bp_readings} = props
    const [show_time_picker, setShowTimePicker] = useState(false);

    const [arm_open, setOpen] = useState(false);
    const [arm_value, setValue] = useState(null);
    const [arm_type, setArmType] = useState([
        {label: 'Left', value: 'left'},
        {label: 'Right', value: 'right'},
    ])

    return (
        <View style={GlobalStyle.BodyGeneral}>

            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Cyan, {marginTop: 20, marginBottom: 20}]}>
                Blood Pressure Reading {id+1}
            </Text>
            
            <CustomDropDownPicker
                placeholder="Which arm used for reading?"
                open={arm_open}
                value={arm_value}
                items={arm_type}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setArmType}
                onChangeValue={(value) => setBPReadings(state => (state.map(val => {//#endregion
                    if (val.index == id) {
                        return {...val, ['arm']: value.trim()}
                    } return val;
                })))}
            />
            <SmartTextInput
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
            <SmartTextInput
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
            {show_time_picker && 
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    style={{minWidth: 200}}
                    value={ bp_readings[id]["time"] }
                    onChange={ (event, new_time) => {
                        if (Platform.OS !== 'ios') setShowTimePicker(false);
                        if (new_time != undefined) {
                            setBPReadings(state => (state.map(val => {//#endregion
                                if (val.index == id) {
                                    return {...val, ['time']: new_time}
                                } return val;
                            })))
                        }
                        }
                    }
                />
            }
            <CustomButton
                onPressFunction={() => setShowTimePicker(true)}
                title="Enter Time"
                color="#008c8c"
            />
        </View>
    )

}

export default BPInputComponent