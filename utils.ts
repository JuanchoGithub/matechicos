// utils.ts

/**
 * Generates a random proper fraction (numerator < denominator).
 * Denominator will be between 2 and maxDenominator (inclusive).
 * Numerator will be between 1 and denominator - 1 (inclusive).
 * @param maxDenominator The maximum value for the denominator.
 * @returns An object with numerator and denominator.
 */
export const generateProperFraction = (maxDenominator: number): { numerator: number, denominator: number } => {
  if (maxDenominator < 2) {
    // Fallback for invalid maxDenominator, though exercise data should prevent this.
    return { numerator: 1, denominator: 2 };
  }
  // Ensure denominator is at least 2.
  const denominator = Math.floor(Math.random() * (maxDenominator - 2 + 1)) + 2;
  // Ensure numerator is at least 1 and less than denominator.
  const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
  return { numerator, denominator };
};

/**
 * Generates a random integer between min (inclusive) and max (inclusive).
 * @param min The minimum value.
 * @param max The maximum value.
 * @returns A random integer.
 */
export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Shuffles an array in place and returns it.
 * Uses the Fisher-Yates (Knuth) shuffle algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
