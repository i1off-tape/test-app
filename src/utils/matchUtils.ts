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

    // Форматирование с использованием локали устройства и часового пояса устройства
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
 * Форматирует счёт матча.
 * Корректно обрабатывает счёт 0:0 (0 является falsy в JavaScript).
 */
export function formatMatchScore(score: MatchScore): string | null {
  if (!score || typeof score.home !== 'number' || typeof score.away !== 'number') {
    return null;
  }
  return `${score.home} : ${score.away}`;
}

/**
 * Возвращает понятный статус матча на русском языке и тип для стилизации бейджа.
 */
export function getMatchStatusInfo(match: Match): {
  label: string;
  type: 'finished' | 'scheduled' | 'live' | 'postponed' | 'other';
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
    default:
      return { label: match.status || 'Неизвестно', type: 'other' };
  }
}

/**
 * Фильтрация матчей по категориям:
 * - 'all': все матчи
 * - 'upcoming': матчи, которые ещё не завершились (scheduled, live, postponed)
 * - 'finished': завершённые матчи (finished)
 */
export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  switch (filter) {
    case 'upcoming':
      return matches.filter(
        (m) => m.status === 'scheduled' || m.status === 'live' || m.status === 'postponed'
      );
    case 'finished':
      return matches.filter((m) => m.status === 'finished');
    case 'all':
    default:
      return matches;
  }
}
