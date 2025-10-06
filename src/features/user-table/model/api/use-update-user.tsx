import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersQueryOptions } from '@/features/user-table/model/api/use-get-users.tsx';
import type { MutationConfig } from '@/shared/types/tanstack-query.ts';
import { api } from '@/shared/api/api.ts';
import type { UserType } from '@/features/user-table/model/types/userType.ts';

type UpdateUserArgs = {
    id: number;
    data: Partial<UserType>;
};

export const updateUser = async ({ id, data }: UpdateUserArgs) => {
    try {
        const res = await api.put(`/logs/${id}`, data);
        return res.data;
    } catch (error) {
        throw new Error('Failed to update user');
    }
};

export type UseUpdateUserOptions = {
    mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = ({
    mutationConfig,
}: UseUpdateUserOptions = {}) => {
    const queryClient = useQueryClient();

    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        onSuccess: async (data, ...args) => {
            await queryClient.refetchQueries({
                queryKey: getUsersQueryOptions().queryKey,
            });
            onSuccess?.(data, ...args);
        },
        ...restConfig,
        mutationFn: updateUser,
    });
};
