import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './useStore';

describe('useStore spaced repetition management', () => {
  beforeEach(() => {
    // Limpiar estado antes de cada prueba
    useStore.getState().clearAllData();
  });

  it('allows adding and retrieving subjects', () => {
    const subject = useStore.getState().addSubject('Matemáticas', '#10b981');
    expect(subject.title).toBe('Matemáticas');
    expect(subject.color).toBe('#10b981');

    const subjects = useStore.getState().subjects;
    expect(subjects).toHaveLength(1);
    expect(subjects[0].id).toBe(subject.id);
  });

  it('allows adding topics to a subject with default interval and date', () => {
    const subject = useStore.getState().addSubject('Física');
    const topic = useStore.getState().addTopic({
      subjectId: subject.id,
      title: 'Termodinámica',
    });

    expect(topic.interval).toBe(1);
    expect(topic.subjectId).toBe(subject.id);
    expect(topic.nextReviewDate).toBeDefined();

    const topics = useStore.getState().topics;
    expect(topics).toHaveLength(1);
    expect(topics[0].id).toBe(topic.id);
  });

  it('deleting a subject cascades and deletes all its topics', () => {
    const sub1 = useStore.getState().addSubject('Sub 1');
    const sub2 = useStore.getState().addSubject('Sub 2');

    useStore.getState().addTopic({ subjectId: sub1.id, title: 'Topic 1' });
    useStore.getState().addTopic({ subjectId: sub1.id, title: 'Topic 2' });
    useStore.getState().addTopic({ subjectId: sub2.id, title: 'Topic 3' });

    expect(useStore.getState().topics).toHaveLength(3);

    useStore.getState().deleteSubject(sub1.id);

    expect(useStore.getState().subjects).toHaveLength(1);
    expect(useStore.getState().subjects[0].id).toBe(sub2.id);

    // Solo debe quedar Topic 3
    const remainingTopics = useStore.getState().topics;
    expect(remainingTopics).toHaveLength(1);
    expect(remainingTopics[0].title).toBe('Topic 3');
  });

  it('reviewing topic with hard resets interval to 1 and updates review date', () => {
    const sub = useStore.getState().addSubject('Historia');
    const topic = useStore.getState().addTopic({
      subjectId: sub.id,
      title: 'Revolución Industrial',
      interval: 10,
    });

    useStore.getState().reviewTopic(topic.id, 'hard');

    const updated = useStore.getState().topics.find((t) => t.id === topic.id);
    expect(updated).toBeDefined();
    expect(updated?.interval).toBe(1);

    // Debe ser una fecha futura
    const nextDate = new Date(updated!.nextReviewDate);
    expect(nextDate.getTime()).toBeGreaterThan(Date.now() - 1000);
  });

  it('reviewing topic with good multiplies interval by 1.5', () => {
    const sub = useStore.getState().addSubject('Química');
    const topic = useStore.getState().addTopic({
      subjectId: sub.id,
      title: 'Enlace Químico',
      interval: 4,
    });

    useStore.getState().reviewTopic(topic.id, 'good');

    const updated = useStore.getState().topics.find((t) => t.id === topic.id);
    expect(updated?.interval).toBe(6); // 4 * 1.5 = 6
  });

  it('reviewing topic with easy multiplies interval by 2.5', () => {
    const sub = useStore.getState().addSubject('Química');
    const topic = useStore.getState().addTopic({
      subjectId: sub.id,
      title: 'Gases Ideales',
      interval: 4,
    });

    useStore.getState().reviewTopic(topic.id, 'easy');

    const updated = useStore.getState().topics.find((t) => t.id === topic.id);
    expect(updated?.interval).toBe(10); // 4 * 2.5 = 10
  });

  it('resets reviewingTopicId when reviewTopic is executed', () => {
    const sub = useStore.getState().addSubject('Biología');
    const topic = useStore.getState().addTopic({
      subjectId: sub.id,
      title: 'Genética',
    });

    useStore.getState().setReviewingTopicId(topic.id);
    expect(useStore.getState().reviewingTopicId).toBe(topic.id);

    useStore.getState().reviewTopic(topic.id, 'good');
    expect(useStore.getState().reviewingTopicId).toBeNull();
  });
});
