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
import { fetchMatches } from '../api/matches';
import { FilterTabs } from '../components/FilterTabs';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme } from '../theme/ThemeContext';
import { Match, MatchFilter } from '../types/match';
import { filterMatches } from '../utils/matchUtils';

export function MatchesScreen() {
  const { theme, colors, toggleTheme } = useTheme();
  const { isFavorite, toggle } = useFavorites();
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
      const data = await fetchMatches();
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
    let isCancelled = false;

    fetchMatches()
      .then((data) => {
        if (!isCancelled) {
          setMatches(data.matches || []);
          setRound(data.round ?? null);
          setLastUpdated(new Date());
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить данные. Проверьте интернет-соединение.'
          );
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    return {
      all: matches.length,
      live: filterMatches(matches, 'live').length,
      upcoming: filterMatches(matches, 'upcoming').length,
      finished: filterMatches(matches, 'finished').length,
    };
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return filterMatches(matches, currentFilter);
  }, [matches, currentFilter]);

  const renderHeader = useCallback(
    () => (
      <View style={styles.headerArea}>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Матчи тура
            </Text>
            {round !== null ? (
              <Text style={[styles.roundSubtitle, { color: colors.textSecondary }]}>
                Тур {round}
              </Text>
            ) : null}
          </View>

          <View style={styles.actionsRow}>
            {/* Кнопка переключения темы */}
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.buttonBackground,
                  borderColor: colors.buttonBorder,
                },
                pressed && styles.actionButtonPressed,
              ]}
              onPress={toggleTheme}
              accessibilityRole="button"
              accessibilityLabel={
                theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'
              }
            >
              <Text style={styles.themeIcon}>{theme === 'dark' ? '☀️' : '🌙'}</Text>
            </Pressable>

            {/* Кнопка обновления */}
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.buttonBackground,
                  borderColor: colors.buttonBorder,
                },
                pressed && styles.actionButtonPressed,
                refreshing && styles.actionButtonDisabled,
              ]}
              onPress={() => loadMatches(true)}
              disabled={refreshing}
              accessibilityRole="button"
              accessibilityLabel="Обновить данные"
            >
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                {refreshing ? 'Обновление...' : 'Обновить'}
              </Text>
            </Pressable>
          </View>
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
    ),
    [
      colors,
      round,
      theme,
      toggleTheme,
      refreshing,
      loadMatches,
      lastUpdated,
      currentFilter,
      counts,
    ]
  );

  const renderEmpty = useCallback(() => {
    if (loading) {
      return null;
    }
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
          Матчей не найдено
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
  }, [loading, colors, currentFilter]);

  if (loading && matches.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Загрузка матчей...
        </Text>
      </View>
    );
  }

  if (error && matches.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={[styles.errorTitle, { color: colors.textPrimary }]}>
          Не удалось загрузить матчи
        </Text>
        <Text style={[styles.errorDescription, { color: colors.textSecondary }]}>
          {error}
        </Text>
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggle(item.id)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadMatches(true)}
            colors={['#1d4ed8']}
            tintColor={colors.textPrimary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  roundSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  themeIcon: {
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
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
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
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
