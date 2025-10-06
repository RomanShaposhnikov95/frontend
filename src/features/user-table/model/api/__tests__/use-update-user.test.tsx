import { TanstackWrapper } from '@/shared/lib/tests/tanstack-wrapper.tsx';
import { useUpdateUser } from '../use-update-user';
import { act, renderHook, waitFor } from '@testing-library/react';
import { api } from '@/shared/api/api';

jest.mock('@/shared/api/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useUpdateUser', () => {
    const user = {
        id: 1,
        owner: 'John Doe',
        text: 'Hello world',
        createdAt: '2025-10-06T00:00:00.000Z',
        updatedAt: '2025-10-06T00:00:00.000Z',
    };

    test('should successfully update user data', async () => {
        mockedApi.put.mockResolvedValueOnce({
            data: { ...user, text: 'Updated text' },
        });

        const { result } = renderHook(() => useUpdateUser(), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({ id: 1, data: { text: 'Updated text' } });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockedApi.put).toHaveBeenCalledWith('/logs/1', {
            text: 'Updated text',
        });
        expect(result.current.data?.text).toBe('Updated text');
    });

    test('should handle error when update fails', async () => {
        mockedApi.put.mockRejectedValueOnce(new Error('Failed to update user'));

        const { result } = renderHook(() => useUpdateUser(), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({ id: 1, data: { text: 'Fail' } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('Failed to update user');
    });
});
