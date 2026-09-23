import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('parqueadero_offline.db');

export default function VehiculosLocales({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);

  const cargarPendientes = async () => {
    try {
      const db = await dbPromise;
      // Buscamos solo los que no se han subido a la nube
      const registros = await db.getAllAsync('SELECT * FROM ingresos_offline WHERE sincronizado = 0');
      setVehiculos(registros);
    } catch (error) {
      console.error(error);
    }
  };

  // Esto hace que la lista se actualice sola cada vez que entras a la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarPendientes();
    });
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <Text style={styles.placa}>{item.placa}</Text>
      <Text style={styles.texto}>Tipo: {item.tipo_vehiculo || item.tipo}</Text>
      <Text style={styles.textoInfo}>Registrado: {item.hora_ingreso || item.hora}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Pendientes de Subir</Text>
      
      {vehiculos.length === 0 ? (
        <Text style={styles.textoVacio}>No hay vehículos locales pendientes. ¡Todo está en la nube!</Text>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.botonVolver} onPress={() => navigation.goBack()}>
        <Text style={styles.textoBotonSecundario}>Volver al Registro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#FF9800' },
  tarjeta: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#FF9800', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  placa: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  texto: { fontSize: 16, color: '#555', marginTop: 5 },
  textoInfo: { fontSize: 12, color: '#888', marginTop: 5 },
  textoVacio: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 40 },
  botonVolver: { marginTop: 20, alignItems: 'center', padding: 15 },
  textoBotonSecundario: { color: '#007BFF', fontSize: 16, fontWeight: 'bold' }
});