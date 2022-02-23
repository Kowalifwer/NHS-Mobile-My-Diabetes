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
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';

export default function Email({navigation, route}) {

    DropDownPicker.setListMode("SCROLLVIEW");
    
    const stored_user = route.params?.stored_user //can access all current user data from this variable.
    const [selected, setSelectedRecipient] = useState("");
    const [selectedDiary, setSelectedDiary] = useState("");
    
    let htmlContent = "";
    const [imageHTML, setImageHTML] = useState();
    const [currentDate, setCurrentDate] = useState("");
    
    //Stores each html table data for each diary. To be used in each html variable
    const [htmlTableData, setHtmlTableData] = useState({bloodPressureDailyResultsHTML: "", bloodPressureAverageResultsHTML: "", foodResultsHTML: "", waterResultsHTML: "", glucoseResultsHTML: ""});

    // Stores each excel files URI to be used as an Email Attachement
    const [excelURIS, setExcelURIS] = useState({bloodpressure: "", food: "", glucose: ""});
    
    const [email, setEmail] = useState([]);

    //const [foodDiaryJSON, setFoodDiaryJSON] = useState([]); //Will be uncommented and worked on when Food Diary Implemented.
    //const [bloodPressureDiaryJSON, setBloodPressureDiaryJSON] = useState([]); //Will be uncommented and worked on when Blood Pressure Diary Implemented.
    //const [glucoseDiaryJSON, setGlucoseDiaryJSON] = useState([]); //Will be uncommented and worked on when Glucose Diary Implemented.

    // Used for DropDownPicker. Automatically closes and opens picker depending on these values.
    const [diary_open, setDiaryOpen] = useState(false);
    const [diary_value, setDiaryValue] = useState(null);
    const [email_open, setEmailOpen] = useState(false);
    const [email_value, setEmailValue] = useState(null);

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

    // Changes image to be used in the html's into base64 and into html code. This is done because Expo Print has no facility to add local images so this workaround was made.
    async function generateImageHTML() {
        const asset = Asset.fromModule(require('../../assets/my_diabetes.jpg'));
        const image = await manipulateAsync(
            asset.localUri ?? asset.uri,
            [],
            {base64: true}
        );

        return `<img src="data:image/jpeg;base64,${image.base64}" class="center"/>`;
    }

    // Generates current date to be added to html of the diaries
    function generateCurrentDate() {
        const n = new Date();
        const y = n.getFullYear();
        const m = n.getMonth() + 1;
        const d = n.getDate();
        return d + "/" + m + "/" + y;
    }

    //BLOOD PRESSURE JSON. Will be removed in future commits. Will be replaced with better way of incorporating actual json data from the diaries and not hardocded data. TESTING PURPOSES
    const bloodPressureDiaryJSON = [{
        date: "22/02/2022",
        morning: [
            {time: "09:31", arm: "left", systolic: "110", diastolic: "73"},
            {time: "09:34", arm: "right", systolic: "117", diastolic: "74"},
        ],
        evening: [
            {time: "20:11", arm: "left", systolic: "111", diastolic: "72"},
            {time: "20:15", arm: "right", systolic: "115", diastolic: "75"},
        ],
        morning_systolic_avg: "113.5",
        morning_diastolic_avg: "73.5",
        evening_systolic_avg: "113",
        evening_diastolic_avg: "73.5",
    },
    {
        date: "23/02/2022",
        morning: [
            {time: "10:51", arm: "left", systolic: "521", diastolic: "41"},
            {time: "04:15", arm: "right", systolic: "130", diastolic: "974"},
        ],
        evening: [
            {time: "18:22", arm: "left", systolic: "127", diastolic: "9423"},
            {time: "19:37", arm: "right", systolic: "648", diastolic: "304"},
        ],
        morning_systolic_avg: "423.5",
        morning_diastolic_avg: "713.5",
        evening_systolic_avg: "5113",
        evening_diastolic_avg: "124713.5",
    }];

    //FOOD DIARY JSON. Will be removed in future commits. Will be replaced with better way of incorporating actual json data from the diaries and not hardocded data. TESTING PURPOSES
    const foodDiaryJSON = [{
        "date": "11/09/2001",
        "time": "13:46",
        "meal": "lunch",
        "water": "400",
        "food": [{ "index": 0,
                    "scanned_item_object": {},
                    "name": "beesechurger",
                    "amount": 1,
                    "carb": "2000",
                    "kcal": "2000",
                    "fat": "2000",
                    "protein": "2000",
                    "sugar": "2000",
                  },
                  { "index": 1,
                    "scanned_item_object": {},
                    "name": "chiken nuget",
                    "amount": 400,
                    "carb": "3",
                    "kcal": "3",
                    "fat": "3",
                    "protein": "3",
                    "sugar": "7000",
                   }]
        },
      {
          "date": "30/10/2001",
          "time": "13:46",
          "meal": "diner",
          "water": "800",
          "food": [
                    { "index": 0,
                      "scanned_item_object": {},
                      "name": "fish",
                      "amount": 1,
                      "carb": "12",
                      "kcal": "12300",
                      "fat": "454",
                      "protein": "5530",
                      "sugar": "13443",
                    },
                    { "index": 1,
                      "scanned_item_object": {},
                      "name": "alien",
                      "amount": 0.4,
                      "carb": "123",
                      "kcal": "4214",
                      "fat": "876",
                      "protein": "222",
                      "sugar": "1",
                     },
                   ]
        }
      ];

    // Food Diary HTML
    const foodHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Food Diary</title>
        <style>
            table, td {
                border:1px solid black;
            }

            td {
                text-align: center;
                overflow: hidden; 
                text-overflow: ellipsis; 
                word-wrap: break-word;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            .center {
                display: block;
                margin-left: auto;
                margin-right: auto;
                width: 50%;
            }
        </style>
    </head>
    
    <body>
        ${imageHTML}
        <h3 style="color:red;font-style:italic;"> USES HARDCODED JSON VALUES RIGHT NOW. SYSTEM TO GET REAL JSON DATA FROM FOOD DIARY TO BE IMPLEMENTED </h3>
        <h1>Diary: Food Diary</h1>
        <h1>NHS Number: ${stored_user.nhs_number} </h1>
        <h1>Date Generated: ${currentDate}</h1>

        <!--Food Results Table-->
        <p>Food Results Table</p>

        <table>
            ${htmlTableData.foodResultsHTML}
        </table>

        <!--Water Results Table-->
        <p>Water Results Table</p>

        <table>
            ${htmlTableData.waterResultsHTML}
        </table>

    </body>
    
    </html>
`

    // Glucose Diary HTML
    const glucoseHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Glucose Diary</title>
        <style>
        table, td {
            border:1px solid black;
        }

        td {
            text-align: center;
            overflow: hidden; 
            text-overflow: ellipsis; 
            word-wrap: break-word;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 50%;
        }
        </style>
    </head>
    
    <body>
        ${imageHTML}
        <h1>Diary: Glucose Diary</h1>
        <h1>NHS Number: ${stored_user.nhs_number} </h1>
        <h1>Date Generated: ${currentDate}</h1>
    </body>
    
    </html>
`

    // Blood Pressure Diary HTML
    const bloodpressureHTML = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blood Pressure Diary</title>
        <style>
        table, td {
            border:1px solid black;
        }

        td {
            text-align: center;
            overflow: hidden; 
            text-overflow: ellipsis; 
            word-wrap: break-word;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        .center {
            display: block;
            margin-left: auto;
            margin-right: auto;
            width: 50%;
        }
        </style>
    </head>
    
    <body>
        ${imageHTML}
        <h3 style="color:red;font-style:italic;"> USES HARDCODED JSON VALUES RIGHT NOW. SYSTEM TO GET REAL JSON DATA FROM BLOOD PRESSURE DIARY TO BE IMPLEMENTED </h3>
        <h1>Diary: Blood Pressure</h1>
        <h1>NHS Number: ${stored_user.nhs_number} </h1>
        <h1>Date Generated: ${currentDate}</h1>
        
        <!--Daily Results Table-->
        <p>Daily Results Table</p>
        
        <table>
            ${htmlTableData.bloodPressureDailyResultsHTML}
        </table>
        
        <br>
        <!--Average Results Table-->
        <p>Average Results Table</p>
        
        <table>
            ${htmlTableData.bloodPressureAverageResultsHTML}
        </table>

    </body>
    
    </html>
`
    // Changes htmlContent variable depending on what diary is selected to be sent
    function changeHtmlContent(index) {
        
        if (selectedDiary[index] == "Blood Pressure") {
            htmlContent = bloodpressureHTML;
        } else if (selectedDiary[index] == "Food Diary") {
            htmlContent = foodHTML;
        } else if (selectedDiary[index] == "Glucose Diary") {
            htmlContent = glucoseHTML;
        } else {
            htmlContent = "SOMETHING WENT WRONG"
        }
    }

    useEffect(async () => {
        setImageHTML(await generateImageHTML());
        setCurrentDate(generateCurrentDate());
        getUserData();
        //getFoodDiaryData();
        //getBloodPressureDiaryData();
        convertDiaryData();
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

    // Gets JSON data of the Blood Pressure Diary from AsyncStorage. Currently not used as diarys are not functioning properly.
    const getBloodPressureDiaryData = async() => {
        try {
            var bloodPressureDiary = await getData('BPDiary');
            console.log("ssdas:")
            console.log(bloodPressureDiary)
            setBloodPressureDiaryJSON([]);

            //Adds each item in array to variable foodDiaryJSON by looping through
            for (var i =0; i< foodDiary.length; i++) {
                setBloodPressureDiaryJSON(state => [])
            }

            
        } catch (e) {
            // error reading value
        }
    }    
    
    // Gets JSON data of the Food Diary from AsyncStorage.  Currently not used as diarys are not functioning properly.
    const getFoodDiaryData = async() => {
        try {
            var foodDiary = await getData('FoodDiary');
            console.log("ssdas:")
            console.log(foodDiary)
            setFoodDiaryJSON([]);

            /*
            //Adds each item in array to variable foodDiaryJSON by looping through
            for (var i =0; i< foodDiary.length; i++) {
                setFoodDiaryJSON(state => [])
            }]*/
        } catch (e) {
            // error reading value
        }
    }

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
    
    // Adding Data to Blood Pressure Excel variable from its JSON
    const bloodPressureJSONtoArr = (dailyResultsExcel, averageResultsExcel) => {
        // Array data for each json diary
        var bloodPressureArrData = bloodPressureDiaryJSON;
        
        //Loops for each day in the JSON
        for (var day=0; day <bloodPressureArrData.length; day++) {

            // Get a row of Morning information from JSON and adds it appropriate excel
            for (var morn=0; morn < bloodPressureArrData[day].morning.length; morn++) {

                dailyResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].morning[morn].time, "Morning", bloodPressureArrData[day].morning[morn].systolic, bloodPressureArrData[day].morning[morn].diastolic, bloodPressureArrData[day].morning[morn].arm])   
            }
            
            // Get a row of Evening information from JSON and adds it appropriate excel
            for (var eveng=0; eveng < bloodPressureArrData[day].evening.length; eveng++) {

                dailyResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].evening[eveng].time,"Evening", bloodPressureArrData[day].evening[eveng].systolic, bloodPressureArrData[day].evening[eveng].diastolic, bloodPressureArrData[day].evening[eveng].arm]);
            }
        }

        // Get a row of averages from JSON and adds it to appropriate excel
        for (var day=0; day < bloodPressureArrData.length; day++) {
            averageResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].morning_systolic_avg, bloodPressureArrData[day].morning_diastolic_avg, bloodPressureArrData[day].evening_systolic_avg, bloodPressureArrData[day].evening_diastolic_avg]);
        }
    }

    // Adding Data to Food Excel variable from its JSON
    const foodJSONtoArr = (foodExcel, waterExcel) => {
        // Array data for each json diary
        var foodArrData = foodDiaryJSON;

        //Loops for each day in the JSON
        for (var day=0; day<foodArrData.length; day++) {
            
            //Loops for each food entry in the JSON and adds to excel sheet the JSON data
            for (var entry = 0; entry<foodArrData[day].food.length; entry++) {

                foodExcel.push([foodArrData[day].date, foodArrData[day].meal, foodArrData[day].time, foodArrData[day].food[entry].name, foodArrData[day].food[entry].amount, foodArrData[day].food[entry].kcal, foodArrData[day].food[entry].carb, foodArrData[day].food[entry].sugar, foodArrData[day].food[entry].fat, foodArrData[day].food[entry].protein])
            }

            //Adds amount of water consumed that day
            waterExcel.push([foodArrData[day].date, foodArrData[day].water]);

        }

    }

    //Adding Data to Glucose Excel variable from its JSON
    const glucoseJSONtoArr = (excel) => {
        // Array data for each json diary
        var glucoseArrData = glucoseDiaryJSON;
    }

    /*
    * Converts JSON Diary data to excel files and also creates a html table to be used in the html variable
    */
    const convertDiaryData = () => {

    // Reformated json data for excel
        var bloodPressureDailyEXCEL = [];
        var bloodPressureAverageEXCEL = [];
        var foodEXCEL = [];
        var waterEXCEL = [];
        var glucoseEXCEL = []; //change name to applicable data

    // Header rows for each table for each diary
        var bloodPressureDailyResultsHeader = ["Date","Time","Period","Systolic","Diastolic","Arm"];
        var bloodPressureAverageResultsHeader = ["Date", "Morning Average Systolic", "Morning Average Diastolic", "Evening Average Systolic", "Evening Average Diastolic"];
        var foodHeader = ["Date", "Meal", "Time", "Food Name", "Amount", "Calories", "Carbs", "Sugar", "Fat", "Protein"];
        var waterHeader = ["Date", "Water Drank"];
        var glucoseHeader = ["Date"]; //change name to applicable data

    // Adding header row to each EXCEL variable
        bloodPressureDailyEXCEL.push(bloodPressureDailyResultsHeader);
        bloodPressureAverageEXCEL.push(bloodPressureAverageResultsHeader);
        foodEXCEL.push(foodHeader);
        waterEXCEL.push(waterHeader);
        glucoseEXCEL.push(glucoseHeader);

    //Adds data to each diaries excel variable
        bloodPressureJSONtoArr(bloodPressureDailyEXCEL, bloodPressureAverageEXCEL);
        foodJSONtoArr(foodEXCEL, waterEXCEL);
       // glucoseJSONtoArr(glucoseEXCEL);
        
    // Create Excel Document from Excel Diary and appends to a global uri variable to be used in other functions

        //creates work book for each diary
        var bloodPressureWB = XLSX.utils.book_new();
        var foodWB = XLSX.utils.book_new();
        var glucoseWB = XLSX.utils.book_new();

        //Creates a options variable to skip the autogenerated excel headers
        const opts = {
            skipHeader: true,
        };

        //creates work sheets for each part in the diarys
        var bloodPressureDailyResultsWS = XLSX.utils.json_to_sheet(bloodPressureDailyEXCEL, opts);
        var bloodPressureAverageResultsWS = XLSX.utils.json_to_sheet(bloodPressureAverageEXCEL, opts);
        var foodResultsWS = XLSX.utils.json_to_sheet(foodEXCEL, opts);
        var waterResultsWS = XLSX.utils.json_to_sheet(waterEXCEL, opts);
        var glucoseResultsWS = XLSX.utils.json_to_sheet(glucoseEXCEL, opts);

        //Append the work sheets to it's work book
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureDailyResultsWS, "Blood Pressure Daily Results");
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureAverageResultsWS, "Blood Pressure Average Results");
        XLSX.utils.book_append_sheet(foodWB,foodResultsWS, "Food Results");
        XLSX.utils.book_append_sheet(foodWB,waterResultsWS, "Water Results");
        XLSX.utils.book_append_sheet(glucoseWB,glucoseResultsWS, "Glucose Results");

        //Writes work book data to each work book
        const bloodPressureWBOUT = XLSX.write(bloodPressureWB, {
            type: 'base64',
            bookType: 'xlsx'
        });

        const foodWBOUT = XLSX.write(foodWB, {
            type: 'base64',
            bookType: 'xlsx'
        });

        const glucoseWBOUT = XLSX.write(glucoseWB, {
            type: 'base64',
            bookType: 'xlsx'
        });

        //Creates URI for each excel file to be used elsewhere
        const bloodPressureURI = FileSystem.cacheDirectory + `BloodPressureDiary_${currentDate.replace(/\//g, '-')}.xlsx`;
        const foodURI = FileSystem.cacheDirectory + `FoodDiary_${currentDate.replace(/\//g, '-')}.xlsx`;
        const glucoseURI = FileSystem.cacheDirectory + `GlucoseDiary_${currentDate.replace(/\//g, '-')}.xlsx`;
        
        FileSystem.writeAsStringAsync(bloodPressureURI, bloodPressureWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });

        FileSystem.writeAsStringAsync(foodURI, foodWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });

        FileSystem.writeAsStringAsync(glucoseURI, glucoseWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });
        
        //appends bloood pressure uri to excelURIS object to be used in composeMail function
        setExcelURIS({bloodpressure: bloodPressureURI,
            food: foodURI,
            glucose: glucoseURI
        });
  
    // Converts the excel work sheet data to html and sets the global variable to be used in the html variable for each diary
        
        // converts to work sheet to html
        const bpdrHTML = XLSX.utils.sheet_to_html(bloodPressureDailyResultsWS);
        const bparHTML = XLSX.utils.sheet_to_html(bloodPressureAverageResultsWS);
        const frHTML = XLSX.utils.sheet_to_html(foodResultsWS);
        const waterHTML = XLSX.utils.sheet_to_html(waterResultsWS);
        const grHTML = XLSX.utils.sheet_to_html(glucoseResultsWS);

        // takes out the uncessary html information and only leaves the contents of inside the table tag then it appends the data to global variable to be used in actual html variable
        setHtmlTableData({bloodPressureDailyResultsHTML: `${bpdrHTML.slice(bpdrHTML.indexOf('<tr>'), bpdrHTML.lastIndexOf('</table>'))}`, 
            bloodPressureAverageResultsHTML: `${bparHTML.slice(bparHTML.indexOf('<tr>'), bparHTML.lastIndexOf('</table>'))}`,
            foodResultsHTML: `${frHTML.slice(frHTML.indexOf('<tr>'), frHTML.lastIndexOf('</table>'))}`,
            waterResultsHTML: `${waterHTML.slice(waterHTML.indexOf('<tr>'), waterHTML.lastIndexOf('</table>'))}`,
           // glucoseResultsHTML: `${grHTML.slice(grHTML.indexOf('<tr>'), grHTML.lastIndexOf('</table>'))}`
        });

    }

    //Composes Email based on diary chosen by user
    const composeMail = async() => {

        let URIS = []; // combination of pdf and excel URIs to be used in the attachements part of Expo Compose
        let pdfURIS = {bloodpressure: "", fooddiary: "", glucosediary: ""};

        //Depending on number of diaries chosen to be attached as a pdf, this section converts each diary into pdf, creates URIs for each, renames the URI and appends the URI to an array of pdf URIs to be used as an attachement
        for (let i=0; i<selectedDiary.length; i++) {
            changeHtmlContent(i);
            
            //makes html code to pdf and saves to Filesystem Cache Directory, sizes are for A4 paper in pixels
            const file_object = await Print.printToFileAsync({
                html: htmlContent,
                height: 842,
                width: 595,
            });

            //renames the file to its diary name with the current date by replacing the string after the last slash with diary name (with spaces taken out) and current date (slash / between the number replaced with a dash -)
            const pdfName = `${file_object.uri.slice(
                0,
                file_object.uri.lastIndexOf('/') + 1)+selectedDiary[i].replace(/ /g, '')}_${currentDate.replace(/\//g, '-')}.pdf`

            await FileSystem.moveAsync({
                from: file_object.uri,
                to: pdfName,
            })

            //Adds the URI from the diary that was just converted to array of pdf uris. Since, the keys in pdfURIS are all lowercase and no spaces together, need to take the space and make lowercase the diary names so the value of the keys can be replaced by the uri. 
            pdfURIS[selectedDiary[i].replace(/ /g, '').toLowerCase()] = pdfName;

        }

        //Appends the pdf and excel diary uris to one array URIS to be used as attachements.
        for (var index in selectedDiary) {
            if (selectedDiary[index] == "Blood Pressure") {
                URIS.push(excelURIS.bloodpressure)
                URIS.push(pdfURIS.bloodpressure)
            }
            if (selectedDiary[index] == "Food Diary") {
                URIS.push(excelURIS.food)
                URIS.push(pdfURIS.fooddiary)
            }
            if (selectedDiary[index] == "Glucose Diary") {
                URIS.push(excelURIS.glucose)
                URIS.push(pdfURIS.glucosediary)
            }
        }

        // This section composes the email with the recepient, email subject and attachemments
        try{
            let emailResult = await MailComposer.composeAsync({
                recipients: (selected != null) ? [selected] : [],
                subject: 'Test email',
                attachments: URIS,
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
                        Select which diary(s) to send to a doctor from your diary list
                    </Text>
                    <DropDownPicker
                        multiple={true}
                        min={0}
                        max={3}
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
                        zIndex={2000}
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
                        zIndex={1000}
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
