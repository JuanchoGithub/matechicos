// Data for Operar Fracciones Heterogéneas G5
// This file provides challenges for the exercise
import { OperarFraccionesHeterogeneasChallenge } from '../types';

export const operarFraccionesHeterogeneasG5Data: OperarFraccionesHeterogeneasChallenge[] = [
  {
    fractionA: { numerator: 1, denominator: 2 },
    fractionB: { numerator: 1, denominator: 3 },
    operation: '+',
    correctResult: { numerator: 5, denominator: 6 },
  },
  {
    fractionA: { numerator: 3, denominator: 4 },
    fractionB: { numerator: 1, denominator: 6 },
    operation: '-',
    correctResult: { numerator: 7, denominator: 12 },
  },
  {
    fractionA: { numerator: 2, denominator: 5 },
    fractionB: { numerator: 1, denominator: 4 },
    operation: '+',
    correctResult: { numerator: 13, denominator: 20 },
  },
  {
    fractionA: { numerator: 5, denominator: 6 },
    fractionB: { numerator: 1, denominator: 3 },
    operation: '-',
    correctResult: { numerator: 1, denominator: 2 },
  },
  {
    fractionA: { numerator: 3, denominator: 8 },
    fractionB: { numerator: 1, denominator: 2 },
    operation: '+',
    correctResult: { numerator: 7, denominator: 8 },
  },
  {
    fractionA: { numerator: 7, denominator: 10 },
    fractionB: { numerator: 2, denominator: 5 },
    operation: '-',
    correctResult: { numerator: 3, denominator: 10 },
  },
];
