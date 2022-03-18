import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import {diary_list} from '../global_structures.js'

export default function Diaries({ navigation, route }) {
    const [stored_user, setStoredUser] = useState(null)

    // console.log("diary_list: \n", diary_list);

    useEffect(() => { // every time DOM renders, IF stored user is null - fetch from AsyncStorage
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
                    <Text style={[GlobalStyle.CustomFont,styles.text,GlobalStyle.Cyan]}>
                        My Diaries Page
                    </Text>
                    <Text style={[GlobalStyle.CustomFont,styles.text, GlobalStyle.Blue]}>
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
                                    videos: route.params.video,
                                    medicine_list: (stored_user.medicine_list) ? stored_user.medicine_list : [],
                                })
                            }}
                            title={item.verbose_name}
                            style={GlobalStyle.button_style}
                        />
                    )}

                    <View style={{display: 'flex', flexDirection: 'column', marginTop: 100}}>
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
        fontSize: 30,
        marginBottom: 30,
        textAlign: "center",
    },
})