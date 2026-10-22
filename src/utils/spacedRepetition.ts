import type { ReviewDifficulty, ReviewResult, Topic } from '../types';

/**
 * Calcula el nuevo intervalo y la fecha del próximo repaso según la dificultad seleccionada.
 * - 'hard': Reinicia el intervalo a 1 día.
 * - 'good': Multiplica el intervalo actual por 1.5 (mínimo 1 día).
 * - 'easy': Multiplica el intervalo actual por 2.5 (mínimo 1 día).
 *
 * @param currentInterval Intervalo actual en días
 * @param difficulty Calificación del repaso ('hard' | 'good' | 'easy')
 * @param baseDate Fecha base para calcular el próximo repaso (por defecto, fecha actual)
 */
export function calculateNextReview(
  currentInterval: number,
  difficulty: ReviewDifficulty,
  baseDate: Date = new Date()
): ReviewResult {
  let newInterval: number;

  switch (difficulty) {
    case 'hard':
      newInterval = 1;
      break;
    case 'good':
      newInterval = Math.max(1, Math.round(currentInterval * 1.5));
      break;
    case 'easy':
      newInterval = Math.max(1, Math.round(currentInterval * 2.5));
      break;
    default:
      newInterval = 1;
  }

  const nextDate = new Date(baseDate.getTime());
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    interval: newInterval,
    nextReviewDate: nextDate.toISOString(),
  };
}

/**
 * Comprueba si un tema está pendiente de repaso hoy o en fechas pasadas.
 */
export function isTopicDueToday(topic: Topic, referenceDate: Date = new Date()): boolean {
  if (!topic.nextReviewDate) return true;
  
  // Obtenemos el final del día de referencia (23:59:59.999) en la zona horaria local
  const endOfReferenceDay = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    23,
    59,
    59,
    999
  );

  const reviewDate = new Date(topic.nextReviewDate);
  return reviewDate.getTime() <= endOfReferenceDay.getTime();
}

/**
 * Formatea una fecha ISO a un formato legible en español.
 */
export function formatReviewDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Devuelve un texto descriptivo relativo a la fecha de repaso (ej: "Hoy", "Ayer", "En 3 días").
 */
export function getRelativeDueDateText(isoString: string, referenceDate: Date = new Date()): {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  const targetDate = new Date(isoString);
  if (isNaN(targetDate.getTime())) {
    return { text: 'Pendiente', isOverdue: false, isToday: false };
  }

  // Normalizamos a medianoche local para comparar días completos
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const refMidnight = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate()).getTime();

  const diffDays = Math.round((targetMidnight - refMidnight) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      text: daysAgo === 1 ? 'Ayer' : `Atrasado ${daysAgo} d`,
      isOverdue: true,
      isToday: false,
    };
  }
  if (diffDays === 0) {
    return { text: 'Hoy', isOverdue: false, isToday: true };
  }
  if (diffDays === 1) {
    return { text: 'Mañana', isOverdue: false, isToday: false };
  }
  return { text: `En ${diffDays} días`, isOverdue: false, isToday: false };
}
