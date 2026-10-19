import { Match, MatchFilter, MatchScore } from '../types/match';

/**
 * Форматирует дату и время начала матча в часовом поясе устройства.
 * Обрабатывает случай, когда startsAt равен null (например, матч перенесён).
 */
export function formatMatchDate(startsAt: string | null): string {
  if (!startsAt) {
    return 'Дата уточняется';
  }

  try {
    const date = new Date(startsAt);
    if (isNaN(date.getTime())) {
      return 'Дата уточняется';
    }

    const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    return dateFormatter.format(date);
  } catch {
    return 'Дата уточняется';
  }
}

/**
 * Проверяет наличие счёта в матче.
 * Корректно учитывает счёт 0:0.
 */
export function hasScore(score: MatchScore): boolean {
  return score !== null && typeof score.home === 'number' && typeof score.away === 'number';
}

/**
 * Возвращает понятный статус матча на русском языке и тип для стилизации бейджа.
 */
export function getMatchStatusInfo(match: Match): {
  label: string;
  type: 'finished' | 'scheduled' | 'live' | 'postponed';
} {
  switch (match.status) {
    case 'finished':
      return { label: 'Завершён', type: 'finished' };
    case 'scheduled':
      return { label: 'Запланирован', type: 'scheduled' };
    case 'live': {
      const minText = typeof match.minute === 'number' ? ` ${match.minute}'` : '';
      return { label: `Идёт матч${minText}`, type: 'live' };
    }
    case 'postponed':
      return { label: 'Перенесён', type: 'postponed' };
  }
}

/**
 * Фильтрация матчей по категориям:
 * - 'all': все матчи
 * - 'live': матчи, проходящие в данный момент (live)
 * - 'upcoming': запланированные или перенесённые несыгранные матчи (scheduled, postponed)
 * - 'finished': завершённые матчи (finished)
 */
export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  switch (filter) {
    case 'live':
      return matches.filter((m) => m.status === 'live');
    case 'upcoming':
      return matches.filter((m) => m.status === 'scheduled' || m.status === 'postponed');
    case 'finished':
      return matches.filter((m) => m.status === 'finished');
    case 'all':
    default:
      return matches;
  }
}
