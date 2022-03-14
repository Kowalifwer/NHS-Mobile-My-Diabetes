
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ProfileSetup from './screens/ProfileSetup';
import ProfileUpdate from './screens/ProfileUpdate';
import Authentication from './screens/Authentication';
import Email from "./screens/Email";
import BarcodeScanner from "./screens/BarcodeScanner";
import EmailSetup from "./screens/EmailSetup";
import { useFonts } from 'expo-font';
import FoodDiary from './screens/diaries/FoodDiary';
import BPDiary from './screens/diaries/BPDiary';
import Diaries from './screens/Diaries';
import GlucoseDiary from "./screens/diaries/GlucoseDiary";
import MyProfile from './screens/MyProfile';
import Resources from './screens/Resources';
import CareProcess from './screens/CareProcess';
import Settings from './screens/Settings';
import Videos from './screens/Videos';
import temp from './screens/temp';
import Results from './screens/Results';
import PDF from './screens/PDF';
import { useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

const Stack = createStackNavigator();

function App() {

  useEffect(() => {
    changeScreenOrientation();
}, []);

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  const [loaded] = useFonts({
    Atkinson: require('./styles/Atkinson.ttf'),
  });
  
  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      
        initialRouteName="ProfileSetup"
      >
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileUpdate"
          component={ProfileUpdate}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
          component={Home}
        />
        <Stack.Screen
          name="Authentication"
          options={{
            headerShown: false,
          }}
          component={Authentication}
        />
        <Stack.Screen
          name="Email"
          options={{
            headerShown: false,
          }}
          component={Email}
        />
        <Stack.Screen
          name="BarcodeScanner"
          options={{
            headerShown: false,
          }}
          component={BarcodeScanner}
        />
        <Stack.Screen
          name="EmailSetup"
          options={{
            headerShown: false,
          }}
          component={EmailSetup}
        />
        <Stack.Screen
          name="Diaries"
          options={{
            headerShown: false,
          }}
          component={Diaries}
        />
        <Stack.Screen
          name="FoodDiary"
          options={{
            headerShown: false,
          }}
          component={FoodDiary}
        />
        <Stack.Screen
          name="BPDiary"
          options={{
            headerShown: false,
          }}
          component={BPDiary}
        />
        <Stack.Screen
          name="GlucoseDiary"
          options={{
            headerShown: false,
          }}
          component={GlucoseDiary}
        />
        <Stack.Screen
          name="MyProfile"
          options={{
            headerShown: false,
          }}
          component={MyProfile}
        />
        <Stack.Screen
          name="Resources"
          options={{
            headerShown: false,
          }}
          component={Resources}
        />
        <Stack.Screen
          name="CareProcess"
          options={{
            headerShown: false,
          }}
          component={CareProcess}
        />
        <Stack.Screen
          name="Settings"
          options={{
            headerShown: false,
          }}
          component={Settings}
        />
        <Stack.Screen
          name="Videos"
          options={{
            headerShown: false,
          }}
          component={Videos}
        />
        <Stack.Screen
          name="temp"
          options={{
            headerShown: false,
          }}
          component={temp}
        /> 
        <Stack.Screen
          name="Results"
          options={{
            headerShown: false,
          }}
          component={Results}
        />        
        <Stack.Screen
          name="PDF"
          options={{
            headerShown: false,
          }}
          component={PDF}
        />     
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;