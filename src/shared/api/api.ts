import axios from 'axios';
import { CONFIG } from '@/shared/const/config.ts';

export const api = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
