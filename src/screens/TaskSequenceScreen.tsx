import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
  {place: '빵집에서', items: ['식빵', '바게트', '베이글', '피자빵', '토스트', '케이크', '크루아상', '소보로빵', '단팥빵', '슈크림빵', '초코빵', '피자빵', '소시지빵', '카레빵', '머핀', '브라우니', '타르트'], action: '사기'},
  {place: '도서관에서', items: ['책'], action: '반납하기'},
  {place: '도서관에서', items: ['책'], action: '대출하기'},
  {place: '까페에서', items: ['말차라떼', '아이스 아메리카노', '아메리카노', '요거트', '밀크티', '홍차','에스프레소','카페라떼','카푸치노','바닐라라떼','카라멜 마끼아또','콜드브루','아인슈페너','모카','그린티라떼','고구마라떼','아이스티','레몬에이드','과일에이드', '과일주스','스무디', '케이크','티라미수','마카롱','쿠키','머핀','스콘','크루아상','샌드위치','베이글'], action: '사기'},
  {place: '약국에서', items: ['파스', '감기약', '소화제', '진통제','해열제','제산제','연고','지사제','변비약','비타민','밴드','거즈','붕대','알코올','인공눈물'], action: '사기'},
  {place: '과일가게에서', items: ['사과','배','감','귤','오렌지','레몬','포도','복숭아','자두','체리','딸기','블루베리','참외','수박','멜론','파인애플','바나나','망고','키위'], action: '사기'},
  {place: '슈퍼에서', items: ['사과','배','감','귤','오렌지','레몬','포도','복숭아','자두','체리','딸기','블루베리','참외','수박','멜론','파인애플','바나나','망고','키위', '달걀', '우유', '사이다','콜라','과자','라면','아이스크림','쌀','김치','생수','소주','맥주','통조림 참치','소고기','돼지고기','닭고기','샴푸','치약','휴지','주방세제','세탁세제'], action: '사기'},
  {place: '편의점에서', items: ['담배','사이다','콜라','소화제','진통제','과자','우유','라면','아이스크림','김치','생수','소주','맥주','샴푸','치약','휴지','주방세제','세탁세제'], action: '사기'},
  {place: '세탁소에서', items: ['와이셔츠','남성정장','블라우스','원피스','코트','스커트','정장바지','자켓','트렌치코트','패딩','조끼','셔츠'], action: '맡기기'},
  {place: '세탁소에서', items: ['와이셔츠','남성정장','블라우스','원피스','코트','스커트','정장바지','자켓','트렌치코트','패딩','조끼','셔츠'], action: '찾아오기'},
  {place: '우체국에서', items: ['편지','소포'], action: '부치기'},
];

const TaskSequenceScreen = () => {
  const [numTasks, setNumTasks] = useState('5');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gamePhase, setGamePhase] = useState<'setup' | 'quiz'>('setup');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<Task[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCongratsVisible, setIsCongratsVisible] = useState(false);

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
    if ([
      '말차라떼','아이스 아메리카노','아메리카노','요거트','밀크티','홍차','에스프레소','카페라떼','카푸치노','바닐라라떼','카라멜 마끼아또','콜드브루','아인슈페너','모카','그린티라떼','고구마라떼','아이스티','레몬에이드','과일에이드','과일주스','스무디'
    ].includes(item)) {
      return '잔';
    }
    if (['알코올','인공눈물','생수','수박','샴푸','김치','편지'].includes(item)) {
      return '통';
    }
    if (['소주','맥주','사이다','콜라'].includes(item)) {
      return '병';
    }
    if (['과자','라면'].includes(item)) {
      return '봉지';
    }
    if (['소고기','돼지고기','닭고기','우유','쌀'].includes(item)) {
      return '팩';
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
    setFeedbackType(null);
    setIsProcessing(false);
  };

  const startGame = () => {
    setFeedbackType(null);
    setIsProcessing(false);
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
    if (isProcessing) return;
    setSelectedOption(optionIndex);

    const correctTask = tasks[currentQuestionIndex];
    const chosen = options[optionIndex];
    const isCorrect = chosen.fullText === correctTask.fullText;

    setIsProcessing(true);
    if (isCorrect) {
      setFeedbackType('correct');
      setTimeout(() => {
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex >= tasks.length) {
          showCongratsThenReset();
        } else {
          setCurrentQuestionIndex(nextIndex);
          generateQuestionOptions(nextIndex);
          setSelectedOption(null);
          setFeedbackType(null);
          setIsProcessing(false);
        }
      }, 600);
    } else {
      setFeedbackType('wrong');
      setTimeout(() => {
        setFeedbackType(null);
        setSelectedOption(null);
        setIsProcessing(false);
      }, 600);
    }
  };

  // Shows a short congratulations message before resetting to settings
  const showCongratsThenReset = () => {
    setIsProcessing(true);
    setIsCongratsVisible(true);
    setTimeout(() => {
      setIsCongratsVisible(false);
      setFeedbackType(null);
      setSelectedOption(null);
      setIsProcessing(false);
      resetGame();
    }, 1000);
  };

  const resetGame = () => {
    setGamePhase('setup');
    setTasks([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setOptions([]);
    setFeedbackType(null);
    setIsProcessing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {gamePhase === 'setup' && (
          <View style={styles.setupContainer}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>심부름 목록 개수:</Text>
              <TextInput
                style={styles.input}
                value={numTasks}
                onChangeText={setNumTasks}
                keyboardType="numeric"
                placeholder="5"
              />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={generateTasks}>
              <Text style={styles.buttonText}>목록 생성!</Text>
            </TouchableOpacity>
            
            {tasks.length > 0 && (
              <>
                <View style={styles.tasksContainer}>
                  {tasks.map((task, index) => (
                    <View key={index} style={styles.taskItem}>
                      <Text style={styles.taskNumber}>{index + 1}.</Text>
                      <Text style={styles.taskText}>{task.fullText}</Text>
                    </View>
                  ))}
                </View>
                
                <TouchableOpacity style={styles.button} onPress={startGame}>
                  <Text style={styles.buttonText}>게임 시작!</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
        
        {gamePhase === 'quiz' && (
          <View style={styles.quizContainer}>
            
            <Text style={styles.questionText}>
              {currentQuestionIndex + 1} 번째 목록은?
            </Text>
            
            {options.map((option, index) => {
              const isSelected = selectedOption === index;
              const showCorrect = isSelected && feedbackType === 'correct';
              const showWrong = isSelected && feedbackType === 'wrong';
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                    showCorrect && styles.correctOption,
                    showWrong && styles.wrongOption,
                  ]}
                  onPress={() => handleOptionSelect(index)}
                  disabled={isProcessing}
                >
                  <Text style={styles.optionText}>{option.fullText}</Text>
                </TouchableOpacity>
              );
            })}
            
          </View>
        )}
        
      </ScrollView>
      {isCongratsVisible && (
        <View style={styles.congratsOverlay} pointerEvents="none">
          <Text style={styles.congratsText}>심부름 완료!</Text>
        </View>
      )}
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
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
    color: '#666',
    minWidth: 25,
  },
  taskText: {
    fontSize: 19,
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
    fontSize:40,
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
  correctOption: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  wrongOption: {
    borderColor: '#c62828',
    backgroundColor: '#ffebee',
  },
  optionText: {
    fontSize: 19,
    color: '#333',
    lineHeight: 22,
  },
  congratsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  congratsText: {
    fontSize: 48,
    marginTop:20,
    color: '#2e7d32',
    fontWeight: '800',
    textAlign: 'center',
    paddingHorizontal: 20,
  }
});

export default TaskSequenceScreen;