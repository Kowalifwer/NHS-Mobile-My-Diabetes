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
// this is the food input which gets added to the page when user clicks the + button
const FoodInputComponent = (props) => {
    const {setFoodInputComponentsData, id, setBarcodeScannerOpen, barcode_scanner_open} = props
        
    return (
        <View>
            <Text>Diary data for food item {id+1}</Text>
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Food Name'
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['name']: value}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder='Brand'
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['brand']: value}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
            />

            <TextInput
                style={GlobalStyle.InputField}
                placeholder="Weight or Amount"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setFoodInputComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['amount']: value.trim()}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
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