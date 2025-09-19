import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert
} from 'react-native';
import Slider from '@react-native-community/slider';

interface Cell {
  id: number;
  highlighted: boolean;
  correct: boolean;
  incorrect: boolean;
}

const GridMemoryScreen = () => {
  const [gridWidth, setGridWidth] = useState('5');
  const [numCells, setNumCells] = useState('5');
  const [speed, setSpeed] = useState(1000);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [sequence, setSequence] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<'setup' | 'showing' | 'playing' | 'completed'>('setup');
  const [userSequence, setUserSequence] = useState<number[]>([]);

  const initializeGrid = () => {
    const width = parseInt(gridWidth) || 5;
    const height = parseInt(gridWidth) || 5;
    const cells: Cell[] = [];
    for (let i = 0; i < width * height; i++) {
      cells.push({
        id: i,
        highlighted: false,
        correct: false,
        incorrect: false,
      });
    }
    setGrid(cells);
  };

  const generateSequence = (): boolean => {
    const width = parseInt(gridWidth) || 5;
    const height = parseInt(gridWidth) || 5;
    const k = parseInt(numCells) || 5;
    const totalCells = width * height;

    if (width > 10) {
      Alert.alert('설정 오류', `한변의 길이는 10 을 넘을수 없습니다.`);
      return false;
    }

    if (width < 1) {
      Alert.alert('설정 오류', `한변의 길이는 1 이상이어야 합니다.`);
      return false;
    }

    if (k < 1) {
      Alert.alert('설정 오류', `터치 횟수는 1 이상이어야 합니다.`);
      return false;
    }
    
    if (k > totalCells) {
      Alert.alert('설정 오류', `전체 셀 (${totalCells} 개) 보다 많은 터치 횟수 (${k} 개) 를 설정할 수 없습니다.`);
      return false;
    }

    // Generate unique sequence of length k without duplication
    const pool: number[] = Array.from({ length: totalCells }, (_, i) => i);
    // Fisher-Yates shuffle, but we only need first k
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    const selectedSequence: number[] = pool.slice(0, k);

    setSequence(selectedSequence);
    setUserSequence([]);
    return true;
  };

  const startGame = () => {
    initializeGrid();
    const ok = generateSequence();
    if (!ok) return;
    setGamePhase('showing');
  };

  const resetToSetup = () => {
    setGrid([]);
    setSequence([]);
    setUserSequence([]);
    setGamePhase('setup');
  };

  useEffect(() => {
    if (gamePhase === 'showing' && sequence.length > 0 && grid.length > 0) {
      let index = 0;

      const showAtIndex = (i: number) => {
        setGrid(prevGrid =>
          prevGrid.map(cell => ({
            ...cell,
            highlighted: cell.id === sequence[i],
          }))
        );

        setTimeout(() => {
          setGrid(prevGrid =>
            prevGrid.map(cell => ({
              ...cell,
              highlighted: false,
            }))
          );
        }, speed * 0.8);
      };

      // Immediately show the first cell once the grid is ready
      showAtIndex(0);
      index = 1;

      const interval = setInterval(() => {
        if (index < sequence.length) {
          showAtIndex(index);
          index++;
        } else {
          clearInterval(interval);
          setGamePhase('playing');
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [gamePhase, sequence, speed, grid.length]);

  const handleCellPress = (cellId: number) => {
    if (gamePhase !== 'playing') return;
    
    const expectedCellId = sequence[userSequence.length];
    const newUserSequence = [...userSequence, cellId];
    
    if (cellId === expectedCellId) {
      setGrid(prevGrid => 
        prevGrid.map(cell => 
          cell.id === cellId ? {...cell, correct: true} : cell
        )
      );
      setUserSequence(newUserSequence);
      
      if (newUserSequence.length === sequence.length) {
        setGamePhase('completed');
      }
    } else {
      setGrid(prevGrid => 
        prevGrid.map(cell => 
          cell.id === cellId ? {...cell, incorrect: true} : cell
        )
      );
      setTimeout(() => {
        setGrid(prevGrid => 
          prevGrid.map(cell => 
            cell.id === cellId ? {...cell, incorrect: false} : cell
          )
        );
      }, 500);
    }
  };

  const renderGrid = () => {
    const width = parseInt(gridWidth) || 5;
    const height = parseInt(gridWidth) || 5;
    
    return (
      <View style={styles.gridContainer}>
        {Array.from({length: height}).map((_, row) => (
          <View key={row} style={styles.gridRow}>
            {Array.from({length: width}).map((_, col) => {
              const cellIndex = row * width + col;
              const cell = grid[cellIndex];
              return (
                <TouchableOpacity
                  key={cellIndex}
                  style={[
                    styles.cell,
                    {
                      width: `${100 / width}%`,
                      aspectRatio: 1,
                    },
                    cell?.highlighted && styles.highlightedCell,
                    cell?.correct && styles.correctCell,
                    cell?.incorrect && styles.incorrectCell,
                  ]}
                  onPress={() => handleCellPress(cellIndex)}
                  disabled={gamePhase !== 'playing'}
                />
              );
            })}
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
            <Text style={styles.label}>그리드 한변의 길이:</Text>
            <TextInput
              style={styles.input}
              value={gridWidth}
              onChangeText={setGridWidth}
              keyboardType="numeric"
              placeholder="5"
            />
          </View>
          
          <View style={styles.inputRow}>
            <Text style={styles.label}>터치 횟수:</Text>
            <TextInput
              style={styles.input}
              value={numCells}
              onChangeText={setNumCells}
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
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>게임 시작!</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {(gamePhase === 'showing' || gamePhase === 'playing') && (
        <View style={styles.gameContainer}>
          <Text style={styles.instruction}>
            {gamePhase === 'showing' && '순서를 암기하세요!'}
            {gamePhase === 'playing' && '순서대로 터치하세요!'}
          </Text>
          {renderGrid()}
        </View>
      )}
      
      {gamePhase === 'completed' && (
        <View style={styles.gameContainer}>
          <Text style={styles.instruction}>성공하였습니다!</Text>
          {renderGrid()}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>다시 시작</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={resetToSetup}>
              <Text style={styles.buttonText}>세팅 화면</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    fontSize: 32,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 24,
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
    width: 300,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '600',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 32,
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  gridContainer: {
    width: '90%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#333',
  },
  gridRow: {
    flexDirection: 'row',
    flex: 1,
  },
  cell: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedCell: {
    backgroundColor: '#4CAF50',
  },
  correctCell: {
    backgroundColor: '#4CAF50',
  },
  incorrectCell: {
    backgroundColor: '#F44336',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  }
});

export default GridMemoryScreen;