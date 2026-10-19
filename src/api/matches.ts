import { MATCHES_URL } from '../config';
import { MatchesApiResponse } from '../types/match';

/**
 * Загружает список матчей тура по HTTP.
 */
export async function fetchMatches(): Promise<MatchesApiResponse> {
  const response = await fetch(MATCHES_URL);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных (${response.status})`);
  }
  return response.json();
}
