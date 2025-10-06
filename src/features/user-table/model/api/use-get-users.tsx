import {
    keepPreviousData,
    queryOptions,
    useQuery,
} from '@tanstack/react-query';
import type { QueryConfig } from '@/shared/types/tanstack-query';
import { api } from '@/shared/api/api';
import type { UsersResponseDto } from '@/features/user-table/model/types/userType';

export const getUsers = async (page: number): Promise<UsersResponseDto> => {
    try {
        const res = await api.get<UsersResponseDto>('/logs', {
            params: { page, limit: 10 },
        });
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
};

export const getUsersQueryOptions = (page?: number) => {
    return queryOptions({
        queryKey: page ? ['users', { page }] : ['users'],
        queryFn: () => getUsers(page ?? 1),
        placeholderData: keepPreviousData,
    });
};

type UseGetUsersType = {
    page?: number;
    queryConfig?: QueryConfig<typeof getUsersQueryOptions>;
};

export const useGetUsers = ({ page = 1, queryConfig }: UseGetUsersType) => {
    return useQuery({
        ...getUsersQueryOptions(page),
        ...queryConfig,
    });
};
