import React, { useState, useRef, useEffect } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { SpinnerProbabilityExercise as SpinnerProbabilityExerciseType, ExerciseScaffoldApi, Exercise } from '../types';
import './SpinnerProbabilityExercise.css';

interface SpinnerProbabilityExerciseProps {
  exercise: SpinnerProbabilityExerciseType | any; // Allow any for compatibility with Exercise type
  api?: ExerciseScaffoldApi; // Make this optional
  scaffoldApi?: ExerciseScaffoldApi; // Added for compatibility with other components
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void; // For sidebar keypad
}

const SpinnerProbabilityExercise: React.FC<SpinnerProbabilityExerciseProps> = ({ 
  exercise, 
  api, 
  scaffoldApi,
  setCustomKeypadContent 
}) => {
  // Use scaffoldApi if provided, otherwise fall back to api
  const activeApi = scaffoldApi || api;
  
  // Create a dummy API if neither is provided
  const safeApi = activeApi || {
    onAttempt: () => {},
    advanceToNextChallengeSignal: 0,
    showFeedback: () => {}
  };
  
  // Track which field is active for keypad input - numerator is selected by default
  const [activeField, setActiveField] = useState<'numerator' | 'denominator'>('numerator');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [wonPrize, setWonPrize] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // Removed unused state
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);

  // Access data based on how it's provided from the API
  // This can either be direct properties or nested in a data field
  const exerciseData = exercise as any;
  
  // State to hold the spinner configuration
  const [spinnerConfig, setSpinnerConfig] = useState<{
    sections: { color: string; label: string }[];
    targetSection: string;
    correctNumerator: number;
    correctDenominator: number;
  } | null>(null);
  
  // Initialize spinner configuration on mount
  useEffect(() => {
    console.log('Exercise data:', exerciseData);
    
    // Check if the exercise is set to use random generation
    const useRandomConfig = 
      (exerciseData.useRandomConfig) || 
      (exerciseData.data && exerciseData.data.useRandomConfig);
    
    if (useRandomConfig) {
      // Generate a random spinner configuration
      const randomConfig = generateRandomSpinnerConfig();
      setSpinnerConfig(randomConfig);
      console.log('Using randomly generated configuration:', randomConfig);
    } else {
      // Use the provided configuration
      let sections: { color: string; label: string }[] = [];
      let correctNumerator = 1;
      let correctDenominator = 1;
      let targetSection = '';
      
      // If the data is in the expected format directly on the exercise
      if (exerciseData.sections && Array.isArray(exerciseData.sections)) {
        sections = exerciseData.sections;
        correctNumerator = exerciseData.correctNumerator;
        correctDenominator = exerciseData.correctDenominator;
        targetSection = exerciseData.targetSection;
        console.log('Using direct properties');
      } 
      // If the data is nested in a data property (new format)
      else if (exerciseData.data && exerciseData.data.sections && Array.isArray(exerciseData.data.sections)) {
        sections = exerciseData.data.sections;
        correctNumerator = exerciseData.data.correctNumerator;
        correctDenominator = exerciseData.data.correctDenominator;
        targetSection = exerciseData.data.targetSection;
        console.log('Using data property');
      } else {
        console.error('Unable to find spinner data in the expected format', exerciseData);
        // Create a fallback configuration
        const fallbackConfig = generateRandomSpinnerConfig();
        sections = fallbackConfig.sections;
        correctNumerator = fallbackConfig.correctNumerator;
        correctDenominator = fallbackConfig.correctDenominator;
        targetSection = fallbackConfig.targetSection;
        console.log('Using fallback random configuration');
      }
      
      setSpinnerConfig({
        sections,
        targetSection,
        correctNumerator,
        correctDenominator
      });
    }
  }, [exerciseData]);
  
  // Wait until we have a spinner configuration
  const sections = spinnerConfig?.sections || [];
  const targetSection = spinnerConfig?.targetSection || '';
  const correctNumerator = spinnerConfig?.correctNumerator || 1;
  const correctDenominator = spinnerConfig?.correctDenominator || 1;

  console.log('Sections:', sections);
  console.log('Target section:', targetSection);
  console.log('Numerator/Denominator:', correctNumerator, '/', correctDenominator);

  const totalSections = sections.length;
  const angleStep = 360 / totalSections;

  // Create spinning sound effect
  useEffect(() => {
    // Create a simple beeping sound that gets faster as spinner slows down
    const createSpinAudio = () => {
      const audio = new Audio();
      return audio;
    };
    
    spinAudioRef.current = createSpinAudio();
    
    return () => {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
      }
    };
  }, []);

  const handleSpin = () => {
    if (!isSpinning) {
      setIsSpinning(true);
      setShowFeedback(false);
      
      // Play spinning sound
      if (spinAudioRef.current) {
        spinAudioRef.current.currentTime = 0;
        spinAudioRef.current.play().catch(() => {
          // Handle any playback error silently
        });
      }
      
      const randomSection = Math.floor(Math.random() * totalSections);
      // Store result in a local variable instead of state
      const targetRotation = 360 * 5 + (randomSection * angleStep) + Math.random() * angleStep;
      setRotation(targetRotation);
      
      setTimeout(() => {
        setIsSpinning(false);
        
        // Stop sound
        if (spinAudioRef.current) {
          spinAudioRef.current.pause();
        }
      }, 4000);
    }
  };

  const checkAnswer = () => {
    if (!numerator || !denominator) {
      setFeedbackMessage('Por favor ingresa una fracción completa (numerador/denominador).');
      setShowFeedback(true);
      return;
    }
    
    const num = parseInt(numerator, 10);
    const den = parseInt(denominator, 10);
    const isAnswerCorrect = num === correctNumerator && den === correctDenominator;
    
    // Check if the fraction can be simplified
    let feedbackText = '';
    if (isAnswerCorrect) {
      const targetSectionName = sections.find((s: {color: string; label: string}) => s.label === targetSection)?.label || targetSection;
      feedbackText = `¡Genial! ${correctNumerator} ${targetSectionName} de ${correctDenominator} secciones es ${correctNumerator}/${correctDenominator}.`;
      setWonPrize(true);
    } else {
      // If numerator is correct but denominator is wrong
      if (num === correctNumerator && den !== correctDenominator) {
        feedbackText = `Casi... El denominador no es correcto. Cuenta el número total de secciones en la ruleta.`;
      } 
      // If denominator is correct but numerator is wrong
      else if (num !== correctNumerator && den === correctDenominator) {
        feedbackText = `Casi... El numerador no es correcto. Cuenta las secciones ${targetSection}.`;
      }
      // If both are wrong
      else {
        feedbackText = `La probabilidad es ${correctNumerator}/${correctDenominator}, no ${num}/${den}. Cuenta las secciones ${targetSection} y el total de secciones.`;
      }
      setWonPrize(false);
    }
    
    setFeedbackMessage(feedbackText);
    setShowFeedback(true);
    safeApi.onAttempt(isAnswerCorrect);
    
    // Also use the API's showFeedback method if available
    if (safeApi.showFeedback) {
      safeApi.showFeedback({
        type: isAnswerCorrect ? 'correct' : 'incorrect',
        message: feedbackText
      });
    }
  };

  const handleKeypadPress = (value: string) => {
    if (value === 'check') {
        checkAnswer();
        return;
    }
    
    if (value === 'delete' || value === 'backspace') {
      if (activeField === 'numerator') {
        setNumerator(numerator.slice(0, -1));
      } else if (activeField === 'denominator') {
        setDenominator(denominator.slice(0, -1));
      }
    } else if (value === '0' || value === '1' || value === '2' || value === '3' || 
               value === '4' || value === '5' || value === '6' || value === '7' || 
               value === '8' || value === '9') {
      // Prevent adding more than 2 digits
      if (activeField === 'numerator' && numerator.length < 2) {
        setNumerator(numerator + value);
      } else if (activeField === 'denominator' && denominator.length < 2) {
        setDenominator(denominator + value);
      }
    }
  };
  
  // Update active field - the useEffect will handle updating the sidebar keypad
  const updateActiveField = (field: 'numerator' | 'denominator') => {
    setActiveField(field);
    // The useEffect that depends on activeField will update the keypad
  };

  const conicGradient = `conic-gradient(${sections
    .map((section: {color: string; label: string}, i: number) => `${section.color} ${i * angleStep}deg ${(i + 1) * angleStep}deg`)
    .join(', ')})`;

  const openHelpModal = () => {
    setShowModal(true);
  };

  const closeHelpModal = () => {
    setShowModal(false);
  };

  // Function to reset the spinner with a new random configuration
  const resetSpinner = () => {
    // Check if the exercise uses random configs
    const useRandomConfig = 
      (exerciseData.useRandomConfig) || 
      (exerciseData.data && exerciseData.data.useRandomConfig);
      
    if (useRandomConfig) {
      // Generate a new random configuration
      const newConfig = generateRandomSpinnerConfig();
      setSpinnerConfig(newConfig);
      
      // Reset user input and feedback
      setNumerator('');
      setDenominator('');
      setShowFeedback(false);
      setWonPrize(false);
      setRotation(0);
      setIsSpinning(false);
      setActiveField('numerator'); // Reset to numerator field
      
      console.log('Generated new random spinner configuration:', newConfig);
    }
  };

  // Auto-generate new configuration after winning
  useEffect(() => {
    if (wonPrize && showFeedback) {
      // Check if the exercise uses random configs
      const useRandomConfig = 
        (exerciseData.useRandomConfig) || 
        (exerciseData.data && exerciseData.data.useRandomConfig);
        
      if (useRandomConfig) {
        // Wait for the win animation to play (3.5 seconds)
        const timer = setTimeout(() => {
          // Use the resetSpinner function to generate a new challenge
          resetSpinner();
          console.log('Auto-generated new challenge after winning!');
        }, 3500);
        
        // Clean up timer if component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [wonPrize, showFeedback, exerciseData]);

  // Set up sidebar keypad initially and when dependencies change
  useEffect(() => {
    console.log('Setting up keypad, active field:', activeField);
    if (setCustomKeypadContent) {
      setCustomKeypadContent(
        <div className="sidebar-keypad-container">
          <h3 className="sidebar-keypad-title">
            {activeField === 'numerator' ? 'Numerador' : 'Denominador'}
          </h3>
          <NumericKeypad onKeyPress={handleKeypadPress} className="w-full" />
          <div className="sidebar-keypad-buttons">
            <button className="carnival-button check-button" onClick={checkAnswer}>
              Verificar
            </button>
          </div>
          <p className="sidebar-keypad-instructions">
            Haz clic en el numerador o denominador para cambiar el campo activo
          </p>
        </div>
      );
    }
  }, [setCustomKeypadContent, activeField, handleKeypadPress, checkAnswer]);

  // Helper functions for generating random spinner configurations
  const COLORS = [
    { value: 'red', name: 'Rojo' },
    { value: 'blue', name: 'Azul' },
    { value: 'green', name: 'Verde' },
    { value: 'yellow', name: 'Amarillo' },
    { value: 'orange', name: 'Naranja' },
    { value: 'purple', name: 'Morado' },
    { value: 'pink', name: 'Rosa' },
    { value: 'brown', name: 'Café' },
    { value: 'teal', name: 'Turquesa' }
  ];

  // Get a random number within a range
  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate a random spinner configuration appropriate for 5th graders
  const generateRandomSpinnerConfig = () => {
    // For 5th grade, use denominators between 4 and 12
    const totalSections = getRandomInt(4, 12);
    
    // Randomly select 2-4 different colors to use
    const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random());
    const selectedColors = shuffledColors.slice(0, getRandomInt(2, 4));
    
    // Distribute the colors across sections
    const sections: { color: string; label: string }[] = [];
    let remainingSections = totalSections;
    
    // Ensure each color appears at least once
    selectedColors.forEach((color, index) => {
      const isLastColor = index === selectedColors.length - 1;
      
      // If it's the last color, assign all remaining sections
      // Otherwise, assign a random number of sections
      const colorSections = isLastColor 
        ? remainingSections 
        : getRandomInt(1, Math.max(1, Math.floor(remainingSections / 2)));
        
      for (let i = 0; i < colorSections; i++) {
        sections.push({ color: color.value, label: color.name });
      }
      
      remainingSections -= colorSections;
    });
    
    // Shuffle the sections for more randomness
    sections.sort(() => 0.5 - Math.random());
    
    // Randomly select one of the used colors as the target
    const uniqueColors = Array.from(new Set(sections.map(section => section.label)));
    const targetSection = uniqueColors[getRandomInt(0, uniqueColors.length - 1)];
    
    // Count occurrences of target section
    const targetCount = sections.filter(section => section.label === targetSection).length;
    
    return {
      sections,
      targetSection,
      correctNumerator: targetCount,
      correctDenominator: totalSections
    };
  };

  return (
    <div className="carnival-game">
      {showModal && (
        <div className="modal-overlay" onClick={closeHelpModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">¿Cómo calcular la probabilidad?</h3>
            
            <p className="modal-text">Para calcular la probabilidad de que la ruleta caiga en un color específico:</p>
            
            <div className="modal-step">
              <div className="modal-step-number">1</div>
              <div>Identifica cuántas secciones de la ruleta son del color que te interesa. Este número será tu <strong>numerador</strong>.</div>
            </div>
            
            <div className="modal-step">
              <div className="modal-step-number">2</div>
              <div>Cuenta el número total de secciones en la ruleta. Este número será tu <strong>denominador</strong>.</div>
            </div>
            
            <div className="modal-step">
              <div className="modal-step-number">3</div>
              <div>La probabilidad se expresa como una fracción: (Número de secciones del color deseado) / (Número total de secciones).</div>
            </div>
            
            <p className="modal-text">Por ejemplo, si una ruleta tiene 8 secciones y 2 son azules, la probabilidad de que caiga en azul es 2/8 (que se puede simplificar a 1/4).</p>
            
            <button className="modal-button" onClick={closeHelpModal}>
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="carnival-header">
        <h2>¡Juego de Carnaval! - Desafío de Probabilidad</h2>
        <p>Adivina la probabilidad correcta para ganar un premio</p>
      </div>
      
      <div className="spinner-booth">
        <div className="spinner-container">
          <div className="spinner-arrow"></div>
          <div
            className="spinner"
            style={{
              background: conicGradient,
              transform: `rotate(${rotation}deg)`,
            }}
          ></div>
        </div>
        
        <button 
          onClick={handleSpin} 
          disabled={isSpinning} 
          className={`carnival-button spin-button ${isSpinning ? 'spinning' : ''}`}
        >
          {isSpinning ? 'Girando...' : 'Girar la Ruleta'}
        </button>
      </div>
      
      <div className="prediction-box">
        <h3>¿Cuál es la probabilidad de que caiga en {targetSection}?</h3>
        
        <div className="fraction-input">
          <input 
            type="text" 
            value={numerator} 
            readOnly 
            placeholder="Numerador" 
            className={`fraction-field ${activeField === 'numerator' ? 'active' : ''}`}
            onClick={() => updateActiveField('numerator')}
          />
          <div className="fraction-divider"></div>
          <input 
            type="text" 
            value={denominator} 
            readOnly 
            placeholder="Denominador" 
            className={`fraction-field ${activeField === 'denominator' ? 'active' : ''}`}
            onClick={() => updateActiveField('denominator')}
          />
        </div>
      </div>
      
      {showFeedback && (
        <div className={`feedback-container ${wonPrize ? 'success' : 'error'}`}>
          <p>{feedbackMessage}</p>
          {wonPrize && (
            <>
              <div className="prize-animation">
                <span role="img" aria-label="trophy">🏆</span>
                <span role="img" aria-label="confetti">🎉</span>
                <span>¡Ganaste un premio!</span>
                <span role="img" aria-label="confetti">🎉</span>
                <span role="img" aria-label="medal">🥇</span>
              </div>
              {(exerciseData.useRandomConfig || (exerciseData.data && exerciseData.data.useRandomConfig)) && (
                <div className="next-challenge-message">
                  ¡Prepárate para el siguiente desafío!
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      <div className="hint-container">
        <div className="button-row">
          <button onClick={openHelpModal} className="help-button">
            <span>¿Cómo era?</span>
            <span role="img" aria-label="question">❓</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpinnerProbabilityExercise;
