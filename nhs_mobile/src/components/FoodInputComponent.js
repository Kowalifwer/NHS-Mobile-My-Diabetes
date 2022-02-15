import React from 'react';
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


// this is the food input which gets added to the page when user clicks the + button
class FoodInputComponent extends React.Component {
    constructor() {
        super();
        this.dict = {name: "", brand: "", amount: ""};
    }

    render() {
        return (
            <View>
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Food Name'
                    onChangeText={(value) => {
                        this.dict["name"] = value.trim()
                    }}
                    multiline={true}
                    numberOfLines={1}
                />
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder='Brand'
                    onChangeText={(value) => {
                        this.dict["brand"] = value.trim()
                    }}
                    multiline={true}
                    numberOfLines={1}
                />
                <TextInput
                    style={GlobalStyle.InputField}
                    placeholder="Weight or Amount"
                    keyboardType="numeric"
                    onChangeText={(value) => {
                        this.dict["amount"] = value.trim()
                    }}
                    multiline={true}
                    numberOfLines={1}
                />
            </View>
        );
    }
}

export default FoodInputComponent