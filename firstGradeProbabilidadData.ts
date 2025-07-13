
import { Exercise, ExerciseComponentType, OriginalIconName, CertaintyScenario, FrecuenciaScenario, CertaintyLevel, FrequencyLevel } from './types';

const certezaSucesos1stGradeScenarios: CertaintyScenario[] = [
  { id: 'g1_sol_manana', eventText: "Que el sol salga mañana por la mañana.", correctCertainty: 'seguro' as CertaintyLevel, emoji: '☀️' },
  { id: 'g1_perro_vuele', eventText: "Que un perro pueda volar como un pájaro.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🐶' },
  { id: 'g1_llueva_hoy', eventText: "Que llueva más tarde hoy.", correctCertainty: 'posible' as CertaintyLevel, emoji: '🌧️' },
  { id: 'g1_gato_hable', eventText: "Que un gato hable español.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🐈' },
  { id: 'g1_lunes_martes', eventText: "Que después del Lunes venga el Martes.", correctCertainty: 'seguro' as CertaintyLevel, emoji: '🗓️' },
  { id: 'g1_vea_pajaro', eventText: "Que vea un pájaro volando hoy.", correctCertainty: 'posible' as CertaintyLevel, emoji: '🐦' },
  { id: 'g1_pez_camine', eventText: "Que un pez camine por la calle.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🐠' },
  { id: 'g1_sacar_roja_bolsa_roja', eventText: "Sacar una bolita roja de una bolsa que solo tiene bolitas rojas.", correctCertainty: 'seguro' as CertaintyLevel, emoji: '🔴' },
  { id: 'g1_sacar_verde_bolsa_azulroja', eventText: "Sacar una bolita verde de una bolsa con bolitas azules y rojas.", correctCertainty: 'imposible' as CertaintyLevel, emoji: '🟢' },
  { id: 'g1_comer_helado', eventText: "Que hoy coma un helado de postre.", correctCertainty: 'posible' as CertaintyLevel, emoji: '🍦' },
];

const frecuenciaSucesos1stGradeScenarios: FrecuenciaScenario[] = [
  { id: 'g1_sol_sale_manana', eventText: "El sol sale por la mañana.", correctFrequency: 'siempre' as FrequencyLevel, emoji: '🌅' },
  { id: 'g1_perros_maullan', eventText: "Los perros maúllan como los gatos.", correctFrequency: 'nunca' as FrequencyLevel, emoji: '🐕' },
  { id: 'g1_voy_parque', eventText: "Voy al parque los fines de semana.", correctFrequency: 'a_veces' as FrequencyLevel, emoji: '🏞️' },
  { id: 'g1_noche_despues_dia', eventText: "Después del día viene la noche.", correctFrequency: 'siempre' as FrequencyLevel, emoji: '🌃' },
  { id: 'g1_circulo_esquinas', eventText: "Un círculo tiene esquinas.", correctFrequency: 'nunca' as FrequencyLevel, emoji: '⭕' },
  { id: 'g1_como_pizza', eventText: "Como pizza para la cena.", correctFrequency: 'a_veces' as FrequencyLevel, emoji: '🍕' },
  { id: 'g1_pajaros_alas', eventText: "Los pájaros tienen alas.", correctFrequency: 'siempre' as FrequencyLevel, emoji: '🐦' },
  { id: 'g1_cielo_verde', eventText: "El cielo es de color verde.", correctFrequency: 'nunca' as FrequencyLevel, emoji: '☁️' },
  { id: 'g1_veo_arcoiris', eventText: "Veo un arcoíris después de la lluvia.", correctFrequency: 'a_veces' as FrequencyLevel, emoji: '🌈' },
  { id: 'g1_agua_moja', eventText: "El agua moja.", correctFrequency: 'siempre' as FrequencyLevel, emoji: '💧' },
];

export const firstGradeProbabilidadExercises: Exercise[] = [
  { 
    id: 'g1-s7-e1', 
    title: 'Posible, Imposible, Seguro', 
    description: 'Decide si algo puede pasar, no puede pasar, o pasará seguro.', 
    iconName: 'ProbabilityIcon' as OriginalIconName, 
    isLocked: false,
    componentType: ExerciseComponentType.CERTEZA_SUCESOS,
    question: 'Analiza el suceso: ¿Es posible, imposible o seguro?',
    data: {
      totalStars: 6, // Number of scenarios to complete
      scenarios: certezaSucesos1stGradeScenarios,
    },
    content: 'Lee la descripción de un evento y decide si es posible, imposible o seguro que ocurra.' 
  },
  { 
    id: 'g1-s7-e2', 
    title: 'Nunca, A Veces, Siempre', 
    description: 'Decide con qué frecuencia ocurren las cosas.', 
    iconName: 'ProbabilityIcon' as OriginalIconName, 
    isLocked: false,
    componentType: ExerciseComponentType.FRECUENCIA_SUCESOS,
    question: 'Analiza el suceso: ¿Ocurre nunca, a veces o siempre?',
    data: {
      totalStars: 6, 
      scenarios: frecuenciaSucesos1stGradeScenarios,
    },
    content: 'Lee la descripción de un evento y decide si ocurre nunca, a veces o siempre.' 
  },
];
