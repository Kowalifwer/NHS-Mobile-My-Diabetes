import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
    Button,
} from 'react-native';

import CustomButton from '../components/CustomButton';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/GlobalStyle';
import YoutubePlayer from "react-native-youtube-iframe";


export default function Videos({ navigation, route }) {
    const [ytVideo,setYTVideo] = useState(null);
    const [playing, setPlaying] = useState(false);


    const onStateChange = useCallback((state) => {
    if (state === "ended") {
        setPlaying(false);
        Alert.alert("video has finished playing!");
    }
    }, []);

    const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
    }, []);

    const showData = () => {
        console.log("YEET")
        console.log(ytVideo[1]); 
        console.log(route.params.paramKey);
    }

    useEffect(() => {
        getVideos();
    }, []);

    const getVideos = async () => {
        try {
          const value = await AsyncStorage.getItem('videos')
          setYTVideo(JSON.parse(value));
        } catch(e) {
          console.log(e)
        }
      }

    const renderVideos = () => {
        var xy =[];
        for (var vid = 0; vid< route.params.paramKey.length; vid++) {
            xy.push(
             <View>
                 <Text>{route.params.paramKey[vid].name}</Text>
                <YoutubePlayer
                        height={300}
                        play={playing}
                        videoId={route.params.paramKey[vid].id}
                        onChangeState={onStateChange}
                    />
                    <Button title={playing ? "pause" : "play"} onPress={togglePlaying} />
            </View>)
        }
        return xy;
    } 

    return (
        <SafeAreaView style={styles.body}>

            <ScrollView>

                <View style={styles.body}>

                    <Header></Header>

                    <Text style={[GlobalStyle.CustomFont,styles.text]}>
                        Videos Page
                    </Text>
                </View>


                <View>
                {renderVideos()}
                </View>

                <CustomButton
                        title='Go to Homepage directly'
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
})