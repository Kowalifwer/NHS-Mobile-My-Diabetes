import React from 'react';
import {
    Pressable,
    Text,
    StyleSheet,
} from 'react-native';

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
        fontSize: 23,
        textAlign: 'center',
        marginTop: -5,
    },
    button: {
        width: 170,
        minHeight: 75,
        height: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    
})

export default HomePageButton;