import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/** Screens in the app and the parameters each one receives. */
export type RootStackParamList = {
  Home: undefined;
  /** No itemId = add a new dish. With itemId = edit that dish. */
  MenuItemForm: { itemId?: string } | undefined;
  Statistics: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type MenuItemFormScreenProps = NativeStackScreenProps<RootStackParamList, 'MenuItemForm'>;
export type StatisticsScreenProps = NativeStackScreenProps<RootStackParamList, 'Statistics'>;
