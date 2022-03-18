import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, 
    ScrollView,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';

import MealInputComponent from '../components/MealInputComponent';


export default function EditDiaries({ navigation }) {
    // dropdown-related states
    const [select_diary_dropdown_open, setSelectDiaryDropdownOpen] = useState(false)
    const [selected_diary, setSelectedDiary] = useState(null)
    const [diary_choices, setDiaryChoice] = useState([
        {label: 'Food Diary', value: 'NewFoodDiary'},
        {label: 'Blood Pressure Diary', value: 'BPDiary'},
        {label: 'Glucose Diary', value: 'GlucoseDiary'},
    ])

    // entry-related states
    const [entry_dropdown_open, setEntryDropdownOpen] = useState(false)
    const [selected_diary_entry, setSelectedDiaryEntry] = useState(null)
    const [diary_entries, changeDiaryEntries] = useState([]) // <------------------------------------------

    // editor-related states
    const [input_components, setInputComponents] = useState([])
    const [meals, setMeals] = useState([]); // for food diary

    let editor
    if (selected_diary == "NewFoodDiary" && selected_diary_entry != null) {

        editor = <View>
            {selected_diary_entry.meals.map((input_component, i) => <MealInputComponent key={i} id={i} meals={meals} setMeals={setMeals}/>)}
        </View>

    } else if (selected_diary == "BPDiary" && selected_diary_entry != null) {
        
        editor = <View>
            
        </View>

    } else if (selected_diary == "GlucoseDiary" && selected_diary_entry != null) {

        editor = <View>
            
        </View>

    }

    useEffect(() => {
        if (selected_diary == "NewFoodDiary" && selected_diary_entry != null) {
            setMeals(selected_diary_entry["meals"])
        }
    }, selected_diary_entry)

    // function to set selectable diary entries
    const updateDiaryEntries = async () => {
        console.log("hello :)")
        let diary = JSON.parse(await AsyncStorage.getItem(selected_diary))
        let new_entries = []
        if (diary != null) {
            for (let i = 0; i < diary.length; i++) {
                let entry = diary[i]
                new_entries.push({label: entry.key, value: entry})
            }            
        }
        changeDiaryEntries(new_entries)
    }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>

                    {/* dropdown to pick the diary */}

                    <DropDownPicker
                        dropDownDirection="BOTTOM"
                        style={[DropdownStyle.style, {marginBottom: 25}]}
                        containerStyle={DropdownStyle.containerStyle}
                        placeholderStyle={DropdownStyle.placeholderStyle}
                        textStyle={DropdownStyle.textStyle}
                        labelStyle={DropdownStyle.labelStyle}
                        listItemContainerStyle={DropdownStyle.itemContainerStyle}
                        selectedItemLabelStyle={DropdownStyle.selectedItemLabelStyle}
                        selectedItemContainerStyle={DropdownStyle.selectedItemContainerStyle}
                        showArrowIcon={true}
                        showTickIcon={true}
                        placeholder="Select Diary"
                        open={select_diary_dropdown_open}
                        value={selected_diary}
                        items={diary_choices}
                        setOpen={setSelectDiaryDropdownOpen}
                        setValue={setSelectedDiary}
                        setItems={setDiaryChoice}
                        onChangeValue={value => {
                            setSelectedDiaryEntry(null)
                            updateDiaryEntries(value)
                        }}
                    />                    

                    {/* picker to select entry from selected diary */}

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
                        placeholder="Select an Entry"
                        open={entry_dropdown_open}
                        value={selected_diary_entry}
                        items={diary_entries}
                        setOpen={setEntryDropdownOpen}
                        setValue={setSelectedDiaryEntry}
                        setItems={changeDiaryEntries}
                        // onChangeValue={}
                    />   

                    {/* section to render the selected entry */}

                    {selected_diary_entry != null && (
                        <Text>Hello :)</Text>
                    )}

                    {editor != null && editor}

                    {/* button to apply edits */}

                    <CustomButton
                            title='Homepage'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Home")}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

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