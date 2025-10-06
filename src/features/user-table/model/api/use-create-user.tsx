import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersQueryOptions } from '@/features/user-table/model/api/use-get-users.tsx';
import type { MutationConfig } from '@/shared/types/tanstack-query.ts';
import { api } from '@/shared/api/api.ts';
import type { UserType } from '@/features/user-table/model/types/userType.ts';

type CreateUserArgs = {
    data: Partial<UserType>;
};

export const createUser = async ({ data }: CreateUserArgs) => {
    try {
        const res = await api.post('/logs', data);
        return res.data;
    } catch (error) {
        throw new Error('Failed to create user');
    }
};

type UseUpdateUserOptions = {
    mutationConfig?: MutationConfig<typeof createUser>;
};

export const useCreateUser = ({
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
        mutationFn: createUser,
    });
};
