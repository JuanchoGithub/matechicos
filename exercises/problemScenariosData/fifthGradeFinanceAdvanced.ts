
import { FinanceChallengeG5, FinanceItem } from '../../types';

const items: Record<string, FinanceItem> = {
  laptop: { name: 'Laptop', price: 4500, icon: '💻' },
  smartphone: { name: 'Smartphone', price: 2000, icon: '📱' },
  tablet: { name: 'Tablet', price: 1500, icon: '📱' },
  headphones: { name: 'Audífonos', price: 500, icon: '🎧' },
  tv: { name: 'Televisor', price: 3500, icon: '📺' },
  console: { name: 'Consola', price: 2800, icon: '🎮' },
  book: { name: 'Libro', price: 150, icon: '📚' },
  ball: { name: 'Balón', price: 180, icon: '⚽' },
  watch: { name: 'Reloj', price: 700, icon: '⌚' },
  shoes: { name: 'Zapatos', price: 450, icon: '👟' },
  backpack: { name: 'Mochila', price: 380, icon: '🎒' },
  bike: { name: 'Bicicleta', price: 2200, icon: '🚲' },
  guitar: { name: 'Guitarra', price: 1800, icon: '🎸' },
  camera: { name: 'Cámara', price: 1200, icon: '📷' }
};

export const fifthGradeFinanceAdvancedScenarios: FinanceChallengeG5[] = [
  {
    id: 'finance_g5_tech_shopping',
    initialMoney: 8000,
    shoppingList: [
      { item: items.headphones, quantity: 2 },
      { item: items.tablet, quantity: 1 },
      { item: items.watch, quantity: 1 }
    ]
  },
  {
    id: 'finance_g5_school_supplies',
    initialMoney: 2000,
    shoppingList: [
      { item: items.backpack, quantity: 1 },
      { item: items.book, quantity: 4 },
      { item: items.shoes, quantity: 1 }
    ]
  },
  {
    id: 'finance_g5_gifts',
    initialMoney: 5000,
    shoppingList: [
      { item: items.console, quantity: 1 },
      { item: items.ball, quantity: 2 },
      { item: items.book, quantity: 3 }
    ]
  },
  {
    id: 'finance_g5_hobby',
    initialMoney: 4000,
    shoppingList: [
      { item: items.guitar, quantity: 1 },
      { item: items.headphones, quantity: 1 },
      { item: items.book, quantity: 2 }
    ]
  },
  {
    id: 'finance_g5_sports',
    initialMoney: 3500,
    shoppingList: [
      { item: items.shoes, quantity: 2 },
      { item: items.ball, quantity: 3 },
      { item: items.backpack, quantity: 1 }
    ]
  },
  {
    id: 'finance_g5_photography',
    initialMoney: 6000,
    shoppingList: [
      { item: items.camera, quantity: 1 },
      { item: items.book, quantity: 2 },
      { item: items.backpack, quantity: 1 }
    ]
  }
];
