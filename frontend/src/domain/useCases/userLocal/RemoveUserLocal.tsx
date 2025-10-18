import AsyncStorage from '@react-native-async-storage/async-storage';

export const RemoveUserLocal = async () => {
  try {
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error removiendo usuario:', error);
    return false;
  }
};
