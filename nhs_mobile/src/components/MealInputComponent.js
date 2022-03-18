import React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';
import FoodInputComponent from './FoodInputComponent';
import SmartTextInput from './SmartTextInput';


// this component renders a list of food input components which comprise one meal
const MealInputComponent = props => {
    let {id, meals, setMeals} = props
    const [show_time_picker, setShowTimePicker] = useState(false)

    const [meal_open, setOpen] = useState(false)
    const [meal_value, setValue] = useState(null)
    const [meal_types, setMealType] = useState([
        {label: 'Breakfast', value: 'breakfast'},
        {label: 'Lunch', value: 'lunch'},
        {label: 'Dinner', value: 'dinner'},
    ])

    // first element is a boolean, second element is the index of the component that is currently open for barcode scanning.
    const [barcode_scanner_open, setBarcodeScannerOpen] = useState([false, 0]);

    const [numFoods, setNumFoods] = useState(0)
    const [foodInputComponents, _setFoodInputComponents] = useState([])

    function setFoodInputComponents(foo) {
        _setFoodInputComponents(foo)
        setMeals(state => (state.map(val => {
            if (val.index == id) {
                return {...val, ['food']: foodInputComponents}
            } return val;
        })))
    }

    useEffect(() => {
        setFoodInputComponents(state => [...state, {index: numFoods, name: "", amount: "", energy: "", carb: "", fat: "", protein: "", sugar: "", scanned_item_object: {}}]);
    }, [numFoods])

    function addFoodInputComponent() {
        setNumFoods(numFoods + 1)
    }

    return (
        <View style={GlobalStyle.BodyGeneral}>

            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Cyan, {marginTop: 20, marginBottom: 20}]}>
                Meal
            </Text>

            {/* TIME PICKER */}
            {show_time_picker && 
                <DateTimePicker
                    testID="timePicker"
                    display="default"
                    mode="time"
                    style={{minWidth: 200}}
                    value={ meals[id]["time"] }
                    onChange={ (event, new_time) => {
                        if (Platform.OS !== 'ios') setShowTimePicker(false);
                        if (new_time != undefined) {
                            setMeals(state => (state.map(val => {
                                if (val.index == id) {
                                    return {...val, ['time']: new_time}
                                } return val;
                            })))
                        }
                    }}
                />
            }

            {/* BUTTON TO SHOW TIME PICKER */}
            <CustomButton
                onPressFunction={() => setShowTimePicker(true)}
                title="Enter Time"
                color="#008c8c"
            />            
            
            {/* MEAL PICKER DROPDOWN */}
            <DropDownPicker
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
                placeholder="Meal"
                open={meal_open}
                value={meal_value}
                items={meal_types}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setMealType}
                onChangeValue={(value) => setMeals(state => (state.map(val => {
                    if (val.index == id) {
                        return {...val, ['meal']: value.trim()}
                    } return val;
                })))}
            />

            {/* WATER INPUT */}
            <SmartTextInput
                placeholder='Water (ml)'
                keyboardType = 'numeric'
                onChangeText={value => {
                    setMeals(state => (state.map(val => {
                        if (val.index == id) {
                            return {...val, ['water']: value}
                        } return val;
                    })))
                }}
            />

            {foodInputComponents.map((input_component) => <FoodInputComponent key={input_component.index} id={input_component.index} food_input_components_data={foodInputComponents} setFoodInputComponentsData={setFoodInputComponents} barcode_scanner_open={barcode_scanner_open} setBarcodeScannerOpen={setBarcodeScannerOpen}/>)}

            <CustomButton 
                onPressFunction={addFoodInputComponent}
                title="Add another food"
            />

        </View>
    )

}

export default MealInputComponent