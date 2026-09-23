import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { prepararBaseDeDatos } from './src/database/sqliteManager';

// Importamos la pantalla de Login
import Login from './src/screens/Login';

const Stack = createNativeStackNavigator();

export default function App() {
  
  useEffect(() => {
    // Esto se ejecuta una sola vez al abrir la app para asegurar que la tabla offline exista
    prepararBaseDeDatos();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ title: 'Iniciar Sesión', headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}