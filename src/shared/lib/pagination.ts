export const ELLIPSIS = Symbol('ellipsis');

export function getPaginationRange(
    currentPage: number,
    totalPages: number,
    delta = 1,
): (number | typeof ELLIPSIS)[] {
    if (totalPages <= 5 + delta * 2) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range: (number | typeof ELLIPSIS)[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) {
        range.push(ELLIPSIS);
    }

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < totalPages - 1) {
        range.push(ELLIPSIS);
    }

    range.push(totalPages);

    return range;
}
