import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Alert,
    SafeAreaView,
    ScrollView,
    Keyboard,
    Modal,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import CustomButton from '../components/CustomButton';
import GlobalStyle from '../styles/GlobalStyle';
import SmartTextInput from '../components/SmartTextInput';
import Header from '../components/Header';
import {user_struct, health_type_reverse_lookup} from '../global_structures.js';
import CustomDropDownPicker from '../components/CustomDropDownPicker';

export default function Home({ navigation, route }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)
    const [stored_user, setStoredUser] = useState(user_struct)

    const [medicine_popup_visible, setMedicinePopupVisible] = useState(false);

    const [medicineInput, setMedicineInput] = useState(null);
    const [medicineList, setMedicineList] = useState([]);

    const [medicine_open, setMedicineOpen] = useState(false);
    const [medicine_value, setMedicineValue] = useState(null);
    const [medicine_type, setMedicineType] = useState([])

    useEffect(() => {
        setDynamicUser(state => ({ ...state, ["medicine_list"]: medicineList }));
    }, [medicineList]);

    const modifyMedicineList = () => {
        setMedicineList(state => [...state, medicineInput])
        setMedicineType(state => [...state, {label: medicineInput, value: medicineInput}]) //FOR THE DROPDOWN
        setMedicineInput(null);
        Alert.alert(medicineInput + " added to your Medicine List! Feel free to add more if neccesary.")
    }

    const removeMedicines = () => {
        let new_medicine_list = [...medicineList]
        medicine_value.forEach(medicine_name => {
            new_medicine_list.splice(new_medicine_list.indexOf(medicine_name), 1)
        })
        console.log(new_medicine_list)
        setMedicineType(new_medicine_list.map(medicine_name => {
            return {label: medicine_name, value: medicine_name}
        }))
        setMedicineList(new_medicine_list)
        setMedicineValue(null)
        Alert.alert(`${medicineList.length - new_medicine_list.length} Medicines have been removed from your Medicine List!`)
    }

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        console.log(dynamic_user)
        
        try {
            AsyncStorage.getItem('UserData')
                .then(value => {
                    
                    if (value != null) {
                        let user = JSON.parse(value);
                        setMedicineType(user["medicine_list"].map(medicine_name => {
                            return {label: medicine_name, value: medicine_name}
                        }))
                        setMedicineList(user["medicine_list"])
                        setStoredUser(user)
                        return user
                    }
                    else {
                        console.log("Profile not set up - redirected to setup page")
                        Alert.alert("Profile not set up - redirecting to setup page")
                        navigation.navigate("ProfileSetup")
                    }
                })
        } catch (error) {
            console.log(error);
        }
    }

    const updateUserData = async () => {
        console.log("UPDATE DATA")
        console.log(dynamic_user)
        if (Object.values(dynamic_user).every(x => x === null || x === '')) {
            Alert.alert('Warning!', 'Please write your data.')
            console.log("All fields empty!")
        } else {
            try {
                const compatible = await LocalAuthentication.hasHardwareAsync();
                if (!compatible) throw 'This device is not compatible for biometric authentication';

                const enrolled = await LocalAuthentication.isEnrolledAsync();
                if (!enrolled) throw 'This device does not have biometric authentication enabled';

                const result = await LocalAuthentication.authenticateAsync();
                if(result.success){
                    console.log(dynamic_user)
                    var user = {...stored_user} //create a safe copy of the local storage user object
                    for (const key of Object.keys(user)) { //go over every existing record, and replace it ONLY if the current form input is NOT empty.
                        console.log(key)
                        if (key in dynamic_user && dynamic_user[key].length > 0) 
                            user[key] = dynamic_user[key]
                    }
                    await AsyncStorage.mergeItem('UserData', JSON.stringify(user));
                    setDynamicUser(user_struct)
                    getUserData()
                    console.log("Data updated")
                    Alert.alert('Success!', 'Your data has been updated.');
                }
                else{
                    Alert.alert('Failure!', 'Your data could not be updated.');
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const removeUserData = async () => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            if (!compatible) throw 'This device is not compatible for biometric authentication';

            const enrolled = await LocalAuthentication.isEnrolledAsync();
            if (!enrolled) throw 'This device does not have biometric authentication enabled';

            const result = await LocalAuthentication.authenticateAsync();
            if(result.success){
                console.log("CLEARED UserData - output below")
                getUserData()
                await AsyncStorage.removeItem("UserData");
                Alert.alert('Success!', 'Your User data has been cleared! Redirecting to the setup page.')
                navigation.navigate('ProfileSetup');
            }
            else{
                Alert.alert('Failure!', 'Your profile could not be deleted.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
            <Modal
                animationType="slide"
                visible={medicine_popup_visible}
                onRequestClose={() => {
                    
                    setModalVisible(!modalVisible);
                }}
                presentationStyle = "fullScreen"
            >   
                <View style={[GlobalStyle.BodyGeneral, {paddingTop: 75, marginBottom: -100}]}>
                    <Text style={[GlobalStyle.CustomFont, GlobalStyle.Black, {textAlign: "center", marginHorizontal: 20, marginBottom: 25}]}>Please manage your medicines in the section below</Text>
                    <SmartTextInput
                        value={medicineInput}
                        hint={`Name of medication number ${medicineList.length+1}`}
                        placeholder='Medicine Name'
                        onChangeText={(value) => setMedicineInput(value)}
                    />

                    <CustomButton
                        style={{marginTop: 0, marginBottom: 75}}
                        title={`Press to add medication to your list!`}
                        onPressFunction={() => (medicineInput) ? modifyMedicineList() : Alert.alert("Please make sure to fill up the input field above!")}
                    />

                    <CustomDropDownPicker
                        multiple={true}
                        placeholder="Preview medicine list..."
                        open={medicine_open}
                        value={medicine_value}
                        items={medicine_type}
                        setOpen={setMedicineOpen}
                        setValue={setMedicineValue}
                        setItems={setMedicineType}
                    />

                    <CustomButton
                        color='red'
                        title={`Press to remove selected medications from list`}
                        onPressFunction={() => (medicine_value && medicine_value.length > 0) ? removeMedicines() : Alert.alert("Please make sure to select at least one medication from the list above, to remove!")}
                    />

                    <CustomButton
                        style={{marginTop: 10, marginBottom:35, padding: 25}}
                        color='green'
                        title={`Medication setup complete!`}
                        onPressFunction={() => setMedicinePopupVisible(false)}
                    />
                </View>
                
            </Modal>
                <View style={styles.body}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Orange, {marginBottom: 75}]}>
                        Profile Settings
                    </Text>
                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Black]}>
                        Welcome, {stored_user.name} !
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        You are{"\n"} {stored_user.age} years old.
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        Your height is{"\n"} {stored_user.height} cm
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        Your weight is{"\n"} {stored_user.weight} kg
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        Your NHS number is:{"\n"} {stored_user.nhs_number}
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Black]}>
                        Your diabetes status is:{"\n"} {health_type_reverse_lookup[route.params?.stored_user.health_type]}
                    </Text>

                    {stored_user.daily_injections ? 
                        <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Black]}>
                            Your daily number of injections is {route.params?.stored_user.daily_injections}
                        </Text> :
                        <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Black]}>
                            You do not inject insulin.
                        </Text>
                    }

                    {stored_user.medicine_list.length > 0 && 
                        <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Black]}>
                            Medicine that you are currently using:
                        </Text>
                    }
                    {stored_user.medicine_list.map((medicine, index) => {
                        return (<Text key={index}  style={[GlobalStyle.CustomFont, GlobalStyle.Orange]}>
                            Medication {index+1}: {medicine}
                        </Text>)})
                    }

                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Cyan, {marginTop: 50, marginBottom: 50}]}>
                        You can update all this data below!
                    </Text>

                    <SmartTextInput
                        value={dynamic_user.name}
                        placeholder={"Update your name"}
                        hint="Name"
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])} //updating the dict
                    />
                    <SmartTextInput
                        value={dynamic_user.age}
                        placeholder={"Update your age"}
                        keyboardType="numeric"
                        hint="Age (years)"
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                    />
                    <SmartTextInput
                        value={dynamic_user.height}
                        placeholder={"Update your height"}
                        keyboardType="numeric"
                        hint="Height (cm)"
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                    />
                    <SmartTextInput
                        value={dynamic_user.weight}
                        placeholder={"Update your weight"}
                        keyboardType="numeric"
                        hint="Weight (kg)"
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                    />
                    <SmartTextInput
                        value={dynamic_user.nhs_number}
                        placeholder= {"Update your NHS number"}
                        keyboardType="numeric"
                        mask = "999 999 9999"
                        hint="NHS Number"
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["nhs_number"]:value }), [])} //updating the dict
                    />

                    {stored_user.medicine_list.length > 0 && 
                        <CustomButton
                            style={{marginTop: 50, marginBottom: 25}}
                            title={`Press to update your medication!`}
                            onPressFunction={() => setMedicinePopupVisible(true)}
                        />
                    }

                    <CustomButton
                        style={{marginTop: 40}}
                        title='Update Profile'
                        color='#ff7f00'
                        onPressFunction={updateUserData}
                    />
                    
                    <CustomButton
                        title='Delete Profile'
                        color='#f40100'
                        onPressFunction={removeUserData}
                    />

                    <View style={{display: 'flex', flexDirection: 'column', paddingBottom: 100}}>
                        <CustomButton
                            title='Return to Settings'
                            color='#761076'
                            onPressFunction={() => navigation.navigate("Settings")}
                        />

                        <CustomButton
                            title='Homepage'
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
        fontSize: 40,
        margin: 10,
        marginTop: 25,
        marginBottom: 25,
        textAlign: 'center',
    },
})