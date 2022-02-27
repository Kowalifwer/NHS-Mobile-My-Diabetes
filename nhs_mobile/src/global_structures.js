//global structures
//Stores user profile data. The equivalent in LocalStorage is 'UserData'
const user_struct = {
    nhs_number: "",
    name: "", 
    age: "", 
    height: "", 
    weight: "", 
    health_type: "",
    // Option 1  – I manage my diabetes through diet only or I have pre-diabetes  
    // Option 2 – I only take tablets for my diabetes
    // Option 3 – I inject insulin for my diabetes  
    daily_injections: "",
}

//Stores the data for 1 entry in the foor diary. The equivalent in LocalStorage is 'FoodDiary'. 'FoodDiary' in LocalStorage is an array of all the entries logged by the user.
const food_diary_entry = {
    date: "",
    meal: "",
    time: "",
    food: [],
    water: "",
    kcal: "",
    fat: "",
    carb: "",
    sugar: "",
    protein: ""
}

const bp_diary_entry = {
    date: "",
    readings: [],
    systolic_avg: "",
    diastolic_avg: ""
}

const glucose_diary_entry = {
    date: "",
    glucose_readings: [],
    injections: [],
    feel_sick: "",
}

const food_diary = {screen_name: "FoodDiary", verbose_name: "Food Diary", entries: []} //food diary
const bp_diary = {screen_name: "BPDiary", verbose_name: "Blood Pressure Diary", entries: []} //blood pressure diary
const render_test_diary = {screen_name: "TestDiary", verbose_name: "Test Diary", entries: []} //test diary
const sleep_diary = {screen_name: "SleepDiary", verbose_name: "Sleep Diary", entries: []} //sleep diary
const exercise_diary = {screen_name: "ExerciseDiary", verbose_name: "Exercise Diary", entries: []} //exercise diary

const diary_list = [ //make sure to define screen_name here, to match the names of the screens in the App.js - this is used to render this component.
    food_diary,
    bp_diary,
    //diaries below are not linked, just test placeholders
    // render_test_diary,
    // sleep_diary,
    // exercise_diary,
    //add other diaries here
]

const health_type_reverse_lookup = { //reverse lookup for health type, into readable form.
    1: "I manage my diabetes through diet only or I have pre-diabetes",
    2: "I only take tablets for my diabetes",
    3: "I inject insulin for my diabetes",
}


//global functions
const object_is_empty = (obj) => {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export {diary_list, food_diary_entry, bp_diary_entry, user_struct, health_type_reverse_lookup, object_is_empty}
// diary_paths = {}

// {item: "", brand: "", amount: ""}
// ^^^ might need to put this in food_diary_entry