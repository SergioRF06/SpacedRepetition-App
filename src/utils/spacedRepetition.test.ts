import { describe, it, expect } from 'vitest';
import { calculateNextReview, isTopicDueToday, getRelativeDueDateText } from './spacedRepetition';

describe('calculateNextReview', () => {
  const baseDate = new Date('2026-10-22T10:00:00.000Z');

  it('hard resets interval to 1 day', () => {
    const result = calculateNextReview(10, 'hard', baseDate);
    expect(result.interval).toBe(1);
    
    const expectedDate = new Date(baseDate.getTime());
    expectedDate.setDate(expectedDate.getDate() + 1);
    expect(result.nextReviewDate).toBe(expectedDate.toISOString());
  });

  it('good multiplies interval by 1.5 with minimum of 1', () => {
    // 1 * 1.5 = 1.5 -> rounded to 2
    const res1 = calculateNextReview(1, 'good', baseDate);
    expect(res1.interval).toBe(2);

    // 4 * 1.5 = 6
    const res2 = calculateNextReview(4, 'good', baseDate);
    expect(res2.interval).toBe(6);

    // 0 * 1.5 = 0 -> minimum 1
    const res3 = calculateNextReview(0, 'good', baseDate);
    expect(res3.interval).toBe(1);
  });

  it('easy multiplies interval by 2.5 with minimum of 1', () => {
    // 1 * 2.5 = 2.5 -> rounded to 3
    const res1 = calculateNextReview(1, 'easy', baseDate);
    expect(res1.interval).toBe(3);

    // 2 * 2.5 = 5
    const res2 = calculateNextReview(2, 'easy', baseDate);
    expect(res2.interval).toBe(5);

    // 4 * 2.5 = 10
    const res3 = calculateNextReview(4, 'easy', baseDate);
    expect(res3.interval).toBe(10);
  });
});

describe('isTopicDueToday', () => {
  const referenceDate = new Date('2026-10-22T12:00:00.000Z');

  it('returns true when nextReviewDate is today', () => {
    const topic = {
      id: '1',
      subjectId: 's1',
      title: 'Tema 1',
      interval: 1,
      nextReviewDate: '2026-10-22T08:00:00.000Z',
    };
    expect(isTopicDueToday(topic, referenceDate)).toBe(true);
  });

  it('returns true when nextReviewDate was in the past (overdue)', () => {
    const topic = {
      id: '2',
      subjectId: 's1',
      title: 'Tema 2',
      interval: 1,
      nextReviewDate: '2026-10-20T10:00:00.000Z',
    };
    expect(isTopicDueToday(topic, referenceDate)).toBe(true);
  });

  it('returns false when nextReviewDate is tomorrow', () => {
    const tomorrow = new Date(referenceDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const topic = {
      id: '3',
      subjectId: 's1',
      title: 'Tema 3',
      interval: 2,
      nextReviewDate: tomorrow.toISOString(),
    };
    expect(isTopicDueToday(topic, referenceDate)).toBe(false);
  });
});

describe('getRelativeDueDateText', () => {
  const referenceDate = new Date('2026-10-22T12:00:00.000Z');

  it('identifies today correctly', () => {
    const result = getRelativeDueDateText('2026-10-22T15:00:00.000Z', referenceDate);
    expect(result.isToday).toBe(true);
    expect(result.text).toBe('Hoy');
  });

  it('identifies overdue dates', () => {
    const result = getRelativeDueDateText('2026-10-20T12:00:00.000Z', referenceDate);
    expect(result.isOverdue).toBe(true);
    expect(result.text).toContain('Atrasado');
  });

  it('identifies future dates', () => {
    const result = getRelativeDueDateText('2026-10-23T12:00:00.000Z', referenceDate);
    expect(result.text).toBe('Mañana');
  });
});
