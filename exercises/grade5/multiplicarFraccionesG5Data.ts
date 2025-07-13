// Data for Multiplicar Fracciones G5
// This file provides challenges for the exercise
import { MultiplicarFraccionesChallenge } from '../types';

export const multiplicarFraccionesG5Data: MultiplicarFraccionesChallenge[] = [
  {
    factor1: { numerator: 2, denominator: 3 },
    factor2: { numerator: 4, denominator: 5 },
    correctResult: { numerator: 8, denominator: 15 },
  },
  {
    factor1: { numerator: 2, denominator: 3 },
    factor2: { numerator: 3, denominator: 4 },
    correctResult: { numerator: 1, denominator: 2 },
  },
  {
    factor1: { numerator: 5, denominator: 6 },
    factor2: 2,
    correctResult: { numerator: 5, denominator: 3 },
  },
  {
    factor1: { numerator: 3, denominator: 8 },
    factor2: { numerator: 2, denominator: 5 },
    correctResult: { numerator: 3, denominator: 20 },
  },
  {
    factor1: { numerator: 7, denominator: 10 },
    factor2: { numerator: 2, denominator: 7 },
    correctResult: { numerator: 1, denominator: 5 },
  },
  {
    factor1: { numerator: 3, denominator: 4 },
    factor2: 3,
    correctResult: { numerator: 9, denominator: 4 },
  },
];
