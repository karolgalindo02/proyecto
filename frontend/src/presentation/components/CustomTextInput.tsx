import React from 'react';
import { StyleSheet, View, Image, TextInput, KeyboardType, Text } from 'react-native';

interface Props {
  image: any;
  placeholder: string;
  value: string;
  keyboardType: KeyboardType;
  secureTextEntry?: boolean;
  property: string;
  onChangeText: (property: string, value: any) => void;
  error?: string;
  showError?: boolean;
}

export const CustomTextInput = ({
  image,
  placeholder,
  value,
  keyboardType,
  secureTextEntry = false,
  property,
  onChangeText,
  error,
  showError = false
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.formInput,
        showError && error ? styles.formInputError : {}
      ]}>
        <Image style={styles.formIcon} source={image} />
        <TextInput
          style={styles.formTextInput}
          placeholder={placeholder}
          keyboardType={keyboardType}
          value={value}
          onChangeText={text => onChangeText(property, text)}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
        />
      </View>
      {showError && error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  formIcon: {
    width: 25,
    height: 25,
    marginTop: 5,
  },
  formInput: {
    flexDirection: 'row',
    marginTop: 25,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#AAAAAA',
    paddingBottom: 5,
  },
  formInputError: {
    borderBottomColor: '#F44336',
  },
  formTextInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 40,
  },
});