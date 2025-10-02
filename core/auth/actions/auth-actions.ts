import { productsApi } from "../api/productsApi";
import { User } from "../interface/user";

export interface AuthResponse {
    id:       string;
    email:    string;
    fullName: string;
    isActive: boolean;
    roles:    string[];
    token:    string;
}


const returnUserToken = (data: AuthResponse): {
    user: User,
    token: string
} => {
    const {id, email, fullName, isActive, roles, token} = data;

    const user: User = {
        id, email, fullName, isActive, roles
    }

    return {
        user,
        token
    }
}


export const authLogin = async(email: string, password: string) => {
    email = email.toLowerCase();
    try {
        const { data } = await productsApi.post<AuthResponse>('/auth/login', {
            email, password
        });

        return returnUserToken(data);
    } catch (error) {
        console.log(error);
        // throw new Error('User and/or password not valid');
        return null;
    }
}

export const authCheckStatus = async () => {
    try {
        const { data } = await productsApi.get<AuthResponse>('/auth/check-status');
        return returnUserToken(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const authRegister = async(email: string, password: string, fullName: string) => {
    email = email.toLowerCase();
    try {
        console.log('Intentando registrar:', { email, password, fullName });
        console.log('URL base:', productsApi.defaults.baseURL);

        const { data } = await productsApi.post<AuthResponse>('/auth/register', {
            email, password, fullName
        });

        console.log('Registro exitoso, data:', data);

        return returnUserToken(data);
    } catch (error: any) {
        console.log('Error en authRegister:');
        console.log('Error message:', error.message);
        console.log('Error code:', error.code);
        if (error.response) {
            console.log('Response status:', error.response.status);
            console.log('Response data:', error.response.data);
        } else if (error.request) {
            console.log('No response received');
            console.log('Request:', error.request);
        }
        return null;
    }
}