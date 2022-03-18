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

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownStyle from '../styles/DropdownStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';


export default function EditDiaries({ navigation }) {
    // dropdown-related states
    const [select_diary_dropdown_open, setSelectDiaryDropdownOpen] = useState(false)
    const [selected_diary, setSelectedDiary] = useState("")
    const [diary_choices, setDiaryChoice] = useState([
        {label: 'Food Diary', value: 'NewFoodDiary'},
        {label: 'Blood Pressure Diary', value: 'BPDiary'},
        {label: 'Glucose Diary', value: 'GlucoseDiary'},
    ])

    // entry-related states
    const [entry_dropdown_open, setEntryDropdownOpen] = useState(false)
    const [selected_diary_entry, setSelectedDiaryEntry] = useState("")
    const [diary_entries, changeDiaryEntries] = useState([])

    // function to set 
    const updateDiaryEntries = async () => {
        console.log("hello :)")
        let diary = JSON.parse(await AsyncStorage.getItem(selected_diary))
        console.log("diary: ", diary)
        let new_entries = []
        if (diary != null) {
            for (let i = 0; i < diary.length; i++) {
                let entry = diary[i]
                console.log("entry: ", entry)
                new_entries.push({label: "???", value: "???"})
            }            
        }
        changeDiaryEntries(new_entries)
    }

    useEffect(updateDiaryEntries, [selected_diary])

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
                        // onChangeValue={updateDiaryEntries}
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
                        onChangeValue={value => console.log(value)}
                    />   

                    {/* section to render the selected entry */}

                    {/* button to apply edits */}

                    <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginBottom:45, marginTop:15}]}>{diary_entries}</Text>

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