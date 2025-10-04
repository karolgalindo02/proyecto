import { useState } from "react";

interface RegisterValues {
  name: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterViewModel = () => {
  const [values, setValues] = useState<RegisterValues>({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const onChange = (property: string, value: any) => {
    setValues({ ...values, [property]: value });
  };

  const register = () => {
    if (!values.name || !values.email || !values.password) {
      console.log("Todos los campos obligatorios deben estar llenos");
      return;
    }
    if (values.password !== values.confirmPassword) {
      console.log("Las contraseñas no coinciden");
      return;
    }
    console.log("Datos listos para enviar:", JSON.stringify(values));
  };

  return {
    ...values,
    onChange,
    register
  };
};

export default RegisterViewModel;
