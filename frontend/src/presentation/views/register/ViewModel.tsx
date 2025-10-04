import { useState } from 'react';
import { ApiDelivery } from '../../../data/sources/remote/api/ApiDelivery';

const RegisterViewModel = () => {
    const [values, setValues] = useState({
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
    const register = async () => {
      try {
        const response = await ApiDelivery.post('/users/create', values);
        console.log('RESPONSE: ' + JSON.stringify(response));
      } catch (error) {
        console.log('Error: ' + error);
      }
    };
    return {
      ...values,
      onChange,
      register
    };
}

export default RegisterViewModel;