import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
    Dimensions
} from 'react-native';
import Constants from 'expo-constants';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import { compute_glucose_metrics } from '../global_functions';

var deviceHeight = Dimensions.get("window").height;

export default function MyProfile({ navigation }) {
    
    const [show, setShow] = useState(false)
    const [metrics, setMetrics] = useState()
    
    useEffect(async() => {
        compute_glucose_metrics();
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

              <View style={styles.profileView}><Text style={styles.text}>Average:</Text><Text style={styles.metricText}>{metrics.mean}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Maximum:</Text><Text style={styles.metricText}>{metrics.max}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Minimum:</Text><Text style={styles.metricText}>{metrics.min}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Number of Readings:</Text><Text style={styles.metricText}>{metrics.number}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in TIR:</Text><Text style={styles.metricText}>{metrics.num_in_TIR}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 1 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l1hyper}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 2 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l2hyper}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 1 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l1hypo}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Readings in Level 2 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.num_l2hypo}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in TIR:</Text><Text style={styles.metricText}>{metrics.percent_in_TIR}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 1 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l1hyper}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 2 Hyperglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l2hyper}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 1 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l1hypo}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>% in Level 2 Hypoglycaemia:</Text><Text style={styles.metricText}>{metrics.percent_l2hypo}%</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Median:</Text><Text style={styles.metricText}>{metrics.median}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Standard Deviation:</Text><Text style={styles.metricText}>{metrics.SD}</Text></View>

              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range 25th Percentile Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR_25}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Interquartile Range 75th Percentile Inclusive:</Text><Text style={styles.metricText}>{metrics.IQR_75}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Adjusted SD Inclusive IQR/1.35:</Text><Text style={styles.metricText}>{metrics.adj_SD}</Text></View>
              <View style={styles.profileView}><Text style={styles.text}>Coefficient of Variation (CV) 100 x SD/Mean:</Text><Text style={styles.metricText}>{metrics.CV}</Text></View>
            
          </View>
      )

    }

    const loadMetrics = async() => {

        setMetrics(await getData("GlucoseMetrics"))
        setShow(true)
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
                    onPressFunction={() => loadMetrics()}
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