import { TableCell, TableRow } from '@/shared/ui/table.tsx';
import { Button } from '@/shared/ui/button';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { memo, useState } from 'react';
import { Input } from '@/shared/ui/input';
import { formatDate } from '@/shared/lib/format.ts';
import { z } from 'zod';
import { formSchema } from '@/features/user-table/model/schema.ts';
import { useController, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Spinner } from '@/shared/ui/spinner.tsx';
import type { UserType } from '@/features/user-table/model/types/userType.ts';
import type { useUpdateUser } from '../model/api/use-update-user.tsx';

type PropsType = {
    data: UserType;
    getUserData: (userData: UserType) => void;
    updateUserMutation: ReturnType<typeof useUpdateUser>;
    isPending: boolean;
};

export const UserTableRow = memo((props: PropsType) => {
    const { data, getUserData, updateUserMutation } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            owner: data?.owner ?? '',
            text: data?.text ?? '',
        },
    });

    const enableEditMode = () => setEditMode(true);

    const handleUpdate = (id: number, values: z.infer<typeof formSchema>) => {
        setUpdatingId(id);
        updateUserMutation.mutate(
            { id: data.id, data: values },
            {
                onSuccess: () => setEditMode(false),
            },
        );
    };

    const ownerField = useController({ name: 'owner', control }).field;
    const textField = useController({ name: 'text', control }).field;

    return (
        <TableRow>
            <TableCell className="truncate w-64">
                {editMode ? <Input {...ownerField} /> : data.owner}
            </TableCell>
            <TableCell className="truncate w-64">
                {editMode ? <Input {...textField} /> : data.text}
            </TableCell>
            <TableCell>{formatDate(data.createdAt)}</TableCell>
            <TableCell>{formatDate(data.updatedAt)}</TableCell>
            <TableCell>
                <div className="flex gap-2 justify-end">
                    {editMode && (
                        <Button
                            onClick={handleSubmit((values) =>
                                handleUpdate(data.id, values),
                            )}
                            size="icon"
                            variant="success"
                        >
                            {updateUserMutation.isPending &&
                            updatingId === data.id ? (
                                <Spinner />
                            ) : (
                                <Check />
                            )}
                        </Button>
                    )}
                    {!editMode && (
                        <Button
                            type="button"
                            onClick={enableEditMode}
                            size="icon"
                            variant="outline"
                        >
                            <Pencil />
                        </Button>
                    )}
                    <Button
                        type="button"
                        onClick={() => getUserData(data)}
                        size="icon"
                        variant="destructive"
                    >
                        <Trash2 />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
});
