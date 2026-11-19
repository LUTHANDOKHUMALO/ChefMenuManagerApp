# Chef's Menu Manager

**Name:** Luthando Khumalo

**Student number:** ST10517026

**Module:** MAST5112 -  Mobile App Scripting 


## About the app

This is a React Native app I made for the restaurant owner. At the moment the chef keeps the menu on paper, so this app lets him manage the menu on his phone instead.

Each menu item has a dish name, a description, a course (Starter, Main Course or Dessert) and a price.

## What the app can do

- Add a new dish
- View all dishes, grouped into Starters, Mains and Desserts
- Edit a dish (tap on it)
- Delete a dish (from the edit screen, or by holding down on the dish), with an Undo option
- Search for a dish by name
- Filter dishes by course
- Clear the search and filter with "Show all"
- See menu statistics on the Overview screen:
  - total number of dishes
  - average price
  - number of dishes in each course
  - cheapest and most expensive dish
- Show error messages under each field when something is wrong
- Show a message when a dish is added, updated or deleted
- Keep the menu saved after the app is closed

## What I improved since Part 2

- Made reusable components (buttons, form fields, the menu row, search bar and filter tabs) so I don't repeat code
- Moved validation, search, filter and statistics code into separate helper files
- Used React Context so all screens share the same menu data and update straight away
- Made the validation stricter
- Improved the design so it looks like a real restaurant menu, with the same colours and fonts on every screen
- Added a warning if you try to leave the form without saving

## Folder structure

```
App.tsx          starts the app
src/
  screens/       Home, Add/Edit dish, Overview
  components/    reusable parts of the UI
  context/       shared menu data and messages
  hooks/         delete with undo
  utils/         validation and helper functions
  constants/     colours, fonts, courses
  navigation/    moving between screens
  types/         TypeScript types
```

## How to run it

1. Install Node.js and Android Studio
2. Start an emulator in Android Studio (Device Manager → ▶)
3. Open a terminal in the project folder and run:

```
npm install
npx expo start
```

4. Press **a** to open the app on the emulator
