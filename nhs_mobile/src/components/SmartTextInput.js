import React from 'react';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const SmartTextInput = (props) => {
    const [input_state, setInputState] = React.useState('');
    
    return (
        <FloatingLabelInput
            {...props}
            label={(props.label) ? props.label : props.placeholder}
            placeholder={null}
            value={(props.value) ? props.value : input_state}
            hintTextColor={'#999999'}
            containerStyles = {{
                width: 350,
                borderWidth: 1,
                borderColor: '#17a09d',
                borderRadius: 10,
                height: 50,
                backgroundColor: '#ffffff',
                fontSize: 30,
                marginTop: 20,
                marginBottom: 20,
                marginLeft: 12,
                marginRight: 12,
                fontFamily: 'Atkinson',
            }}
            customLabelStyles={{
                colorFocused: '#17a09d',
                colorBlurred: '#5B5B5B',
                fontSizeFocused: 28,
                fontSizeBlurred: 28,
                topFocused: -45,
                leftFocused: -12,
            }}
            labelStyles={{
                backgroundColor: 'transparent',
                paddingHorizontal: 10,
            }}
            inputStyles={{
                color: '#5B5B5B',
                paddingHorizontal: 10,
                fontSize: 20,
            }}

            onChange={(text) => setInputState(text)}
        />
    )
}

export default SmartTextInput;