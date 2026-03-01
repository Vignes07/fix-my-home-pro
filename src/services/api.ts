import axios from 'axios';
import { supabase } from './supabase';

// The base URL defaults to the deployed backend link if in production, or localhost:5000 locally
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Supabase Auth token to requests automatically
api.interceptors.request.use(async (config) => {
    // Automatically fetch the current session token
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});
