import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const MainScreen = ({navigation}: any) => {
  const games = [
    {
      title: '숫자 암기',
      icon: '71825',
      screen: 'NumberMemory',
    },
    {
      title: '터치 순서 암기',
      icon: '👆🏻',
      screen: 'GridMemory',
    },
    {
      title: '모양 순서 암기',
      icon: '⭐⚪🟧',
      screen: 'ShapeSequence',
    },
    {
      title: '심부름 암기',
      icon: '📝',
      screen: 'TaskSequence',
    },
    {
      title: '국기 맞추기',
      icon: '🇰🇷',
      screen: 'FlagQuiz',
    },
    {
      title: '수도 맞추기',
      icon: '🏛️',
      screen: 'CapitalQuiz',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>기억력 강화 훈련</Text>
      <View style={styles.grid}>
        {games.map((game, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gameButton}
            onPress={() => navigation.navigate(game.screen)}>
            <Text style={styles.gameIcon}>{game.icon}</Text>
            <Text style={styles.gameTitle}>{game.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  title: {
    fontSize:36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
  },
  gameButton: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#eee',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gameIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});

export default MainScreen;