import React, { useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import GlobalStyle from '../styles/GlobalStyle';
import YoutubePlayer from "react-native-youtube-iframe";


export default function Videos({ navigation, route }) {
    const [playing, setPlaying] = useState(false);

    // Used to tell user video has finished. Currently commented as not needed. If by code freeze still not needed then will delete from app
    const onStateChange = useCallback((state) => {
    if (state === "ended") {
        setPlaying(false);
        //Alert.alert("video has finished playing!");
    }
    }, []);

    // Used to toggle if video is playing via a button. Currently commented as not needed. If by code freeze still not needed then will delete from app
    /*
    const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
    }, []);
    */

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>
                    <Header></Header>
                </View>


                <View styles={styles.body}>
                    {route.params?.video.map( vid =>(
                        <View key={vid.id}>
                                <Text style={[styles.video_text, GlobalStyle.Blue]}>{vid.name}</Text>
                                <YoutubePlayer
                                        webViewStyle={ {opacity:0.99} }
                                        height={300}
                                        play={playing}
                                        videoId={vid.id}
                                        onChangeState={onStateChange}
                                />
                        </View>
                    ))}
                </View>

                <CustomButton
                        title='Homepage'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Home")}
                />

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
    video_text: {
        fontSize: 25,
        textAlign: "center",
        marginBottom: 20,
    },
})