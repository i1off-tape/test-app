import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Match } from '../types/match';
import { formatMatchDate, getMatchStatusInfo, hasScore } from '../utils/matchUtils';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

type TeamRowProps = {
  name: string;
  city: string;
  score?: number;
  showScore: boolean;
  textColor: string;
  secondaryColor: string;
};

function TeamRow({
  name,
  city,
  score,
  showScore,
  textColor,
  secondaryColor,
}: TeamRowProps) {
  return (
    <View style={styles.teamRow}>
      <View style={styles.teamInfo}>
        <Text style={[styles.teamName, { color: textColor }]}>{name}</Text>
        <Text style={[styles.city, { color: secondaryColor }]}>{city}</Text>
      </View>
      {showScore ? (
        <Text style={[styles.teamScore, { color: textColor }]}>{score}</Text>
      ) : null}
    </View>
  );
}

export function MatchCard({ match, isFavorite, onToggleFavorite }: Props) {
  const { colors } = useTheme();
  const statusInfo = getMatchStatusInfo(match);
  const formattedDate = formatMatchDate(match.startsAt);
  const scoreVisible = hasScore(match.score);

  const badgeBg = colors.badgeBackground[statusInfo.type];
  const badgeTextColor = colors.badgeText[statusInfo.type];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          {formattedDate}
        </Text>
        <View style={styles.headerRight}>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <Text style={[styles.badgeText, { color: badgeTextColor }]}>
              {statusInfo.label}
            </Text>
          </View>
          <FavoriteButton active={isFavorite} onPress={onToggleFavorite} />
        </View>
      </View>

      <View style={styles.teamsContainer}>
        <TeamRow
          name={match.home.name}
          city={match.home.city}
          score={match.score?.home}
          showScore={scoreVisible}
          textColor={colors.textPrimary}
          secondaryColor={colors.textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <TeamRow
          name={match.away.name}
          city={match.away.city}
          score={match.score?.away}
          showScore={scoreVisible}
          textColor={colors.textPrimary}
          secondaryColor={colors.textSecondary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  city: {
    fontSize: 12,
    marginTop: 1,
  },
  teamScore: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
    minWidth: 20,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
