import { UserTable } from '@/features/user-table';
import { Toaster } from '@/shared/ui/sonner.tsx';

export const App = () => {
    return (
        <>
            <UserTable />

            <Toaster richColors />
        </>
    );
};
