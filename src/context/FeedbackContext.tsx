/**
 * FeedbackContext shows short messages in a snackbar at the bottom of the
 * screen, e.g. "Malva Pudding added" or "Dish deleted  UNDO".
 * Because it sits above the navigator, a message started on one screen
 * stays visible after navigating back.
 */
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, radius, spacing } from '../constants/theme';

export type FeedbackType = 'success' | 'error' | 'info';

type FeedbackOptions = {
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
};

type FeedbackMessage = FeedbackOptions & {
  text: string;
  type: FeedbackType;
};

type FeedbackContextValue = {
  showFeedback: (text: string, type?: FeedbackType, options?: FeedbackOptions) => void;
};

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

/** Small coloured bar on the left of the snackbar to show the type of message. */
const accentColors: Record<FeedbackType, string> = {
  success: '#7FBF8A',
  error: '#F08A80',
  info: '#9DB8D3',
};

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const animation = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const hide = useCallback(() => {
    Animated.timing(animation, { toValue: 0, duration: 180, useNativeDriver: true }).start(() =>
      setMessage(null),
    );
  }, [animation]);

  const showFeedback = useCallback(
    (text: string, type: FeedbackType = 'success', options: FeedbackOptions = {}) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage({ text, type, ...options });
      Animated.timing(animation, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      hideTimer.current = setTimeout(hide, options.durationMs ?? (options.actionLabel ? 5000 : 2500));
    },
    [animation, hide],
  );

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  const handleAction = () => {
    message?.onAction?.();
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hide();
  };

  const translateY = animation.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <FeedbackContext.Provider value={{ showFeedback }}>
      {children}
      {message && (
        <Animated.View
          style={[
            styles.snackbar,
            {
              bottom: insets.bottom + 84,
              opacity: animation,
              transform: [{ translateY }],
              borderLeftColor: accentColors[message.type],
            },
          ]}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          <Text style={styles.text}>{message.text}</Text>
          {message.actionLabel && (
            <Pressable onPress={handleAction} hitSlop={12} accessibilityRole="button">
              <Text style={styles.action}>{message.actionLabel}</Text>
            </Pressable>
          )}
        </Animated.View>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used inside a FeedbackProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.snackbar,
    borderRadius: radius.sm,
    borderLeftWidth: 4,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    flex: 1,
    color: colors.white,
    fontSize: fontSize.label,
    lineHeight: 20,
  },
  action: {
    color: '#9DB8D3',
    fontWeight: '700',
    fontSize: fontSize.label,
    marginLeft: spacing.lg,
  },
});
