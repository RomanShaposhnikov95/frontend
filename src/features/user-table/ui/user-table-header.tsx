import { TableHead, TableHeader, TableRow } from '@/shared/ui/table.tsx';
import { memo } from 'react';

export const UserTableHeader = memo(() => {
    return (
        <TableHeader>
            <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Log Text</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
        </TableHeader>
    );
});
