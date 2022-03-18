import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import BarcodeScannerComponent from '../components/BarcodeScannerComponent';
import CustomButton from '../components/CustomButton';
import SmartTextInput from '../components/SmartTextInput';
import {object_is_empty} from '../global_structures.js'
// this is the food input which gets added to the page when user clicks the + button

const query_object_for_food_component = (object, key) => {
    if (object_is_empty(object)) return ""
    if (object[key] == undefined) return ""
    return object[key].toString()
}

const FoodInputComponent = (props) => {
    // props passed to this component during rendering, which point back to the states in meal input component
    const {food_input_components_data, setFoodInputComponentsData, id, setBarcodeScannerOpen, barcode_scanner_open} = props
    // used for barcode scanner
    const [scanned_data, setScannedData] = useState(null);

    //Define the state of all the input components. Components will be rendered from this array.
    const [render_input_components, setRenderInputComponents] = useState([
        {placeholder: "Food Name", is_numeric: false, component_update_key: "name", is_nutrient: false, current_value: ""},
        {placeholder: "Amount (g)", is_numeric: true, component_update_key: "amount", is_nutrient: false, current_value: ""},
        {placeholder: "Protein (per 100g)", is_numeric: true, component_update_key: "protein", is_nutrient: true, current_value: ""},
        {placeholder: "Sugar (per 100g)", is_numeric: true, component_update_key: "sugar", is_nutrient: true, current_value: ""},
        {placeholder: "Fat (per 100g)", is_numeric: true, component_update_key: "fat", is_nutrient: true, current_value: ""},
        {placeholder: "Carbohydrates (per 100g)", is_numeric: true, component_update_key: "carb", is_nutrient: true, current_value: ""},
        {placeholder: "Energy (kcal)", is_numeric: true, component_update_key: "energy", is_nutrient: true, current_value: ""},
    ])

    useEffect(() => { // If scanned data changes - make sure to update the input fields as well!
        if (scanned_data) {
            setRenderInputComponents(state => (state.map(entry => {
                return {...entry, current_value: (entry.is_nutrient) ? query_object_for_food_component(scanned_data["nutrients"], entry.component_update_key) : query_object_for_food_component(scanned_data, entry.component_update_key)}
            })));
        }
    }, [scanned_data]);

    useEffect(() => { //If input fields change - make sure to update the parent object state that holds all the data.
        if (render_input_components.some(component => component.current_value != "")) {
            let copy_state = [...food_input_components_data]
            render_input_components.forEach((render_component) => {
                copy_state[id][render_component.component_update_key] = render_component.current_value
            })
            setFoodInputComponentsData(copy_state);
        };
    }, [render_input_components]);

    return (
        <View style={GlobalStyle.BodyGeneral}>
            {(object_is_empty(food_input_components_data[id]["scanned_item_object"])) ? 
                <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginTop:15, marginBottom:25 }]}>Diary data for food item {id+1}. </Text> : 
                <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginTop:15, marginBottom:25 }]}>Some data for food item {id+1} has been filled by Barcode scanner! Please double check and make sure to update anything that is not correct!</Text>
            }
            {/* Render all inputs here! All logic is dealt with, please define components above if neccesary */}
            {render_input_components.map((val, index) => 
                <SmartTextInput
                    key={index}
                    value={val.current_value}
                    placeholder={val.placeholder}
                    onChangeText={(value) => {
                        setRenderInputComponents(state => (state.map(entry => {
                            if (entry.component_update_key == val.component_update_key) {
                                return {...entry, current_value: value}
                            } return entry;
                        })));
                    }}
                    keyboardType={(val.is_numeric) ? "numeric" : "default"}
                />
            )}
            
            {(barcode_scanner_open[0] && barcode_scanner_open[1] == id) && <BarcodeScannerComponent id={id} setFoodInputComponentsData={setFoodInputComponentsData} setBarcodeScannerOpen={setBarcodeScannerOpen} barcode_scanner_open={barcode_scanner_open} setScannedData={setScannedData}/>}
            
            {(!(barcode_scanner_open[0] && barcode_scanner_open[1] == id)) && <CustomButton
                color="#f96a3e"
                onPressFunction={() => {
                    setBarcodeScannerOpen([true, id])
                }}
                title={`Barcode scan a food into food item ${id+1}!`}
            />}
            
        </View>
        )
}

export default FoodInputComponent