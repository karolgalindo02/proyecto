import { ApiDelivery, BASE_URL } from '../sources/remote/api/ApiDelivery';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserRepository = {
  /**
   * Sube la foto de perfil. `image` debe ser un objeto { uri, type, name }
   * tal como lo devuelve expo-image-picker después de procesarlo.
   */
  async uploadAvatar(image: { uri: string; type?: string; name?: string }): Promise<{ user: any; image: string }> {
    const form = new FormData();
    // @ts-ignore RN FormData acepta { uri, type, name }
    form.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || `avatar_${Date.now()}.jpg`,
    } as any);

    const token = await AsyncStorage.getItem('takio_token');
    const res = await fetch(`${BASE_URL}/api/users/me/image`, {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        // ⚠️ No setear Content-Type manualmente; fetch añade el boundary correcto.
      },
      body: form,
    });
    const json = await res.json();
    if (!res.ok || !json?.success) {
      throw new Error(json?.message || 'Error al subir la imagen');
    }
    return json.data;
  },

  async removeAvatar(): Promise<void> {
    await ApiDelivery.delete('/users/me/image');
  },

  async updateProfile(payload: { name?: string; lastname?: string; phone?: string | null }): Promise<any> {
    const { data } = await ApiDelivery.put('/users/me', payload);
    return data.data.user;
  },

  /** Convierte la ruta /uploads/... a URL absoluta para mostrarla en <Image /> */
  resolveImageUrl(image?: string | null): string | null {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${BASE_URL}${image}`;
  },
};