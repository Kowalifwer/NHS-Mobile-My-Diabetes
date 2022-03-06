
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
import ImportantInformation from './screens/ImportantInformation';
import CareProcess from './screens/CareProcess';
import Settings from './screens/Settings';
import Videos from './screens/Videos';
import temp from './screens/temp';

const Stack = createStackNavigator();

function App() {

  const [loaded] = useFonts({
    AbrilFatface: require('../assets/AbrilFatface.ttf'),
  });
  
  if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      
        initialRouteName="ProfileSetup"
        screenOptions={{
          gestureEnabled: false,
       }}
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
          name="ImportantInformation"
          options={{
            headerShown: false,
          }}
          component={ImportantInformation}
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
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;