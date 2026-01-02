import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

export function useThemeColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme ?? 'light'];
}
