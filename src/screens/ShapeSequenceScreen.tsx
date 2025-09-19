import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface Shape {
  type: string;
  color: string;
}

const SHAPES = ['Circle', 'Square', 'Triangle', 'Star', 'Clover', 'Diamond', 'Spade', 'Heart'];
const COLORS = ['Black', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet'];

const SHAPE_SYMBOLS = {
  Circle: '●',
  Square: '■',
  Triangle: '▲',
  Star: '★',
  Clover: '♣',
  Diamond: '♦',
  Spade: '♠',
  Heart: '♥',
};

const COLOR_CODES = {
  Red: '#FF0000',
  Orange: '#FFA500',
  Yellow: '#F5F500',
  Green: '#008000',
  Blue: '#0000FF',
  Violet: '#8A2BE2',
};

const ShapeSequenceScreen = () => {
  const [numShapes, setNumShapes] = useState('5');
  const [sequence, setSequence] = useState<Shape[]>([]);
  const [speed, setSpeed] = useState(1000);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(-1);
  const [gamePhase, setGamePhase] = useState<'setup' | 'showing' | 'quiz' | 'completed'>('setup');
  const [options, setOptions] = useState<Shape[][]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number>(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const generateSequence = () => {
    const n = parseInt(numShapes) || 5;
    const newSequence: Shape[] = [];
    
    if (n > 20) {
      Alert.alert('설정 오류', `모양 개수는 20을 넘을수 없습니다.`);
      return false;
    }
    
    for (let i = 0; i < n; i++) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      newSequence.push({type: shape, color});
    }
    
    setSequence(newSequence);
    setCurrentShapeIndex(-1);
    setSelectedOption(null);
    generateOptions(newSequence);
    return true;
  };

  const generateOptions = (correctSequence: Shape[]) => {
    const correctIndex = Math.floor(Math.random() * 4);
    setCorrectOption(correctIndex);

    const sequenceKey = (seq: Shape[]) =>
      seq.map(s => `${s.type}|${s.color}`).join(',');

    const deepCopy = (seq: Shape[]) => seq.map(s => ({...s}));

    const makeVariantAt = (base: Shape[], position: number, typeOffset: number, colorOffset: number): Shape[] => {
      if (base.length === 0) return [];
      const idx = ((position % base.length) + base.length) % base.length;
      const target = base[idx];
      const typeIndex = SHAPES.indexOf(target.type);
      const colorIndex = COLORS.indexOf(target.color);
      const nextType = SHAPES[(typeIndex + typeOffset + SHAPES.length) % SHAPES.length];
      const nextColor = COLORS[(colorIndex + colorOffset + COLORS.length) % COLORS.length];
      const modified: Shape = {type: nextType, color: nextColor};
      return base.map((s, j) => (j === idx ? modified : s));
    };

    const usedKeys = new Set<string>();
    usedKeys.add(sequenceKey(correctSequence));

    const newOptions: Shape[][] = new Array(4);
    newOptions[correctIndex] = deepCopy(correctSequence);

    // Create three unique variants deterministically with adjustments if needed
    let filled = 0;
    for (let slot = 0; slot < 4; slot++) {
      if (slot === correctIndex) continue;
      let attempt: Shape[] = makeVariantAt(correctSequence, filled, filled + 1, filled + 2);
      let key = sequenceKey(attempt);
      let guard = 0;
      while (usedKeys.has(key) && guard < 50) {
        guard++;
        attempt = makeVariantAt(correctSequence, filled + guard, filled + 1 + guard, filled + 2 + guard);
        key = sequenceKey(attempt);
      }
      usedKeys.add(key);
      newOptions[slot] = attempt;
      filled++;
    }

    setOptions(newOptions);
  };

  const startGame = () => {
    const legitimate = generateSequence();
    if (legitimate === true){
      setGamePhase('showing');
      setCurrentShapeIndex(0);
      setSelectedOption(null);
      setAnswerSubmitted(false);
    }
  };

  useEffect(() => {
    if (gamePhase === 'showing' && currentShapeIndex >= 0) {
      if (currentShapeIndex < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentShapeIndex(prev => prev + 1);
        }, speed);
        
        return () => clearTimeout(timer);
      } else {
        setGamePhase('quiz');
        setCurrentShapeIndex(-1);
      }
    }
  }, [gamePhase, currentShapeIndex, sequence, speed]);

  const handleOptionSelect = (optionIndex: number) => {
    if (answerSubmitted) return;

    const isCorrect = optionIndex === correctOption;
    setSelectedOption(optionIndex);
    setAnswerSubmitted(true);

    if (isCorrect) {
      // Show green selection briefly, update text to success, then go to completed
      setTimeout(() => {
        setGamePhase('completed');
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
            color: COLOR_CODES[shape.color as keyof typeof COLOR_CODES],
          },
        ]}>
        {SHAPE_SYMBOLS[shape.type as keyof typeof SHAPE_SYMBOLS]}
      </Text>
    );
  };

  const renderSequence = (shapes: Shape[]) => {
    return (
      <View style={[styles.sequenceContainer, styles.optionSequence]}>
        {shapes.map((shape, index) => (
          <View key={index} style={styles.shapeContainer}>
            {renderShape(shape, 32)}
          </View>
        ))}
      </View>
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
          
          <View style={styles.inputRow}>
          <Text style={styles.label}>시연 속도</Text>
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>빠름</Text>
              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={2000}
                value={speed}
                onValueChange={setSpeed}
                step={100}
              />
              <Text style={styles.sliderLabel}>느림</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>게임 시작!</Text>
          </TouchableOpacity>
    
        </View>
      )}
      
      {gamePhase === 'showing' && (
        <View style={styles.showingContainer}>
          {currentShapeIndex < sequence.length && 
          (<Text style={styles.instruction}>
            {currentShapeIndex + 1} / {sequence.length}
          </Text>)}
          
          {currentShapeIndex < sequence.length && (
            <View style={styles.currentShapeContainer}>
              {renderShape(sequence[currentShapeIndex], 80)}
            </View>
          )}
        </View>
      )}
      
      {((gamePhase === 'quiz') || (gamePhase === 'completed') ) && (
        <View style={styles.quizContainer}>
          {gamePhase === 'quiz' && 
          <Text style={styles.instruction}>정답을 골라주세요!</Text>}
          
          {gamePhase === 'completed' &&
          <Text style={styles.textcorrect}>정답입니다!</Text>
          }

          {options.map((option, index) => {
            let optionBackgroundColor = '#fff';
            if (answerSubmitted && selectedOption === index) {
              optionBackgroundColor = selectedOption === correctOption ? '#4CAF50' : '#F44336';
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
                {renderSequence(option)}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      
      {gamePhase === 'completed' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>다시 시작</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={resetToSetup}>
            <Text style={styles.buttonText}>세팅 화면</Text>
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
  sliderContainer: {
    marginBottom: 80,
    alignItems: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 18,
    color: '#666',
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
  showingContainer: {
    flex: 1,
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
  sequenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSequence: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
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