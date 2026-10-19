import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { MatchesScreen } from './src/screens/MatchesScreen';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

function Main() {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <MatchesScreen />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 48,
  },
});
