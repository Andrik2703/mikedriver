import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const API_URL = 'http://192.168.1.107:5678/webhook-taxi-request';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [viaje, setViaje] = useState(null);
  const [error, setError] = useState(null);

  const solicitarTaxi = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu solicitud');
      return;
    }

    setLoading(true);
    setError(null);
    setViaje(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const data = await response.json();
      console.log('Respuesta de n8n:', data);

      if (data && data.status === 'asignado') {
        setViaje(data);
      } else {
        setError('No se pudo asignar un conductor');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al conectar con el servidor');
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con n8n.\nVerifica:\n1. IP en App.js\n2. n8n corriendo\n3. Misma red Wi-Fi'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetear = () => {
    setPrompt('');
    setViaje(null);
    setError(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚖 MikeDriver</Text>
        <Text style={styles.headerSubtitle}>Solicita tu viaje con IA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!viaje ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>¿A dónde quieres ir?</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: Quiero ir del centro al aeropuerto"
                placeholderTextColor="#666"
                value={prompt}
                onChangeText={setPrompt}
                multiline
                numberOfLines={3}
                editable={!loading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={solicitarTaxi}
              disabled={loading}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.buttonText}> Buscando...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>Solicitar Taxi 🚕</Text>
              )}
            </TouchableOpacity>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>✅ ¡Viaje Asignado!</Text>
            
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{viaje.conductor}</Text>
              <Text style={styles.driverCar}>🚗 {viaje.auto}</Text>
              <Text style={styles.driverStatus}>🟢 Disponible</Text>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>📍 Origen</Text>
                <Text style={styles.detailValue}>{viaje.origen}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>📍 Destino</Text>
                <Text style={styles.detailValue}>{viaje.destino}</Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>📏 Distancia</Text>
                  <Text style={styles.detailValue}>{viaje.distancia} km</Text>
                </View>
                <View style={styles.detailHalf}>
                  <Text style={styles.detailLabel}>⏱️ Tiempo</Text>
                  <Text style={styles.detailValue}>{viaje.tiempoEstimado} min</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={resetear}>
              <Text style={styles.resetButtonText}>🔄 Nuevo Viaje</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#16213e',
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: '#ff4757',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
  confirmationCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ed573',
    textAlign: 'center',
    marginBottom: 20,
  },
  driverInfo: {
    backgroundColor: '#0f3460',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  driverName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  driverCar: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 5,
  },
  driverStatus: {
    fontSize: 14,
    color: '#2ed573',
    marginTop: 5,
  },
  tripDetails: {
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailHalf: {
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e94560',
  },
  resetButtonText: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: '600',
  },
});