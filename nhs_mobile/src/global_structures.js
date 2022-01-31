//Stores user profile data. The equivalent in LocalStorage is 'UserData'
user_struct = {
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
food_diary_entry = {
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

diary_dict = {}
diry_paths = {}

// {item: "", brand: "", amount: ""}
// ^^^ might need to put this in food_diary_entry