
import React, { useState } from 'react';
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
    let {setData} = props;
    let {setDynamicUser} = props;
    let {account_type} = props;
    
    console.log(account_type)

    switch (account_type) {
    case "1":
    case "2":
        return <View>
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Enter your name'
                    onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                />
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Enter your age'
                    onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                />
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Enter your height (cm)'
                    onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                />
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Enter your weight (kg)'
                    onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                />

                <CustomButton
                    style={{marginTop: 40}}
                    title='Setup your profile!'
                    color='#1eb900'
                    onPressFunction={setData}
                />
            </View>
    case "3": //IF USER TAKES INSULIN - TAKE THIS PATH
        const [daily_injections_open, setOpen] = useState(false);
        const [daily_injections_value, setValue] = useState(null);
        const [daily_injections, setDailyInjections] = useState([
            {label: '1', value: '1'},
            {label: '2', value: '2'},
            {label: '3', value: '3'},
            {label: '4', value: '4'},
            {label: '5 or more', value: '5'}
        ])
        return <View>
                    <DropDownPicker
                        dropDownDirection="BOTTOM"
                        style={[DropdownStyle.style, {marginTop: 20, marginBottom: 200}]}
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
                        <View>
                            <TextInput
                            style={GlobalStyle.InputField}
                            placeholder='Enter your name'
                            onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                            />
                            <TextInput
                                style={GlobalStyle.InputField}
                                placeholder='Enter your name'
                                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                            />
                            <TextInput
                                style={GlobalStyle.InputField}
                                placeholder='Enter your age'
                                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                            />
                            <TextInput
                                style={GlobalStyle.InputField}
                                placeholder='Enter your height (cm)'
                                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                            />
                            <TextInput
                                style={GlobalStyle.InputField}
                                placeholder='Enter your weight (kg)'
                                onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                            />

                            <CustomButton
                                style={{marginTop: 40}}
                                title='Setup your profile!'
                                color='#1eb900'
                                onPressFunction={setData}
                            />
                        </View>
                    }

            
    </View>
    default:
        console.log("None")
        return null;
    }
};

export default ConditionalProfileView;