import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MyColors } from '../theme/AppTheme';

interface Props {
  text: string;
  onPress: () => void;
}

export const RoundedButton = ({ text, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.roundedButton}
      onPress={() => onPress()}
    >
      <Text style={styles.textButton}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  roundedButton: {
    width: '100%',
    height: 40,
    backgroundColor: MyColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  }
});