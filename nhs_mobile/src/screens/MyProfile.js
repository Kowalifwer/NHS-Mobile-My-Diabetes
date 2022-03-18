import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    SafeAreaView, 
    ScrollView,
    Dimensions
} from 'react-native';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { compute_glucose_metrics } from '../global_functions';

var deviceHeight = Dimensions.get("window").height;

export default function MyProfile({ navigation }) {
    
    const [show, setShow] = useState(false)
    const [metrics, setMetrics] = useState()
    
    useEffect(async() => {
        await compute_glucose_metrics();
    }, [])

    // General function to get Data from AsyncStorage. Depending on variable passed it will get data on different listings in AsyncStorage.
    const getData = async (jsonDataType) => {
        try {
          const jsonValue = await AsyncStorage.getItem(jsonDataType)
          console.log(jsonValue);
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
          // error reading value
        }
    }

    //Shows calculations based on glucose diary
    const showMetrics = () => {
      return (
          <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column'}}>

              <View style={styles.profileView}><Text style={styles.text}>Average:</Text><Text style={styles.metricText}>{metrics.mean != null ? metrics.mean : "Not enough data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Maximum:</Text><Text style={styles.metricText}>{metrics.max != null ? metrics.max : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Minimum:</Text><Text style={styles.metricText}>{metrics.min != null ? metrics.min : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Number of Readings:</Text><Text style={styles.metricText}>{metrics.number != null ? metrics.number : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in TIR:</Text><Text style={styles.metricText}>{metrics.num_in_TIR != null ? metrics.num_in_TIR : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 1 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l1hyper != null ? metrics.num_l1hyper : "Not Enough Data"}</Text></View>

              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 2 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l2hyper != null ? metrics.num_l2hyper : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 1 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l1hypo != null ? metrics.num_l1hypo : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 2 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l2hypo != null ? metrics.num_l2hypo : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in TIR:</Text><Text style={styles.metricText}>{metrics.percent_in_TIR != null ? metrics.percent_in_TIR : "Not Enough Data"}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 1 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l1hyper != null ? metrics.percent_l1hyper : "Not Enough Data"}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 2 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l2hyper != null ? metrics.percent_l2hyper : "Not Enough Data"}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 1 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l1hypo != null ? metrics.percent_l1hypo : "Not Enough Data"}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 2 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l2hypo != null ? metrics.percent_l2hypo : "Not Enough Data"}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Median:</Text><Text style={styles.metricText}>{metrics.median != null ? metrics.median : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Standard Deviation:</Text><Text style={styles.metricText}>{metrics.SD != null ? metrics.SD : "Not Enough Data"}</Text></View>

              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR != null ? metrics.IQR : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range 25th Percentile Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR_25 != null ? metrics.IQR_25 : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range 75th Percentile Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR_75 != null ? metrics.IQR_75 : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Adjusted SD Inclusive IQR/1.35:</Text><Text style={styles.metricText}>{metrics.adj_SD != null ? metrics.adj_SD : "Not Enough Data"}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Coefficient of Variation (CV) 100 x SD/Mean:</Text><Text style={styles.metricText}>{metrics.CV != null ? metrics.CV : "Not Enough Data"}</Text></View>
            
          </View>
      )

    }

    //shows the metrics on the screen
    const loadMetrics = async() => {
        setMetrics(await getData("GlucoseMetrics"))
        setShow(true)
    } 

    // Checks if glucose diary is empty first before showing glucose results
    const validateProfile = async() => {
        if (await compute_glucose_metrics() === undefined) {
            loadMetrics();
        } else {
            Alert.alert("Glucose Diary is empty")
        }
    }


    return (
        <SafeAreaView style={styles.outerContainer}>
        
            <ScrollView>
                
                <View style={{alignItems:'center'}}>
                    <Text style={styles.headerText}>
                        My Profile    
                    </Text>
                </View>

                <CustomButton
                    title="Load Glucose Results"
                    color='#761076'
                    onPressFunction={() => validateProfile()}
                />

                <View>
                    <Text style={styles.noteText}>NOTE:</Text>
                    <Text style={styles.noteText}>TIR = Time in Range</Text>
                    <Text style={styles.noteText}>Normal Time in Range: 3.9-10 mmol/L</Text>
                    <Text style={styles.noteText}>Level 1 Hyperglycaemia: 10.1-13.9 mmol/L</Text>
                    <Text style={styles.noteText}>Level 2 Hyperglycaemia: &gt; 13.9 mmol/L</Text>
                    <Text style={styles.noteText}>Level 1 Hypoglycaemia: 3-3.8 mmol/L</Text>
                    <Text style={styles.noteText}>Level 2 Hypoglycaemia: &lt; 3 mmol/L</Text>
                </View>

                <View>
                    {show === true && showMetrics()}
                </View>
                
                <View style={styles.bottomButtons}>
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
    outerContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e9c5b4',
    },
    bottomButtons: {
      alignItems:'center',
      marginBottom:20,
      flexDirection: 'row'
    },
    headerText: {
        fontSize: (deviceHeight * 0.1) * 0.5,
        marginTop: 25,
        textAlign: "center",
    },
    text: {
        fontSize: (deviceHeight * 0.1) * 0.35,
    },
    metricText: {
        fontSize: (deviceHeight * 0.1) * 0.35,
        textAlign: "center",
        color: "red"
    },
    noteText: {
        fontSize: (deviceHeight * 0.1) * 0.25, 
        textAlign: 'center', 
        color: 'red', 
        marginBottom: deviceHeight * 0.01
    },
    profileView: {
        flex: 1, 
        alignSelf: 'stretch',
        marginBottom: deviceHeight * 0.01
    }
})