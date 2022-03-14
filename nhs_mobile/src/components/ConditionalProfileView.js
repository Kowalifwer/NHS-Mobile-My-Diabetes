
import React, { useState, useRef } from 'react';
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
import CustomButton from '../components/CustomButton';
import DropdownStyle from '../styles/DropdownStyle';
import DropDownPicker from 'react-native-dropdown-picker';

const ConditionalProfileView = props => {
    let {setData, setDynamicUser, account_type} = props;

    const [medicineInput, setmedicineInput] = useState(null);

    const [daily_injections_open, setOpen] = useState(false);
    const [daily_injections_value, setValue] = useState(null);
    const [daily_injections, setDailyInjections] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5 or more', value: '5'}
    ]);

    const modifyMedicineList = () => {
        setDynamicUser(state => ({ ...state, ["medicine_list"]: [...state["medicine_list"], medicineInput] }))
        setmedicineInput(null);
        console.log(medicineInput)
        Alert.alert(medicineInput + " added to your Medicine List! Feel free to add more if neccesary.")
    }
    //a shared view that is used in multiple control flows
    const shared_view = () => {
        return(<View style={[styles.body, {marginTop: 50}]}>
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Enter your name'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Enter your age'
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Enter your height (cm)'
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                    />
                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Enter your weight (kg)'
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                    />

                    <TextInput
                        style={GlobalStyle.InputField}
                        placeholder='Medicine Name'
                        value={medicineInput}
                        onChangeText={(value) => setmedicineInput(value)}
                    />

                    <CustomButton
                        style={{marginTop: 40}}
                        title='Press to add medicine'
                        onPressFunction={modifyMedicineList}
                    />

                    <CustomButton
                        style={{marginTop: 40}}
                        title='Setup your profile!'
                        color='#1eb900'
                        onPressFunction={setData}
                    />
                </View>)}

    switch (account_type) {
    case "1":
    case "2":
        return shared_view()
    case "3": //IF USER TAKES INSULIN - TAKE THIS PATH
        return (<View style={styles.body}>
                    <DropDownPicker
                        dropDownDirection="BOTTOM"
                        style={[DropdownStyle.style, {marginTop: 20}]}
                        containerStyle={DropdownStyle.containerStyle}
                        placeholderStyle={DropdownStyle.placeholderStyle}
                        textStyle={DropdownStyle.textStyle}
                        labelStyle={DropdownStyle.labelStyle}
                        listItemContainerStyle={DropdownStyle.itemContainerStyle}
                        selectedItemLabelStyle={DropdownStyle.selectedItemLabelStyle}
                        selectedItemContainerStyle={DropdownStyle.selectedItemContainerStyle}
                        showArrowIcon={true}
                        showTickIcon={true}
                        placeholder="How many times a day do you inject?"
                        open={daily_injections_open}
                        value={daily_injections_value}
                        items={daily_injections}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setDailyInjections}
                        onChangeValue={(value) => setDynamicUser(state => ({ ...state, ["daily_injections"]:value }), [])}
                    />

                    {daily_injections_value != null && //MAKE SURE USER SPECIFIES HOW MANY TIMES THEY INJECT DAILY - THEN MOVE ONTO THE REST.
                        shared_view()
                    }
                </View>)
    default:
        console.log("None")
        return null;
    }
};

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

export default ConditionalProfileView;