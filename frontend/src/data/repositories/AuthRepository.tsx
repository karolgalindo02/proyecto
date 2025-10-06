import { User } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class AuthRepositoryImpl implements AuthRepository {
  async register(user: User): Promise<ResponseApiDelivery> {
    try {
      console.log("📤 Enviando registro:", user);
      const response = await ApiDelivery.post<ResponseApiDelivery>(
        "/api/users/create",
        user
      );
      console.log("✅ Registro exitoso");
      return response.data;
    } catch (error: any) {
      console.log("❌ Error en registro:", error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || "Error al registrar usuario"
      };
    }
  }

  async login(email: string, password: string): Promise<ResponseApiDelivery> {
    try {
      console.log("📤 Enviando login:", { email });
      const response = await ApiDelivery.post<ResponseApiDelivery>(
        "/api/users/login",
        { email, password }
      );
      console.log("✅ Login exitoso");
      return response.data;
    } catch (error: any) {
      console.log("❌ Error en login:", error.response?.data || error.message);
      
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión"
      };
    }
  }
}