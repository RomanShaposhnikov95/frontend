import { memo } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/shared/ui/pagination.tsx';
import { ELLIPSIS, getPaginationRange } from '@/shared/lib/pagination.ts';

type UserTablePaginationProps = {
    currentPage: number;
    totalPages: number;
};

export const UserTablePagination = memo(
    ({ currentPage, totalPages }: UserTablePaginationProps) => {
        const pages = getPaginationRange(currentPage, totalPages);

        return (
            <Pagination className="mt-5">
                <PaginationContent>
                    <PaginationItem>
                        {currentPage > 1 && (
                            <PaginationPrevious
                                href={`?page=${currentPage - 1}`}
                            />
                        )}
                    </PaginationItem>
                    {pages.map((page, idx) => (
                        <PaginationItem key={idx}>
                            {page === ELLIPSIS ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={`?page=${page}`}
                                    isActive={currentPage === page}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        {currentPage < totalPages && (
                            <PaginationNext
                                isActive={false}
                                href={`?page=${currentPage + 1}`}
                            />
                        )}
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        );
    },
);
