import { renderHook, waitFor } from '@testing-library/react';
import { api } from '@/shared/api/api';
import { useGetUsers } from '@/features/user-table/model/api/use-get-users';
import { TanstackWrapper } from '@/shared/lib/tests/tanstack-wrapper.tsx';

jest.mock('@/shared/api/api');
const mockedApi = api as jest.Mocked<typeof api>;

test('should successfully return user data', async () => {
    mockedApi.get.mockResolvedValueOnce({
        data: {
            page: 1,
            totalPages: 5,
            totalLogs: 50,
            logs: [
                {
                    id: 1,
                    owner: 'John Doe',
                    text: 'Hello world',
                    createdAt: '2025-10-06T00:00:00.000Z',
                    updatedAt: '2025-10-06T00:00:00.000Z',
                },
            ],
        },
    });

    const { result } = renderHook(() => useGetUsers({ page: 1 }), {
        wrapper: TanstackWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.page).toBe(1);
    expect(result.current.data?.logs[0].owner).toBe('John Doe');
    expect(result.current.data?.totalLogs).toBe(50);
});
