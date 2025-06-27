
import { FinanceChallengeG5, FinanceItem } from '../../types';

const items: { [key: string]: FinanceItem } = {
  jugo: { name: 'Jugo', price: 850, icon: '🧃' },
  galletas: { name: 'Galletas', price: 600, icon: '🍪' },
  libro: { name: 'Libro', price: 2500, icon: '📚' },
  lapices: { name: 'Lápices', price: 700, icon: '✏️' },
  pizza: { name: 'Porción de Pizza', price: 900, icon: '🍕' },
  helado: { name: 'Helado', price: 1200, icon: '🍦' },
  chocolate: { name: 'Chocolate', price: 550, icon: '🍫'},
  cuaderno: { name: 'Cuaderno', price: 1100, icon: '📓'},
};

export const fifthGradeFinanceAdvancedScenarios: FinanceChallengeG5[] = [
  {
    id: 'g5_fin_adv_1',
    initialMoney: 5000,
    shoppingList: [
      { item: items.jugo, quantity: 2 },
      { item: items.galletas, quantity: 1 },
    ],
  },
  {
    id: 'g5_fin_adv_2',
    initialMoney: 10000,
    shoppingList: [
      { item: items.libro, quantity: 1 },
      { item: items.lapices, quantity: 3 },
    ],
  },
  {
    id: 'g5_fin_adv_3',
    initialMoney: 8000,
    shoppingList: [
      { item: items.pizza, quantity: 2 },
      { item: items.helado, quantity: 2 },
      { item: items.jugo, quantity: 1 },
    ],
  },
  {
    id: 'g5_fin_adv_4',
    initialMoney: 7500,
    shoppingList: [
      { item: items.cuaderno, quantity: 2 },
      { item: items.lapices, quantity: 2 },
      { item: items.chocolate, quantity: 4 },
    ],
  },
  {
    id: 'g5_fin_adv_5',
    initialMoney: 4000,
    shoppingList: [
      { item: items.helado, quantity: 1 },
      { item: items.pizza, quantity: 2 },
    ],
  },
];
