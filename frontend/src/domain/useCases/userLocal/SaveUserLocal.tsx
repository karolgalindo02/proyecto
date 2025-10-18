import AsyncStorage from '@react-native-async-storage/async-storage';

export const SaveUserLocal = async (user: any) => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error guardando usuario:', error);
    return false;
  }
};
