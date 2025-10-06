import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const TanstackWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
