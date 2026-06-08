import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { isRequiredValid, isEmailValid, isPhoneValid } from '../../utils/validations';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen = ({ navigation }: any) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let isValid = true;

    if (!isRequiredValid(name)) {
      setNameError('El nombre es obligatorio.');
      isValid = false;
    }
    if (!isRequiredValid(email)) {
      setEmailError('El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!isEmailValid(email)) {
      setEmailError('Por favor, ingresa un correo electrónico válido.');
      isValid = false;
    }
    if (!isRequiredValid(phone)) {
      setPhoneError('El teléfono es obligatorio.');
      isValid = false;
    } else if (!isPhoneValid(phone)) {
      setPhoneError('El teléfono debe contener entre 8 y 10 dígitos numéricos.');
      isValid = false;
    }
    if (!isRequiredValid(password)) {
      setPasswordError('La contraseña es obligatoria.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    }
    if (!isRequiredValid(confirmPassword)) {
      setConfirmPasswordError('Debes confirmar tu contraseña.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.');
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        const success = register(name, email, phone, password);
        if (success) {
          Alert.alert(
            '¡Cuenta creada!',
            `Bienvenido a EduFocus, ${name}. Ya puedes iniciar sesión.`,
            [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
          );
        } else {
          Alert.alert('Error', 'Este correo electrónico ya está registrado.');
        }
      }, 1000);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>EduFocus</Text>
      <Text style={styles.subtitle}>Crea tu cuenta de estudiante</Text>

      <CustomInput
        label="Nombre completo"
        value={name}
        onChangeText={setName}
        placeholder="Ej: Juan Pérez"
        errorMessage={nameError}
      />
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
        placeholder="Ej: 99887766"
        keyboardType="numeric"
        errorMessage={phoneError}
      />
      <CustomInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="Mínimo 8 caracteres"
        secureTextEntry={true}
        errorMessage={passwordError}
      />
      <CustomInput
        label="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repite tu contraseña"
        secureTextEntry={true}
        errorMessage={confirmPasswordError}
      />

      <CustomButton title="Crear Cuenta" onPress={handleRegister} loading={loading} />
      <CustomButton
        title="¿Ya tienes cuenta? Inicia sesión"
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
});
