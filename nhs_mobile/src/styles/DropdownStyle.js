
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
    style: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#17a09d",
        borderRadius: 10,
        width: 350,
        minHeight: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        marginBottom: 15,
    },
    containerStyle: {
        width: 350,
    },
    placeholderStyle: {
        color: "grey",
        fontSize: 20,
    },  
    textStyle: {
        fontSize: 15,
        textAlign: "center",
        fontFamily: "Atkinson",
    },
    labelStyle: {
        fontWeight: "bold"
    },
    itemContainerStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 15,
        paddingBottom: 5,
        paddingTop: 5,
    },
    selectedItemContainerStyle: {
        backgroundColor: "#D3D3D3",
        paddingLeft: 15,
    },
    selectedItemLabelStyle: {
        fontWeight: "bold",
    }
})