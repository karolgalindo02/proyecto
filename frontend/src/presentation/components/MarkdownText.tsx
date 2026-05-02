import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface MarkdownTextProps {
  content: string;
  style?: any;
}

export const MarkdownText: React.FC<MarkdownTextProps> = ({ content, style }) => {
 
  const parts = content.split(/(\*\*.*?\*\*)/g);

  return (
    <Text style={[styles.baseText, style]}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const cleanText = part.slice(2, -2);
          return (
            <Text key={index} style={styles.boldText}>
              {cleanText}
            </Text>
          );
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'LexendDeca',
    fontSize: 14,
  },
  boldText: {
    fontFamily: 'LexendDeca-SemiBold',
    fontWeight: '700',
  },
});