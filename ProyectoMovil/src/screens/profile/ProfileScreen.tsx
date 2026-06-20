import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const ProfileScreen = () => {
  const { currentUser, logout } = useAuth();
  const { isDark, colors, toggleTheme } = useTheme();
  const userEmail = currentUser?.email || "estudiante@unah.edu";
  const userPhone = currentUser?.phone || "Sin teléfono";
  const userName = currentUser?.name || "Usuario";
  const avatarLetter = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, salir", onPress: () => logout() }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.profileHeader}>
        <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{userName}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail}</Text>
        <Text style={[styles.userPhone, { color: colors.textTertiary }]}>Tel: {userPhone}</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Study guide Resolution</Text>
        <Text style={[styles.infoText, { color: colors.textSecondary }]}>Plataforma de Productividad Estudiantil</Text>
      </View>

      <View style={[styles.themeRow, { backgroundColor: colors.card }]}>
        <View>
          <Text style={[styles.themeLabel, { color: colors.text }]}>Modo Oscuro</Text>
          <Text style={[styles.themeHint, { color: colors.textTertiary }]}>
            {isDark ? 'Activado' : 'Desactivado'}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={isDark ? colors.headerText : colors.textTertiary}
        />
      </View>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.danger }]} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    textAlign: 'center',
  },
  userPhone: {
    fontSize: 16,
    marginTop: 5,
  },
  infoCard: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    marginTop: 5,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeHint: {
    fontSize: 13,
    marginTop: 2,
  },
  logoutButton: {
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
