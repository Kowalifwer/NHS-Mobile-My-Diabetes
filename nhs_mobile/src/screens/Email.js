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
    Button,
    Vibration
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { Asset } from 'expo-asset';
import { manipulateAsync } from 'expo-image-manipulator';
import YoutubePlayer from "react-native-youtube-iframe";

export default function Email({navigation, route}) {

    DropDownPicker.setListMode("SCROLLVIEW");
    
    const stored_user = route.params?.stored_user //can access all current user data from this variable.
    const [selectedRecipient, setSelectedRecipient] = useState("");
    const [selectedDiary, setSelectedDiary] = useState("");
    
    const [imageHTML, setImageHTML] = useState();
    const [currentDate, setCurrentDate] = useState("");

    //variables to check if diaries are enmpty
    const [isBPEmpty, setIsBPEmpty] = useState(false);
    const [isFoodEmpty, setIsFoodEmpty] = useState(false);
    const [isGlucoseEmpty, setIsGlucoseEmpty] = useState(false);

    //Stores each html table data for each diary. To be used in each html variable
    const [htmlTableData, setHtmlTableData] = useState({bloodPressureDailyResultsHTML: "", bloodPressureAverageResultsHTML: "", foodResultsHTML: "", waterResultsHTML: "", glucoseResultsHTML: "", glucoseInjectionsHTML: ""});

    // Stores each excel files URI to be used as an Email Attachement
    const [excelURIS, setExcelURIS] = useState({bloodpressure: "", food: "", glucose: ""});
    
    const [email, setEmail] = useState([]);

    // Used for DropDownPicker. Automatically closes and opens picker depending on these values.
    const [diary_open, setDiaryOpen] = useState(false);
    const [diary_value, setDiaryValue] = useState(null);
    const [email_open, setEmailOpen] = useState(false);
    const [email_value, setEmailValue] = useState(null);

    const [help, setHelp] = useState(false)
    const [playing, setPlaying] = useState(false);
    const [videoIndex, setVideoIndex] = useState();
    const [notFound, setNotFound] = useState(false);

    // Used to tell user video has finished. Currently commented as not needed. If by code freeze still not needed then will delete from app
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            //Alert.alert("video has finished playing!");
        }
    }, []);

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

    useEffect(async () => {
        setImageHTML(await generateImageHTML());
        setCurrentDate(generateCurrentDate());
        getUserData();
        convertDiaryData();
        findVideoIndex("Help Section"); //CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
    }, []);

     // Set the video id that matches the video name passed into this function.
     const findVideoIndex = (videoName) => {
        for (var index=0; index < route.params.video.length; index++) {
            if (route.params.video[index].name == videoName) {
                setVideoIndex(index);
                return
            }
        }
        setNotFound(true);
    }

    const showHelp = () => {
        return <View styles={styles.video_style}>
                    <Text style={styles.video_text}>{route.params.video[videoIndex].name}</Text>
                    <YoutubePlayer
                        webViewStyle={ {opacity:0.99} }
                        height={300}
                        play={playing}
                        videoId={route.params.video[videoIndex].id}
                    />
                </View>
    }

    const toggleHelp = () => {
        if (notFound === false) {
            if (help === true) {
                setHelp(false);
            } else {
                setHelp(true);
            }
        } else {
            Alert.alert("Help Video Not Found. Please contact clinician")
        }
    }

    // changes html to be transformed to pdf depending on what diary user selected
    const changeHTMLContent = (currentDiary) => {
        var currentHTMLTableData = [];

        if (currentDiary == "Blood Pressure") {
            currentHTMLTableData.push(htmlTableData.bloodPressureDailyResultsHTML); 
            currentHTMLTableData.push(htmlTableData.bloodPressureAverageResultsHTML);
        } else if (currentDiary == "Food Diary") {
            currentHTMLTableData.push(htmlTableData.foodResultsHTML); 
            currentHTMLTableData.push(htmlTableData.waterResultsHTML);
        } else if (currentDiary == "Glucose Diary") {
            currentHTMLTableData.push(htmlTableData.glucoseResultsHTML);
            currentHTMLTableData.push((stored_user.health_type == 3) ? htmlTableData.glucoseInjectionsHTML : "");
        } else {
            console.log("something went wrong")
        }

        return `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${currentDiary}</title>
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
                <h1>Diary: ${currentDiary}</h1>
                <h1>NHS Number: ${stored_user.nhs_number} </h1>
                <h1>Date Generated: ${currentDate}</h1>
                
                <table>
                    ${currentHTMLTableData[0]}
                </table>
                
                <br>
        
                <table>
                    ${currentHTMLTableData[1]}
                </table>
        
            </body>
            
            </html>
        `
    }

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

    // General function to get Data from AsyncStorage. Depending on variable passed it will get data on different listings in AsyncStorage.
    const getData = async (jsonDataType) => {
        try {
          const jsonValue = await AsyncStorage.getItem(jsonDataType)
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
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
    const bloodPressureJSONtoArr = (dailyResultsExcel, averageResultsExcel, bloodPressureArrData) => {
        
        //Loops for each day in the JSON
        for (var day=0; day <bloodPressureArrData.length; day++) {

            var fDate = bloodPressureArrData[day].date.slice(0,10);

            // Get a row of Morning information from JSON and adds it appropriate excel
            for (var morn=0; morn < bloodPressureArrData[day].morning.length; morn++) {

                //Since time is diary json is in format: Year-Month-Date<T>Hour:Minute:SecondZ, we need to slice this information so we get the time. Hence below:
                var mornTime = bloodPressureArrData[day].morning[morn].time.slice(bloodPressureArrData[day].morning[morn].time.indexOf('T')+1,bloodPressureArrData[day].morning[morn].time.indexOf('T')+6)

                dailyResultsExcel.push([fDate, mornTime, "Morning", bloodPressureArrData[day].morning[morn].systolic, bloodPressureArrData[day].morning[morn].diastolic, bloodPressureArrData[day].morning[morn].arm])   
            }

            // Get a row of Afternoon information from JSON and adds it to appropriate excel
            for (var aftn=0; aftn < bloodPressureArrData[day].afternoon.length; aftn++) {

                //Since time is diary json is in format: Year-Month-Date<T>Hour:Minute:SecondZ, we need to slice this information so we get the time. Hence below:
                var aftnTime = bloodPressureArrData[day].afternoon[aftn].time.slice(bloodPressureArrData[day].afternoon[aftn].time.indexOf('T')+1,bloodPressureArrData[day].afternoon[aftn].time.indexOf('T')+6)

                dailyResultsExcel.push([fDate, aftnTime, "Afternoon", bloodPressureArrData[day].afternoon[aftn].systolic, bloodPressureArrData[day].afternoon[aftn].diastolic, bloodPressureArrData[day].afternoon[aftn].arm])   
            }
            
            // Get a row of Evening information from JSON and adds it appropriate excel.
            for (var eveng=0; eveng < bloodPressureArrData[day].evening.length; eveng++) {
                
                //Since time is diary json is in format: Year-Month-Date<T>Hour:Minute:SecondZ, we need to slice this information so we get the time. Hence below:
                var evenTime = bloodPressureArrData[day].evening[eveng].time.slice(bloodPressureArrData[day].evening[eveng].time.indexOf('T')+1,bloodPressureArrData[day].evening[eveng].time.indexOf('T')+6)

                dailyResultsExcel.push([fDate, evenTime,"Evening", bloodPressureArrData[day].evening[eveng].systolic, bloodPressureArrData[day].evening[eveng].diastolic, bloodPressureArrData[day].evening[eveng].arm]);
            }
        }

        // Get a row of averages from JSON and adds it to appropriate excel
        for (var day=0; day < bloodPressureArrData.length; day++) {
            averageResultsExcel.push([fDate, bloodPressureArrData[day].morning_systolic_avg, bloodPressureArrData[day].morning_diastolic_avg, bloodPressureArrData[day].afternoon_systolic_avg, bloodPressureArrData[day].afternoon_diastolic_avg, bloodPressureArrData[day].evening_systolic_avg, bloodPressureArrData[day].evening_diastolic_avg]);
        }
    }

    // Adding Data to Food Excel variable from its JSON
    const foodJSONtoArr = (foodExcel, waterExcel, foodArrData) => {

        //Loops for each day in the JSON

        for (var day=0; day<foodArrData.length; day++) {
            
            var fDate = foodArrData[day].date.slice(0,10);
            
            // For each meal in that entry
            for (var meal=0; meal<foodArrData[day].meals.length; meal++) {
                
                var fTime = foodArrData[day].meals[meal].time.slice(foodArrData[day].meals[meal].time.indexOf('T')+1,foodArrData[day].meals[meal].time.indexOf('T')+6);
                var fMeal = foodArrData[day].meals[meal].meal
                var fWater = foodArrData[day].meals[meal].water

                waterExcel.push([fDate,fWater]);

                // For each food item
                for (var item=0; item<foodArrData[day].meals[meal].food.length; item++) {
                    
                    var fAmount = foodArrData[day].meals[meal].food[item].amount;
                    var fCarb = foodArrData[day].meals[meal].food[item].carb;
                    var fEnergy = foodArrData[day].meals[meal].food[item].energy;
                    var fFat = foodArrData[day].meals[meal].food[item].fat;
                    var fName = foodArrData[day].meals[meal].food[item].name;
                    var fProtein = foodArrData[day].meals[meal].food[item].protein;
                    var fSugar = foodArrData[day].meals[meal].food[item].sugar;

                    foodExcel.push([fDate, fMeal, fTime, fName, fAmount, fEnergy, fCarb, fSugar, fFat, fProtein])
                }
            }

        }

    }

    //Adding Data to Glucose Excel variable from its JSON
    const glucoseJSONtoArr = (glucoseResultsExcel, glucoseInjectionsExcel,glucoseArrData) => {

        // Loops for each day
        for (var day=0; day<glucoseArrData.length; day++) {

            var fDate = glucoseArrData[day].date.slice(0, 10);

            //Loops for glucose readings results
            for (var entry=0; entry<glucoseArrData[day].glucose_readings.length; entry++) {
      
                
                var fTime = glucoseArrData[day].glucose_readings[entry].time.slice(glucoseArrData[day].glucose_readings[entry].time.indexOf('T')+1,glucoseArrData[day].glucose_readings[entry].time.indexOf('T')+6);
                var hypo_reason = (glucoseArrData[day].hypo_reason == "") ? "N/A": glucoseArrData[day].hypo_reason;
                var feel_sick = (glucoseArrData[day].feel_sick == false) ? "No" : "Yes";
                var hypo = (glucoseArrData[day].hypo == false) ? "No" : "Yes";
                var glucose_reading = glucoseArrData[day].glucose_readings[entry].reading;

                glucoseResultsExcel.push([fDate, fTime, glucose_reading, hypo, feel_sick, hypo_reason])

            }

            //Only converts data for injections if user injects diabetes
            if (stored_user.health_type == 3) {
                //Loops for injections readings results
                for (var entry=0; entry<glucoseArrData[day].injections.length; entry++) {
                    
                    var fTime = glucoseArrData[day].injections[entry].time.slice(glucoseArrData[day].injections[entry].time.indexOf('T')+1,glucoseArrData[day].injections[entry].time.indexOf('T')+6);
                    var fType = glucoseArrData[day].injections[entry].type;
                    var fUnits = glucoseArrData[day].injections[entry].units;

                    glucoseInjectionsExcel.push([fDate, fTime, fType, fUnits]);
                }
            }
            
        }
    }

    /*
    * Converts JSON Diary data to excel files and also creates a html table to be used in the html variable
    */
    const convertDiaryData = async () => {
    // Getting data from diaries
        var bpJSON = await getData('BPDiary');
        var foodJSON = await getData('NewFoodDiary');
        var glucoseJSON = await getData('GlucoseDiary');

    // Reformated json data for excel
        var bloodPressureDailyEXCEL = [];
        var bloodPressureAverageEXCEL = [];
        var foodEXCEL = [];
        var waterEXCEL = [];
        var glucoseResultsEXCEL = []; 
        var glucoseInjectionsEXCEL = []; 

    // Header rows for each table for each diary
        var bloodPressureDailyResultsHeader = ["Date","Time","Period","Systolic","Diastolic","Arm"];
        var bloodPressureAverageResultsHeader = ["Date", "Morning Average Systolic", "Morning Average Diastolic", "Afternoon Average Systolic", "Afternoon Average Diastolic", "Evening Average Systolic", "Evening Average Diastolic"];
        var foodHeader = ["Date", "Meal", "Time", "Food Name", "Amount", "Calories", "Carbs", "Sugar", "Fat", "Protein"];
        var waterHeader = ["Date", "Water Drank"];
        var glucoseDailyResultsHeader = ["Date", "Time", "Glucose Reading", "Hypo?", "Feel Sick?", "Hypo Reason"]; 
        var glucoseDailyInjectionsHeader = ["Date", "Time", "Type", "Units"];

    // Adding header row to each EXCEL variable
        bloodPressureDailyEXCEL.push(bloodPressureDailyResultsHeader);
        bloodPressureAverageEXCEL.push(bloodPressureAverageResultsHeader);
        foodEXCEL.push(foodHeader);
        waterEXCEL.push(waterHeader);
        glucoseResultsEXCEL.push(glucoseDailyResultsHeader);
        glucoseInjectionsEXCEL.push(glucoseDailyInjectionsHeader);

    //Adds data to each diaries excel variable if diary is not empty
        (bpJSON == null || bpJSON.length == 0) ? setIsBPEmpty(true) : bloodPressureJSONtoArr(bloodPressureDailyEXCEL, bloodPressureAverageEXCEL, bpJSON);
        (foodJSON == null) ? setIsFoodEmpty(true) : foodJSONtoArr(foodEXCEL, waterEXCEL, foodJSON);
        (glucoseJSON == null || glucoseJSON.length == 0) ? setIsGlucoseEmpty(true) : glucoseJSONtoArr(glucoseResultsEXCEL, glucoseInjectionsEXCEL, glucoseJSON);

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
        var glucoseResultsWS = XLSX.utils.json_to_sheet(glucoseResultsEXCEL, opts);
        var glucoseInjectionsWS = XLSX.utils.json_to_sheet(glucoseInjectionsEXCEL, opts);

        //Append the work sheets to it's work book
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureDailyResultsWS, "Blood Pressure Daily Results");
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureAverageResultsWS, "Blood Pressure Average Results");
        XLSX.utils.book_append_sheet(foodWB,foodResultsWS, "Food Results");
        XLSX.utils.book_append_sheet(foodWB,waterResultsWS, "Water Results");
        XLSX.utils.book_append_sheet(glucoseWB,glucoseResultsWS, "Glucose Daily Results");
        XLSX.utils.book_append_sheet(glucoseWB,glucoseInjectionsWS, "Glucose Injections Results");

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
        const gIrHTML = XLSX.utils.sheet_to_html(glucoseInjectionsWS);

        // takes out the uncessary html information and only leaves the contents of inside the table tag then it appends the data to global variable to be used in actual html variable
        setHtmlTableData({bloodPressureDailyResultsHTML: `${bpdrHTML.slice(bpdrHTML.indexOf('<tr>'), bpdrHTML.lastIndexOf('</table>'))}`, 
            bloodPressureAverageResultsHTML: `${bparHTML.slice(bparHTML.indexOf('<tr>'), bparHTML.lastIndexOf('</table>'))}`,
            foodResultsHTML: `${frHTML.slice(frHTML.indexOf('<tr>'), frHTML.lastIndexOf('</table>'))}`,
            waterResultsHTML: `${waterHTML.slice(waterHTML.indexOf('<tr>'), waterHTML.lastIndexOf('</table>'))}`,
            glucoseResultsHTML: `${grHTML.slice(grHTML.indexOf('<tr>'), grHTML.lastIndexOf('</table>'))}`,
            glucoseInjectionsHTML: `${gIrHTML.slice(gIrHTML.indexOf('<tr>'), gIrHTML.lastIndexOf('</table>'))}`,
        });

    }

    const createPDF = async(diaryName) => {
        
        //makes html code to pdf and saves to Filesystem Cache Directory, sizes are for A4 paper in pixels
        const file_object = await Print.printToFileAsync({
            html: changeHTMLContent(diaryName),
            height: 842,
            width: 595,
        });

        //renames the file to its diary name with the current date by replacing the string after the last slash with diary name (with spaces taken out) and current date (slash / between the number replaced with a dash -)
        const pdfName = `${file_object.uri.slice(
            0,
            file_object.uri.lastIndexOf('/') + 1)+diaryName.replace(/ /g, '')}_${currentDate.replace(/\//g, '-')}.pdf`

        await FileSystem.moveAsync({
            from: file_object.uri,
            to: pdfName,
        })

        return pdfName;
    }

    // Alerts user if diary is empty when trying to compose an email
    const alertIfDiaryEmpty = (diaryToCheck) => {
        if (diaryToCheck == "Blood Pressure" && isBPEmpty == true) {
            Alert.alert("ERROR: Blood Pressure Diary is Empty. Can't create attachement.");
            Vibration.vibrate();
            return "exit";
        }
        if (diaryToCheck == "Food Diary" && isFoodEmpty == true) {
            Alert.alert("ERROR: Food Diary is Empty. Can't create attachement");
            Vibration.vibrate();
            return "exit"
        }
        if (diaryToCheck == "Glucose Diary" && isGlucoseEmpty == true) {
            Alert.alert("ERROR: Glucose Diary is Empty. Can't create attachement");
            Vibration.vibrate();
            return "exit"
        }
    }

    const validateEmail = () => {
        Alert.alert("Disclaimer", "Sending this email involves sending your medical data. This is your own responsibility so proceed at your own risk.", [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel"),
                style: 'cancel',
            },
            {text: 'Proceed', onPress: () => composeMail()}
        ]);
    }

    const validateSelection = () => {
        if (selectedDiary == "") {
            Vibration.vibrate();
            Alert.alert("No Diary Selected");
        } else if (selectedRecipient == null) {
            Vibration.vibrate();
            Alert.alert("No Recepient Selected");
        } else {
            return "valid";
        }
    }

    //Composes Email based on diary chosen by user
    const composeMail = async() => {
        
        // Checks if selected diaries and recipient is selected first before composing email
        if (validateSelection() == "valid") {

            let URIS = []; // combination of pdf and excel URIs to be used in the attachements part of Expo Compose
            let pdfURIS = {bloodpressure: "", fooddiary: "", glucosediary: ""};
            const diarySubject = selectedDiary.toString().replace(/,/g, ' + '); //used in subject of email

            //Depending on number of diaries chosen to be attached as a pdf, this section converts each diary into pdf, creates URIs for each, renames the URI and appends the URI to an array of pdf URIs to be used as an attachement
            for (let i=0; i<selectedDiary.length; i++) {
                
                // Check if diary selected is empty before proceeding
                if (alertIfDiaryEmpty(selectedDiary[i]) === "exit") {
                    return;
                }

                // Calls the function that creates the pdf and stores the returned uri in appropriate place to be used as attachement later
                pdfURIS[selectedDiary[i].replace(/ /g, '').toLowerCase()] = await createPDF(selectedDiary[i]);

            }

            //Appends the pdf and excel diary uris to one array URIS to be used as attachements.
            for (var index in selectedDiary) {
                if (selectedDiary[index] == "Blood Pressure" && isBPEmpty != true) {
                    URIS.push(excelURIS.bloodpressure)
                    URIS.push(pdfURIS.bloodpressure)
                }
                if (selectedDiary[index] == "Food Diary" && isFoodEmpty != true) {
                    URIS.push(excelURIS.food)
                    URIS.push(pdfURIS.fooddiary)
                }
                if (selectedDiary[index] == "Glucose Diary" && isGlucoseEmpty != true) {
                    URIS.push(excelURIS.glucose)
                    URIS.push(pdfURIS.glucosediary)
                }
            }

            // This section composes the email with the recepient, email subject and attachemments
            try{

                const compatible = await LocalAuthentication.hasHardwareAsync();
                if (!compatible) throw 'This device is not compatible for biometric authentication';

                const enrolled = await LocalAuthentication.isEnrolledAsync();
                if (!enrolled) throw 'This device does not have biometric authentication enabled';

                const result = await LocalAuthentication.authenticateAsync();
                if(result.success){
                    let emailResult = await MailComposer.composeAsync({
                        recipients: (selectedRecipient != null) ? [selectedRecipient] : [],
                        subject: stored_user.nhs_number == "" ? diarySubject + ' PDF/EXCEL #N/A' : diarySubject + ' PDF/EXCEL #' + stored_user.nhs_number,
                        attachments: URIS,
                    });
                    (emailResult.status === 'sent') ? Alert.alert(`Email sent successfully to ${selectedRecipient}` ) : Alert.alert('Email has not been sent')
                }
                else{
                    Alert.alert("Failure!", "Could not send email.")
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (   
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header></Header>

                    <CustomButton
                            title="Help"
                            onPressFunction={() => toggleHelp()}
                            color='#761076'
                    />
                </View>

                <View styles={styles.video_style}>
                    {(help === true && notFound === false) && showHelp()}
                </View>

                <View style={styles.body}>

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Cyan]}>
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

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Cyan]}>
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
                        onPressFunction={() => validateEmail()}
                        color="#ff0f00"
                        title="Compose Email"
                    />

                    <StatusBar style="auto" />

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Blue, {marginTop:45}]}>If you didnt set up any doctors, you can do so using the button below</Text>

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 50}}>
                        <CustomButton
                            title='Setup email recipients'
                            color="#6495ED"
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
    video_style: {
        flex: 1,
        alignItems: 'center',
    },
})
