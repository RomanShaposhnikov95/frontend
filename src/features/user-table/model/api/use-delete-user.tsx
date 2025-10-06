import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersQueryOptions } from '@/features/user-table/model/api/use-get-users.tsx';
import type { MutationConfig } from '@/shared/types/tanstack-query.ts';
import { api } from '@/shared/api/api.ts';

type DeleteUserArgs = {
    id: number;
};

export const deleteUser = async ({ id }: DeleteUserArgs): Promise<boolean> => {
    try {
        await api.delete(`/logs/${id}`);
        return true;
    } catch (error) {
        throw new Error('Failed to delete user');
    }
};

type UseDeleteUserOptions = {
    mutationConfig?: MutationConfig<typeof deleteUser>;
};

export const useDeleteUser = ({ mutationConfig }: UseDeleteUserOptions) => {
    const queryClient = useQueryClient();

    const { onSuccess, ...restConfig } = mutationConfig || {};

    return useMutation({
        onSuccess: async (...args) => {
            await queryClient.invalidateQueries({
                queryKey: getUsersQueryOptions().queryKey,
            });
            onSuccess?.(...args);
        },
        ...restConfig,
        mutationFn: deleteUser,
    });
};
