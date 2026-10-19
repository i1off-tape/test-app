import { StyleSheet, Text, View } from 'react-native';
import { Match } from '../types/match';
import { formatMatchDate, formatMatchScore, getMatchStatusInfo } from '../utils/matchUtils';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  const statusInfo = getMatchStatusInfo(match);
  const formattedDate = formatMatchDate(match.startsAt);
  const scoreText = formatMatchScore(match.score);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={[styles.badge, styles[`badge_${statusInfo.type}`]]}>
          <Text style={[styles.badgeText, styles[`badgeText_${statusInfo.type}`]]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>

      <View style={styles.teamsContainer}>
        {/* Команда хозяев */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.home.name}</Text>
            <Text style={styles.city}>{match.home.city}</Text>
          </View>
          {scoreText !== null ? (
            <Text style={styles.teamScore}>{match.score?.home}</Text>
          ) : null}
        </View>

        {/* Разделитель */}
        <View style={styles.divider} />

        {/* Команда гостей */}
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{match.away.name}</Text>
            <Text style={styles.city}>{match.away.city}</Text>
          </View>
          {scoreText !== null ? (
            <Text style={styles.teamScore}>{match.score?.away}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  badge_finished: {
    backgroundColor: '#f3f4f6',
  },
  badge_scheduled: {
    backgroundColor: '#eff6ff',
  },
  badge_live: {
    backgroundColor: '#fef2f2',
  },
  badge_postponed: {
    backgroundColor: '#fffbeb',
  },
  badge_other: {
    backgroundColor: '#f3f4f6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  badgeText_finished: {
    color: '#4b5563',
  },
  badgeText_scheduled: {
    color: '#1d4ed8',
  },
  badgeText_live: {
    color: '#dc2626',
  },
  badgeText_postponed: {
    color: '#b45309',
  },
  badgeText_other: {
    color: '#4b5563',
  },
  teamsContainer: {
    marginTop: 4,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  teamInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  city: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 1,
  },
  teamScore: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 16,
    minWidth: 20,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 4,
  },
});
