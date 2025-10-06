export class Validators {
  // Validar nombre (alfabético, máximo 15 caracteres)
  static validateName(name: string): { isValid: boolean; message: string } {
    if (!name.trim()) {
      return { isValid: false, message: 'El nombre es requerido' };
    }
    if (name.length > 15) {
      return { isValid: false, message: 'Máximo 15 caracteres' };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
      return { isValid: false, message: 'Solo se permiten letras' };
    }
    return { isValid: true, message: '' };
  }

  // Validar apellido (alfabético, máximo 15 caracteres)
  static validateLastname(lastname: string): { isValid: boolean; message: string } {
    if (!lastname.trim()) {
      return { isValid: false, message: 'El apellido es requerido' };
    }
    if (lastname.length > 15) {
      return { isValid: false, message: 'Máximo 15 caracteres' };
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastname)) {
      return { isValid: false, message: 'Solo se permiten letras' };
    }
    return { isValid: true, message: '' };
  }

  // Validar email (formato email, máximo 15 caracteres antes del @)
  static validateEmail(email: string): { isValid: boolean; message: string } {
    if (!email.trim()) {
      return { isValid: false, message: 'El email es requerido' };
    }
    
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
      return { isValid: false, message: 'Formato de email inválido' };
    }
    
    const localPart = emailParts[0];
    const domainPart = emailParts[1];
    
    if (localPart.length > 15) {
      return { isValid: false, message: 'Máximo 15 caracteres antes del @' };
    }
    
    if (!/^[a-zA-Z0-9._-]+$/.test(localPart)) {
      return { isValid: false, message: 'Caracteres inválidos en el email' };
    }
    
    if (!domainPart.includes('.') || domainPart.split('.')[1].length < 2) {
      return { isValid: false, message: 'Dominio de email inválido' };
    }
    
    return { isValid: true, message: '' };
  }

  // Validar teléfono (exactamente 10 dígitos)
  static validatePhone(phone: string): { isValid: boolean; message: string } {
    if (!phone.trim()) {
      return { isValid: false, message: 'El teléfono es requerido' };
    }
    if (!/^\d+$/.test(phone)) {
      return { isValid: false, message: 'Solo se permiten números' };
    }
    if (phone.length !== 10) {
      return { isValid: false, message: 'Debe tener exactamente 10 dígitos' };
    }
    return { isValid: true, message: '' };
  }

  // Validar contraseña (mínimo 6 caracteres)
  static validatePassword(password: string): { isValid: boolean; message: string } {
    if (!password) {
      return { isValid: false, message: 'La contraseña es requerida' };
    }
    if (password.length < 6) {
      return { isValid: false, message: 'Mínimo 6 caracteres' };
    }
    return { isValid: true, message: '' };
  }

  // Validar confirmación de contraseña
  static validateConfirmPassword(password: string, confirmPassword: string): { isValid: boolean; message: string } {
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Las contraseñas no coinciden' };
    }
    return { isValid: true, message: '' };
  }
}