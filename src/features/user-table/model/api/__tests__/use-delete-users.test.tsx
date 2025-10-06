import { act, renderHook, waitFor } from '@testing-library/react';
import { api } from '@/shared/api/api';
import { TanstackWrapper } from '@/shared/lib/tests/tanstack-wrapper.tsx';
import { useDeleteUser } from '@/features/user-table/model/api/use-delete-user.tsx';

jest.mock('@/shared/api/api');
const mockedApi = api as jest.Mocked<typeof api>;

jest.mock('@/shared/api/api', () => ({
    api: {
        delete: jest.fn((url) => {
            const id = Number(url.split('/').pop());
            logsData.logs = logsData.logs.filter((log) => log.id !== id);
            logsData.totalLogs = logsData.logs.length;
            return Promise.resolve({});
        }),
        get: jest.fn(() => Promise.resolve(logsData)),
    },
}));

const logsData = {
    page: 1,
    totalPages: 1,
    totalLogs: 5,
    logs: [
        {
            id: 1,
            owner: 'Jone Bown',
            text: 'first log',
            createdAt: '2025-10-06T00:00:00.000Z',
            updatedAt: '2025-10-06T00:00:00.000Z',
        },
        {
            id: 2,
            owner: 'Jason Derulo',
            text: 'second log',
            createdAt: '2025-10-06T00:00:00.000Z',
            updatedAt: '2025-10-06T00:00:00.000Z',
        },
    ],
};

describe('useDeleteUser', () => {
    test('should successfully delete a user', async () => {
        const { result } = renderHook(() => useDeleteUser({}), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({ id: 1 });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockedApi.delete).toHaveBeenCalledWith('/logs/1');
        expect(result.current.data).toBe(true);

        expect(logsData.logs.length).toBe(1);
        expect(logsData.logs.find((log) => log.id === 1)).toBeUndefined();
        expect(logsData.totalLogs).toBe(1);
    });

    test('should handle error when deletion fails', async () => {
        mockedApi.delete.mockRejectedValueOnce(
            new Error('Failed to delete user'),
        );

        const { result } = renderHook(() => useDeleteUser({}), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({ id: 1 });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('Failed to delete user');
    });
});
