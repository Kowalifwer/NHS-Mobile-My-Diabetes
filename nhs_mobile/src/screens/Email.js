import * as MailComposer from 'expo-mail-composer';
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
    StatusBar,
    Button
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import user_struct from '../global_structures.js'
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

export default function Email({navigation}) {

    DropDownPicker.setListMode("SCROLLVIEW");
    const [selected, setSelectedRecipient] = useState("")
    const [selectedDiary, setSelectedDiary] = useState("")
    let htmlContent = "";

    const [email_open, setEmailOpen] = useState(false);
    const [email_value, setEmailValue] = useState(null);
    const [email, setEmail] = useState([]);

    //const [foodDiaryJSON, setFoodDiaryJSON] = useState([]);
    //const [bloodPressureDiaryJSON, setBloodPressureDiaryJSON] = useState([]); Will be uncommented and worked on when Blood Pressure Diary Implemented.
    //const [glucoseDiaryJSON, setGlucoseDiaryJSON] = useState([]); Will be uncommented and worked on when Glucose Diary Implemented.

    // Used for DropDownPicker. Automatically closes and opens picker depending on these values.
    const [diary_open, setDiaryOpen] = useState(false);
    const [diary_value, setDiaryValue] = useState(null);

    // depends on what diary is actually presented to user NEED TO FIX AFTER MERGE
    const [diaryItems, setDiaryItems] = useState([
        {label: 'Blood Pressure', value: 'Blood Pressure'},
        {label: 'Food Diary', value: 'Food Diary'},
        {label: 'Glucose Diary', value: 'Glucose Diary'}
    ]);

    // For DropDownPicker to close a picker when another opened
    const onEmailOpen = useCallback(() => {
        setDiaryOpen(false);
    }, []);

    const onDiaryOpen = useCallback(() => {
        setEmailOpen(false);
    }, []);

    //BLOOD PRESSURE JSON. Will be removed in future commits. Will be replaced with better way of incorporating actual json data from the diaries and not hardocded data.
    const bloodPressureDiaryJSON = [{
        "date": "15/01/2021",
        "morning": {"arm": "left",
                    "sys1": {"bp": 148, "time": "11:00"},
                    "sys2": {"bp": 117, "time": "11:30"},
                    "dia1": {"bp": 90, "time": "11:00"},
                    "dia2": {"bp": 76, "time": "11:30"},
                    "sys_avg": 132,
                    "dia_avg": 83},
        "evening": {"arm": "right",
                    "sys1": {"bp": 141, "time": "16:00"},
                    "sys2": {"bp": 110, "time": "16:30"},
                    "dia1": {"bp": 86, "time": "16:00"},
                    "dia2": {"bp": 70, "time": "16:30"},
                    "sys_avg": 126,
                    "dia_avg": 78}
    },
    {
        "date": "16/01/2021",
        "morning": {"arm": "right",
                    "sys1": {"bp": 11248, "time": "11:00"},
                    "sys2": {"bp": 11327, "time": "11:30"},
                    "dia1": {"bp": 2130, "time": "11:00"},
                    "dia2": {"bp": 71236, "time": "11:30"},
                    "sys_avg": 21412,
                    "dia_avg": 234},
        "evening": {"arm": "left",
                    "sys1": {"bp": 123, "time": "16:00"},
                    "sys2": {"bp": 134, "time": "16:30"},
                    "dia1": {"bp": 8232, "time": "16:00"},
                    "dia2": {"bp": 72442, "time": "16:30"},
                    "sys_avg": 124124,
                    "dia_avg": 23}
    }]

    //other Diary HTML

    const foodHTML = `PLACEHOLDER FOR FOOD DIARY HTML`
    const glucoseHTML = `PLACEHOLDER FOR GLUCOSE DIARY HTML`

    // Blood Pressure Diary HTML
    const bloodpressureHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${selectedDiary}</title>
        <style>
            table, th, tr, td {
                border:1px solid black;
            }

            td {
                text-align: center;
            }
        </style>
    </head>
    
    <body>
        <h3 style="color:red;font-style:italic;"> USES HARDCODED JSON VALUES RIGHT NOW. SYSTEM TO GET REAL JSON DATA FROM BLOOD PRESSURE DIARY TO BE IMPLEMENTED </h3>
        <h1>Diary: ${selectedDiary}</h1>
        <h1>NHS Number: TO BE IMPLEMENTED </h1>
        <h1>Date Generated: <span id="date"></span></h1>
    
        <script>
            n = new Date();
            y = n.getFullYear();
            m = n.getMonth() + 1;
            d = n.getDate();
            document.getElementById("date").innerHTML = d + "/" + m + "/" + y;
        </script>
        
        <!--Daily Results Table-->
        <p>Daily Results Table</p>
        
        <table style="width:100%">
            <tr>
                <th>DATE</th>
                <th>TIME</th>
                <th>PERIOD</th>
                <th>SYSTOLIC</th>
                <th>DIASTOLIC</th>
                <th>ARM</th>
            </tr>
            
            <tbody id="dailyResults"></tbody>
        
        </table>
        
        <br>
        <!--Average Results Table-->
        <p>Average Results Table</p>
        
        <table style="width:100%">
            <tr>
                <th>DATE</th>
                <th>MORNING AVERAGE SYSTOLIC</th>
                <th>MORNING AVERAGE DIASTOLIC</th>
                <th>EVENING AVERAGE SYSTOLIC</th>
                <th>EVENING AVERAGE DIASTOLIC</th>
            </tr>
            
            <tbody id="averageResults"></tbody>
        
        </table>
        
        <script>

            //BLOOD PRESSURE JSON        
            const bloodPressure = ${JSON.stringify(bloodPressureDiaryJSON)};
            
            /*
            (((Object.keys(jcontent[0].morning).length)-3)/2)+1              
            
            Iterates for amount of rows for sys and dia results. Since the amount of sys and dia results will vary depending on amount user inputs. 
            3 is taken away since there are three fields that don't relate to the blood pressures (they are time, average sys and average dia). 
            Next, divided by 2 since there are multiple fields for a result (sys1 and dia1 equate to 2 fields but in reality they only take 1 row). 
            Addition of 1 is for index through the array easier.
            
            */
            
            // Daily Results Scripting
            var dailyResults = document.getElementById('dailyResults');
            
            //Loops through each day in the JSON
            for (var day=0; day <bloodPressure.length; day++) {

                // Get Morning information from JSON and plots into daily results table
                for (var morn=1; morn < (((Object.keys(bloodPressure[day].morning).length)-3)/2)+1; morn++) {
                    var sys = "sys";
                    var dia = "dia";
                    var sysX = sys + morn;
                    var diaX = dia + morn;

                    dailyResults.innerHTML += '<tr>'+ '<td>' + bloodPressure[day].date + '</td>' + '<td>' + bloodPressure[day].morning[sysX].time + '</td>' + '<td>Morning</td>' + '<td>' + bloodPressure[day].morning[sysX].bp + '</td>' + '<td>' + bloodPressure[day].morning[diaX].bp + '</td>' + '<td>' + bloodPressure[day].morning.arm + '</td>' + '</tr>'
                }

                // Get Evening information from JSON and plots into daily results table
                for (var eveng=1; eveng < (((Object.keys(bloodPressure[day].evening).length)-3)/2)+1; eveng++) {
                    var sys = "sys";
                      var dia = "dia";
                      var sysX = sys + eveng;
                      var diaX = dia + eveng;

                  dailyResults.innerHTML += '<tr>' + '<td>' + bloodPressure[day].date + '</td>' + '<td>' + bloodPressure[day].evening[sysX].time + '</td>' + '<td>Evening</td>' + '<td>' + bloodPressure[day].evening[sysX].bp + '</td>' + '<td>' + bloodPressure[day].evening[diaX].bp + '</td>' + '<td>' + bloodPressure[day].evening.arm + '</td>' + '</tr>'
                }
                
            }
            
            // Average Results Scripting
            var averageResults = document.getElementById('averageResults');
            
            for (var day=0; day <bloodPressure.length; day++) {

                  averageResults.innerHTML += '<tr>' + '<td>' + bloodPressure[day].date + '</td>' + '<td>' + bloodPressure[day].morning.sys_avg + '</td>' + '<td>' + bloodPressure[day].morning.dia_avg + '</td>' + '<td>' + bloodPressure[day].evening.sys_avg + '</td>' + '<td>' + bloodPressure[day].evening.dia_avg + '</td>' + '</tr>'
            }

        </script>

    </body>
    
    </html>
`
    // Changes htmlContent variable depending on what diary is selected to be sent
    function changeHtmlContent() {

        if (selectedDiary == "Blood Pressure") {
            htmlContent = bloodpressureHTML;
        } else if (selectedDiary == "Food Diary") {
            htmlContent = foodHTML;
        } else if (selectedDiary == "Glucose Diary") {
            htmlContent = glucoseHTML;
        } else {
            htmlContent = "SOMETHING WENT WRONG"
        }
    }

    /* 
    // To share the pdf file
    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({
          htmlContent
        });
        console.log('File has been saved to:', uri);
        
        //await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
        return uri;
      }
    */

    useEffect(() => {
        getUserData();
   //     getFoodDiaryData();
    }, []);

    // General function to get Data from AsyncStorage. Depending on variable passed it will get data on different listings in AsyncStorage.
    const getData = async (jsonDataType) => {
        try {
          const jsonValue = await AsyncStorage.getItem(jsonDataType)
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

    
    /* TO BE WORKED ON
    // Gets JSON data of the Food Diary from AsyncStorage
    const getFoodDiaryData = async() => {
        try {
            var foodDiary = await getData('FoodDiary');
            console.log(foodDiary)
            setFoodDiaryJSON([]);

            //Adds each item in array to variable foodDiaryJSON by looping through
            for (var i =0; i< foodDiary.length; i++) {
                setFoodDiaryJSON(state =>, [])
            }
        } catch (e) {
            // error reading value
        }
    }
    */



    // Gets email recepients AsyncStorage
    const getUserData = async () => {
        try {
            var recipients = await getData('EmailData');
            console.log(recipients)
            setEmail([]);
            for (var i = 0; i < recipients.length; i++) {
                setEmail(state => [...state, {label: recipients[i], value: recipients[i]}])
            }
        } catch(e) {
        // error reading value
        }
    }

    /*
    const composeMail = async() => {

        //makes html code to pdf and saves to Filesystem Cache Directory
        
        const  { uri }  = await Print.printToFileAsync({
            htmlContent
        });
        
       
        try{
            console.log('this is uri ', uri);
            let emailResult = await MailComposer.composeAsync({
                recipients: [selected],
                subject: 'Test email',
                attachments: [uri],
            });
            console.log('email result: ', emailResult.status);
        } catch (e) {
            console.log(e);
        }
    }
    */

    const composeMail = async() => {
        //makes html code to pdf and saves to Filesystem Cache Directory
        
        changeHtmlContent();

        const file_object = await Print.printToFileAsync({
            html: htmlContent,
        });
       
        try{
            // console.log(file_object.base64);
            let emailResult = await MailComposer.composeAsync({
                recipients: (selected != null) ? [selected] : [],
                subject: 'Test email',
                attachments: [file_object.uri],
            });
            (emailResult.status === 'sent') ? Alert.alert(`Email sent successfully to ${selected}` ) : Alert.alert('Email has not been sent')
        } catch (e) {
            console.log(e);
        }
    }

    return (   
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Select which diary to send to a doctor from your diary list
                    </Text>
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
                        placeholder="Select from diary list!"
                        open={diary_open}
                        onOpen={onDiaryOpen}
                        value={diary_value}
                        items={diaryItems}
                        setOpen={setDiaryOpen}
                        setValue={setDiaryValue}
                        setItems={setDiaryItems}
                        onChangeValue={value => setSelectedDiary(value)}
                    />

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Send and email to a doctor from your doctors list
                    </Text>
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
                        placeholder="Select from doctors list!"
                        open={email_open}
                        onOpen = {onEmailOpen}
                        value={email_value}
                        items={email}
                        setOpen={setEmailOpen}
                        setValue={setEmailValue}
                        setItems={setEmail}
                        onChangeValue={value => setSelectedRecipient(value)}
                    />

                    <CustomButton
                        onPressFunction={() => composeMail()}
                        color="#ff0f00"
                        title="Compose Email"
                    />

                    <StatusBar style="auto" />

                    <Text style={[GlobalStyle.CustomFont, {marginTop: 40, fontSize: 20, marginHorizontal: 20}]}>If you didnt set up any doctors, you can do so using the button below</Text>

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 50,}}>
                        <CustomButton
                            title='Setup email recipients'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("EmailSetup")}
                        />
                        <CustomButton
                                title='Return to Homepage'
                                color='#761076'
                                onPressFunction={() => navigation.navigate("Home")}
                        />
                    </View>
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
        fontSize: 25,
        margin: 10,
        textAlign: 'center',
    },
})
