import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

var deviceWidth = Dimensions.get("window").width;

const CustomButton = (props) => {
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
        fontSize: 22,
        textAlign: 'center',
        marginTop: -2.5,
        fontFamily: 'Atkinson',
    },
    button: {
        width: deviceWidth * 0.92,
        minHeight: 40,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
})

export default CustomButton;