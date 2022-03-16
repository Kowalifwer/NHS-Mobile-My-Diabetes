
import React, { useState, useRef, useEffect } from 'react';
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
import SmartTextInput from '../components/SmartTextInput';

const ConditionalProfileView = props => {
    let {setData, dynamic_user, setDynamicUser, account_type} = props;

    const [medicineInput, setMedicineInput] = useState(null);
    const [medicineList, setMedicineList] = useState([]);

    const [daily_injections_open, setOpen] = useState(false);
    const [daily_injections_value, setValue] = useState(null);
    const [daily_injections, setDailyInjections] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5 or more', value: '5'}
    ]);

    const [medicine_open, setMedicineOpen] = useState(false);
    const [medicine_value, setMedicineValue] = useState(null);
    const [medicine_type, setMedicineType] = useState([])

    useEffect(() => {
        setDynamicUser(state => ({ ...state, ["medicine_list"]: medicineList }));
    }, [medicineList]);

    const modifyMedicineList = () => {
        setMedicineList(state => [...state, medicineInput])
        setMedicineType(state => [...state, {label: medicineInput, value: medicineInput}]) //FOR THE DROPDOWN
        setMedicineInput(null);
        Alert.alert(medicineInput + " added to your Medicine List! Feel free to add more if neccesary.")
    }

    const removeMedicines = () => {
        let new_medicine_list = [...medicineList]
        medicine_value.forEach(medicine_name => {
            new_medicine_list.splice(new_medicine_list.indexOf(medicine_name), 1)
        })
        console.log(new_medicine_list)
        setMedicineType(new_medicine_list.map(medicine_name => {
            return {label: medicine_name, value: medicine_name}
        }))
        setMedicineList(new_medicine_list)
        setMedicineValue(null)
        Alert.alert(`${medicineList.length - new_medicine_list.length} Medicines have been removed from your Medicine List!`)
    }

    //a shared view that is used in multiple control flows
    const shared_view = () => {
        return(<View style={[styles.body, {marginTop: 50}]}>
                    <SmartTextInput
                        placeholder='Enter your name'
                        value={dynamic_user.name}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your age'
                        value={dynamic_user.age}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your height (cm)'
                        value={dynamic_user.height}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your weight (kg)'
                        value={dynamic_user.weight}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                    />

                    {account_type != 1 && 
                        <View style={[styles.body, {marginTop: 40}]}>
                            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {textAlign: "center", marginHorizontal: 20, marginBottom: 25}]}>Please add your medicines in the section below</Text>
                            <SmartTextInput
                                value={medicineInput}
                                hint={`Name of medication number ${medicineList.length+1}`}
                                placeholder='Medicine Name'
                                onChangeText={(value) => setMedicineInput(value)}
                            />

                            <CustomButton
                                style={{marginTop: 0, marginBottom: 25}}
                                title={`Press to add medication ${medicineList.length+1} to list`}
                                onPressFunction={modifyMedicineList}
                            />

                            <DropDownPicker
                                multiple={true}
                                dropDownDirection="BOTTOM"
                                style={DropdownStyle.style}
                                containerStyle={DropdownStyle.containerStyle}
                                placeholderStyle={DropdownStyle.placeholderStyle}
                                textStyle={DropdownStyle.textStyle}
                                labelStyle={DropdownStyle.labelStyle}
                                listItemContainerStyle={DropdownStyle.itemContainerStyle}
                                selectedItemLabelStyle={DropdownStyle.selectedItemLabelStyle}
                                selectedItemContainerStyle={DropdownStyle.selectedItemContainerStyle}
                                showArrowIcon={true}
                                showTickIcon={true}
                                placeholder="Preview medicine list..."
                                open={medicine_open}
                                value={medicine_value}
                                items={medicine_type}
                                setOpen={setMedicineOpen}
                                setValue={setMedicineValue}
                                setItems={setMedicineType}
                            />

                            <CustomButton
                                color='red'
                                title={`Press to remove selected medications from list`}
                                onPressFunction={removeMedicines}
                            />
                        </View>
                    }

                    <CustomButton
                        style={{marginTop: 50}}
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
                        placeholder="How many daily injections?"
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