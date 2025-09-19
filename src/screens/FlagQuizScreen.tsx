import React, {useMemo, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

type Country = {
  nameKo: string;
  nameEn: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  {nameKo: '대한민국', nameEn: 'South Korea', flag: '🇰🇷'},
  {nameKo: '일본', nameEn: 'Japan', flag: '🇯🇵'},
  {nameKo: '중국', nameEn: 'China', flag: '🇨🇳'},
  {nameKo: '미국', nameEn: 'United States', flag: '🇺🇸'},
  {nameKo: '캐나다', nameEn: 'Canada', flag: '🇨🇦'},
  {nameKo: '멕시코', nameEn: 'Mexico', flag: '🇲🇽'},
  {nameKo: '영국', nameEn: 'United Kingdom', flag: '🇬🇧'},
  {nameKo: '프랑스', nameEn: 'France', flag: '🇫🇷'},
  {nameKo: '독일', nameEn: 'Germany', flag: '🇩🇪'},
  {nameKo: '이탈리아', nameEn: 'Italy', flag: '🇮🇹'},
  {nameKo: '스페인', nameEn: 'Spain', flag: '🇪🇸'},
  {nameKo: '포르투갈', nameEn: 'Portugal', flag: '🇵🇹'},
  {nameKo: '네덜란드', nameEn: 'Netherlands', flag: '🇳🇱'},
  {nameKo: '벨기에', nameEn: 'Belgium', flag: '🇧🇪'},
  {nameKo: '스웨덴', nameEn: 'Sweden', flag: '🇸🇪'},
  {nameKo: '노르웨이', nameEn: 'Norway', flag: '🇳🇴'},
  {nameKo: '덴마크', nameEn: 'Denmark', flag: '🇩🇰'},
  {nameKo: '핀란드', nameEn: 'Finland', flag: '🇫🇮'},
  {nameKo: '러시아', nameEn: 'Russia', flag: '🇷🇺'},
  {nameKo: '호주', nameEn: 'Australia', flag: '🇦🇺'},
  {nameKo: '뉴질랜드', nameEn: 'New Zealand', flag: '🇳🇿'},
  {nameKo: '인도', nameEn: 'India', flag: '🇮🇳'},
  {nameKo: '태국', nameEn: 'Thailand', flag: '🇹🇭'},
  {nameKo: '베트남', nameEn: 'Vietnam', flag: '🇻🇳'},
  {nameKo: '말레이시아', nameEn: 'Malaysia', flag: '🇲🇾'},
  {nameKo: '인도네시아', nameEn: 'Indonesia', flag: '🇮🇩'},
  {nameKo: '필리핀', nameEn: 'Philippines', flag: '🇵🇭'},
  {nameKo: '싱가포르', nameEn: 'Singapore', flag: '🇸🇬'},
  {nameKo: '사우디아라비아', nameEn: 'Saudi Arabia', flag: '🇸🇦'},
  {nameKo: '터키', nameEn: 'Türkiye', flag: '🇹🇷'},
  {nameKo: '이집트', nameEn: 'Egypt', flag: '🇪🇬'},
  {nameKo: '남아프리카 공화국', nameEn: 'South Africa', flag: '🇿🇦'},
  {nameKo: '케냐', nameEn: 'Kenya', flag: '🇰🇪'},
  {nameKo: '나이지리아', nameEn: 'Nigeria', flag: '🇳🇬'},
  {nameKo: '브라질', nameEn: 'Brazil', flag: '🇧🇷'},
  {nameKo: '아르헨티나', nameEn: 'Argentina', flag: '🇦🇷'},
  {nameKo: '칠레', nameEn: 'Chile', flag: '🇨🇱'},
  {nameKo: '콜롬비아', nameEn: 'Colombia', flag: '🇨🇴'},
  {nameKo: '페루', nameEn: 'Peru', flag: '🇵🇪'},
  {nameKo: '아랍에미레이트', nameEn: 'United Arab Emirates', flag: '🇦🇪'},
  {nameKo: '튀니지', nameEn: 'Tunisia', flag: '🇹🇳'},
  {nameKo: '오스트리아', nameEn: 'Austria', flag: '🇦🇹'},
  {nameKo: '방글라데시', nameEn: 'Bangladesh', flag: '🇧🇩'},
  {nameKo: '불가리아', nameEn: 'Bulgaria', flag: '🇧🇬'},
  {nameKo: '바레인', nameEn: 'Bahrain', flag: '🇧🇭'},
  {nameKo: '볼리비아', nameEn: 'Bolivia', flag: '🇧🇴'},
  {nameKo: '부탄', nameEn: 'Bhutan', flag: '🇧🇹'},
  {nameKo: '벨라루스', nameEn: 'Belarus', flag: '🇧🇾'},
  {nameKo: '스위스', nameEn: 'Switzerland', flag: '🇨🇭'},
  {nameKo: '카메룬', nameEn: 'Cameroon', flag: '🇨🇲'},
  {nameKo: '쿠바', nameEn: 'Cuba', flag: '🇨🇺'},
  {nameKo: '코스타리카', nameEn: 'Costa Rica', flag: '🇨🇷'},
  {nameKo: '체코', nameEn: 'Czech Republic', flag: '🇨🇿'},
  {nameKo: '알제리', nameEn: 'Algeria', flag: '🇩🇿'},
  {nameKo: '에콰도르', nameEn: 'Ecuador', flag: '🇪🇨'},
  {nameKo: '에스토니아', nameEn: 'Estonia', flag: '🇪🇪'},
  {nameKo: '에티오피아', nameEn: 'Ethiopia', flag: '🇪🇹'},
  {nameKo: '피지', nameEn: 'Fiji', flag: '🇫🇯'},
  {nameKo: '미크로네시아', nameEn: 'Micronesia', flag: '🇫🇲'},
  {nameKo: '조지아', nameEn: 'Georgia', flag: '🇬🇪'},
  {nameKo: '가나', nameEn: 'Ghana', flag: '🇬🇭'},
  {nameKo: '그린란드', nameEn: 'Greenland', flag: '🇬🇱'},
  {nameKo: '그리스', nameEn: 'Greece', flag: '🇬🇷'},
  {nameKo: '과테말라', nameEn: 'Guatemala', flag: '🇬🇹'},
  {nameKo: '괌', nameEn: 'Guam', flag: '🇬🇺'},
  {nameKo: '홍콩', nameEn: 'Hong Kong', flag: '🇭🇰'},
  {nameKo: '대만', nameEn: 'Taiwan', flag: '🇹🇼'},
  {nameKo: '크로아티아', nameEn: 'Croatia', flag: '🇭🇷'},
  {nameKo: '헝가리', nameEn: 'Hungary', flag: '🇭🇺'},
  {nameKo: '인도네시아', nameEn: 'Indonesia', flag: '🇮🇩'},
  {nameKo: '아일랜드', nameEn: 'Ireland', flag: '🇮🇪'},
  {nameKo: '이스라엘', nameEn: 'Israel', flag: '🇮🇱'},
  {nameKo: '이라크', nameEn: 'Iraq', flag: '🇮🇶'},
  {nameKo: '이란', nameEn: 'Iran', flag: '🇮🇷'},
  {nameKo: '아이슬란드', nameEn: 'Iceland', flag: '🇮🇸'},
  {nameKo: '자메이카', nameEn: 'Jamaica', flag: '🇯🇲'},
  {nameKo: '요르단', nameEn: 'Jordan', flag: '🇯🇴'},
  {nameKo: '케냐', nameEn: 'Kenya', flag: '🇰🇪'},
  {nameKo: '캄보디아', nameEn: 'Cambodia', flag: '🇰🇭'},
  {nameKo: '쿠웨이트', nameEn: 'Kuwait', flag: '🇰🇼'},
  {nameKo: '카자흐스탄', nameEn: 'Kazakhstan', flag: '🇰🇿'},
  {nameKo: '키르키즈스탄', nameEn: 'Kyrgyzstan', flag: '🇰🇬'},
  {nameKo: '라오스', nameEn: 'Laos', flag: '🇱🇦'},
  {nameKo: '레바논', nameEn: 'Lebanon', flag: '🇱🇧'},
  {nameKo: '스리랑카', nameEn: 'Sri Lanka', flag: '🇱🇰'},
  {nameKo: '리투아니아', nameEn: 'Lithuania', flag: '🇱🇹'},
  {nameKo: '룩셈부르크', nameEn: 'Luxembourg', flag: '🇱🇺'},
  {nameKo: '라트비아', nameEn: 'Latvia', flag: '🇱🇻'},
  {nameKo: '리비아', nameEn: 'Libya', flag: '🇱🇾'},
  {nameKo: '모로코', nameEn: 'Morocco', flag: '🇲🇦'},
  {nameKo: '모나코', nameEn: 'Monaco', flag: '🇲🇨'},
  {nameKo: '몰도바', nameEn: 'Moldova', flag: '🇲🇩'},
  {nameKo: '몬테네그로', nameEn: 'Montenegro', flag: '🇲🇪'},
  {nameKo: '마다가스카르', nameEn: 'Madagascar', flag: '🇲🇬'},
  {nameKo: '마케도니아', nameEn: 'North Macedonia', flag: '🇲🇰'},
  {nameKo: '미얀마', nameEn: 'Myanmar', flag: '🇲🇲'},
  {nameKo: '몽골', nameEn: 'Mongolia', flag: '🇲🇳'},
  {nameKo: '마카오', nameEn: 'Macau', flag: '🇲🇴'},
  {nameKo: '모리셔스', nameEn: 'Mauritius', flag: '🇲🇺'},
  {nameKo: '몰디브', nameEn: 'Maldives', flag: '🇲🇻'},
  {nameKo: '말라위', nameEn: 'Malawi', flag: '🇲🇼'},
  {nameKo: '나이지리아', nameEn: 'Nigeria', flag: '🇳🇬'},
  {nameKo: '네팔', nameEn: 'Nepal', flag: '🇳🇵'},
  {nameKo: '오만', nameEn: 'Oman', flag: '🇴🇲'},
  {nameKo: '파나마', nameEn: 'Panama', flag: '🇵🇦'},
  {nameKo: '파푸아뉴기니', nameEn: 'Papua New Guinea', flag: '🇵🇬'},
  {nameKo: '파키스탄', nameEn: 'Pakistan', flag: '🇵🇰'},
  {nameKo: '폴란드', nameEn: 'Poland', flag: '🇵🇱'},
  {nameKo: '푸에르토리코', nameEn: 'Puerto Rico', flag: '🇵🇷'},
  {nameKo: '팔레스타인', nameEn: 'Palestine', flag: '🇵🇸'},
  {nameKo: '파라과이', nameEn: 'Paraguay', flag: '🇵🇾'},
  {nameKo: '카타르', nameEn: 'Qatar', flag: '🇶🇦'},
  {nameKo: '루마니아', nameEn: 'Romania', flag: '🇷🇴'},
  {nameKo: '세르비아', nameEn: 'Serbia', flag: '🇷🇸'},
  {nameKo: '르완다', nameEn: 'Rwanda', flag: '🇷🇼'},
  {nameKo: '사우디아라비아', nameEn: 'Saudi Arabia', flag: '🇸🇦'},
  {nameKo: '솔로몬제도', nameEn: 'Solomon Islands', flag: '🇸🇧'},
  {nameKo: '수단', nameEn: 'Sudan', flag: '🇸🇩'},
  {nameKo: '슬로베니아', nameEn: 'Slovenia', flag: '🇸🇮'},
  {nameKo: '슬로베키아', nameEn: 'Slovakia', flag: '🇸🇰'},
  {nameKo: '세네갈', nameEn: 'Senegal', flag: '🇸🇳'},
  {nameKo: '소말리아', nameEn: 'Somalia', flag: '🇸🇴'},
  {nameKo: '수리남', nameEn: 'Suriname', flag: '🇸🇷'},
  {nameKo: '남수단', nameEn: 'South Sudan', flag: '🇸🇸'},
  {nameKo: '엘살바도르', nameEn: 'El Salvador', flag: '🇸🇻'},
  {nameKo: '시리아', nameEn: 'Syria', flag: '🇸🇾'},
  {nameKo: '토고', nameEn: 'Togo', flag: '🇹🇬'},
  {nameKo: '동티모르', nameEn: 'Timor-Leste', flag:'🇹🇱'},
  {nameKo: '투르크메니스탄', nameEn: 'Turkmenistan', flag: '🇹🇲'},
  {nameKo: '타지키스탄', nameEn: 'Tajikistan', flag: '🇹🇯'},
  {nameKo: '탄자니아', nameEn: 'Tanzania', flag: '🇹🇿'},
  {nameKo: '우크라이나', nameEn: 'Ukraine', flag: '🇺🇦'},
  {nameKo: '우간다', nameEn: 'Uganda', flag: '🇺🇬'},
  {nameKo: '우즈베키스탄', nameEn: 'Uzbekistan', flag: '🇺🇿'},
  {nameKo: '바티칸시티', nameEn: 'Vatican City', flag: '🇻🇦'},
  {nameKo: '베네수엘라', nameEn: 'Venezuela', flag: '🇻🇪'},
  {nameKo: '예멘', nameEn: 'Yemen', flag: '🇾🇪'},
  {nameKo: '남아프리카공화국', nameEn: 'South Africa', flag: '🇿🇦'},
  {nameKo: '짐바브웨', nameEn: 'Zimbabwe', flag: '🇿🇼'},
  {nameKo: '스코틀랜드', nameEn: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿'},
  {nameKo: '웨일스', nameEn: 'Wales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿'},
  {nameKo: '잉글랜드', nameEn: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿'},
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

const FlagQuizScreen = () => {
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
        <Text style={styles.flag}>{current.flag}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isSelectedCorrect = feedback === 'correct' && isSelected && opt.nameEn === current.nameEn;
          const isSelectedWrong = feedback === 'wrong' && isSelected && opt.nameEn !== current.nameEn;
          let bg = '#fff';
          if (isSelectedCorrect) bg = '#b9dfbb';
          if (isSelectedWrong) bg = '#ef9a9a';
          return (
            <TouchableOpacity
              key={`${opt.nameEn}-${idx}`}
              style={[styles.option, {backgroundColor: bg}]}
              onPress={() => handleSelect(idx)}
              disabled={selectedIndex !== null}
            >
              <Text style={styles.optionText}>{opt.nameKo}</Text>
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
  flag: {
    fontSize: 120,
    marginBottom: 10,
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
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    color: '#333',
  },
});

export default FlagQuizScreen;


