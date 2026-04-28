import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { UserRepository } from '../../../data/repositories/UserRepository';
import { formatApiError } from '../../../data/sources/remote/api/ApiDelivery';

export const useProfileViewModel = () => {
  const [user, setUser] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const refreshFromStorage = useCallback(async () => {
    const raw = await AsyncStorage.getItem('takio_user');
    setUser(raw ? JSON.parse(raw) : null);
  }, []);

  useEffect(() => { refreshFromStorage(); }, [refreshFromStorage]);

  const persistUser = async (u: any) => {
    setUser(u);
    await AsyncStorage.setItem('takio_user', JSON.stringify(u));
  };

  /** URL absoluta lista para usar en <Image source={{ uri }} /> */
  const avatarUrl = UserRepository.resolveImageUrl(user?.image);

  /**
   * Pide permisos y abre la galería o cámara según `source`.
   * Después llama al backend (POST /api/users/me/image) que guarda el archivo
   * en /uploads/avatars/ y persiste la ruta en `users.image`.
   */
  const pickAndUpload = async (source: 'library' | 'camera') => {
    try {
      let perm;
      if (source === 'camera') {
        perm = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (!perm.granted) {
        Alert.alert('Permiso denegado', 'Necesitamos acceso para cambiar tu foto.');
        return;
      }

      const opts: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      };
      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(opts)
        : await ImagePicker.launchImageLibraryAsync(opts);

      if (result.canceled || !result.assets?.[0]?.uri) return;
      const asset = result.assets[0];

      setUploading(true);
      const data = await UserRepository.uploadAvatar({
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        name: asset.fileName || `avatar_${Date.now()}.jpg`,
      });
      await persistUser(data.user);
    } catch (err) {
      Alert.alert('Error', formatApiError(err));
    } finally {
      setUploading(false);
    }
  };

  const showAvatarOptions = () => {
    Alert.alert(
      'Foto de perfil',
      '¿Cómo quieres actualizarla?',
      [
        { text: 'Tomar foto',       onPress: () => pickAndUpload('camera') },
        { text: 'Elegir de galería', onPress: () => pickAndUpload('library') },
        ...(user?.image ? [{
          text: 'Quitar foto', style: 'destructive' as const,
          onPress: async () => {
            try {
              await UserRepository.removeAvatar();
              await persistUser({ ...user, image: null });
            } catch (err) { Alert.alert('Error', formatApiError(err)); }
          },
        }] : []),
        { text: 'Cancelar', style: 'cancel' as const },
      ]
    );
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['takio_token', 'takio_user']);
    setUser(null);
  };

  return { user, avatarUrl, uploading, refreshFromStorage, showAvatarOptions, logout };
};