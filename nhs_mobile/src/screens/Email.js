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

export default function Email({navigation, route}) {

    DropDownPicker.setListMode("SCROLLVIEW");
    
    const stored_user = route.params?.stored_user //can access all current user data from this variable.
    const [selected, setSelectedRecipient] = useState("")
    const [selectedDiary, setSelectedDiary] = useState("")
    
    let htmlContent = "";
    
    //Stores each html table data for each diary. To be used in each html variable
    const [htmlTableData, setHtmlTableData] = useState({bloodPressureDailyResultsHTML: "", bloodPressureAverageResultsHTML: "", foodResultsHTML: "", glucoseResultsHTML: ""});

    // Stores each excel files URI to be used as an Email Attachement
    const [excelURIS, setExcelURIS] = useState({bloodpressure: "", food: "", glucose: ""});
    
    const [email_open, setEmailOpen] = useState(false);
    const [email_value, setEmailValue] = useState(null);
    const [email, setEmail] = useState([]);

    //const [foodDiaryJSON, setFoodDiaryJSON] = useState([]); Will be uncommented and worked on when Food Diary Implemented.
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
        <title>Blood Pressure Diary</title>
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
        <h1>Diary: Blood Pressure</h1>
        <h1>NHS Number: ${stored_user.nhs_number} </h1>
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
            ${htmlTableData.bloodPressureDailyResultsHTML}
        </table>
        
        <br>
        <!--Average Results Table-->
        <p>Average Results Table</p>
        
        <table style="width:100%">
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

    useEffect(() => {
        getUserData();
   //     getFoodDiaryData();
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
    * Adding Data to Blood Pressure Excel variable from its JSON
    */
    const bloodPressureJSONtoArr = (dailyResultsExcel, averageResultsExcel) => {
        // Array data for each json diary
        var bloodPressureArrData = bloodPressureDiaryJSON;
        
        //Loops for each day in the JSON
        for (var day=0; day <bloodPressureArrData.length; day++) {

            // Get a row of Morning information from JSON and adds it appropriate excel
            for (var morn=1; morn < (((Object.keys(bloodPressureArrData[day].morning).length)-3)/2)+1; morn++) {

                var sys = "sys";
                var dia = "dia";
                var sysX = sys + morn;
                var diaX = dia + morn;

                dailyResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].morning[sysX].time, "Morning", bloodPressureArrData[day].morning[sysX].bp, bloodPressureArrData[day].morning[diaX].bp, bloodPressureArrData[day].morning.arm])   
            }
            
            // Get a row of Evening information from JSON and adds it appropriate excel
            for (var eveng=1; eveng < (((Object.keys(bloodPressureArrData[day].evening).length)-3)/2)+1; eveng++) {

                var sys = "sys";
                var dia = "dia";
                var sysX = sys + eveng;
                var diaX = dia + eveng;

                dailyResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].evening[sysX].time,"Evening", bloodPressureArrData[day].evening[sysX].bp, bloodPressureArrData[day].evening[diaX].bp, bloodPressureArrData[day].evening.arm]);
            }
        }

        // Get a row of averages from JSON and adds it to appropriate excel
        for (var day=0; day < bloodPressureArrData.length; day++) {
            averageResultsExcel.push([bloodPressureArrData[day].date, bloodPressureArrData[day].morning.sys_avg, bloodPressureArrData[day].morning.dia_avg, bloodPressureArrData[day].evening.sys_avg, bloodPressureArrData[day].evening.dia_avg]);
        }
    }

    /*
    * Adding Data to Food Excel variable from its JSON
    */
    const foodJSONtoArr = (excel) => {
        // Array data for each json diary
        var foodArrData = foodDiaryJSON;

    }

    /*
    * Adding Data to Glucose Excel variable from its JSON
    */
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
        var foodEXCEL = []; // change name to applicable data
        var glucoseEXCEL = []; //change name to applicable data

    // Header rows for each table for each diary
        var bloodPressureDailyResultsHeader = ["Date","Time","Period","Systolic","Diastolic","Arm"];
        var bloodPressureAverageResultsHeader = ["Date", "Morning Average Systolic", "Morning Average Diastolic", "Evening Average Systolic", "Evening Average Diastolic"];
        var foodHeader = []; //change name to applicable data
        var glucoseHeader = []; //change name to applicable data

    // Adding header row to each EXCEL variable
        bloodPressureDailyEXCEL.push(bloodPressureDailyResultsHeader);
        bloodPressureAverageEXCEL.push(bloodPressureAverageResultsHeader);
    //    foodEXCEL.push(foodHeader);
    //    glucoseEXCEL.push(glucoseHeader);

    //Adds data to each diaries excel variable
        bloodPressureJSONtoArr(bloodPressureDailyEXCEL, bloodPressureAverageEXCEL);
      //  foodJSONtoArr(foodEXCEL);
       // glucoseJSONtoArr(glucoseEXCEL);
        
    // Create Excel Document from Excel Diary and appends to a global uri variable to be used in other functions

        //creates work book for each diary
        var bloodPressureWB = XLSX.utils.book_new();
    //    var foodWB = XLSX.utils.book_new();
     //   var glucoseWB = XLSX.utils.book_new();

        //Creates a options variable to skip the autogenerated excel headers
        const opts = {
            skipHeader: true,
        };

        //creates work sheets for each part in the diarys
        var bloodPressureDailyResultsWS = XLSX.utils.json_to_sheet(bloodPressureDailyEXCEL, opts);
        var bloodPressureAverageResultsWS = XLSX.utils.json_to_sheet(bloodPressureAverageEXCEL, opts);
      //  var foodResultsWS = XLSX.utils.json_to_sheet(foodEXCEL, opts);
       // var glucoseResultsWS = XLSX.utils.json_to_sheet(glucoseEXCEL, opts);

        //Append the work sheets to it's work book
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureDailyResultsWS, "Blood Pressure Daily Results");
        XLSX.utils.book_append_sheet(bloodPressureWB,bloodPressureAverageResultsWS, "Blood Pressure Average Results");
      //  XLSX.utils.book_append_sheet(foodWB,foodResultsWS, "Food Results");
       // XLSX.utils.book_append_sheet(glucoseWB,glucoseResultsWS, "Glucose Results");

        //Writes work book data to each work book
        const bloodPressureWBOUT = XLSX.write(bloodPressureWB, {
            type: 'base64',
            bookType: 'xlsx'
        });
/*
        const foodWBOUT = XLSX.write(foodWB, {
            type: 'base64',
            bookType: 'xlsx'
        });

        const glucoseWBOUT = XLSX.write(glucoseWB, {
            type: 'base64',
            bookType: 'xlsx'
        });*/

        //Creates URI for each excel file to be used elsewhere
        const bloodPressureURI = FileSystem.cacheDirectory + 'BloodPressureDiary.xlsx';
       // const foodURI = FileSystem.cacheDirectory + 'FoodDiary.xlsx';
       // const glucoseURI = FileSystem.cacheDirectory + 'GlucoseDiary.xlsx';
        
        FileSystem.writeAsStringAsync(bloodPressureURI, bloodPressureWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });
/*
        FileSystem.writeAsStringAsync(foodURI, foodWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });

        FileSystem.writeAsStringAsync(glucoseURI, glucoseWBOUT, {
            encoding: FileSystem.EncodingType.Base64
            });*/
        
        //apppends bloood pressure uri to excelURIS object to be used in composeMail function
        setExcelURIS({bloodpressure: bloodPressureURI,
            //food: foodURI,
            //glucose: glucoseURI
        });
  
    // Converts the excel work sheet data to html and sets the global variable to be used in the html variable for each diary
        
        // converts to work sheet to html
        const bpdrHTML = XLSX.utils.sheet_to_html(bloodPressureDailyResultsWS);
        const bparHTML = XLSX.utils.sheet_to_html(bloodPressureAverageResultsWS);
        //const frHTML = XLSX.utils.sheet_to_html(foodResultsWS);
        //const grHTML = XLSX.utils.sheet_to_html(glucoseResultsWS);

        // takes out the uncessary html information and only leaves the contents of inside the table tag then it appends the data to global variable to be used in actual html variable
        setHtmlTableData({bloodPressureDailyResultsHTML: `${bpdrHTML.slice(bpdrHTML.indexOf('<tr>'), bpdrHTML.lastIndexOf('</table>'))}`, 
            bloodPressureAverageResultsHTML: `${bparHTML.slice(bparHTML.indexOf('<tr>'), bparHTML.lastIndexOf('</table>'))}`,
          //  foodResultsHTML: `${frHTML.slice(frHTML.indexOf('<tr>'), frHTML.lastIndexOf('</table>'))}`,
           // glucoseResultsHTML: `${grHTML.slice(grHTML.indexOf('<tr>'), grHTML.lastIndexOf('</table>'))}`
        });

    }

    //Composes Email based on diary chosen by user
    const composeMail = async() => {

        let pdfURIS = [];
        let URIS = [];
        var eURi = [];
        var bloodPressureSelected = false;

        //Depending on number of diaries chosen to be attached as a pdf, this section converts each diary into pdf, creates URIs for each and appends the URI to an array of URIs to be used as an attachement
        for (let i=0; i<selectedDiary.length; i++) {
            changeHtmlContent(i);
            
            //makes html code to pdf and saves to Filesystem Cache Directory
            const file_object = await Print.printToFileAsync({
                html: htmlContent,
            });

            var fURI = file_object.uri;
            pdfURIS.push(fURI);
        }

        //if bloodpressure in selecteddiary then add excel uri to URIS
        for (var index in selectedDiary) {
            if (selectedDiary[index] == "Blood Pressure") {
                eURi.push(excelURIS.bloodpressure)
                bloodPressureSelected = true;
            }
        }

        // Formats URIS depending on diaries chosen by user. Oriented to work with blood pressure diary right now.
        if (pdfURIS.length == 1) {
            bloodPressureSelected ? URIS = [pdfURIS[0], eURi[0]] : URIS = [pdfURIS[0]]
        } else if (pdfURIS.length == 2) {
            bloodPressureSelected ? URIS = [pdfURIS[0], pdfURIS[1], eURi[0]] : URIS = [pdfURIS[0], pdfURIS[1]]
        } else {
            bloodPressureSelected ? URIS = [pdfURIS[0], pdfURIS[1], pdfURIS[2], eURi[0]] : URIS = [pdfURIS[0], pdfURIS[1], pdfURIS[2]]
        };

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
                    {/* TO BE WORKED ON FOR JSON TO EXCEL
                    <CustomButton
                        onPressFunction={() => JSONtoCSV(bloodPressureDiaryJSON,"bloodpressurediary")}
                        color="#ff0f00"
                        title="Convert to CSV"
                    />
                    */}

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
