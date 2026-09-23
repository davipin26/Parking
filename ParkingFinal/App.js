import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { prepararBaseDeDatos } from './src/database/sqliteManager';

// Importación de las pantallas
import Login from './src/screens/Login';
import Registro from './src/screens/Registro';
import Parqueadero from './src/screens/Parqueadero';
import ListaVehiculos from './src/screens/ListaVehiculos'; // <-- La nueva pantalla
import VehiculosLocales from './src/screens/VehiculosLocales';

const Stack = createNativeStackNavigator();

export default function App() {
  
  // Prepara la base de datos local SQLite al iniciar la app
  useEffect(() => {
    prepararBaseDeDatos();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Registro" 
          component={Registro} 
          options={{ title: 'Registro de Usuario' }} 
        />
        <Stack.Screen 
          name="Parqueadero" 
          component={Parqueadero} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ListaVehiculos" 
          component={ListaVehiculos} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="VehiculosLocales" 
          component={VehiculosLocales} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}