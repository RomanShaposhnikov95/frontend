import { getPaginationRange, ELLIPSIS } from '../pagination.ts';

describe('getPaginationRange', () => {
    it('returns full range when totalPages is small', () => {
        expect(getPaginationRange(1, 3)).toEqual([1, 2, 3]);
        expect(getPaginationRange(2, 4)).toEqual([1, 2, 3, 4]);
    });

    it('adds ellipsis when totalPages is large and currentPage in the middle', () => {
        const totalPages = 10;
        const currentPage = 5;
        const result = getPaginationRange(currentPage, totalPages, 1);

        expect(result[0]).toBe(1);
        expect(result[result.length - 1]).toBe(totalPages);
        expect(result).toContain(ELLIPSIS);
        expect(result).toEqual([1, ELLIPSIS, 4, 5, 6, ELLIPSIS, 10]);
    });

    it('handles currentPage near start', () => {
        expect(getPaginationRange(2, 10, 1)).toEqual([1, 2, 3, ELLIPSIS, 10]);
    });

    it('handles currentPage near end', () => {
        expect(getPaginationRange(9, 10, 1)).toEqual([1, ELLIPSIS, 8, 9, 10]);
    });

    it('respects delta parameter', () => {
        expect(getPaginationRange(5, 10, 2)).toEqual([
            1,
            ELLIPSIS,
            3,
            4,
            5,
            6,
            7,
            ELLIPSIS,
            10,
        ]);
    });
});
