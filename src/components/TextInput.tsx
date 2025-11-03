import React from 'react';
import { TextInput as RNTextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.errorInput,
          style,
        ]}
        placeholderTextColor="#C4A57B"
        multiline={multiline}
        numberOfLines={numberOfLines}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8D5C4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#5C4A3A',
    backgroundColor: '#FDFBF7',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
});
