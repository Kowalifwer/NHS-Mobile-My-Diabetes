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
import CheckBox from "expo-checkbox";
import DialogInput from 'react-native-dialog-input';


// glucose input component 
const GlucoseInputComponent = props => {
    let {setGlucoseComponentsData, glucoseReadings, id} = props

    const [show_time_picker, setShowTimePicker] = useState(false);
    const [feelSick, setFeelSick] = useState(false);
    const [hypo, setHypo] = useState(false);
    const [hypoReason, setHypoReason] = useState("");
    const [showHypoDialog, setShowHypoDialog] = useState(false);

    // function to be run after user has entered a value which qualifies as hypoglycemic,
    // it sets the hypo and reason values in the reading
    const afterHypo = (reason = "") => {
        setGlucoseComponentsData(state => (state.map(val => {
            if (val.index == id) {
                return {...val, ["hypo"]: hypo, ["hypoReason"]: reason}
            } return val;
        })))
        setShowHypoDialog(false);
    }

    return (
        <View style={GlobalStyle.BodyGeneral}>
            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Cyan, {marginTop:20, marginBottom: 20}]}>
                Blood Glucose Reading {id+1}
            </Text>

            {/* time picker */}
            {show_time_picker && (
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    style={{minWidth: 200}}
                    value={ glucoseReadings[id]["time"] }
                    onChange={(event, new_time) => {
                        if (Platform.OS !== 'ios') setShowTimePicker(false);
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

            {/* button to show time picker */}
            <CustomButton
                onPressFunction={() => {
                    setShowTimePicker(true);
                }}
                title="Enter Time"
            />

            {/*  */}
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="Reading (mmol/L)"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setGlucoseComponentsData(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['reading']: value.trim(), ["hypo"]: hypo, ["hypoReason"]: hypoReason}
                        } return val;
                    })))
                }}
                // check if reading indicates hypoglycemia after ending input
                onEndEditing={(event) => {
                    let value = event.nativeEvent.text
                    if (parseInt(value) <= 4) {
                        setHypo(true);
                        setShowHypoDialog(true);
                    } else {
                        setHypo(false);
                        setHypoReason("");
                        afterHypo("");
                    }
                }}
            />

            <View style={styles.checkboxContainer}>
                <Text style={[styles.label, GlobalStyle.CustomFont]}>I don't feel well</Text>
                <CheckBox
                    value={feelSick}
                    onValueChange={(value) => {
                        setFeelSick(value);
                        setGlucoseComponentsData(state => (state.map(val => {
                            if (val.index == id) {
                                return {...val, ["feelSick"]: value}
                            } return val;
                        })))
                    }}
                    style={GlobalStyle.CheckBox}
                />
            </View>

            <DialogInput isDialogVisible={showHypoDialog}
                title={"Low Blood Sugar"}
                message={"This reading is below 4mmol/L, please explain why"}
                hintInput ={"Reason"}
                submitInput={ value => {
                    setHypoReason(value);
                    afterHypo(value);
                }}
                closeDialog={ () => afterHypo() }>
            </DialogInput>            

        </View>
    )

}

export default GlucoseInputComponent

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
