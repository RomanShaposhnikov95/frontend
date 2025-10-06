import { memo, useState } from 'react';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/form.tsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/shared/ui/input.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { toast } from 'sonner';
import { formSchema } from '@/features/user-table/model/schema.ts';
import { useCreateUser } from '@/features/user-table/model/api/use-create-user.tsx';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog.tsx';
import { UserRoundPlus } from 'lucide-react';
import { Spinner } from '@/shared/ui/spinner.tsx';

export const CreateFormUser = memo(() => {
    const [open, setOpen] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            owner: '',
            text: '',
        },
    });

    const createUserMutation = useCreateUser({
        mutationConfig: {
            onSuccess: () => {
                toast.success('User successfully created');
                form.reset();
                setOpen(false);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        createUserMutation.mutate({ data: values });
    }

    const openModal = () => {
        setOpen(true);
    };

    return (
        <>
            <div className="flex justify-end p-2">
                <Button
                    onClick={openModal}
                    size="icon"
                >
                    <UserRoundPlus />
                </Button>
            </div>
            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Owner</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="owner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Owner</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="owner"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="text"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Log Text</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="log text"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={createUserMutation.isPending}
                                type="submit"
                            >
                                {createUserMutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
});
