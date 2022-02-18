import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Alert,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { BarCodeScanner } from 'expo-barcode-scanner';

const BarcodeScannerComponent = (props) => {
    let {setFoodInputComponentsData, id, setBarcodeScannerOpen, barcode_scanner_open} = props;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

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

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        fetch_product_data(data).then(result => {
            setFoodInputComponentsData(state => (state.map(val => {//#endregion
                if (val.index == id) {
                    return {...val, ['scanned_item_object']: result}
                } return val;
            })))
            setBarcodeScannerOpen([false, 0])
        }).catch(error => Alert.alert("Product not found. Please try to scan again or close the scanner and input data manually. Sorry for the inconvenience."))
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    if (!barcode_scanner_open[0]) return null //make sure no barcode scanner object returned if the barcode scanner is not supposed to be open

    return (
        <View style={styles.body}>
            <Text>Scan a product into diary entry {id+1}</Text>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={[StyleSheet.absoluteFillObject, {height: 500, marginBottom: 100}]}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.ean13]}
            />
            {scanned && <CustomButton title={'Tap to Scan Again'} onPressFunction={() => setScanned(false)} />}
            <CustomButton
                style= {{marginTop:550}}
                title='Cancel Scan'
                color='#761076'
                onPressFunction={() => {setBarcodeScannerOpen([false, 0])}}
            />
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

export default BarcodeScannerComponent