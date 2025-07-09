// Data for Dividir Fracciones G5
// This file provides challenges for the exercise
import { DividirFraccionesChallenge } from '../types';

export const dividirFraccionesG5Data: DividirFraccionesChallenge[] = [
  {
    dividend: { numerator: 2, denominator: 3 },
    divisor: { numerator: 1, denominator: 4 },
    correctResult: { numerator: 8, denominator: 3 },
  },
  {
    dividend: 4,
    divisor: { numerator: 1, denominator: 2 },
    correctResult: { numerator: 8, denominator: 1 },
  },
  {
    dividend: { numerator: 3, denominator: 5 },
    divisor: 2,
    correctResult: { numerator: 3, denominator: 10 },
  },
  {
    dividend: { numerator: 5, denominator: 6 },
    divisor: { numerator: 2, denominator: 3 },
    correctResult: { numerator: 15, denominator: 12 },
  },
  {
    dividend: { numerator: 7, denominator: 10 },
    divisor: { numerator: 2, denominator: 5 },
    correctResult: { numerator: 35, denominator: 20 },
  },
  {
    dividend: { numerator: 3, denominator: 4 },
    divisor: 3,
    correctResult: { numerator: 1, denominator: 4 },
  },
];
