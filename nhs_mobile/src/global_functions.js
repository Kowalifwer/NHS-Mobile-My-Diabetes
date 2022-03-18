import * as math from 'mathjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import stats from "statsjs";


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

// https://www.statology.org/quartile-exc-vs-quartile-inc-excel/
// quartile explanation
const compute_glucose_metrics = async () => {
    try {
        const glucose_diary = JSON.parse(await AsyncStorage.getItem('GlucoseDiary'))
        var readings = []
        for (let i = 0; i < glucose_diary.length; i++) {
            let glucose_readings = glucose_diary[i]["glucose_readings"]
            for (let j = 0; j < glucose_readings.length; j++) {
                let reading = parseFloat(glucose_readings[j]["reading"])
                readings.push(reading)
            }
        }
        // console.log("parsed readings: ", readings)
    } catch (error) {
        console.log("error while getting glucose diary data: ", error)
        return
    }

    // let readings = generate_random_data(20) // !! FOR TESTING <---------------------------------------------------------

    let nums = stats(readings)

    const glucose_metrics = {
        mean: nums.mean(),
        SD: nums.stdDev(),
        median: nums.median(),
        IQR: nums.q3() - nums.q1(),
        IQR_25: nums.q1(),
        IQR_75: nums.q3(),
        adj_SD: (nums.q3() - nums.q1()) / 1.35,
        // IQR_exc: null,
        // IQR_25_exc: null,
        // IQR_75_exc: null,
        // IQR_inc: null,
        // IQR_25_inc: null,
        // IQR_75_inc: null,
        // adj_SD_exc: null,
        // adj_SD_inc: null,
        CV: nums.stdDev() / nums.mean(),
        max: nums.max(),
        min: nums.min(),
        number: nums.size(),
        // l2hypo < 3 <= l1hypo < 3.9 <= in_TIR <= 10 < l1hyper <= 13.9 < l2hyper
        num_in_TIR: 0,
        num_l2hyper: 0,
        num_l1hyper: 0,
        num_l2hypo: 0,
        num_l1hypo: 0,
        percent_in_TIR: 0,
        percent_l2hyper: 0,
        percent_l1hyper: 0,
        percent_l2hypo: 0,
        percent_l1hypo: 0,
    }

    for (let i = 0; i < glucose_metrics["number"]; i++) {
        let reading = readings[i]
        if (reading < 3) {glucose_metrics["num_l2hypo"] += 1}
        else if (3 <= reading && reading < 3.9) {glucose_metrics["num_l1hypo"] += 1}
        else if (3.9 <= reading && reading <= 10) {glucose_metrics["num_in_TIR"] += 1}
        else if (10 < reading && reading <= 13.9) {glucose_metrics["num_l1hyper"] += 1}
        else if (13.9 < reading) {glucose_metrics["num_l2hyper"] += 1}
    }

    glucose_metrics["percent_in_TIR"] = glucose_metrics["num_in_TIR"] / glucose_metrics["number"] * 100
    glucose_metrics["percent_l2hyper"] = glucose_metrics["num_l2hyper"] / glucose_metrics["number"] * 100
    glucose_metrics["percent_l1hyper"] = glucose_metrics["num_l1hyper"] / glucose_metrics["number"] * 100
    glucose_metrics["percent_l2hypo"] = glucose_metrics["num_l2hypo"] / glucose_metrics["number"] * 100
    glucose_metrics["percent_l1hypo"] = glucose_metrics["num_l1hypo"] / glucose_metrics["number"] * 100

    // console.log("raw values: ", readings)
    // console.log("glucose_metrics: ", glucose_metrics)

    await AsyncStorage.setItem("GlucoseMetrics", JSON.stringify(glucose_metrics))
}

const generate_random_data = (num) => {
    let arr = []
    for (let i = 0; i < num; i++) {
        arr.push(math.random(0.0001, 16))
    }
    return arr
}

export { compute_glucose_metrics }
