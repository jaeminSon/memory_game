import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';

const NumberMemoryScreen = () => {
  const [digits, setDigits] = useState('10');
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [showNumber, setShowNumber] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackColor, setFeedbackColor] = useState('');

  const generateNumber = () => {
    const numDigits = parseInt(digits) || 10;
    let number = '';
    for (let i = 0; i < numDigits; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    setGeneratedNumber(number);
    setShowNumber(true);
    setGameStarted(false);
    setUserInput('');
    setFeedback('');
  };

  const startGame = () => {
    setShowNumber(false);
    setGameStarted(true);
    setUserInput('');
    setFeedback('');
  };

  const checkAnswer = (input: string) => {
    if (input === generatedNumber) {
      setFeedback('정답!');
      setFeedbackColor('#4CAF50');
    } else if (input.length < generatedNumber.length) {
      // Still typing correctly, no feedback yet
      setFeedback('');
    } else {
      setFeedback('오답!');
      setFeedbackColor('#F44336');
    }
  };

  const handleInputChange = (input: string) => {
    setUserInput(input);
    if (input.length > 0) {
      checkAnswer(input);
    } else {
      setFeedback('');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>생성할 숫자 개수: </Text>
        <TextInput
          style={styles.input}
          value={digits}
          onChangeText={setDigits}
          keyboardType="numeric"
          placeholder="10"
        />
      </View>

      <View style={styles.numberContainer}>
      <TouchableOpacity style={styles.button} onPress={generateNumber}>
        <Text style={styles.buttonText}>생성</Text>
      </TouchableOpacity>
      </View>

      {showNumber && (
        <View style={styles.numberContainer}>
          <Text style={styles.generatedNumber}>{generatedNumber}</Text>
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>게임 시작!</Text>
          </TouchableOpacity>
        </View>
      )}

      {gameStarted && (
        <View style={styles.gameContainer}>
          <TextInput
            style={styles.answerInput}
            value={userInput}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            placeholder="입력"
          />
          
        </View>
      )}

      {feedback && (
        <Text style={[styles.feedback, {color: feedbackColor}]}>
          {feedback}
        </Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 32,
    marginRight: 0,
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
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: 200,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '600',
  },
  numberContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  generatedNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 8,
    marginBottom: 40,
    letterSpacing: 2,
  },
  gameContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  answerInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    backgroundColor: '#fff',
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 1,
  },
  feedback: {
    fontSize: 76,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  }
});

export default NumberMemoryScreen;