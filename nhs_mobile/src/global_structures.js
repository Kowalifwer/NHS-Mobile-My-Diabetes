user_struct = {name: "", age: "", height: "", weight: "", blood_type: ""}

diary_dict = {}
diry_paths = {}

dropdown_schema = {
    showArrowIcon: true,
    showTickIcon: true,
    label: 'title',
    value: 'val',
    style: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        minwidth: 300,
        minHeight: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
    },
    containerStyle: {
        width: 300,
    },
    placeholderStyle: {
        color: "grey",
        fontSize: 20,
    },  
    textStyle: {
        fontSize: 15,
        textAlign: "center"
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
        paddingLeft: 15
    },
    selectedItemLabelStyle: {
        fontWeight: "bold",
    }
}