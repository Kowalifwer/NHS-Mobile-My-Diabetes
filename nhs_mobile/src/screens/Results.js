import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    SafeAreaView, 
    ScrollView,
    Vibration,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import HomePageButtonSlim from '../components/HomePageButtonSlim';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import YoutubePlayer from "react-native-youtube-iframe";
import XLSX from 'xlsx';
import { manipulateAsync } from 'expo-image-manipulator';
import { Asset } from 'expo-asset';
import Constants from 'expo-constants';

export default function Results({ navigation, route }) {

    const stored_user = route.params?.stored_user

    const [help, setHelp] = useState(false)
    const [playing, setPlaying] = useState(false);
    const [videoIndex, setVideoIndex] = useState();
    const [notFound, setNotFound] = useState(false);

    const [imageHTML, setImageHTML] = useState();
    const [htmlTableData, setHtmlTableData] = useState({bloodPressureDailyResultsHTML: "", bloodPressureAverageResultsHTML: "", foodResultsHTML: "", waterResultsHTML: "", glucoseResultsHTML: "", glucoseInjectionsHTML: ""});

    const [loaded, setLoaded] = useState(false);

    //variables to check if diaries are enmpty
    const [isBPEmpty, setIsBPEmpty] = useState(false);
    const [isFoodEmpty, setIsFoodEmpty] = useState(false);
    const [isGlucoseEmpty, setIsGlucoseEmpty] = useState(false);

    // Used to tell user video has finished. Currently commented as not needed. If by code freeze still not needed then will delete from app
    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
            //Alert.alert("video has finished playing!");
        }
    }, []);

    useEffect(async () => {
        findVideoIndex("Help Section"); //CHANGE NAME HERE TO RENDER ANOTHER VIDEO. If name doesnt match exactly with youtube video title then user alerted to contact clinician.
        setImageHTML(await generateImageHTML());
        await convertDiaryData().then(setLoaded(true));
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

    // General function to get Data from AsyncStorage. Depending on variable passed it will get data on different listings in AsyncStorage.
    const getData = async (jsonDataType) => {
        try {
          const jsonValue = await AsyncStorage.getItem(jsonDataType)
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

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


    // Alerts user if diary is empty when trying to compose an email
    const alertIfDiaryEmpty = (diaryToCheck) => {
        if (diaryToCheck == "Blood Pressure" && isBPEmpty == true) {
            Alert.alert("ERROR: Blood Pressure Diary is Empty. Can't show results.");
            Vibration.vibrate();
            return "exit";
        }
        if (diaryToCheck == "Food Diary" && isFoodEmpty == true) {
            Alert.alert("ERROR: Food Diary is Empty. Can't show results.");
            Vibration.vibrate();
            return "exit"
        }
        if (diaryToCheck == "Glucose Diary" && isGlucoseEmpty == true) {
            Alert.alert("ERROR: Glucose Diary is Empty. Can't show results.");
            Vibration.vibrate();
            return "exit"
        }
    }

    const showDisclaimer = (diaryName) => {
        Alert.alert("Disclaimer", "Clicking this button will show you your medical data. Proceed at your own risk.", [
            {
                text: 'Cancel',
                onPress: () => console.log("Cancel"),
                style: 'cancel',
            },
            {text: 'Proceed', onPress: () => showPDF(diaryName)}
        ]);
    }

    const showPDF = (diaryName) => {

        if (alertIfDiaryEmpty(diaryName) === "exit") {
            return;
        }

        navigation.navigate("PDF", {
            HTML: changeHTMLContent(diaryName),
            videos: route.params.video,
            stored_user: stored_user,
        })
        
    }

    const showDiaryButtons = () => {
        return <View>
            <CustomButton
                title="Blood Pressure Diary"
                onPressFunction={() => showDisclaimer("Blood Pressure")}
            />

            <CustomButton
                title="Glucose Diary"
                onPressFunction={() => showDisclaimer("Glucose Diary")}
            />

            <CustomButton
                title="Food Diary"
                onPressFunction={() => showDisclaimer("Food Diary")}
            />
        </View>
    }

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Blue]}>
                        Select Diary to View
                    </Text>

                    <CustomButton
                        title="Help"
                        onPressFunction={() => toggleHelp()}
                        color='#761076'
                        style={{marginBottom: 40}}
                    />

                </View>
                
                <View styles={styles.video_style}>
                    {(help === true && notFound === false) && showHelp()}
                </View>

                <View style={styles.body}>

                    {loaded === true && showDiaryButtons()}

                    <CustomButton
                        title='Homepage'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Home")}
                        style={{marginTop: 40}}
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
        marginBottom: 45,
        textAlign: "center",
    },
    video_style: {
        flex: 1,
        alignItems: 'center',
    }
})