
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import ProfileSetup from './screens/ProfileSetup';
import Register from './screens/Register';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      
        initialRouteName="ProfileSetup"
        // screenOptions={{
        //   headerTitleAlign: 'center',
        //   headerStyle: {
        //     backgroundColor: '#0080ff'
        //   },
        //   headerTintColor: '#ffffff',
        //   headerTitleStyle: {
        //     fontSize: 25,
        //     fontWeight: 'bold'
        //   }
        // }}
      >
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetup}
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
          name="Register"
          options={{
            headerShown: false,
          }}
          component={Register}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App;