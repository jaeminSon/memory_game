import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface Shape {
  emoji: string;
}

const SHAPE_EMOJIS = [
  '🔴',
  '🟠', 
  '🟡',
  '🟢',
  '🔵',
  '🟣',
  '⚫',
  '⚪',
  '🟤',
  '🔺',
  '🔻',
  '🔶',
  '🔷',
  '🟥',
  '🟧',
  '🟨',
  '🟩',
  '🟦',
  '🟪',
  '⬛️',
  '⬜️',
  '🟫',
  '♠️',
  '♣️',
  '♥️',
  '♦️',
  '🩷',
  '🧡',
  '💛',
  '💚',
  '💙',
  '🩵',
  '💜',
  '🖤',
  '🩶',
  '🤍',
  '🤎',
  '⚽️',
  '🏀',
  '🏈',
  '⚾️',
  '🏐',
  '🏉',
  '🎱',
];

const ShapeSequenceScreen = () => {
  const [numShapes, setNumShapes] = useState('5');
  const [sequence, setSequence] = useState<Shape[]>([]);
  const [showSequence, setShowSequence] = useState(false);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(-1);
  const [gamePhase, setGamePhase] = useState<'setup' | 'quiz' | 'completed'>('setup');
  const [options, setOptions] = useState<Shape[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const generateSequence = () => {
    const n = parseInt(numShapes) || 5;
    const newSequence: Shape[] = [];
    
    if (n > 20) {
      Alert.alert('설정 오류', `모양 개수는 20 을 넘을수 없습니다.`);
      return false;
    }
    
    if (n < 1) {
      Alert.alert('설정 오류', `모양 개수는 1 이상이어야 합니다.`);
      return false;
    }

    for (let i = 0; i < n; i++) {
      const emoji = SHAPE_EMOJIS[Math.floor(Math.random() * SHAPE_EMOJIS.length)];
      newSequence.push({emoji});
    }
    setShowSequence(true);
    setSequence(newSequence);
    setSelectedOption(null);
    return true;
  };

  const generateOptions = (correctSequence: Shape[], targetIndex: number) => {
    const correctShape = correctSequence[targetIndex];
    const correctIndex = Math.floor(Math.random() * 4);
    setCorrectOption(correctIndex);

    // Get all available emojis except the correct one
    const availableEmojis = SHAPE_EMOJIS.filter(emojiString => emojiString !== correctShape.emoji);
    
    // Ensure we have at least 3 different options
    if (availableEmojis.length < 3) {
      console.warn('Not enough emoji options for quiz');
      return;
    }
    
    // Shuffle available emojis
    for (let i = availableEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = availableEmojis[i];
      availableEmojis[i] = availableEmojis[j];
      availableEmojis[j] = tmp;
    }

    // Take the first 3 for wrong options
    const wrongShapes: Shape[] = availableEmojis.slice(0, 3).map(emojiString => ({emoji: emojiString}));

    // Place options with the correct one in a random slot
    const optionShapes: Shape[] = new Array(4);
    optionShapes[correctIndex] = { ...correctShape };
    let w = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot === correctIndex) continue;
      optionShapes[slot] = wrongShapes[w++];
    }
    setOptions(optionShapes);
  };

  const startGame = () => {
    setGamePhase('quiz');
    setShowSequence(false);
    setCurrentShapeIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    generateOptions(sequence, 0);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (answerSubmitted) return;

    const isCorrect = optionIndex === correctOption;
    setSelectedOption(optionIndex);
    setAnswerSubmitted(true);

    if (isCorrect) {
      // On correct: advance to next index or finish
      setTimeout(() => {
        const isLast = currentShapeIndex >= sequence.length - 1;
        if (isLast) {
          setGamePhase('completed');
        } else {
          const nextIndex = currentShapeIndex + 1;
          setSelectedOption(null);
          setAnswerSubmitted(false);
          generateOptions(sequence, nextIndex);
          setCurrentShapeIndex(nextIndex);
        }
      }, 800);
    } else {
      // Flash red briefly, then allow user to try again (stay in quiz)
      setTimeout(() => {
        setSelectedOption(null);
        setAnswerSubmitted(false);
      }, 800);
    }
  };

  const resetToSetup = () => {
    setGamePhase('setup');
    setSequence([]);
    setCurrentShapeIndex(-1);
    setSelectedOption(null);
    setOptions([]);
    setAnswerSubmitted(false);
  };

  const renderShape = (shape: Shape, size: number = 48) => {
    return (
      <Text
        style={[
          styles.shapeText,
          {
            fontSize: size,
          },
        ]}>
        {shape.emoji}
      </Text>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {gamePhase === 'setup' && (
        <View style={styles.setupContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>전체 모양 개수: </Text>
            <TextInput
              style={styles.input}
              value={numShapes}
              onChangeText={setNumShapes}
              keyboardType="numeric"
              placeholder="5"
            />
          </View>

          <View style={styles.numberContainer}>
          <TouchableOpacity style={styles.button} onPress={generateSequence}>
            <Text style={styles.buttonText}>생성</Text>
          </TouchableOpacity>
          </View>
          
          {showSequence && <View style={styles.optionSequence}>
            {sequence.map((shape, index) => (
              <View key={index} style={styles.shapeContainer}>
                {renderShape(shape, 32)}
              </View>
            ))}
          </View>}

          {showSequence && <TouchableOpacity style={[styles.button, {marginTop: 40}]} onPress={startGame}>
            <Text style={styles.buttonText}>게임 시작!</Text>
          </TouchableOpacity>}
    
        </View>
      )}

      {((gamePhase === 'quiz') || (gamePhase === 'completed') ) && (
        <View style={styles.quizContainer}>
          {gamePhase === 'quiz' && (
            <Text style={styles.instruction}>{currentShapeIndex + 1} 번째 모양은?</Text>)}
          {gamePhase === 'completed' &&
          <Text style={styles.textcorrect}>훌륭합니다!</Text>}

          {options.map((option, index) => {
            let optionBackgroundColor = '#fff';
            if (answerSubmitted && selectedOption === index) {
              optionBackgroundColor = selectedOption === correctOption ? '#b9dfbb' : '#ef9a9a';
            }
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  {backgroundColor: optionBackgroundColor}
                ]}
                onPress={() => handleOptionSelect(index)}
                disabled={answerSubmitted}>
                <View style={styles.optionContainer}>
                  <View style={styles.shapeContainer}>
                    {renderShape(option, 48)}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      
      {gamePhase === 'completed' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={resetToSetup}>
            <Text style={styles.buttonText}>다시 시작</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  setupContainer: {
    flex: 1,
  },
  numberContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 32,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 32,
    backgroundColor: '#fff',
    width: 80,
  },
  button: {
    backgroundColor: '#aaaaaa',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40,
    width: 200,
    fontWeight: '600',
    textAlign: 'center',
  },
  previewContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 32,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  textcorrect: {
    fontSize: 32,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  currentShapeContainer: {
    backgroundColor: '#fff',
    padding: 50,
    width:200,
    borderRadius: 30,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignSelf: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSequence: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeContainer: {
    margin: 2,
  },
  shapeText: {
    textAlign: 'center',
  },
  quizContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedOption: {
    borderColor: '#aaaaaa',
    backgroundColor: '#e3f2fd',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  }
});

export default ShapeSequenceScreen;