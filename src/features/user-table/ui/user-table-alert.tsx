import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/shared/ui/alert-dialog.tsx';
import { Spinner } from '@/shared/ui/spinner.tsx';

type UserTableAlertProps = {
    open: boolean;
    setOpen: (value: boolean) => void;
    removeUser: () => void;
    isPending: boolean;
};

export const UserTableAlert = ({
    open,
    setOpen,
    removeUser,
    isPending,
}: UserTableAlertProps) => {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure you want to delete this item?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The item will be
                        permanently removed from your records.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        data-cy="delete-alert-button"
                        disabled={isPending}
                        onClick={removeUser}
                    >
                        {isPending ? <Spinner /> : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
