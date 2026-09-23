import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function Registro({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');

  const registrarUsuario = async () => {
    if (!nombre || !correo || !clave) {
      Alert.alert('Atención', 'Por favor, llena todos los campos.');
      return;
    }

    try {
      const respuesta = await fetch('https://parking-39fc.onrender.com/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, correo, clave }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        Alert.alert('Éxito', 'Usuario registrado correctamente');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', datos.mensaje || 'No se pudo registrar');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nuevo Usuario</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.boton} onPress={registrarUsuario}>
        <Text style={styles.textoBoton}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.botonSecundario} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.textoBotonSecundario}>Volver al Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 8, fontSize: 16 },
  boton: { backgroundColor: '#28A745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  botonSecundario: { marginTop: 20, alignItems: 'center' },
  textoBotonSecundario: { color: '#007BFF', fontSize: 16 }
});