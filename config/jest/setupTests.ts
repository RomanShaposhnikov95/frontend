import '@testing-library/jest-dom';
import 'regenerator-runtime/runtime';

jest.mock('@/shared/const/config.ts', () => {
    return {
        CONFIG: {
            API_BASE_URL: 'https://backend-yrq8.onrender.com/',
        },
    };
});
