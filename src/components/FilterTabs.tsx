import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { MatchFilter } from '../types/match';

type Props = {
  currentFilter: MatchFilter;
  onSelectFilter: (filter: MatchFilter) => void;
  counts: Record<MatchFilter, number>;
};

const FILTER_ITEMS: { key: MatchFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'live', label: 'В игре' },
  { key: 'upcoming', label: 'Предстоящие' },
  { key: 'finished', label: 'Завершённые' },
];

export function FilterTabs({ currentFilter, onSelectFilter, counts }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.tabBackground }]}>
      {FILTER_ITEMS.map((item) => {
        const isActive = currentFilter === item.key;
        const count = counts[item.key];

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelectFilter(item.key)}
            style={[
              styles.tab,
              isActive && [
                styles.activeTab,
                { backgroundColor: colors.activeTabBackground },
              ],
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.textPrimary : colors.textSecondary },
                isActive && styles.activeTabText,
              ]}
              numberOfLines={1}
            >
              {item.label} {count !== undefined ? `(${count})` : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '600',
  },
});
