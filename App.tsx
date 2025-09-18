import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import NumberMemoryScreen from './src/screens/NumberMemoryScreen';
import GridMemoryScreen from './src/screens/GridMemoryScreen';
import ShapeSequenceScreen from './src/screens/ShapeSequenceScreen';
import TaskSequenceScreen from './src/screens/TaskSequenceScreen';
import CapitalQuizScreen from './src/screens/CapitalQuizScreen';
import FlagQuizScreen from './src/screens/FlagQuizScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen 
          name="Main" 
          component={MainScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="NumberMemory" 
          component={NumberMemoryScreen} 
          options={{title: '숫자 암기'}}
        />
        <Stack.Screen 
          name="GridMemory" 
          component={GridMemoryScreen} 
          options={{title: '터치 순서 암기'}}
        />
        <Stack.Screen 
          name="ShapeSequence" 
          component={ShapeSequenceScreen} 
          options={{title: '모양 순서 암기'}}
        />
        <Stack.Screen 
          name="TaskSequence" 
          component={TaskSequenceScreen} 
          options={{title: '심부름 암기'}}
        />
        <Stack.Screen 
          name="CapitalQuiz" 
          component={CapitalQuizScreen} 
          options={{title: '수도 맞히기'}}
        />
        <Stack.Screen 
          name="FlagQuiz" 
          component={FlagQuizScreen} 
          options={{title: '국기 나라 맞히기'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;