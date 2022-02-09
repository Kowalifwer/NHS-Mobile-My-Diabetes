import React from 'react';
import GlobalStyle from '../styles/GlobalStyle';
import { TextInput } from 'react-native';

// const NumberInput = (props) => {
//     constructor() {
//         super();
//         this.label = label;
//         this.num = 0;
//     }

//     cleanInput() {
//         this.num = this.num.match(/^\d+(\.\d+)?$/);
//     }

//     return (
//         <TextInput
//             onChangeText={props.onChangeText}
//             placeholder={props.label}
//             keyboardType='numeric'
//         />
//     )
// }

class NumberInput extends React.Component {
    constructor(props) {
        super();
        this.label = props.label;
        this.last_input = 0;
        this.input = 0;
    }

    validateInput() {
        if (this.input.match(/^\d+(\.\d+)?$/) == null) {
            return false
        } else {
            return true
        }
    }

    render() {
        return (
            <TextInput
                style={ GlobalStyle.InputField }
                keyboardType = 'numeric'
                placeholder={ this.label }
                onChangeText={ value => {
                        this.last_input = this.input
                        this.input = value
                        console.log(this.input, this.last_input, "what is going on")
                        if (!this.validateInput()) {
                            // this.input = this.last_input
                            value = this.last_input
                            console.log("SHOULD HAVE BEEN REPLACED")
                        }
                    }
                }
            />
        );
    }
}

export default NumberInput;