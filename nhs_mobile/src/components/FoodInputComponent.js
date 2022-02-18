import React, { useState, useEffect } from 'react';
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
import BarcodeScannerComponent from '../components/BarcodeScannerComponent';
import CustomButton from '../components/CustomButton';
import {object_is_empty} from '../global_structures.js'
// this is the food input which gets added to the page when user clicks the + button

const query_object_for_food_component = (object, key) => {
    if (object_is_empty(object)) return ''
    if (object[key] == undefined) return ''
    return object[key]
}

const FoodInputComponent = (props) => {
    const {food_input_components_data, setFoodInputComponentsData, id, setBarcodeScannerOpen, barcode_scanner_open} = props
        
    return (
        <View>
            {(object_is_empty(food_input_components_data[id]["scanned_item_object"])) ? 
                <Text>Diary data for food item {id+1}. </Text> : 
                <Text>Some data for food item {id+1} has been filled by Barcode scanner! Please double check and make sure to update anything that is not correct!</Text>
            }
            
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Food Name'
                value={query_object_for_food_component(food_input_components_data[id]["scanned_item_object"], "name")}
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => { //updates the food_input_components_data
                        if (val.index == id) {
                            return {...val, ['name']: value}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Brand'
                value={query_object_for_food_component(food_input_components_data[id]["scanned_item_object"], "name")}
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => {//updates the food_input_components_data
                        if (val.index == id) {
                            return {...val, ['brand']: value}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder="Weight or Amount"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => {//updates the food_input_components_data
                        if (val.index == id) {
                            return {...val, ['amount']: value.trim()}
                        } return val;
                    })))
                }}
                // multiline={true}
                // numberOfLines={1}
            />

            {(barcode_scanner_open[0] && barcode_scanner_open[1] == id) && <BarcodeScannerComponent id={id} setFoodInputComponentsData={setFoodInputComponentsData} setBarcodeScannerOpen={setBarcodeScannerOpen} barcode_scanner_open={barcode_scanner_open}/>}

            <CustomButton
                onPressFunction={() => {
                    setBarcodeScannerOpen([true, id])
                }}
                title={`Scan a food into food slot ${id+1}!`}
                color="#008c8c"
            />
        </View>
        )
}

export default FoodInputComponent