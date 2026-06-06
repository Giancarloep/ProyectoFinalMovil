// src/components/CustomInput.tsx
import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  errorMessage?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({label,value,onChangeText,placeholder,secureTextEntry = false,
    keyboardType = 'default',
    errorMessage,}) => {const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View
        style={[
          styles.inputContainer,
          // ESTILO CONDICIONAL: Si hay error se pone rojo, si está enfocado se pone azul o esa es la idea por lo menos
          errorMessage ? styles.borderError : isFocused ? styles.borderFocused : styles.borderDefault
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
  },
  borderDefault: {
    borderColor: '#E0E0E0',
  },
  borderFocused: {
    borderColor: '#007AFF',
  },
  //errorMessage: Si hay un error, el borde se pone rojo
  borderError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});