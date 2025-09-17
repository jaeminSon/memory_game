import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';

interface Task {
  place: string;
  item: string;
  quantity: number;
  action: string;
  fullText: string;
}

const TASK_TEMPLATES = [
  {place: '빵집에서', items: ['바게트', '피자빵', '토스트', '케이크'], action: '사기'},
  {place: '도서관에서', items: ['책'], action: '반납하기'},
  {place: '도서관에서', items: ['책'], action: '대출하기'},
  {place: '까페에서', items: ['말차라떼', '아이스 아메리카노', '아메리카노', '요거트', '밀크티', '홍차'], action: '사기'},
  {place: '약국에서', items: ['파스', '감기약', '소화제', '진통제'], action: '사기'},
  {place: '과일가게에서', items: ['사과', '배', '딸기', '수박', '바나나'], action: '사기'},
  {place: '슈퍼에서', items: ['사과', '배', '딸기', '수박', '바나나', '계란', '우유', '음료수', '과자'], action: '사기'},
  {place: '편의점에서', items: ['음료수', '소화제', '진통제', '과자'], action: '사기'},
];

const TaskSequenceScreen = () => {
  const [numTasks, setNumTasks] = useState('5');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gamePhase, setGamePhase] = useState<'setup' | 'showing' | 'quiz'>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<Task[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const generateTask = (usedTasks: Set<string>): Task => {
    let attempts = 0;
    while (attempts < 100) {
      const template = TASK_TEMPLATES[Math.floor(Math.random() * TASK_TEMPLATES.length)];
      const item = template.items[Math.floor(Math.random() * template.items.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      
      const unit = getUnit(item, template.action);
      const fullText = `${template.place} ${item} ${quantity}${unit} ${template.action}`;
      
      if (!usedTasks.has(fullText)) {
        usedTasks.add(fullText);
        return {
          place: template.place,
          item: item,
          quantity: quantity,
          action: template.action,
          fullText: fullText,
        };
      }
      attempts++;
    }
    
    const template = TASK_TEMPLATES[0];
    const item = template.items[0];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const unit = getUnit(item, template.action);
    const fullText = `${template.place} ${item} ${quantity}${unit} ${template.action}`;
    
    return {
      place: template.place,
      item: item,
      quantity: quantity,
      action: template.action,
      fullText: fullText,
    };
  };

  const getUnit = (item: string, action: string): string => {
    if (action === '반납하기' || action === '대출하기') {
      return '권';
    }
    if (item.includes('라떼') || item.includes('아메리카노') || item.includes('요거트') || item.includes('밀크티') || item.includes('홍차')) {
      return '잔';
    }
    return '개';
  };

  const generateTasks = () => {
    const n = parseInt(numTasks) || 5;
    const usedTasks = new Set<string>();
    const newTasks: Task[] = [];
    
    for (let i = 0; i < n; i++) {
      const task = generateTask(usedTasks);
      newTasks.push(task);
    }
    
    setTasks(newTasks);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setUserAnswers([]);
  };

  const startGame = () => {
    if (tasks.length === 0) {
      Alert.alert('Error', 'Please generate tasks first');
      return;
    }
    
    setGamePhase('showing');
  };

  const startQuiz = () => {
    setGamePhase('quiz');
    generateQuestionOptions(0);
  };

  const generateQuestionOptions = (questionIndex: number) => {
    if (questionIndex >= tasks.length) return;
    
    const correctTask = tasks[questionIndex];
    const wrongOptions: Task[] = [];
    
    const availableTasks = tasks.filter((_, index) => index !== questionIndex);
    
    while (wrongOptions.length < 3 && availableTasks.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableTasks.length);
      const wrongTask = availableTasks[randomIndex];
      
      if (!wrongOptions.find(option => option.fullText === wrongTask.fullText)) {
        wrongOptions.push(wrongTask);
      }
      availableTasks.splice(randomIndex, 1);
    }
    
    while (wrongOptions.length < 3) {
      const randomTask = generateTask(new Set());
      if (!wrongOptions.find(option => option.fullText === randomTask.fullText) && 
          randomTask.fullText !== correctTask.fullText) {
        wrongOptions.push(randomTask);
      }
    }
    
    const allOptions = [correctTask, ...wrongOptions];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    
    setOptions(shuffled);
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const submitAnswer = () => {
    if (selectedOption === null) {
      Alert.alert('Error', 'Please select an option');
      return;
    }
    
    const selectedTask = options[selectedOption];
    const correctTask = tasks[currentQuestionIndex];
    const isCorrect = selectedTask.fullText === correctTask.fullText;
    
    const newUserAnswers = [...userAnswers, selectedOption];
    setUserAnswers(newUserAnswers);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    if (currentQuestionIndex + 1 < tasks.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      generateQuestionOptions(nextIndex);
    } else {
      const finalScore = correctAnswers + (isCorrect ? 1 : 0);
      Alert.alert(
        'Quiz Complete!',
        `You got ${finalScore} out of ${tasks.length} correct!`,
        [{text: 'OK', onPress: resetGame}]
      );
    }
  };

  const resetGame = () => {
    setGamePhase('setup');
    setTasks([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setUserAnswers([]);
    setOptions([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {gamePhase === 'setup' && (
          <View style={styles.setupContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Number of tasks:</Text>
              <TextInput
                style={styles.input}
                value={numTasks}
                onChangeText={setNumTasks}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={generateTasks}>
              <Text style={styles.buttonText}>Generate Tasks</Text>
            </TouchableOpacity>
            
            {tasks.length > 0 && (
              <>
                <View style={styles.tasksContainer}>
                  <Text style={styles.tasksTitle}>Generated Tasks:</Text>
                  {tasks.map((task, index) => (
                    <View key={index} style={styles.taskItem}>
                      <Text style={styles.taskNumber}>{index + 1}.</Text>
                      <Text style={styles.taskText}>{task.fullText}</Text>
                    </View>
                  ))}
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
            <Text style={styles.instruction}>Memorize these tasks in order:</Text>
            <View style={styles.tasksContainer}>
              {tasks.map((task, index) => (
                <View key={index} style={styles.taskItem}>
                  <Text style={styles.taskNumber}>{index + 1}.</Text>
                  <Text style={styles.taskText}>{task.fullText}</Text>
                </View>
              ))}
            </View>
            
            <TouchableOpacity style={styles.button} onPress={startQuiz}>
              <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {gamePhase === 'quiz' && (
          <View style={styles.quizContainer}>
            <Text style={styles.instruction}>
              Question {currentQuestionIndex + 1} of {tasks.length}
            </Text>
            <Text style={styles.questionText}>
              What was task #{currentQuestionIndex + 1}?
            </Text>
            
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(index)}>
                <Text style={styles.optionText}>{option.fullText}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={styles.button} onPress={submitAnswer}>
              <Text style={styles.buttonText}>Submit Answer</Text>
            </TouchableOpacity>
            
            <Text style={styles.scoreText}>
              Score: {correctAnswers}/{currentQuestionIndex + 1}
            </Text>
          </View>
        )}
        
        {gamePhase !== 'setup' && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Reset Game</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  setupContainer: {
    padding: 20,
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
  tasksContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 15,
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  taskItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  taskNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    color: '#666',
    minWidth: 25,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    color: '#333',
  },
  showingContainer: {
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#333',
  },
  quizContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
    color: '#aaaaaa',
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
  optionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
    color: '#4CAF50',
  },
  resetButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
});

export default TaskSequenceScreen;