/**
 * Reusable delete logic, used by both the Home screen (long-press) and the
 * Edit Dish screen. Asks the chef to confirm, deletes the dish and shows a
 * snackbar with an Undo option.
 */
import { useCallback } from 'react';
import { Alert } from 'react-native';

import { useFeedback } from '../context/FeedbackContext';
import { useMenu } from '../context/MenuContext';
import type { MenuItem } from '../types/menu';

export function useDeleteMenuItem() {
  const { deleteItem, restoreItem } = useMenu();
  const { showFeedback } = useFeedback();

  return useCallback(
    (item: MenuItem, onDeleted?: () => void) => {
      Alert.alert(
        `Delete ${item.dishName}?`,
        'It will be removed from the menu.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              const removed = deleteItem(item.id);
              if (!removed) return;
              onDeleted?.();
              showFeedback(`${item.dishName} deleted`, 'info', {
                actionLabel: 'UNDO',
                onAction: () => {
                  restoreItem(removed.item, removed.index);
                  showFeedback(`${item.dishName} is back on the menu`, 'success');
                },
              });
            },
          },
        ],
        { cancelable: true },
      );
    },
    [deleteItem, restoreItem, showFeedback],
  );
}
