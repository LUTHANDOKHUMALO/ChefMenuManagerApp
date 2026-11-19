import type { MenuItem } from '../types/menu';

/**
 * Optional sample dishes. The chef can load these from the empty Home screen
 * to try the app (and to demonstrate search, filter and statistics).
 */
export const SAMPLE_MENU: Omit<MenuItem, 'id'>[] = [
  {
    dishName: 'Butternut Soup',
    description: 'Roasted butternut soup with a swirl of cream and toasted seeds.',
    course: 'Starter',
    price: 65,
  },
  {
    dishName: 'Chicken Livers Peri-Peri',
    description: 'Pan-fried chicken livers in a creamy peri-peri sauce, served with bread.',
    course: 'Starter',
    price: 79.5,
  },
  {
    dishName: 'Durban Lamb Curry',
    description: 'Slow-cooked lamb curry with basmati rice, sambals and roti.',
    course: 'Main Course',
    price: 165,
  },
  {
    dishName: 'Grilled Line Fish',
    description: 'Catch of the day with lemon butter, chips and a side salad.',
    course: 'Main Course',
    price: 189,
  },
  {
    dishName: 'Beef Burger',
    description: '200g beef patty, cheddar, caramelised onions and hand-cut chips.',
    course: 'Main Course',
    price: 135,
  },
  {
    dishName: 'Malva Pudding',
    description: 'Warm malva pudding served with vanilla custard.',
    course: 'Dessert',
    price: 69,
  },
  {
    dishName: 'Peppermint Crisp Tart',
    description: 'Classic fridge tart with caramel, cream and Peppermint Crisp.',
    course: 'Dessert',
    price: 59,
  },
];
