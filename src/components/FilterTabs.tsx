import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchFilter } from '../types/match';

type Props = {
  currentFilter: MatchFilter;
  onSelectFilter: (filter: MatchFilter) => void;
  counts: {
    all: number;
    upcoming: number;
    finished: number;
  };
};

const FILTER_ITEMS: { key: MatchFilter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'upcoming', label: 'Предстоящие' },
  { key: 'finished', label: 'Завершённые' },
];

export function FilterTabs({ currentFilter, onSelectFilter, counts }: Props) {
  return (
    <View style={styles.container}>
      {FILTER_ITEMS.map((item) => {
        const isActive = currentFilter === item.key;
        const count = counts[item.key];

        return (
          <Pressable
            key={item.key}
            onPress={() => onSelectFilter(item.key)}
            style={[styles.tab, isActive && styles.activeTab]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
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
    backgroundColor: '#f3f4f6',
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
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
});
