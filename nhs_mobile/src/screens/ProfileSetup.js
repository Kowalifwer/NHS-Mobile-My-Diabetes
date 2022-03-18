import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, 
    ScrollView,
    Keyboard,
    Modal,
    Alert,
} from 'react-native';
import ConditionalProfileView from '../components/ConditionalProfileView';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import {user_struct} from '../global_structures.js'
import SmartTextInput from '../components/SmartTextInput';
import CustomDropDownPicker from '../components/CustomDropDownPicker';
import CustomButton from '../components/CustomButton';

export default function ProfileSetup({ navigation }) {
    const [dynamic_user, setDynamicUser] = useState(user_struct)

    const setData = async () => {
        try {
            console.log(dynamic_user)
            await AsyncStorage.setItem('UserData', JSON.stringify(dynamic_user));
            await AsyncStorage.setItem('EmailData', JSON.stringify(emailList));
            console.log(emailList)
            setDynamicUser(user_struct) //reset the state - important!!
            setOpen(false);
            setValue(null);
            navigation.navigate('Home');
        } catch (error) {
            console.log(error);
        }
    }
      
    const [health_type_open, setOpen] = useState(false);
    const [health_type_value, setValue] = useState(null);
    const [health_type, setHealthType] = useState([
        {label: 'I manage my diabetes through diet only or I have pre-diabetes', value: '1'},
        {label: 'I only take tablets for my diabetes', value: '2'},
        {label: 'I inject insulin for my diabetes', value: '3'},
        {label: '--Deselect--', value: '4'},
    ])

    const [medicine_popup_visible, setMedicinePopupVisible] = useState(false);

    const [medicineInput, setMedicineInput] = useState(null);
    const [medicineList, setMedicineList] = useState([]);

    const [medicine_open, setMedicineOpen] = useState(false);
    const [medicine_value, setMedicineValue] = useState(null);
    const [medicine_type, setMedicineType] = useState([]);

    const [email_popup_visible, setEmailPopupVisible] = useState(false);

    const [emailInput, setEmailInput] = useState(null);
    const [emailList, setEmailList] = useState([]);

    const [email_open, setEmailOpen] = useState(false);
    const [email_value, setEmailValue] = useState(null);
    const [email_type, setEmailType] = useState([])

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
        setMedicineType(new_medicine_list.map(medicine_name => {
            return {label: medicine_name, value: medicine_name}
        }))
        setMedicineList(new_medicine_list)
        setMedicineValue(null)
        Alert.alert(`${medicineList.length - new_medicine_list.length} Medicines have been removed from your Medicine List!`)
    }

    const modifyEmailList = () => {
        setEmailList(state => [...state, emailInput])
        setEmailType(state => [...state, {label: emailInput, value: emailInput}]) //FOR THE DROPDOWN
        setEmailInput(null);
        Alert.alert(emailInput + " added to your list of Doctor emails! Feel free to add more if neccesary.")
    }

    const removeEmails = () => {
        let new_email_list = [...emailList]
        email_value.forEach(email_name => {
            new_email_list.splice(new_email_list.indexOf(email_name), 1)
        })
        console.log(new_email_list)
        setEmailType(new_email_list.map(email_name => {
            return {label: email_name, value: email_name}
        }))
        setEmailList(new_email_list)
        setEmailValue(null)
        Alert.alert(`${emailList.length - new_email_list.length} Emails have been removed from your Emails List!`)
    }

    return (
        <SafeAreaView style={[GlobalStyle.BodyGeneral, {marginBottom: -25}]}>
            <ScrollView keyboardShouldPersistTaps="never" onScrollBeginDrag={Keyboard.dismiss}>
                <Modal
                    animationType="slide"
                    visible={medicine_popup_visible}
                    onRequestClose={() => {
                        
                        setMedicinePopupVisible(!medicine_popup_visible);
                    }}
                    presentationStyle = "fullScreen"
                >   
                    <View style={[GlobalStyle.BodyGeneral, {paddingTop: 75, marginBottom: -100}]}>
                        <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {textAlign: "center", marginHorizontal: 20, marginBottom: 25}]}>Please manage your medicines in the section below</Text>
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

                <Modal
                    animationType="slide"
                    visible={email_popup_visible}
                    onRequestClose={() => {
                        setEmailPopupVisible(!email_popup_visible);
                    }}
                    presentationStyle = "fullScreen"
                >   
                    <View style={[GlobalStyle.BodyGeneral, {paddingTop: 75, marginBottom: -100}]}>
                        <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {textAlign: "center", marginHorizontal: 20, marginBottom: 25}]}>Please manage your doctor email addresses in the section below</Text>
                        <SmartTextInput
                            value={emailInput}
                            hint={`Email of Doctor ${emailList.length+1}`}
                            placeholder='Email'
                            onChangeText={(value) => setEmailInput(value)}
                        />

                        <CustomButton
                            style={{marginTop: 0, marginBottom: 75}}
                            title={`Press to add email to your list!`}
                            onPressFunction={() => (emailInput) ? modifyEmailList() : Alert.alert("Please make sure to fill up the input field above!")}
                        />

                        <CustomDropDownPicker
                            multiple={true}
                            placeholder="Preview emails list..."
                            open={email_open}
                            value={email_value}
                            items={email_type}
                            setOpen={setEmailOpen}
                            setValue={setEmailValue}
                            setItems={setEmailType}
                        />

                        <CustomButton
                            color='red'
                            title={`Press to remove selected emails from list`}
                            onPressFunction={() => (email_value && email_value.length>0) ? removeEmails() : Alert.alert("Please make sure to select at least one email from the list above, to remove!")}
                        />

                        <CustomButton
                            style={{marginTop: 10, marginBottom:35, padding: 25}}
                            color='green'
                            title={`Email setup complete!`}
                            onPressFunction={() => setEmailPopupVisible(false)}
                        />
                    </View>
                    
                </Modal>

                <View style={[GlobalStyle.BodyGeneral, {paddingBottom: 10}]}>
                    <Header></Header>
                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Orange]}>
                        Profile setup page.
                    </Text>
                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Blue, {marginBottom: 50}]}>
                        Note that you do not need to fill all the fields. It is recommended though since it will allow us to prefil data for you in other places,
                        such as any documents or diaries that you create within the app.
                    </Text>

                    <SmartTextInput
                        placeholder='Enter your NHS Number'
                        maxLength={12}
                        value={dynamic_user.nhs_number}
                        keyboardType = 'numeric'
                        mask = '999 999 9999'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["nhs_number"]:value }), [])}
                    />

                    <Text style={[GlobalStyle.CustomFont, styles.text, GlobalStyle.Blue, {marginVertical: 35}]}>
                        Please describe which of the options from the list below applies to you the most.
                        Please try to give the most accurate answer, as this decision will tailor how the application will assist you with your diabetes.
                    </Text>

                    <CustomDropDownPicker
                        placeholder="Please select what applies to you the most"
                        open={(health_type_open)}
                        value={(health_type_value)}
                        items={(health_type)}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setHealthType}
                        onChangeValue={(value) => setDynamicUser(state => ({ ...state, ["health_type"]:value }), [])}
                    />

                    {(!health_type_value || health_type_value=="4") && <View style={{height: 200}}></View>}

                    <ConditionalProfileView emailList={emailList} setEmailPopupVisible={setEmailPopupVisible} setMedicinePopupVisible={setMedicinePopupVisible} style={styles.body} account_type = {health_type_value} setData={setData} dynamic_user={dynamic_user} setDynamicUser={setDynamicUser}/>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 27,
        marginBottom: 15,
        marginHorizontal: 5,
        textAlign: "center",
    },
})