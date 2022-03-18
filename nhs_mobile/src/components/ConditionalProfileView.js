
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import CustomButton from '../components/CustomButton';
import SmartTextInput from '../components/SmartTextInput';
import CustomDropDownPicker from '../components/CustomDropDownPicker';

const ConditionalProfileView = props => {
    let {setData, dynamic_user, setDynamicUser, account_type, setMedicinePopupVisible, setEmailPopupVisible, emailList} = props;

    const [daily_injections_open, setOpen] = useState(false);
    const [daily_injections_value, setValue] = useState(null);
    const [daily_injections, setDailyInjections] = useState([
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5 or more', value: '5'}
    ]);

    //a shared view that is used in multiple control flows
    const shared_view = () => {
        return(<View style={[styles.body, {marginTop: 50}]}>
                    <SmartTextInput
                        placeholder='Enter your name'
                        value={dynamic_user.name}
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["name"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your age'
                        value={dynamic_user.age}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["age"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your height (cm)'
                        value={dynamic_user.height}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["height"]:value }), [])}
                    />
                    <SmartTextInput
                        placeholder='Enter your weight (kg)'
                        value={dynamic_user.weight}
                        keyboardType = 'numeric'
                        onChangeText={(value) => setDynamicUser(state => ({ ...state, ["weight"]:value }), [])}
                    />

                    {account_type != 1 &&
                        <>
                            {dynamic_user.medicine_list.length > 0 && 
                                <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginTop:25, marginBottom: 25, textAlign:"center"}]}>
                                    Medicine that you are currently using:
                                </Text>
                            }
                            {dynamic_user.medicine_list.map((medicine, index) => {
                                return (<Text key={index} style={[GlobalStyle.CustomFont, GlobalStyle.Orange]}>
                                    Medication {index+1}: {medicine}
                                </Text>)})
                            }
                            <CustomButton
                                style={{marginTop: 50, marginBottom: 25}}
                                title={`Press to setup your medication!`}
                                onPressFunction={() => setMedicinePopupVisible(true)}
                            />
                        </>
                    }

                    <>
                        {emailList.length > 0 && 
                            <Text style={[GlobalStyle.CustomFont, GlobalStyle.Blue, {marginTop:25, marginBottom: 25, textAlign:"center"}]}>
                                Emails that you can send reports to:
                            </Text>
                        }
                        {emailList.map((email, index) => {
                            return (<Text key={index} style={[GlobalStyle.CustomFont, GlobalStyle.Orange]}>
                                Email {index+1}: {email}
                            </Text>)})
                        }
                        <CustomButton
                            style={{marginTop: 50, marginBottom: 25}}
                            title={`Press to setup your doctor's emails!`}
                            onPressFunction={() => setEmailPopupVisible(true)}
                        />
                    </>

                    <CustomButton
                        style={{marginTop: 50, paddingVertical: 15}}
                        title='Finalize profile!'
                        color='#1eb900'
                        onPressFunction={setData}
                    />
                </View>)}

    switch (account_type) {
    case "1":
    case "2":
        return shared_view()
    case "3": //IF USER TAKES INSULIN - TAKE THIS PATH
        return (<View style={styles.body}>
                    <CustomDropDownPicker
                        placeholder="How many daily injections?"
                        open={daily_injections_open}
                        value={daily_injections_value}
                        items={daily_injections}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setDailyInjections}
                        onChangeValue={(value) => setDynamicUser(state => ({ ...state, ["daily_injections"]:value }), [])}
                    />
                    {(!daily_injections_value) && <View style={{height: 225}}></View>}

                    {daily_injections_value != null && //MAKE SURE USER SPECIFIES HOW MANY TIMES THEY INJECT DAILY - THEN MOVE ONTO THE REST.
                        shared_view()
                    }
                </View>)
    default:
        return null;
    }
};

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e9c5b4',
    },
    text: {
        fontSize: 30,
        marginBottom: 130,
        textAlign: "center",
    },
})

export default ConditionalProfileView;