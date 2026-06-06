import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userEmail = route.params?.email || "estudiante@unah.edu";
  const userPhone = route.params?.phone || "Sin teléfono";
  const avatarLetter = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir de EduFocus?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, salir",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={styles.userEmail}>{userEmail}</Text>
        <Text style={styles.userPhone}>Tel: {userPhone}</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Place holder name</Text>
        <Text style={styles.infoText}>Plataforma de Productividad Estudiantil</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: '#F2F2F7',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  infoText: {
    fontSize: 14,
    color: '#3A3A3C',
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});