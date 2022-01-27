import React from "react";
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

const ConditionalProfileView = props => {
    let {set_data_function} = props;
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
                    onPressFunction={set_data_function}
                />
            </View>
    case "3":
        return <View>
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
                onPressFunction={set_data_function}
            />
    </View>
    default:
        console.log("None")
        return null;
    }
};

export default ConditionalProfileView;