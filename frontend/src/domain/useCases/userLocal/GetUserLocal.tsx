import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetUserLocal = async () => {
  try {
    const userString = await AsyncStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};
