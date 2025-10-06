import { Table, TableBody, TableCell, TableRow } from '@/shared/ui/table';
import { Skeleton } from '@/shared/ui/skeleton.tsx';
import { memo } from 'react';
import { UserTableHeader } from '@/features/user-table/ui/user-table-header.tsx';

export const UserTableSkeleton = memo(() => {
    return (
        <Table className="table-fixed w-full">
            <UserTableHeader />
            <TableBody>
                {Array.from({ length: 10 }).map((_, idx) => (
                    <TableRow key={idx}>
                        <TableCell>
                            <Skeleton className="h-4 w-24 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-48 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-32 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-32 rounded" />
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2 justify-end">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
});
