import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { guardarIngresoLocal } from '../database/sqliteManager';
import * as SQLite from 'expo-sqlite'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const dbPromise = SQLite.openDatabaseAsync('parqueadero_offline.db');

export default function Parqueadero({ navigation }) {
  const [placa, setPlaca] = useState('');
  const [tipo, setTipo] = useState('Carro');
  const [sincronizando, setSincronizando] = useState(false);

  // 1. Guardar localmente sin internet
  const registrarIngreso = async () => {
    if (!placa) {
      Alert.alert('Atención', 'Por favor ingresa la placa del vehículo.');
      return;
    }
    const horaActual = new Date().toLocaleString('es-CO');
    try {
      await guardarIngresoLocal(placa.toUpperCase(), tipo, horaActual);
      Alert.alert('Guardado', `Vehículo ${placa.toUpperCase()} guardado localmente.`);
      setPlaca('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el registro local.');
    }
  };

  // 2. Enviar datos a la nube
  const sincronizarDatos = async () => {
    setSincronizando(true);
    try {
      const db = await dbPromise;
      const registrosPendientes = await db.getAllAsync('SELECT * FROM ingresos_offline WHERE sincronizado = 0');
      
      if (registrosPendientes.length === 0) {
        Alert.alert('Aviso', 'No hay registros nuevos para sincronizar con la nube.');
        setSincronizando(false);
        return;
      }

      const respuesta = await fetch('https://parking-39fc.onrender.com/api/sincronizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registros: registrosPendientes }),
      });

      if (respuesta.ok) {
        await db.runAsync('UPDATE ingresos_offline SET sincronizado = 1 WHERE sincronizado = 0');
        Alert.alert('Éxito', `${registrosPendientes.length} registros subidos a la nube.`);
      } else {
        Alert.alert('Error', 'No se pudieron sincronizar los datos. Revisa tu conexión.');
      }
    } catch (error) {
      console.error("Error al sincronizar:", error);
      Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
    } finally {
      setSincronizando(false);
    }
  };

  // 3. Cerrar sesión
  // 3. Cerrar sesión
  const cerrarSesion = async () => {
    // Destruimos la sesión guardada
    await AsyncStorage.removeItem('usuarioLogueado');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Control de Ingreso</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Placa (Ej: ABC123)"
        value={placa}
        onChangeText={setPlaca}
        autoCapitalize="characters"
        maxLength={6}
      />

      <View style={styles.filaBotones}>
        <TouchableOpacity style={[styles.botonTipo, tipo === 'Carro' && styles.botonActivo]} onPress={() => setTipo('Carro')}>
          <Text style={tipo === 'Carro' ? styles.textoBlanco : styles.textoNegro}>Carro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botonTipo, tipo === 'Moto' && styles.botonActivo]} onPress={() => setTipo('Moto')}>
          <Text style={tipo === 'Moto' ? styles.textoBlanco : styles.textoNegro}>Moto</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.botonGuardar} onPress={registrarIngreso}>
        <Text style={styles.textoBoton}>Guardar (Local)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSincronizar} onPress={sincronizarDatos} disabled={sincronizando}>
        {sincronizando ? (
           <ActivityIndicator color="#fff" />
        ) : (
           <Text style={styles.textoBoton}>Subir a la Nube (Sincronizar)</Text>
        )}
      </TouchableOpacity>

      {/* NUEVO BOTÓN: Ver la lista de vehículos adentro */}
      <TouchableOpacity 
        style={styles.botonLista} 
        onPress={() => navigation.navigate('ListaVehiculos')}
      >
        <Text style={styles.textoBoton}>Ver Vehículos Adentro</Text>
      </TouchableOpacity>
      {/* NUEVO BOTÓN: Ver los pendientes locales */}
      <TouchableOpacity 
        style={[styles.botonLista, { backgroundColor: '#6C757D', marginBottom: 15 }]} 
        onPress={() => navigation.navigate('VehiculosLocales')}
      >
        <Text style={styles.textoBoton}>Ver Pendientes (Local)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonSalir} onPress={cerrarSesion}>
        <Text style={styles.textoBotonSalir}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, fontSize: 18, textAlign: 'center', marginBottom: 20 },
  filaBotones: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  botonTipo: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#fff' },
  botonActivo: { backgroundColor: '#007BFF', borderColor: '#007BFF' },
  textoNegro: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  textoBlanco: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  botonGuardar: { backgroundColor: '#28A745', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  botonSincronizar: { backgroundColor: '#FFC107', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  botonLista: { backgroundColor: '#17A2B8', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 30 },
  botonSalir: { alignItems: 'center', marginTop: 10 },
  textoBoton: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  textoBotonSalir: { color: '#DC3545', fontSize: 16, fontWeight: 'bold' }
});