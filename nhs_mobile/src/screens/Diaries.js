import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import FoodDiary from './diaries/FoodDiary';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../components/CustomButton';
import ConditionalProfileView from '../components/ConditionalProfileView';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import DropdownStyle from '../styles/DropdownStyle';
import {diary_list} from '../global_structures.js'

export default function Diaries({ navigation }) {
    const [stored_user, setStoredUser] = useState(null)

    useEffect(() => { //every time DOM renders, IF stored user is null - fetch from AsyncStorage
        if (!stored_user) 
            (async () => {
                const user = await AsyncStorage.getItem('UserData');
                console.log(user + " is stored user");
                setStoredUser(JSON.parse(user));
            })();
    }, []);

    return (
        <SafeAreaView style={styles.body}>
            <ScrollView>
                <View style={styles.body}>
                    <Header/>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        My Diaries Page
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Here you can view your diaries and make changes to them.
                    </Text>
                    
                    {/* we can iterate over a list of diaries here (once we have them) and create buttons that link to their respective screens */}
                    {diary_list.map((item, i) =>
                        <CustomButton
                            key={i}
                            onPressFunction={() => {
                                navigation.navigate(item.screen_name, { // we can pass paramters to the .navigate function here, such as the number of insulin readings etc.. to then use in the respective Diary screen.
                                    daily_injections: (stored_user.daily_injections) ? stored_user.daily_injections : "-1",
                                    health_type: (stored_user.health_type) ? stored_user.health_type : "-1",
                                })
                            }}
                            color="#761076"
                            title={item.verbose_name}
                            style={GlobalStyle.button_style}
                        />
                    )}

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 200}}>
                        <CustomButton
                            title='Go to Homepage directly'
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
        fontSize: 30,
        marginBottom: 130,
        textAlign: "center",
    },
})