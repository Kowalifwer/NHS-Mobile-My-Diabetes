import React from 'react';
import GlobalStyle from '../styles/GlobalStyle';
import { TextInput } from 'react-native';


class NumberInput extends React.Component {
    constructor(props, diary_name) {
        super();
        this.state = { input_text: "", last_input_text: "" }
        this.diary_name = diary_name
    }

    validateInput(input) {
        console.log("testing: ", input)
        if (input.match(/(^$)|(^\d+\.*\d*?$)/) == null) {
            return false
        } else {
            return true
        }
    }

    updateInput(input) {
        if (this.validateInput(input)) {
            this.setState({last_input_text: this.state.input_text, input_text: input})
        }
    }

    render() {
        return (
            <TextInput
                style={ GlobalStyle.InputField }
                value={ this.state.input_text }
                keyboardType = 'numeric'
                placeholder={ this.props.label }
                onChangeText={ value => {
                    if (this.validateInput(value)) {
                        this.updateInput(value)
                    }
                }}
            />
        );
    }
}

export default NumberInput;