import { useState } from 'react';
import { Validators } from '../../../utils/validators';
import { RegisterAuthUseCase } from '../../../domain/useCases/auth/RegisterAuth';

const RegisterViewModel = () => {
    const [values, setValues] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        lastname: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'info' as 'success' | 'error' | 'warning' | 'info',
        title: '',
        message: ''
    });

    const validateField = (field: string, value: string) => {
        let error = '';
        
        switch (field) {
            case 'name':
                error = Validators.validateName(value).message;
                break;
            case 'lastname':
                error = Validators.validateLastname(value).message;
                break;
            case 'email':
                error = Validators.validateEmail(value).message;
                break;
            case 'phone':
                error = Validators.validatePhone(value).message;
                break;
            case 'password':
                error = Validators.validatePassword(value).message;
                break;
            case 'confirmPassword':
                error = Validators.validateConfirmPassword(values.password, value).message;
                break;
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return error === '';
    };

    const validateAllFields = () => {
        const newErrors = {
            name: Validators.validateName(values.name).message,
            lastname: Validators.validateLastname(values.lastname).message,
            email: Validators.validateEmail(values.email).message,
            phone: Validators.validatePhone(values.phone).message,
            password: Validators.validatePassword(values.password).message,
            confirmPassword: Validators.validateConfirmPassword(values.password, values.confirmPassword).message,
        };

        setErrors(newErrors);

        return Object.values(newErrors).every(error => error === '');
    };

    const onChange = (property: string, value: any) => {
        setValues(prev => ({ ...prev, [property]: value }));
        
        // Validación en tiempo real
        if (property === 'confirmPassword') {
            validateField(property, value);
        } else {
            validateField(property, value);
        }
    };

    const showModal = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
        setModalConfig({ type, title, message });
        setModalVisible(true);
    };

    const register = async () => {
        // Validar todos los campos antes de enviar
        if (!validateAllFields()) {
            showModal('error', 'Error de validación', 'Por favor corrige los errores en el formulario');
            return;
        }

        setLoading(true);

        try {
            console.log('📝 Intentando registrar usuario:', values);
            const response = await RegisterAuthUseCase(values);
            
            if (response.success) {
                console.log('✅ Registro exitoso:', response.data);
                
                // Mostrar modal de éxito
                showModal('success', '¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
                
                // Limpiar formulario
                setValues({
                    name: '',
                    lastname: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                
                // Limpiar errores
                setErrors({
                    name: '',
                    lastname: '',
                    phone: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                
            } else {
                showModal('error', 'Error en el registro', response.message || 'Ha ocurrido un error al registrar');
            }
        } catch (error: any) {
            console.log('💥 Error en el proceso:', error);
            showModal('error', 'Error de conexión', 'No se pudo conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return {
        ...values,
        errors,
        loading,
        modalVisible,
        modalConfig,
        onChange,
        register,
        setModalVisible,
        validateField
    };
}

export default RegisterViewModel;