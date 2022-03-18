import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
    Modal,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { BarCodeScanner } from 'expo-barcode-scanner';
import {object_is_empty} from '../global_structures.js';

export default function BarcodeScanner({ navigation }) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [product_data, setProductData] = useState(null);

    const fetch_product_data = async (ean_barcode) => { //Fetch the product data from the open food facts API.
        const url = `https://world.openfoodfacts.org/api/v0/product/${ean_barcode}.json`;
        return await fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data["status"] == 1) {
                //WE CAN FETCH DIFFERENT LANGUAGES AS WELL IF NECESSARY!!
                return product_data_parsed = {
                    name: data["product"]["product_name"],
                    image: data["product"]["image_url"],
                    allergens: data["product"]["allergens_from_ingredients"],
                    ingredients: data["product"]["ingredients_text"],
                    countries: data["product"]["countries"],
                    image_nutrition: data["product"]["image_nutrition_url"],
                    nutriscore_score: data["product"]["nutriscore_score"],
                    nutriscore_grade: data["product"]["nutriscore_grade"],
                    nova_score: data["product"]["nova_group"],
                    product_url: `https://world.openfoodfacts.org/product/${ean_barcode}`,
                    api_url: url,
                    ean_barcode: ean_barcode,
                    nutrients: data["product"]["nutriments"],
                }
            }
            
            else {
                throw "Error - no product found in Database"
            }
            
        })
        .catch(error => {throw new Error(error);})
    }

    // useEffect(() => {return}, [product_data]) //rerender when product data updates.

    useEffect(() => {
        // update_product_state(product_data)
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        fetch_product_data(data).then(result => {setProductData(result); setModalVisible(true)}).catch(error => Alert.alert(error.message))
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
            <View style={styles.body}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
                />

                <View style={{display: 'flex', flexDirection: 'column', height: "100%", justifyContent: "flex-end", paddingBottom: 20}}>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >   
                        {product_data && 
                            <View style={{height: "100%",padding: 50, backgroundColor: "blue", display: "flex", justifyContent: "space-between", paddingBottom: 50, zIndex: 5}}>

                                <Text>Product found!</Text>
                                <Text>{product_data.name}</Text>
                                <Text>{product_data.image}</Text>
                                <Text>{product_data.allergens}</Text>
                                <Text>{product_data.ingredients}</Text>
                                <Text>{product_data.countries}</Text>
                                <Text>{product_data.image_nutrition}</Text>

                                {console.log(object_is_empty(product_data.nutrients))}

                                <CustomButton
                                    title="Close product"
                                    onPressFunction={() => setModalVisible(!modalVisible)}
                                />
                            </View>
                        }
                            
                    
                    </Modal>

                    {scanned && <CustomButton title={'Tap to Scan Again'} onPressFunction={() => setScanned(false)} />}
                    <CustomButton
                        title='Return to Homepage'
                        color='#761076'
                        onPressFunction={() => navigation.navigate("Home")}
                    />
                </View>
            </View>
    );

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
        textAlign: 'center',
    },
})