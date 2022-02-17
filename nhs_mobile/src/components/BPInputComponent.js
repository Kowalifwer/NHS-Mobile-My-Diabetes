import React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    SafeAreaView, 
    ScrollView,
} from 'react-native';
import GlobalStyle from '../styles/GlobalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from './CustomButton';


// this is the food input which gets added to the page when user clicks the + button
const BPInputComponent = props => {
    let {setBPComponentsData,id} = props

    const [state_dict, setStateDict] = useState({
        showTimePicker: false,
    });

    return (
        <View>
            {state_dict.showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={new Date()}
                    display="default"
                    mode="time"
                    onChange={(event, new_time) => {
                        setBPComponentsData(state => (state.map(val => {//#endregion
                            if (val.index == id) {
                                return {...val, ['time']: new_time}
                            } return val;
                        })))
                        }
                    }
                />
            )}
            <CustomButton
                onPressFunction={() => {
                    setStateDict(state => ({ ...state, 
                        ["showTimePicker"]:true,
                    }), [])
                }}
                title="Enter Time"
                color="#008c8c"
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder='arm'
                onChangeText={(value) => {
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['arm']: value.trim()}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="systolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['systolic']: value.trim()}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
            />
            <TextInput
                style={GlobalStyle.InputField}
                placeholder="diastolic"
                keyboardType="numeric"
                onChangeText={(value) => {
                    setBPComponentsData(state => (state.map(val => {//#endregion
                        if (val.index == id) {
                            return {...val, ['diastolic']: value.trim()}
                        } return val;
                    })))
                }}
                multiline={true}
                numberOfLines={1}
            />
        </View>
    )

}

// class BPInputComponent extends React.Component {
//     constructor() {
//         super();
//         this.mounted = false;
//         this.state = {
//             time: new Date(),
//             time_string: "",
//             showTimePicker: false,
//             dict: {time: "", arm: "", systolic: "", diastolic: ""},
//         };
//         console.log("ismounted: ", this.isMounted)
//     }

//     componentDidMount() {
//         console.log("COMPONENT MOUNTED");
//         this.mounted = true;
//     }

//     render() {
//         return (
//             <View>
//                 {this.state.showTimePicker && (
//                     <DateTimePicker
//                         testID="timePicker"
//                         value={this.state.time}
//                         display="default"
//                         mode="time"
//                         onChange={(event, new_time) => {
//                             this.setState({
//                                 showTimePicker: false,
//                                 time: new_time,
//                                 time_string: `${new_time.getHours()}:${new_time.getMinutes()}`,
//                             })
//                         }}
//                     />
//                 )}
//                 <CustomButton
//                     onPressFunction={() => {
//                         console.log("PRESSED BUTTON, IS MOUNTED?: ", this.mounted);
//                         this.setState({showTimePicker: true});
//                         console.log("showTimePicker: true");
//                     }}
//                     title="Enter Time"
//                     color="#008c8c"
//                 />
//                 <TextInput
//                     style={GlobalStyle.InputField}
//                     placeholder='arm'
//                     onChangeText={(value) => {
//                         this.dict["arm"] = value.trim()
//                     }}
//                     multiline={true}
//                     numberOfLines={1}
//                 />
//                 <TextInput
//                     style={GlobalStyle.InputField}
//                     placeholder="systolic"
//                     keyboardType="numeric"
//                     onChangeText={(value) => {
//                         this.dict["systolic"] = value.trim()
//                     }}
//                     multiline={true}
//                     numberOfLines={1}
//                 />
//                                 <TextInput
//                     style={GlobalStyle.InputField}
//                     placeholder="diastolic"
//                     keyboardType="numeric"
//                     onChangeText={(value) => {
//                         this.dict["diastolic"] = value.trim()
//                     }}
//                     multiline={true}
//                     numberOfLines={1}
//                 />
//             </View>
//         );
//     }
// }

export default BPInputComponent