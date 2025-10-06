import { renderHook, act, waitFor } from '@testing-library/react';
import { api } from '@/shared/api/api';
import { useCreateUser } from '../use-create-user.tsx';
import { TanstackWrapper } from '@/shared/lib/tests/tanstack-wrapper';

jest.mock('@/shared/api/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('useCreateUser', () => {
    const newUser = {
        id: 1,
        owner: 'Jane Doe',
        text: 'New user',
        createdAt: '2025-10-06T00:00:00.000Z',
        updatedAt: '2025-10-06T00:00:00.000Z',
    };

    test('should successfully create a user', async () => {
        mockedApi.post.mockResolvedValueOnce({ data: newUser });

        const { result } = renderHook(() => useCreateUser(), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({
                data: { owner: 'Jane Doe', text: 'New user' },
            });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockedApi.post).toHaveBeenCalledWith('/logs', {
            owner: 'Jane Doe',
            text: 'New user',
        });
        expect(result.current.data).toEqual(newUser);
    });

    test('should handle error when creation fails', async () => {
        mockedApi.post.mockRejectedValueOnce(
            new Error('Failed to create user'),
        );

        const { result } = renderHook(() => useCreateUser(), {
            wrapper: TanstackWrapper(),
        });

        await act(async () => {
            result.current.mutate({
                data: { owner: 'Jane Doe', text: 'Fail' },
            });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toBe('Failed to create user');
    });
});
