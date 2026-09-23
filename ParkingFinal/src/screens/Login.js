import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Nueva importación

export default function Login({ navigation }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  // NUEVO: Al abrir la app, verificamos si ya hay una sesión guardada
  useEffect(() => {
    const verificarSesion = async () => {
      const sesionActiva = await AsyncStorage.getItem('usuarioLogueado');
      if (sesionActiva === 'true') {
        navigation.replace('Parqueadero'); // Lo saltamos directo al parqueadero
      }
    };
    verificarSesion();
  }, []);

  const iniciarSesion = async () => {
    if (!correo || !clave) {
      Alert.alert('Atención', 'Por favor ingresa tus datos.');
      return;
    }

    try {
      const respuesta = await fetch('https://parking-39fc.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, clave }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // NUEVO: Guardamos el "pase VIP" en el celular
        await AsyncStorage.setItem('usuarioLogueado', 'true');
        
        Alert.alert('Éxito', 'Bienvenido al Parqueadero');
        navigation.replace('Parqueadero');
      } else {
        Alert.alert('Error', datos.mensaje || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      
      <TextInput style={styles.input} placeholder="Correo electrónico" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Contraseña" value={clave} onChangeText={setClave} secureTextEntry />
      
      <TouchableOpacity style={styles.boton} onPress={iniciarSesion}>
        <Text style={styles.textoBoton}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSecundario} onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.textoBotonSecundario}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  boton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  botonSecundario: { marginTop: 20, alignItems: 'center' },
  textoBotonSecundario: { color: '#28A745', fontSize: 16 }
});