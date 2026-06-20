import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) ? { backgroundColor: colors.inactive } : { backgroundColor: colors.primary }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
