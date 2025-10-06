import { Table, TableBody, TableCell, TableRow } from '@/shared/ui/table';
import { UserTableRow } from '../ui/user-table-row';
import { memo, useState } from 'react';
import { useQueryParams } from '@/shared/hooks/use-query-params';
import { useGetUsers } from '../model/api/use-get-users';
import { useDeleteUser } from '../model/api/use-delete-user';
import { toast } from 'sonner';
import { useUpdateUser } from '../model/api/use-update-user';
import { UserTablePagination } from '../ui/user-table-pagination';
import { UserTableSkeleton } from '../ui/user-table-skeleton';
import { UserTableAlert } from '../ui/user-table-alert';
import { CreateFormUser } from '../ui/create-form-user';
import type { UserType } from '@/features/user-table/model/types/userType.ts';
import { UserTableHeader } from '@/features/user-table/ui/user-table-header.tsx';

export const UserTable = memo(() => {
    const query = useQueryParams();
    const currentPage = Number(query.get('page') ?? 1);
    const [open, setOpen] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserType | null>(null);

    const { data, isLoading, error } = useGetUsers({ page: currentPage });

    const deleteUserMutation = useDeleteUser({
        mutationConfig: {
            onSuccess: () => {
                toast.success(
                    `The user ${userData?.owner} has been successfully deleted.`,
                );
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        },
    });

    const updateUserMutation = useUpdateUser({
        mutationConfig: {
            onSuccess: () => {
                toast.success('User successfully updated!');
            },
            onError: (error) => {
                toast.error(error.message);
            },
        },
    });

    const getUserData = (user: UserType) => {
        setOpen(true);
        setUserData(user);
    };

    if (isLoading) return <UserTableSkeleton />;

    if (error) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <>
            <CreateFormUser />

            <div className="w-full overflow-x-auto">
                <Table
                    data-cy="user-table"
                    className="table-fixed min-w-[700px] w-full"
                >
                    <UserTableHeader />
                    <TableBody>
                        {!data || !data.logs.length ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    className="text-center text-muted-foreground py-4"
                                >
                                    No data
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.logs.map((user: UserType) => (
                                <UserTableRow
                                    key={user.id}
                                    data={user}
                                    getUserData={getUserData}
                                    updateUserMutation={updateUserMutation}
                                    isPending={updateUserMutation.isPending}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <UserTablePagination
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
            />

            <UserTableAlert
                open={open}
                setOpen={setOpen}
                removeUser={() =>
                    deleteUserMutation.mutate({ id: userData!.id })
                }
                isPending={deleteUserMutation.isPending}
            />
        </>
    );
});
