import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NumericKeypad } from '../components/NumericKeypad';
import { CoinDiceProbabilityExercise as CoinDiceProbabilityExerciseType, ExerciseScaffoldApi } from '../types';
import './CoinDiceProbabilityExercise.css';

interface CoinDiceProbabilityExerciseProps {
  exercise: CoinDiceProbabilityExerciseType | any;
  api?: ExerciseScaffoldApi;
  scaffoldApi?: ExerciseScaffoldApi;
  setCustomKeypadContent?: (keypadNode: React.ReactNode | null) => void;
}

const CoinDiceProbabilityExercise: React.FC<CoinDiceProbabilityExerciseProps> = ({ 
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
  

  // Access data based on how it's provided from the API
  const exerciseData = exercise as any;
  // If scenarios array exists, pick one at random on mount/reset
  const scenarios: any[] | undefined = exerciseData.data?.scenarios;
  const [scenarioIndex, setScenarioIndex] = useState(() => scenarios ? Math.floor(Math.random() * scenarios.length) : 0);
  const scenario = scenarios ? scenarios[scenarioIndex] : exerciseData.data || exerciseData;

  // State variables
  const [activeField, setActiveField] = useState<'numerator' | 'denominator'>('numerator');
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [wonPrize, setWonPrize] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // When the component mounts or the exercise changes, pick a new scenario
  useEffect(() => {
    if (scenarios && scenarios.length > 1) {
      setScenarioIndex(Math.floor(Math.random() * scenarios.length));
      setNumerator('');
      setDenominator('');
      setShowFeedback(false);
      setWonPrize(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);
  
  // Animation state
  const [coinRotation, setCoinRotation] = useState(0);
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0 });
  
  // Audio references
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);
  const diceAudioRef = useRef<HTMLAudioElement | null>(null);

  // Get experiment configuration from the selected scenario
  const experimentType = scenario.experimentType || 'coin';
  const experimentConfig = scenario.experimentConfig || {};
  const correctNumerator = scenario.correctNumerator || 1;
  const correctDenominator = scenario.correctDenominator || 2;

  // Get specific configuration based on experiment type
  const coinSides = experimentConfig.coinSides || [
    { value: 'heads', label: 'Cara' },
    { value: 'tails', label: 'Cruz' }
  ];
  
  const diceType = experimentConfig.diceType || 6; // Default to 6-sided die
  const targetType = experimentConfig.targetType || 'even';
  // We'll redefine targetLabel to include the target values directly
  const targetLabel = experimentConfig.targetLabel || 
    (targetType === 'even' ? 'número par' : 
    targetType === 'odd' ? 'número impar' : 
    'número específico');

  // Create audio effects
  useEffect(() => {
    // Simple audio placeholders - in a real app, you would use actual sound files
    const createCoinAudio = () => {
      const audio = new Audio();
      return audio;
    };
    
    const createDiceAudio = () => {
      const audio = new Audio();
      return audio;
    };
    
    coinAudioRef.current = createCoinAudio();
    diceAudioRef.current = createDiceAudio();
    
    return () => {
      if (coinAudioRef.current) coinAudioRef.current.pause();
      if (diceAudioRef.current) diceAudioRef.current.pause();
    };
  }, []);
  
  // Auto-focus numerator input on component mount
  useEffect(() => {
    setActiveField('numerator');
    // This will trigger keypad initialization with the active field set to numerator
  }, []);

  // Handle keypad key press function
  const handleKeypadPress = useCallback((key: string) => {
    // Handle digits
    if (/^\d$/.test(key)) {
      if (activeField === 'numerator') {
        setNumerator(prev => {
          // Allow only reasonably sized numbers
          if (prev.length < 2) {
            return `${prev}${key}`;
          }
          return prev;
        });
      } else {
        setDenominator(prev => {
          if (prev.length < 2) {
            return `${prev}${key}`;
          }
          return prev;
        });
      }
    } 
    // Handle backspace
    else if (key === 'backspace') {
      if (activeField === 'numerator') {
        setNumerator(prev => prev.slice(0, -1));
      } else {
        setDenominator(prev => prev.slice(0, -1));
      }
    }
  }, [activeField]);
  
  // Set up the numeric keypad for fraction input
  useEffect(() => {
    const keypadContent = (
      <div style={{ width: '100%' }}>
        <NumericKeypad 
          onKeyPress={handleKeypadPress}
          allowDecimal={false}
        />
      </div>
    );
    
    // Use setTimeout with 0ms delay to ensure the keypad is created after component is fully mounted
    setTimeout(() => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(keypadContent);
      }
    }, 0);
  }, [activeField, setCustomKeypadContent, handleKeypadPress]);
  
  // Separate cleanup logic into its own useEffect
  useEffect(() => {
    return () => {
      if (setCustomKeypadContent) {
        setCustomKeypadContent(null);
      }
    };
  }, [setCustomKeypadContent]);
  
  // Function to flip the coin
  const flipCoin = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowFeedback(false);
    
    // Play coin flip sound
    if (coinAudioRef.current) {
      coinAudioRef.current.currentTime = 0;
      coinAudioRef.current.play().catch(() => {
        // Handle any playback error silently
      });
    }
    
    // Determine a random outcome (heads or tails)
    const randomSide = Math.floor(Math.random() * coinSides.length);
    const result = coinSides[randomSide].value;
    
    // Animate the coin flip (multiple rotations + final state)
    const flips = 5 + Math.floor(Math.random() * 3);
    const finalRotation = flips * 360 + (result === 'heads' ? 0 : 180);
    setCoinRotation(finalRotation);
    
    // Complete the animation after a timeout
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };
  
  // Function to roll the die
  const rollDice = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowFeedback(false);
    
    // Play dice rolling sound
    if (diceAudioRef.current) {
      diceAudioRef.current.currentTime = 0;
      diceAudioRef.current.play().catch(() => {
        // Handle any playback error silently
      });
    }
    
    // Random dice roll animation
    const animateDice = () => {
      const start = Date.now();
      const duration = 1500; // 1.5 seconds
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - start;
        
        if (elapsed < duration) {
          // Random rotations during animation
          setDiceRotation({
            x: Math.floor(Math.random() * 360),
            y: Math.floor(Math.random() * 360)
          });
          requestAnimationFrame(animate);
        } else {
          // Final state - determine result
          const result = Math.floor(Math.random() * diceType) + 1;
          
          // Set final rotation to show the correct face
          // This is a simplified version - in a real app you would calculate
          // the exact rotation to show the specific die face
          let finalRotation = { x: 0, y: 0 };
          
          switch(result) {
            case 1: finalRotation = { x: 0, y: 0 }; break;      // Front face
            case 2: finalRotation = { x: 0, y: 90 }; break;     // Right face
            case 3: finalRotation = { x: -90, y: 0 }; break;    // Top face
            case 4: finalRotation = { x: 90, y: 0 }; break;     // Bottom face
            case 5: finalRotation = { x: 0, y: -90 }; break;    // Left face
            case 6: finalRotation = { x: 0, y: 180 }; break;    // Back face
            default: finalRotation = { x: 0, y: 0 };
          }
          
          setDiceRotation(finalRotation);
          setIsAnimating(false);
        }
      };
      
      animate();
    };
    
    animateDice();
  };
  
  // Combined experiment function (both coin and dice)
  const runCombinedExperiment = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowFeedback(false);
    
    // Play both sounds
    if (coinAudioRef.current) {
      coinAudioRef.current.currentTime = 0;
      coinAudioRef.current.play().catch(() => {});
    }
    if (diceAudioRef.current) {
      diceAudioRef.current.currentTime = 0;
      diceAudioRef.current.play().catch(() => {});
    }
    
    // Determine random outcomes
    const randomCoinSide = Math.floor(Math.random() * coinSides.length);
    const coinResult = coinSides[randomCoinSide].value;
    const diceResult = Math.floor(Math.random() * diceType) + 1;
    
    // Animate coin
    const coinFlips = 5 + Math.floor(Math.random() * 3);
    const finalCoinRotation = coinFlips * 360 + (coinResult === 'heads' ? 0 : 180);
    setCoinRotation(finalCoinRotation);
    
    // Animate dice (simplified)
    const animateDice = () => {
      let frameCount = 0;
      const maxFrames = 20;
      
      const animate = () => {
        if (frameCount < maxFrames) {
          setDiceRotation({
            x: Math.floor(Math.random() * 360),
            y: Math.floor(Math.random() * 360)
          });
          frameCount++;
          requestAnimationFrame(animate);
        } else {
          // Final rotation based on result
          let finalRotation = { x: 0, y: 0 };
          
          switch(diceResult) {
            case 1: finalRotation = { x: 0, y: 0 }; break;
            case 2: finalRotation = { x: 0, y: 90 }; break;
            case 3: finalRotation = { x: -90, y: 0 }; break;
            case 4: finalRotation = { x: 90, y: 0 }; break;
            case 5: finalRotation = { x: 0, y: -90 }; break;
            case 6: finalRotation = { x: 0, y: 180 }; break;
            default: finalRotation = { x: 0, y: 0 };
          }
          
          setDiceRotation(finalRotation);
        }
      };
      
      animate();
    };
    
    animateDice();
    
    // Complete animation after timeout
    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };
  
  // Function to run the experiment based on type
  const runExperiment = () => {
    switch(experimentType) {
      case 'coin': flipCoin(); break;
      case 'dice': rollDice(); break;
      case 'combined': runCombinedExperiment(); break;
      default: flipCoin();
    }
  };
  
  // Check the user's answer
  const checkAnswer = useCallback(() => {
    if (!numerator || !denominator) {
      setFeedbackMessage('Por favor ingresa una fracción completa (numerador/denominador).');
      setShowFeedback(true);
      return;
    }
    
    const num = parseInt(numerator, 10);
    const den = parseInt(denominator, 10);
    const isAnswerCorrect = num === correctNumerator && den === correctDenominator;
    
    let feedbackText = '';
    if (isAnswerCorrect) {
      // Provide positive feedback based on experiment type
      if (experimentType === 'coin') {
        feedbackText = `¡Excelente! La probabilidad de obtener ${coinSides[0].label} es ${correctNumerator}/${correctDenominator}.`;
      } else if (experimentType === 'dice') {
        feedbackText = `¡Muy bien! La probabilidad de obtener un ${targetLabel} al lanzar un dado de ${diceType} caras es ${correctNumerator}/${correctDenominator}.`;
      } else {
        feedbackText = `¡Fantástico! Has calculado correctamente la probabilidad: ${correctNumerator}/${correctDenominator}.`;
      }
      setWonPrize(true);
      safeApi.onAttempt(true); // Report success to the API
    } else {
      // Provide helpful hints based on what's wrong
      if (num === correctNumerator && den !== correctDenominator) {
        feedbackText = `Casi... El denominador no es correcto. Recuerda que el denominador representa el número total de resultados posibles.`;
      } else if (num !== correctNumerator && den === correctDenominator) {
        feedbackText = `Cerca... El numerador no es correcto. El numerador representa la cantidad de resultados favorables.`;
      } else {
        // Both are wrong
        feedbackText = `La probabilidad correcta es ${correctNumerator}/${correctDenominator}. Intenta de nuevo contando todos los posibles resultados (denominador) y los resultados favorables (numerador).`;
      }
      setWonPrize(false);
      safeApi.onAttempt(false); // Report failure to the API
    }
    
    setFeedbackMessage(feedbackText);
    setShowFeedback(true);
  }, [numerator, denominator, correctNumerator, correctDenominator, experimentType, coinSides, targetLabel, diceType, safeApi]);
  
  // Show hint modal with explanation
  const showHint = () => {
    setShowModal(true);
  };
  
  // Generate appropriate hint based on experiment type
  const getHintText = () => {
    if (experimentType === 'coin') {
      return `Para calcular la probabilidad de un evento, debemos dividir el número de resultados favorables entre el número total de resultados posibles.\n\nEn una moneda hay ${coinSides.length} posibles resultados: ${coinSides.map((side: {value: string; label: string}) => side.label).join(' y ')}.\n\nPara encontrar la probabilidad de obtener ${coinSides[0].label}, cuenta cuántos resultados son ${coinSides[0].label} y divídelo entre el total de resultados posibles.`;
    } else if (experimentType === 'dice') {
      return `Para calcular la probabilidad de un evento, debemos dividir el número de resultados favorables entre el número total de resultados posibles.\n\nEn un dado de ${diceType} caras, hay ${diceType} posibles resultados: ${Array.from({length: diceType}, (_, i) => i + 1).join(', ')}.\n\nPara encontrar la probabilidad de obtener ${targetLabel}, cuenta cuántos resultados son ${targetLabel} y divídelo entre el total de resultados posibles (${diceType}).`;
    } else {
      return `Para calcular la probabilidad de un evento, debemos dividir el número de resultados favorables entre el número total de resultados posibles.\n\nLista todos los posibles resultados del experimento.\nIdentifica cuáles de estos resultados son favorables (los que cumplen la condición).\nDivide el número de resultados favorables entre el número total de resultados posibles.`;
    }
  };
  
  // Render the coin component
  const renderCoin = () => (
    <div 
      className="coin" 
      style={{ transform: `rotateY(${coinRotation}deg)` }}
    >
      {coinSides.map((side: {value: string; label: string}, index: number) => (
        <div 
          key={side.value} 
          className={`coin-side coin-${side.value}`}
          style={{ transform: index === 0 ? 'rotateY(0deg)' : 'rotateY(180deg)' }}
        >
          {side.label}
        </div>
      ))}
    </div>
  );
  
  // Render a single die face with dots based on value
  const renderDieFace = (value: number) => {
    // Configuration for dot positions based on face value
    // Each face has a 3x3 grid where dots can be placed
    const dotPositions: { [key: number]: number[] } = {
      1: [4], // Center
      2: [0, 8], // Top left, bottom right
      3: [0, 4, 8], // Top left, center, bottom right
      4: [0, 2, 6, 8], // Four corners
      5: [0, 2, 4, 6, 8], // Four corners + center
      6: [0, 2, 3, 5, 6, 8] // Two columns of three
    };
    
    const positions = dotPositions[value] || [];
    
    return (
      <div className={`dice-face dice-face-${value}`}>
        {Array(9).fill(0).map((_, index) => (
          positions.includes(index) ? (
            <div key={index} className="dice-dot" />
          ) : <div key={index} />
        ))}
      </div>
    );
  };
  
  // Render the dice component
  const renderDice = () => (
    <div 
      className="dice" 
      style={{ 
        transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg)` 
      }}
    >
      {Array.from({ length: 6 }, (_, i) => i + 1).map(value => (
        renderDieFace(value)
      ))}
    </div>
  );
  
  // We'll simply skip the result highlighting functionality for now
  // It could be implemented in the future if needed
  
  return (
    <div className="coin-dice-container">
      <div className="experiment-area">
        <div className="help-button" onClick={showHint}>?</div>
        {scenario.label && <div className="scenario-label" style={{marginBottom: 8, fontWeight: 500}}>{scenario.label}</div>}
        {experimentType === 'coin' && renderCoin()}
        {experimentType === 'dice' && renderDice()}
        {experimentType === 'combined' && (
          <div className="combined-experiment">
            {renderCoin()}
            {renderDice()}
          </div>
        )}
        {wonPrize && (
          <div className="prize-container">
            <div className="prize">
              ¡Felicidades! 🏆<br />
              Has ganado el juego de probabilidad
            </div>
          </div>
        )}
      </div>
      
      <button 
        className="action-button"
        onClick={runExperiment}
        disabled={isAnimating}
      >
        {experimentType === 'coin' ? '¡Lanzar Moneda!' : 
         experimentType === 'dice' ? '¡Lanzar Dado!' : 
         '¡Lanzar!'}
      </button>
      
      <div className="input-area">
        <p>¿Cuál es la probabilidad de obtener {
          experimentType === 'coin' 
            ? coinSides[0].label 
            : experimentType === 'dice' 
              ? targetLabel 
              : 'el resultado buscado'
        }?</p>
        
        <div className="fraction-input">
          <input
            type="text"
            className={`fraction-field ${activeField === 'numerator' ? 'active' : ''}`}
            value={numerator}
            onChange={(e) => setNumerator(e.target.value.replace(/[^0-9]/g, ''))}
            onClick={() => setActiveField('numerator')}
            autoFocus={activeField === 'numerator'} 
            readOnly // Use the keypad instead
          />
          <div className="fraction-divider"></div>
          <input
            type="text"
            className={`fraction-field ${activeField === 'denominator' ? 'active' : ''}`}
            value={denominator}
            onChange={(e) => setDenominator(e.target.value.replace(/[^0-9]/g, ''))}
            onClick={() => setActiveField('denominator')}
            autoFocus={activeField === 'denominator'}
            readOnly // Use the keypad instead
          />
        </div>
        
        <button 
          className="action-button"
          onClick={checkAnswer}
          disabled={isAnimating || !numerator || !denominator}
        >
          Verificar
        </button>
      </div>
      
      {showFeedback && (
        <div className={`feedback-message ${wonPrize ? 'feedback-success' : 'feedback-error'}`}>
          {feedbackMessage}
        </div>
      )}
      
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ayuda</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{getHintText()}</p>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoinDiceProbabilityExercise;
