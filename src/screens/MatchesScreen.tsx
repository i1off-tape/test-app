import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { MATCHES_URL } from '../config';
import { Match, MatchesApiResponse, MatchFilter } from '../types/match';
import { filterMatches } from '../utils/matchUtils';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentFilter, setCurrentFilter] = useState<MatchFilter>('all');

  const loadMatches = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch(MATCHES_URL);
      if (!response.ok) {
        throw new Error(`Ошибка загрузки данных (${response.status})`);
      }
      const data: MatchesApiResponse = await response.json();
      setMatches(data.matches || []);
      setRound(data.round ?? null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось загрузить данные. Проверьте интернет-соединение.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const counts = useMemo(() => {
    return {
      all: matches.length,
      upcoming: filterMatches(matches, 'upcoming').length,
      finished: filterMatches(matches, 'finished').length,
    };
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return filterMatches(matches, currentFilter);
  }, [matches, currentFilter]);

  const renderHeader = () => (
    <View style={styles.headerArea}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Матчи тура</Text>
          {round !== null ? (
            <Text style={styles.roundSubtitle}>Тур {round}</Text>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.refreshButtonPressed,
            refreshing && styles.refreshButtonDisabled,
          ]}
          onPress={() => loadMatches(true)}
          disabled={refreshing}
          accessibilityRole="button"
          accessibilityLabel="Обновить данные"
        >
          <Text style={styles.refreshButtonText}>
            {refreshing ? 'Обновление...' : 'Обновить'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.statusRow}>
        {lastUpdated ? <UpdatedAgo since={lastUpdated} /> : null}
      </View>

      <FilterTabs
        currentFilter={currentFilter}
        onSelectFilter={setCurrentFilter}
        counts={counts}
      />
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return null;
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Матчей не найдено</Text>
        <Text style={styles.emptyText}>
          {currentFilter !== 'all'
            ? 'В этой категории сейчас нет матчей'
            : 'Список матчей пуст'}
        </Text>
        {currentFilter !== 'all' && (
          <Pressable
            style={styles.resetFilterButton}
            onPress={() => setCurrentFilter('all')}
          >
            <Text style={styles.resetFilterButtonText}>Показать все матчи</Text>
          </Pressable>
        )}
      </View>
    );
  };

  if (loading && matches.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={styles.loadingText}>Загрузка матчей...</Text>
      </View>
    );
  }

  if (error && matches.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Не удалось загрузить матчи</Text>
        <Text style={styles.errorDescription}>{error}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => loadMatches(false)}
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MatchCard match={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMatches(true)}
            colors={['#1d4ed8']}
            tintColor="#1d4ed8"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerArea: {
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  roundSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  refreshButtonPressed: {
    backgroundColor: '#f3f4f6',
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#4b5563',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1d4ed8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  resetFilterButton: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  resetFilterButtonText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '600',
  },
});
