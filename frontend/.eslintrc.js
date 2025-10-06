module.exports = {
  root: true,
  env: {
    'react-native/react-native': true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Reglas de seguridad
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-eval': 'error',
    
    // Reglas de React
    'react/prop-types': 'off', // Usamos TypeScript
    'react/react-in-jsx-scope': 'off', // No necesario en React 17+
    
    // Reglas de React Native
    'react-native/no-inline-styles': 'warn',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'warn',
    
    // Reglas de TypeScript
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    
    // Calidad de código
    'complexity': ['warn', 10],
    'max-depth': ['warn', 4],
    'max-lines': ['warn', 300],
  },
};