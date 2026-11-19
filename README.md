# Chef's Menu Manager

**MAST5112 – Mobile App Scripting | Portfolio of Evidence (Final)**
Luthando Khumalo – ST10517026

A React Native (Expo + TypeScript) Android app that lets Christoffel, the restaurant owner and head chef, manage his menu from his phone instead of on paper. Each menu item has a **Dish Name**, **Description**, **Course** (Starter, Main Course or Dessert) and **Price**.

---

## Features

| Requirement | How the app meets it |
|---|---|
| **Add menu items** | "+ Add New Menu Item" opens the *Add New Dish* form (Dish Name, multi-line Description, Course picker, Price in Rand). |
| **View all menu items** | The Home screen ("Chef's Menu") lists every dish in a `FlatList`, laid out like a printed menu: grouped under Starters, Mains and Desserts, with a dotted line from each dish name to its price. |
| **Edit / update menu items** | Tapping a dish opens the same form, already filled in with its details (long-pressing also offers Edit). The changes show up on every screen straight away. |
| **Delete menu items** | Use **Delete this dish** on the edit screen, or long-press a dish and choose Delete. The app asks the chef to confirm first, and an **UNDO** option appears for 5 seconds afterwards. |
| **Search** | The search box finds dishes by name, ignores upper/lower case and updates as the chef types. The ✕ button clears it. |
| **Filter by course** | The All / Starters / Mains / Desserts tabs each show how many dishes are in that course. |
| **Clear search & filter** | The "Show all" link (and the button on the "No dishes found" screen) shows all dishes again. |
| **Menu statistics** | The *Menu overview* screen (**Overview** link at the top of the Home screen) shows the total number of items, the average price, the number of items per course (with a bar, a % of the menu and the average price for that course), and the cheapest and most expensive dish. |
| **Validation & feedback** | Every field is required. Red error messages appear under the field that has a problem: name length, duplicate dish names, description length, no course selected, and price format and range. A message at the bottom of the screen confirms each add, update and delete, and a line above the Save button says how many fields still need fixing. |
| **Saved data** | The menu is saved on the device with AsyncStorage, so it is still there after the app is closed. |
| **Unsaved-changes warning** | Leaving the form with changes that have not been saved (Cancel, the back arrow or the Android back button) asks "Discard changes?" first. |

## Improvements since Part 2

- **Reusable components and hooks:** `AppButton`, `FormField`, `MenuItemRow`, `SearchBar`, `CourseFilterBar` and `EmptyState` are shared by all the screens. The `useDeleteMenuItem` hook holds the delete logic used by both the Home and Edit screens.
- **Reusable functions:** validation, formatting and the search/filter/sort/statistics logic now live in `src/utils` instead of inside the screens.
- **Shared state:** a single `MenuContext` (React Context + `useReducer`), so a change on one screen shows up on all screens immediately.
- **Better validation:** the checks are stricter (lengths, duplicate names, price format, prices entered with a comma such as `85,50`), and once the chef has pressed Save, errors update as each field is corrected.
- **Consistent look:** the design is based on a printed menu, with a warm paper background, a serif font for dish names and headings, and the calm blue from Part 1 used as the accent colour. All colours, fonts, spacing and the 48 px minimum tap size come from one theme file (`src/constants/theme.ts`).
- **Better user experience:** an empty-state screen (with an optional sample menu), a "no results" screen, a results count, Undo after delete, accessibility labels and keyboard handling.

## Project structure

```
App.tsx                      Entry point: wraps the app in the providers
src/
  navigation/                Stack navigator + screen param types
  screens/
    HomeScreen.tsx           Menu list, search, filter, edit/delete
    MenuItemFormScreen.tsx   Add New Dish / Edit Dish (shared form)
    StatisticsScreen.tsx     Menu overview (statistics)
  components/                Reusable UI components
  hooks/                     useDeleteMenuItem (shared delete + undo)
  context/
    MenuContext.tsx          Menu state (add, update, delete, restore) + saving
    FeedbackContext.tsx      Success / error / info messages (toast)
  utils/
    validation.ts            Form validation rules
    menuHelpers.ts           Search, filter, sort and statistics functions
    formatters.ts            Price formatting, plurals, ids
  constants/                 Theme, courses, limits, sample menu
  types/menu.ts              TypeScript types
```

## Running the app on the Android emulator

**Prerequisites:** Node.js (LTS) and Android Studio with an Android Virtual Device (AVD) set up.

1. Start your emulator from Android Studio (**Device Manager → ▶**).
2. In this project folder, install the packages:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npx expo start --android
   ```
   (or run `npx expo start` and press **a**). Expo installs Expo Go on the emulator and opens the app.

To make a native Android build instead (this opens in Android Studio and needs the Android SDK):
```bash
npx expo run:android
```

Type check: `npm run typecheck`

## References

Expo (2026) *Expo Documentation*. Available at: https://docs.expo.dev (Accessed: 18 November 2026).
Meta Platforms, Inc. (2026) *React Native Documentation*. Available at: https://reactnative.dev/docs/getting-started (Accessed: 18 November 2026).
React Native Community (2026) *@react-native-picker/picker*. Available at: https://github.com/react-native-picker/picker (Accessed: 18 November 2026).
React Native Community (2026) *AsyncStorage*. Available at: https://react-native-async-storage.github.io/async-storage/ (Accessed: 18 November 2026).
React Navigation (2026) *Native Stack Navigator*. Available at: https://reactnavigation.org/docs/native-stack-navigator (Accessed: 18 November 2026).
