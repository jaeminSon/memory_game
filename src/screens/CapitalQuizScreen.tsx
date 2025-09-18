import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

type Country = {
  nameKo: string; // 국가명 (한글)
  nameEn: string; // 국가명 (영문, 내부 비교용)
  capitalKo: string; // 수도명 (한글)
};

// 간단한 대표 국가 목록 (필요 시 추가 확장 가능)
const COUNTRIES: Country[] = [
  {nameKo: '대한민국', nameEn: 'South Korea', capitalKo: '서울'},
  {nameKo: '일본', nameEn: 'Japan', capitalKo: '도쿄'},
  {nameKo: '중국', nameEn: 'China', capitalKo: '베이징'},
  {nameKo: '미국', nameEn: 'United States', capitalKo: '워싱턴 D.C.'},
  {nameKo: '캐나다', nameEn: 'Canada', capitalKo: '오타와'},
  {nameKo: '멕시코', nameEn: 'Mexico', capitalKo: '멕시코시티'},
  {nameKo: '영국', nameEn: 'United Kingdom', capitalKo: '런던'},
  {nameKo: '프랑스', nameEn: 'France', capitalKo: '파리'},
  {nameKo: '독일', nameEn: 'Germany', capitalKo: '베를린'},
  {nameKo: '이탈리아', nameEn: 'Italy', capitalKo: '로마'},
  {nameKo: '스페인', nameEn: 'Spain', capitalKo: '마드리드'},
  {nameKo: '포르투갈', nameEn: 'Portugal', capitalKo: '리스본'},
  {nameKo: '네덜란드', nameEn: 'Netherlands', capitalKo: '암스테르담'},
  {nameKo: '벨기에', nameEn: 'Belgium', capitalKo: '브뤼셀'},
  {nameKo: '스웨덴', nameEn: 'Sweden', capitalKo: '스톡홀름'},
  {nameKo: '노르웨이', nameEn: 'Norway', capitalKo: '오슬로'},
  {nameKo: '덴마크', nameEn: 'Denmark', capitalKo: '코펜하겐'},
  {nameKo: '핀란드', nameEn: 'Finland', capitalKo: '헬싱키'},
  {nameKo: '러시아', nameEn: 'Russia', capitalKo: '모스크바'},
  {nameKo: '호주', nameEn: 'Australia', capitalKo: '캔버라'},
  {nameKo: '뉴질랜드', nameEn: 'New Zealand', capitalKo: '웰링턴'},
  {nameKo: '인도', nameEn: 'India', capitalKo: '뉴델리'},
  {nameKo: '태국', nameEn: 'Thailand', capitalKo: '방콕'},
  {nameKo: '베트남', nameEn: 'Vietnam', capitalKo: '하노이'},
  {nameKo: '말레이시아', nameEn: 'Malaysia', capitalKo: '쿠알라룸푸르'},
  {nameKo: '인도네시아', nameEn: 'Indonesia', capitalKo: '자카르타'},
  {nameKo: '필리핀', nameEn: 'Philippines', capitalKo: '마닐라'},
  {nameKo: '싱가포르', nameEn: 'Singapore', capitalKo: '싱가포르'},
  {nameKo: '사우디아라비아', nameEn: 'Saudi Arabia', capitalKo: '리야드'},
  {nameKo: '터키', nameEn: 'Türkiye', capitalKo: '앙카라'},
  {nameKo: '이집트', nameEn: 'Egypt', capitalKo: '카이로'},
  {nameKo: '남아프리카 공화국', nameEn: 'South Africa', capitalKo: '프리토리아'},
  {nameKo: '케냐', nameEn: 'Kenya', capitalKo: '나이로비'},
  {nameKo: '나이지리아', nameEn: 'Nigeria', capitalKo: '아부자'},
  {nameKo: '브라질', nameEn: 'Brazil', capitalKo: '브라질리아'},
  {nameKo: '아르헨티나', nameEn: 'Argentina', capitalKo: '부에노스아이레스'},
  {nameKo: '칠레', nameEn: 'Chile', capitalKo: '산티아고'},
  {nameKo: '콜롬비아', nameEn: 'Colombia', capitalKo: '보고타'},
  {nameKo: '페루', nameEn: 'Peru', capitalKo: '리마'},
  {nameKo: '아랍에미레이트', nameEn: 'United Arab Emirates', capitalKo: '아부다비'},
{nameKo: '오스트리아', nameEn: 'Austria', capitalKo: '비엔나'},
{nameKo: '불가리아', nameEn: 'Bulgaria', capitalKo: '소피아'},
{nameKo: '바레인', nameEn: 'Bahrain', capitalKo: '마나마'},
{nameKo: '스위스', nameEn: 'Switzerland', capitalKo: '베른'},
{nameKo: '코스타리카', nameEn: 'Costa Rica', capitalKo: '산호세'},
{nameKo: '체코', nameEn: 'Czech Republic', capitalKo: '프라하'},
{nameKo: '에스토니아', nameEn: 'Estonia', capitalKo: '탈린'},
{nameKo: '그리스', nameEn: 'Greece', capitalKo: '아테네'},
{nameKo: '대만', nameEn: 'Taiwan', capitalKo: '타이베이'},
{nameKo: '크로아티아', nameEn: 'Croatia', capitalKo: '자그레브'},
{nameKo: '헝가리', nameEn: 'Hungary', capitalKo: '부다페스트'},
{nameKo: '인도네시아', nameEn: 'Indonesia', capitalKo: '자카르타'},
{nameKo: '아일랜드', nameEn: 'Ireland', capitalKo: '더블린'},
{nameKo: '이스라엘', nameEn: 'Israel', capitalKo: '예루살렘'},
{nameKo: '아이슬란드', nameEn: 'Iceland', capitalKo: '레이캬비크'},
{nameKo: '요르단', nameEn: 'Jordan', capitalKo: '암만'},
{nameKo: '쿠웨이트', nameEn: 'Kuwait', capitalKo: '쿠웨이트시티'},
{nameKo: '카자흐스탄', nameEn: 'Kazakhstan', capitalKo: '누르술탄'},
{nameKo: '레바논', nameEn: 'Lebanon', capitalKo: '베이루트'},
{nameKo: '스리랑카', nameEn: 'Sri Lanka', capitalKo: '스리자야와르데네푸라코테'},
{nameKo: '리투아니아', nameEn: 'Lithuania', capitalKo: '빌뉴스'},
{nameKo: '라트비아', nameEn: 'Latvia', capitalKo: '리가'},
{nameKo: '모로코', nameEn: 'Morocco', capitalKo: '라바트'},
{nameKo: '몬테네그로', nameEn: 'Montenegro', capitalKo: '포드고리차'},
{nameKo: '모리셔스', nameEn: 'Mauritius', capitalKo: '포트루이스'},
{nameKo: '몰디브', nameEn: 'Maldives', capitalKo: '말레'},
{nameKo: '오만', nameEn: 'Oman', capitalKo: '무스카트'},
{nameKo: '파나마', nameEn: 'Panama', capitalKo: '파나마시티'},
{nameKo: '폴란드', nameEn: 'Poland', capitalKo: '바르샤바'},
{nameKo: '푸에르토리코', nameEn: 'Puerto Rico', capitalKo: '산후안'},
{nameKo: '카타르', nameEn: 'Qatar', capitalKo: '도하'},
{nameKo: '루마니아', nameEn: 'Romania', capitalKo: '부쿠레슈티'},
{nameKo: '세르비아', nameEn: 'Serbia', capitalKo: '베오그라드'},
{nameKo: '사우디아라비아', nameEn: 'Saudi Arabia', capitalKo: '리야드'},
{nameKo: '슬로베니아', nameEn: 'Slovenia', capitalKo: '류블랴나'},
{nameKo: '슬로바키아', nameEn: 'Slovakia', capitalKo: '브라티슬라바'},
{nameKo: '남아프리카공화국', nameEn: 'South Africa', capitalKo: '프리토리아'},
];

const pickDistinct = <T,>(arr: T[], count: number): T[] => {
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, Math.min(count, pool.length));
};

const CapitalQuizScreen = () => {
  const [current, setCurrent] = useState<Country>(() => {
    const [first] = pickDistinct(COUNTRIES, 1);
    return first;
  });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const loadNextQuestion = () => {
    const [next] = pickDistinct(COUNTRIES, 1);
    setCurrent(next);
  };

  const options = useMemo(() => {
    if (!current) return [] as Country[];
    const wrongs = pickDistinct(
      COUNTRIES.filter(c => c.nameEn !== current.nameEn),
      3,
    );
    const pool = [current, ...wrongs];
    // shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
  }, [current]);

  const handleSelect = (idx: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(idx);
    const isCorrect = options[idx].nameEn === current.nameEn;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      if (isCorrect) {
        loadNextQuestion();
      }
      setSelectedIndex(null);
      setFeedback(null);
    }, 700);
  };

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>문제를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.country}>{current.nameKo}의 수도는?</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isSelectedCorrect = feedback === 'correct' && isSelected && opt.nameEn === current.nameEn;
          const isSelectedWrong = feedback === 'wrong' && isSelected && opt.nameEn !== current.nameEn;
          let bg = '#fff';
          if (isSelectedCorrect) bg = '#e8f5e9';
          if (isSelectedWrong) bg = '#ffebee';
          return (
            <TouchableOpacity
              key={`${opt.nameEn}-${idx}`}
              style={[styles.option, {backgroundColor: bg}]}
              onPress={() => handleSelect(idx)}
              disabled={selectedIndex !== null}
            >
              <Text style={styles.optionText}>{opt.capitalKo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  country: {
    fontSize: 36,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  optionText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'center',
  },
  progress: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    color: '#333',
  },
});

export default CapitalQuizScreen;


