import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

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
    errorMessage,}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          { backgroundColor: colors.surface },
          errorMessage ? { borderColor: colors.danger } : isFocused ? { borderColor: colors.primary } : { borderColor: colors.border }
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      {errorMessage ? <Text style={[styles.errorText, { color: colors.danger }]}>{errorMessage}</Text> : null}
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
    marginBottom: 5,
  },
  inputContainer: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
