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

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';

var deviceHeight = Dimensions.get("window").height;

export default function Resources({ navigation }) {
    

    return (
        <SafeAreaView style={styles.outerContainer}>

            <ScrollView>

                <View style={{alignItems: 'center'}}>
                    <Header></Header>
                </View>

                <Text style={[GlobalStyle.CustomFont,styles.headerText]}>
                    Resources Page
                </Text>

                {/* SECTION TO ADD INFORMATION FOR RESOURCES */}
                <View style={{ flex: 1, alignSelf: 'stretch', flexDirection: 'column'}}>

                    {/* Each View in this View corresponds to a line being printed in the resource section. 
                    To create a new line, add the View Tag and inside that add a Text Tag. Examples shown below.
                    Basically can copy paste the lines below and edit in between <Text style={styles.text}> and
                    </Text> to write text to be outputted to the screen.
                    */}
                    
                    <View style={styles.profileView}><Text style={styles.text}>Medication 1: Example A. Side Effect B</Text></View>
                    <View style={styles.profileView}><Text style={styles.text}>Medication 2: Example X. Side Effect C</Text></View>
                    <View style={styles.profileView}><Text style={styles.text}>Medication 3: Example Y. Side Effect D</Text></View>

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
    headerText: {
        fontSize: (deviceHeight * 0.1) * 0.4,
        marginBottom: deviceHeight * 0.03,
        textAlign: "center",
    },
    text: {
        fontSize: (deviceHeight * 0.1) * 0.32,
        marginBottom: deviceHeight * 0.03,
        textAlign: "center",
    },
    bottomButtons: {
        alignItems:'center',
        marginBottom:20,
        flexDirection: 'row'
    },
    profileView: {
        flex: 1, 
        alignSelf: 'stretch',
    },
})