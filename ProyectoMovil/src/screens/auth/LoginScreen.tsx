// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { isRequiredValid, isEmailValid, isPhoneValid } from '../../utils/validations';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    let isValid = true;

    // Validar el Email
    if (!isRequiredValid(email)) {
      setEmailError('El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!isEmailValid(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      isValid = false;
    }

    // Validar el Teléfono
    if (!isRequiredValid(phone)) {
      setPhoneError('El teléfono es obligatorio.');
      isValid = false;
    } else if (!isPhoneValid(phone)) {
      setPhoneError('El teléfono debe contener entre 8 y 10 dígitos numéricos.');
      isValid = false;
    }

    // Validar la Contraseña
    if (!isRequiredValid(password)) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    }

    // SI TODO ESTÁ CORRECTO: DEBERIA tirar el mensaje de exito y navega a la pantalla principal aunque aun no esta creada
    if (isValid) {
      Alert.alert('¡Éxito!', 'Iniciando sesión...');
      navigation.replace('MainTabs'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EduFocus</Text>
      <Text style={styles.subtitle}>Plataforma de Productividad Estudiantil</Text>
      <CustomInput
        label="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        errorMessage={emailError}
      />

      <CustomInput
        label="Teléfono"
        value={phone}
        onChangeText={setPhone}
        placeholder="Introduce tu número"
        keyboardType="numeric"
        errorMessage={phoneError}
      />

      <CustomInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Introduce tu contraseña"
        secureTextEntry={true}
        errorMessage={passwordError}
      />

      <CustomButton title="Iniciar Sesión" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  logoImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
});