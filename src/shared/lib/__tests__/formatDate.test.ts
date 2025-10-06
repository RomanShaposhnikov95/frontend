import { formatDate } from '../format.ts';
import dayjs from 'dayjs';

describe('formatDate', () => {
    it('formats date correctly', () => {
        const date = '2025-10-06T14:30:00Z';
        const expected = dayjs(date).format('DD.MM.YYYY H:mm');

        expect(formatDate(date)).toBe(expected);
    });

    it('handles invalid date strings', () => {
        const invalidDate = 'not-a-date';
        expect(formatDate(invalidDate)).toBe('Invalid Date');
    });

    it('formats different time zones correctly', () => {
        const date = '2025-10-06T23:45:00+03:00';
        const expected = dayjs(date).format('DD.MM.YYYY H:mm');

        expect(formatDate(date)).toBe(expected);
    });
});
