

import { Scenario } from '../../types'; // From exercises/problemScenarios/index.ts to root/types.ts
import { firstGradeEasyAddSubScenarios } from '../problemScenariosData/firstGradeEasyAddSub';
import { firstGradeTensSimpleTwoDigitScenarios } from '../problemScenariosData/firstGradeTensSimpleTwoDigit';
import { generalScenarios } from '../problemScenariosData/general';
import { technologyScenarios } from '../problemScenariosData/technology';
import { houseScenarios } from '../problemScenariosData/house';
import { transportScenarios } from '../problemScenariosData/transport';
import { videogameScenarios } from '../problemScenariosData/videogame';
import { foodScenarios } from '../problemScenariosData/food';
import { mixedOperationsAdvancedScenarios } from '../problemScenariosData/mixedOperationsAdvanced';
import { fifthGradeFinanceScenarios } from '../problemScenariosData/fifthGradeFinance';
import { fifthGradeFractionsDecimalsScenarios } from '../problemScenariosData/fifthGradeFractionsDecimals';
import { fifthGradeConversionsScenarios } from '../problemScenariosData/fifthGradeConversions';
import { fifthGradeFinanceAdvancedScenarios } from '../problemScenariosData/fifthGradeFinanceAdvanced';


// Helper to generate random numbers within a range for scenarios
const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export enum ScenarioSetId {
  GENERAL = 'general_problems',
  TECHNOLOGY = 'technology_problems',
  HOUSE = 'house_problems',
  TRANSPORT = 'transport_problems',
  VIDEOGAMES = 'videogame_problems',
  FOOD = 'food_problems',
  MIXED_OPERATIONS_ADVANCED = 'mixed_operations_advanced_problems',
  FIRST_GRADE_ADD_SUB_EASY = 'first_grade_add_sub_easy',
  FIRST_GRADE_ADD_SUB_LT100_SIMPLE = 'first_grade_add_sub_lt100_simple',
  FIFTH_GRADE_FINANCE = 'fifth_grade_finance',
  FIFTH_GRADE_FRAC_DEC = 'fifth_grade_frac_dec',
  FIFTH_GRADE_CONVERSIONS = 'fifth_grade_conversions',
  FIFTH_GRADE_FINANCE_ADVANCED = 'fifth_grade_finance_advanced',
}

export const scenarioCollections = {
  [ScenarioSetId.GENERAL]: generalScenarios,
  [ScenarioSetId.TECHNOLOGY]: technologyScenarios,
  [ScenarioSetId.HOUSE]: houseScenarios,
  [ScenarioSetId.TRANSPORT]: transportScenarios,
  [ScenarioSetId.VIDEOGAMES]: videogameScenarios,
  [ScenarioSetId.FOOD]: foodScenarios,
  [ScenarioSetId.MIXED_OPERATIONS_ADVANCED]: mixedOperationsAdvancedScenarios,
  [ScenarioSetId.FIRST_GRADE_ADD_SUB_EASY]: firstGradeEasyAddSubScenarios,
  [ScenarioSetId.FIRST_GRADE_ADD_SUB_LT100_SIMPLE]: firstGradeTensSimpleTwoDigitScenarios,
  [ScenarioSetId.FIFTH_GRADE_FINANCE]: fifthGradeFinanceScenarios,
  [ScenarioSetId.FIFTH_GRADE_FRAC_DEC]: fifthGradeFractionsDecimalsScenarios,
  [ScenarioSetId.FIFTH_GRADE_CONVERSIONS]: fifthGradeConversionsScenarios,
  [ScenarioSetId.FIFTH_GRADE_FINANCE_ADVANCED]: fifthGradeFinanceAdvancedScenarios,
};

// Function to generate numbers for a problem based on range and operation
export const generateProblemNumbers = (range: [number, number], operation: '+' | '-' | '*' | '/', isDecimal = false): { num1: number, num2: number } => {
  if (isDecimal) {
    let num1 = parseFloat((Math.random() * (range[1] - range[0]) + range[0]).toFixed(2));
    let num2 = parseFloat((Math.random() * (range[1] - range[0]) + range[0]).toFixed(2));
    if (operation === '-') {
      if (num1 < num2) [num1, num2] = [num2, num1];
    }
    return { num1, num2 };
  }

  let num1 = getRandomInt(range[0], range[1]);
  let num2 = getRandomInt(range[0], range[1]);

  if (operation === '-') {
    if (num1 < num2) { // Ensure num1 is greater or equal for subtraction
      [num1, num2] = [num2, num1];
    }
  } else if (operation === '/') {
    // Robust logic for division: generate divisor and quotient first
    const minDivisor = Math.max(1, range[0] > 0 ? range[0] : 1); // Ensure divisor is at least 1 if range allows 0
    let quotient;
    let attempts = 0;
    do {
      num2 = getRandomInt(minDivisor, range[1]);
      if (num2 === 0) num2 = 1; // Absolute fallback for divisor
      
      const maxQuotient = Math.floor(range[1] / num2);
      let minQuotient = (range[0] === 0 && num2 !== 0) ? 0 : Math.ceil(range[0] / num2);
      
      if (maxQuotient > 0) {
        minQuotient = Math.max(1, minQuotient);
      } else if (range[0] > 0 && maxQuotient === 0) { 
        if (num2 >= range[0] && num2 <= range[1]) {
            num1 = num2;
            return { num1, num2 };
        } else {
            num1 = num2;
            return { num1, num2 };
        }
      } else if (maxQuotient === 0 && minQuotient === 0) { 
          // num1 will be 0
      }


      if (maxQuotient < minQuotient) {
        if (num2 >= range[0] && num2 <= range[1]) {
          num1 = num2;
        } else if (range[0] === 0) {
          num1 = 0; 
        } else {
          num1 = Math.max(range[0], num2); 
          num1 = Math.ceil(num1 / num2) * num2; 
          if (num1 > range[1]) num1 = num2; 
        }
      } else {
        const quotient = getRandomInt(minQuotient, maxQuotient);
        num1 = quotient * num2;
      }
    } while ((num1 > range[1] || num1 < range[0]) && attempts < 50);

    // Fallback if we can't find a good pair after 50 tries
    if (attempts >= 50) {
        num2 = getRandomInt(2, 5);
        quotient = getRandomInt(2, 5);
        num1 = num2 * quotient;
    }
  } else if (operation === '*') {
     if (range[1] > 100) { 
         if (num1 * num2 > 20000 && num1 > 10 && num2 > 10) { 
            if (num1 > num2) {
                num1 = getRandomInt(Math.max(1, range[0]), Math.min(range[1], Math.floor(20000 / Math.max(1,num2)), 100));
            } else {
                num2 = getRandomInt(Math.max(1, range[0]), Math.min(range[1], Math.floor(20000 / Math.max(1,num1)), 100));
            }
         }
     }
  }
  return { num1, num2 };
};
