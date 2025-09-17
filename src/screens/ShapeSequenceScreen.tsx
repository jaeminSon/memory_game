import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';

interface Shape {
  type: string;
  color: string;
}

const SHAPES = ['Circle', 'Square', 'Triangle', 'Star', 'Clover', 'Diamond', 'Spade', 'Heart'];
const COLORS = ['Black', 'White', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Violet'];

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
  Yellow: '#FFFF00',
  Green: '#008000',
  Blue: '#0000FF',
  Violet: '#8A2BE2',
};

const ShapeSequenceScreen = () => {
  const [numShapes, setNumShapes] = useState('10');
  const [exposureTime, setExposureTime] = useState(1000);
  const [sequence, setSequence] = useState<Shape[]>([]);
  const [currentShapeIndex, setCurrentShapeIndex] = useState(-1);
  const [gamePhase, setGamePhase] = useState<'setup' | 'showing' | 'quiz'>('setup');
  const [options, setOptions] = useState<Shape[][]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctOption, setCorrectOption] = useState<number>(0);

  const generateSequence = () => {
    const n = parseInt(numShapes) || 10;
    const newSequence: Shape[] = [];
    
    for (let i = 0; i < n; i++) {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      newSequence.push({type: shape, color});
    }
    
    setSequence(newSequence);
    setCurrentShapeIndex(-1);
    setSelectedOption(null);
    generateOptions(newSequence);
  };

  const generateOptions = (correctSequence: Shape[]) => {
    const newOptions: Shape[][][] = [];
    const correctIndex = Math.floor(Math.random() * 4);
    setCorrectOption(correctIndex);
    
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        newOptions.push(correctSequence);
      } else {
        const incorrectSequence = [...correctSequence];
        const randomIndex = Math.floor(Math.random() * correctSequence.length);
        
        if (Math.random() < 0.5) {
          incorrectSequence[randomIndex] = {
            ...incorrectSequence[randomIndex],
            type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          };
        } else {
          incorrectSequence[randomIndex] = {
            ...incorrectSequence[randomIndex],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          };
        }
        
        newOptions.push(incorrectSequence);
      }
    }
    
    setOptions(newOptions);
  };

  const startGame = () => {
    if (sequence.length === 0) {
      Alert.alert('Error', 'Please generate shapes first');
      return;
    }
    
    setGamePhase('showing');
    setCurrentShapeIndex(0);
  };

  useEffect(() => {
    if (gamePhase === 'showing' && currentShapeIndex >= 0) {
      if (currentShapeIndex < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentShapeIndex(prev => prev + 1);
        }, exposureTime);
        
        return () => clearTimeout(timer);
      } else {
        setGamePhase('quiz');
        setCurrentShapeIndex(-1);
      }
    }
  }, [gamePhase, currentShapeIndex, sequence, exposureTime]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedOption === null) {
      Alert.alert('Error', 'Please select an option');
      return;
    }
    
    if (selectedOption === correctOption) {
      Alert.alert('Correct!', 'You selected the right sequence!');
    } else {
      Alert.alert('Wrong!', 'That was not the correct sequence.');
    }
    
    resetGame();
  };

  const resetGame = () => {
    setGamePhase('setup');
    setSequence([]);
    setCurrentShapeIndex(-1);
    setSelectedOption(null);
    setOptions([]);
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

  const renderSequence = (shapes: Shape[], isOption: boolean = false) => {
    return (
      <View style={[styles.sequenceContainer, isOption && styles.optionSequence]}>
        {shapes.map((shape, index) => (
          <View key={index} style={styles.shapeContainer}>
            {renderShape(shape, isOption ? 24 : 32)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {gamePhase === 'setup' && (
        <View style={styles.setupContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>Number of shapes:</Text>
            <TextInput
              style={styles.input}
              value={numShapes}
              onChangeText={setNumShapes}
              keyboardType="numeric"
              placeholder="10"
            />
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Exposure time: {exposureTime}ms</Text>
            <Slider
              style={styles.slider}
              minimumValue={500}
              maximumValue={2000}
              value={exposureTime}
              onValueChange={setExposureTime}
              step={100}
            />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={generateSequence}>
            <Text style={styles.buttonText}>Generate Shapes</Text>
          </TouchableOpacity>
          
          {sequence.length > 0 && (
            <>
              <View style={styles.previewContainer}>
                <Text style={styles.previewTitle}>Generated Sequence:</Text>
                {renderSequence(sequence)}
              </View>
              
              <TouchableOpacity style={styles.button} onPress={startGame}>
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      
      {gamePhase === 'showing' && (
        <View style={styles.showingContainer}>
          <Text style={styles.instruction}>
            Shape {currentShapeIndex + 1} of {sequence.length}
          </Text>
          {currentShapeIndex < sequence.length && (
            <View style={styles.currentShapeContainer}>
              {renderShape(sequence[currentShapeIndex], 80)}
            </View>
          )}
        </View>
      )}
      
      {gamePhase === 'quiz' && (
        <View style={styles.quizContainer}>
          <Text style={styles.instruction}>Which sequence did you see?</Text>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && styles.selectedOption,
              ]}
              onPress={() => handleOptionSelect(index)}>
              <Text style={styles.optionLabel}>Option {index + 1}:</Text>
              {renderSequence(option, true)}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.button} onPress={submitAnswer}>
            <Text style={styles.buttonText}>Submit Answer</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {gamePhase !== 'setup' && (
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.buttonText}>Reset Game</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
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
    fontSize: 16,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    width: 80,
  },
  sliderContainer: {
    marginBottom: 30,
  },
  slider: {
    width: '100%',
    height: 40,
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
    fontSize: 16,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  currentShapeContainer: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sequenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionSequence: {
    backgroundColor: '#f9f9f9',
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
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ShapeSequenceScreen;