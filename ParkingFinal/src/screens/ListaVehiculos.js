import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export default function ListaVehiculos({ navigation }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarVehiculos = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://parking-39fc.onrender.com/api/vehiculos');
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setVehiculos(datos);
      } else {
        Alert.alert('Error', 'No se pudieron cargar los vehículos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor en la nube.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const darSalida = async (id, placa) => {
    Alert.alert(
      'Confirmar Salida',
      `¿Estás seguro de registrar la salida del vehículo ${placa}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sí, Salida', 
          onPress: async () => {
            try {
              const respuesta = await fetch(`https://parking-39fc.onrender.com/api/salida/${id}`, {
                method: 'PUT'
              });
              if (respuesta.ok) {
                Alert.alert('Éxito', `Salida registrada para ${placa}`);
                cargarVehiculos(); // Recargar la lista
              } else {
                Alert.alert('Error', 'No se pudo registrar la salida.');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Problemas de conexión.');
            }
          } 
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.tarjeta}>
      <View>
        <Text style={styles.placa}>{item.placa}</Text>
        <Text style={styles.texto}>Tipo: {item.tipo_vehiculo}</Text>
        <Text style={styles.textoInfo}>Ingreso: {item.hora_ingreso}</Text>
      </View>
      <TouchableOpacity style={styles.botonSalida} onPress={() => darSalida(item.id, item.placa)}>
        <Text style={styles.textoBoton}>Dar Salida</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Vehículos en Parqueadero</Text>
      
      {cargando ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : vehiculos.length === 0 ? (
        <Text style={styles.textoVacio}>No hay vehículos adentro en la nube.</Text>
      ) : (
        <FlatList
          data={vehiculos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onRefresh={cargarVehiculos}
          refreshing={cargando}
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
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#333' },
  tarjeta: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  placa: { fontSize: 20, fontWeight: 'bold', color: '#007BFF' },
  texto: { fontSize: 16, color: '#555', marginTop: 5 },
  textoInfo: { fontSize: 12, color: '#888', marginTop: 5 },
  botonSalida: { backgroundColor: '#DC3545', padding: 10, borderRadius: 5 },
  textoBoton: { color: '#fff', fontWeight: 'bold' },
  textoVacio: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 40 },
  botonVolver: { marginTop: 20, alignItems: 'center', padding: 15 },
  textoBotonSecundario: { color: '#007BFF', fontSize: 16, fontWeight: 'bold' }
});