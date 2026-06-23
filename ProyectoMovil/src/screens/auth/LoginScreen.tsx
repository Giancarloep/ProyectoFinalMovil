import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { isRequiredValid, isEmailValid, isPhoneValid } from '../../utils/validations';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setEmailError('');
    setPhoneError('');
    setPasswordError('');

    let isValid = true;

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
    }
    if (isValid) {
      setLoading(true);
      const success = await login(email, phone, password);
      setLoading(false);
      if (!success) {
        Alert.alert('Error', 'Credenciales incorrectas. ¿No tienes cuenta? Regístrate primero.');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>Study guide Resolution</Text>
      <Text style={[styles.subtitle, { color: colors.textTertiary }]}>Plataforma de Productividad Estudiantil</Text>

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

      <CustomButton title="Iniciar Sesión" onPress={handleLogin} loading={loading} />
      <CustomButton
        title="¿No tienes cuenta? Regístrate"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 25,
  },
});
