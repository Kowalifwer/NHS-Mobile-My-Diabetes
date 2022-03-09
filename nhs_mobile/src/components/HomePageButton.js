import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

var deviceHeight = Dimensions.get("window").height;
var deviceWidth = Dimensions.get("window").width;

const HomePageButton = (props) => {
    return (
        <Pressable
            onPress={props.onPressFunction}
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            android_ripple={{ color: '#00000050' }}
            style={({ pressed }) => [
                { backgroundColor: pressed ? '#dddddd' : (props.color) ? props.color : '#17a09d' },
                styles.button,  
                { ...props.style }
            ]}
        >
            <Text style={styles.text}>
                {props.title}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
        fontSize: (deviceHeight * 0.1) * 0.35,
        textAlign: 'center',
        margin: -5,
    },
    button: {
        width: deviceWidth * 0.44,
        height: deviceHeight * 0.1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    
})

export default HomePageButton;