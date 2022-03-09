import React from 'react';
import {
    Image
} from 'react-native';

const Header = () => {
    return (
        <>
            
            <Image
                style={{width: 300,
                        height: 100,
                        margin: 20}}
                source={require('../../assets/my_diabetes.png')}
            />
        </>
    )
}

export default Header;