import {} from 'mathjs';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*

    metrics to compute:

    Mean ---------------------------------------------------------- 
    SD ------------------------------------------------------------ 
    Median -------------------------------------------------------- 
    Interquartile Range Exclusive --------------------------------- 
    Interquartile Range 25th Percentile Exclusive ----------------- 
    Interquartile Range 75th Percentile Exclusive ----------------- 
    Interquartile Range Inclusive --------------------------------- 
    Interquartile Range 25th Percentile Inclusive ----------------- 
    Interquartile Range 75th Percentile Inclusive ----------------- 
    Adjusted SD Exclusive IQR/1.35 -------------------------------- 
    Adjusted SD Inclusive IQR/1.35 -------------------------------- 
    Coefficient of Variation (CV) 100 x SD/Mean ------------------- 
    Maximum ------------------------------------------------------- 
    Minimum ------------------------------------------------------- 
    Number of readings -------------------------------------------- 
    Number in TIR 3.9-10mmol/L ------------------------------------ 
    Number above TIR >13.9mmol/L - Level 2 hyperglycaemia --------- 
    Number above TIR  10.1-13.9mmol/L - Level 1 hyperglycaemia ---- 
    Number below TIR 3-3.8mmol/L - Level 1 hypoglycaemia ---------- 
    Number below TIR <3mmol/L - Level 2 hypoglycaemia ------------- 
    % in TIR 3.9-10mmol/L ----------------------------------------- 
    % above TIR >13.9mmol/L - Level 2 hyperglycaemia -------------- 
    % above TIR 10.1-13.9mmol/L - Level 1 hyperglycaemia ---------- 
    % below TIR 3-3.8mmol/L - Level 1 hypoglycaemia --------------- 
    % below TIR  <3mmol/L - Level 2 hypoglycaemia ----------------- 
    Symptomatic hypoglycaemia ------------------------------------- 

*/

const mean = (array) => {
    
}

const SD = (array) => {

}

const median = (array) => {
    
}

const IQR_exc = (array) => {
    
}

const IQR_25_exc = (array) => {
    
}

const IQR_75_exc = (array) => {
    
}

const IQR_inc = (array) => {
    
}

const IQR_25_inc = (array) => {
    
}

const IQR_75_inc = (array) => {
    
}

const adj_SD_exc = (array) => {
    
}

const adj_SD_inc = (array) => {
    
}

const CV = (array) => {
    
}

const max = (array) => {
    
}

const min = (array) => {
    
}

const number = (array) => {
    
}

const num_in_TIR = (array) => {
    
}

const num_l2hyper = (array) => {
    
}

const num_l1hyper = (array) => {
    
}

const num_l2hypo = (array) => {
    
}

const num_l1hypo = (array) => {
    
}

const percent_in_TIR = (array) => {
    
}

const percent_l2hyper = (array) => {
    
}

const percent_l1hyper = (array) => {
    
}

const percent_l2hypo = (array) => {
    
}

const percent_l1hypo = (array) => {
    
}

const compute_glucose_metrics = async () => {
    try {
        const glucose_diary = JSON.parse(await AsyncStorage.getItem('GlucoseDiary'))
        const readings = []
        for (let i = 0; i < glucose_diary.length; i++) {
            let glucose_readings = glucose_diary[i]["glucose_readings"]
            for (let j = 0; j < glucose_readings.length; j++) {
                let reading = parseFloat(glucose_readings[j]["reading"])
                readings.push(reading)
            }
        }
        console.log("parsed readings: ", readings)
        
    } catch (error) {
        console.log("error while computing glucose metrics: ", error);
    }
}

export { compute_glucose_metrics }