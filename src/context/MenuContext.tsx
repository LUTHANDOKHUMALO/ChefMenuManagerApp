/**
 * MenuContext holds the list of menu items for the whole app.
 *
 * Every screen reads from and writes to this one shared state, so any
 * add / edit / delete is reflected immediately on the Home screen, the
 * search results and the Statistics screen.
 *
 * Items are also saved to the device with AsyncStorage so the menu is still
 * there the next time the chef opens the app.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { SAMPLE_MENU } from '../constants/sampleMenu';
import type { MenuItem } from '../types/menu';
import { createId } from '../utils/formatters';

const STORAGE_KEY = '@chefs_menu_manager/menu_items';

type MenuState = {
  items: MenuItem[];
  isLoading: boolean;
};

type MenuAction =
  | { type: 'LOADED'; items: MenuItem[] }
  | { type: 'ADD'; item: MenuItem }
  | { type: 'UPDATE'; item: MenuItem }
  | { type: 'DELETE'; id: string }
  | { type: 'RESTORE'; item: MenuItem; index: number }
  | { type: 'ADD_MANY'; items: MenuItem[] };

function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case 'LOADED':
      return { items: action.items, isLoading: false };
    case 'ADD':
      return { ...state, items: [...state.items, action.item] };
    case 'ADD_MANY':
      return { ...state, items: [...state.items, ...action.items] };
    case 'UPDATE':
      return {
        ...state,
        items: state.items.map((item) => (item.id === action.item.id ? action.item : item)),
      };
    case 'DELETE':
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case 'RESTORE': {
      const items = [...state.items];
      items.splice(Math.min(action.index, items.length), 0, action.item);
      return { ...state, items };
    }
    default:
      return state;
  }
}

type MenuContextValue = {
  items: MenuItem[];
  isLoading: boolean;
  addItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => { item: MenuItem; index: number } | null;
  restoreItem: (item: MenuItem, index: number) => void;
  loadSampleMenu: () => void;
  getItemById: (id: string) => MenuItem | undefined;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(menuReducer, { items: [], isLoading: true });

  // Load saved items once when the app starts.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        const saved: MenuItem[] = json ? JSON.parse(json) : [];
        dispatch({ type: 'LOADED', items: Array.isArray(saved) ? saved : [] });
      })
      .catch(() => dispatch({ type: 'LOADED', items: [] }));
  }, []);

  // Save items whenever they change (after the first load has finished).
  useEffect(() => {
    if (state.isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)).catch(() => {
      // Saving failed (very rare). The app keeps working from memory.
    });
  }, [state.items, state.isLoading]);

  const addItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: createId() };
    dispatch({ type: 'ADD', item: newItem });
    return newItem;
  }, []);

  const updateItem = useCallback((item: MenuItem) => {
    dispatch({ type: 'UPDATE', item });
  }, []);

  const deleteItem = useCallback(
    (id: string) => {
      const index = state.items.findIndex((item) => item.id === id);
      if (index === -1) return null;
      const item = state.items[index];
      dispatch({ type: 'DELETE', id });
      // Returned so the screen can offer an "Undo" option.
      return { item, index };
    },
    [state.items],
  );

  const restoreItem = useCallback((item: MenuItem, index: number) => {
    dispatch({ type: 'RESTORE', item, index });
  }, []);

  const loadSampleMenu = useCallback(() => {
    dispatch({
      type: 'ADD_MANY',
      items: SAMPLE_MENU.map((item) => ({ ...item, id: createId() })),
    });
  }, []);

  const getItemById = useCallback(
    (id: string) => state.items.find((item) => item.id === id),
    [state.items],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      isLoading: state.isLoading,
      addItem,
      updateItem,
      deleteItem,
      restoreItem,
      loadSampleMenu,
      getItemById,
    }),
    [state, addItem, updateItem, deleteItem, restoreItem, loadSampleMenu, getItemById],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

/** Hook used by screens to read and change the menu. */
export function useMenu(): MenuContextValue {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used inside a MenuProvider');
  }
  return context;
}
