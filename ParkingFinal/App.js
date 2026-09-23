import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { prepararBaseDeDatos } from './src/database/sqliteManager';

import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import Parqueadero from './src/screens/Parqueadero'; // <-- Nueva importación

const Stack = createNativeStackNavigator();

export default function App() {
  
  useEffect(() => {
    prepararBaseDeDatos();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Registro" component={Registro} options={{ title: 'Registro de Usuario' }} />
        {/* Nueva pantalla */}
        <Stack.Screen name="Parqueadero" component={Parqueadero} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}