import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Trophy, ArrowRight, CheckCircle2, AlertCircle, Lightbulb, Flag, Timer, Info, X, Home } from 'lucide-react';

// --- HANGUL CONSTANTS & UTILS ---
const CHOSUNG = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const JUNGSUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
const JONGSUNG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

// Resource groups according to game rules
const RESOURCE_LABELS = {
  'gn': 'ㄱ/ㄴ', 'd': 'ㄷ', 'r': 'ㄹ', 'm': 'ㅁ', 'b': 'ㅂ', 's': 'ㅅ', 'o': 'ㅇ', 'j': 'ㅈ', 'ch': 'ㅊ', 'k': 'ㅋ', 't': 'ㅌ', 'p': 'ㅍ', 'h': 'ㅎ',
  'aou': 'ㅏ/ㅓ/ㅗ/ㅜ', 'yau': 'ㅑ/ㅕ/ㅛ/ㅠ', 'line': 'ㅡ/ㅣ'
};

// Target words for each length (2 to 8) - 검증된 사전 기반 데이터
const WORDS = {
  2: ["사과", "포도", "바다", "하늘", "우주", "나무", "의자", "책상", "시계", "가방", "안경", "모자", "신발", "양말", "바지", "치마", "침대", "거울", "사진", "우산", "기차", "버스", "택시", "학교", "식당", "병원", "은행", "공원", "피자", "치킨", "커피", "우유", "콜라", "사자", "여우", "토끼", "돼지", "녹차", "홍차", "과자", "사탕", "젤리", "연필", "칠판", "분필", "달력", "지갑", "휴지", "수건", "비누"],
  3: ["강아지", "고양이", "비행기", "자동차", "자전거", "도서관", "박물관", "미술관", "우체국", "경찰서", "소방서", "병아리", "코끼리", "원숭이", "호랑이", "컴퓨터", "라디오", "카메라", "모니터", "마우스", "키보드", "피아노", "다람쥐", "너구리", "두꺼비", "비둘기", "독수리", "앵무새", "거북이", "달팽이", "개구리", "지렁이", "잠자리", "메뚜기", "사마귀", "소나무", "벚나무", "무궁화", "개나리", "진달래", "민들레", "운동화", "선풍기", "에어컨", "청소기", "냉장고", "세탁기", "다리미", "정수기", "자판기", "햄스터", "마이크", "스피커", "이어폰", "텀블러", "쓰레기", "빗자루", "십자수", "계산기", "복사기", "프린터", "아파트", "경찰관", "소방관", "우체부", "요리사", "간호사", "선생님", "과학자", "미용사", "금메달", "은메달", "동메달"],
  4: ["고속도로", "일기예보", "자연재해", "사자성어", "스마트폰", "텔레비전", "비밀번호", "헬리콥터", "인공지능", "가상현실", "해바라기", "카네이션", "불가사리", "김치찌개", "된장찌개", "부대찌개", "비빔냉면", "감자튀김", "스파게티", "마카로니", "스테이크", "블루베리", "파인애플", "놀이공원", "고등학교", "초등학교", "종합병원", "전통시장", "벼룩시장", "연극배우", "영화감독", "신용카드", "체크카드", "교통카드", "운전면허", "여권사진", "스케치북", "다이어리", "직장동료", "일상생활", "형제자매", "동서남북", "춘하추동", "생년월일", "이구동성", "십시일반", "백과사전", "국회의원", "오토바이", "샌드위치", "사슴벌레", "플라스틱", "마요네즈", "프라이팬", "아스팔트", "콘크리트", "오피스텔", "대학원생", "유치원생", "할아버지", "할머니", "사과주스", "포도주스", "딸기우유", "초코우유", "포테이토", "주차요금", "고객센터", "서비스업", "평양냉면", "와이파이", "삯바느질"],
  5: ["엘리베이터", "전자레인지", "아이스크림", "이산화탄소", "일산화탄소", "콜레스테롤", "초미세먼지", "기상캐스터", "사회복지사", "헌법재판소", "최저임금제", "근로기준법", "신용불량자", "다큐멘터리", "내비게이션", "주민등록증", "프로그래머", "국회의사당", "고속터미널", "버스정류장", "국민연금법", "유치원교사", "올림픽공원", "국립박물관", "국립도서관", "국립미술관", "시립도서관", "광화문광장", "독립기념관", "이순신장군", "안중근의사", "유관순열사", "대중교통비", "대학교수진", "가정폭력법", "학교폭력법", "동물보호법", "농산물시장", "수산물시장", "종합운동장", "해양경찰청", "국가정보원", "보건복지부", "여성가족부", "국토교통부", "해양수산부", "행정안전부", "프로게이머", "오스트리아"],
  6: ["주민등록번호", "프레젠테이션", "오리엔테이션", "엔터테인먼트", "데이터베이스", "스테인리스강", "로스앤젤레스", "샌프란시스코", "인스턴트식품", "우즈베키스탄", "대한적십자사", "지방자치단체", "국민건강보험", "어린이대공원", "세종문화회관", "근로복지공단", "소비자보호원", "대통령비서실", "항공우주산업", "농림축산식품", "운전면허시험", "대학입학시험", "대리운전기사", "택시운전기사", "한국장학재단", "에스컬레이터", "아르바이트생", "가상현실게임", "소셜네트워크", "알리오올리오", "올림픽경기장", "월드컵경기장", "고등학교교사", "어린이집교사", "유치원선생님", "초등학교학생", "고등학교학생", "대학교신입생", "개인정보유출", "음주운전단속", "지하철노선도", "불법주차단속"],
  7: ["국립중앙박물관", "국립중앙도서관", "국가지정문화재", "대한상공회의소", "국립현대미술관", "국립해양박물관", "한국수자원공사", "어린이보호구역", "청소년보호구역", "여성안심귀갓길", "대중교통환승제", "기초생활수급자", "개인정보보호법", "부산국제영화제", "독립유공자유족", "국가유공자유족", "장애인복지시설", "노인요양보호사", "방송통신위원회", "고속버스터미널", "시외버스터미널", "토마토스파게티", "블루투스이어폰", "과속단속카메라", "고속도로휴게소", "스마트폰케이스", "클라우드서비스", "자율주행자동차", "크리스마스트리"],
  8: ["대한민국임시정부", "대학수학능력시험", "국민건강보험공단", "한국산업안전공단", "학교폭력예방센터", "아이스아메리카노", "고속도로톨게이트", "남아프리카공화국", "초미세먼지주의보", "무선인터넷공유기"],
  9: ["중앙선거관리위원회", "초등학교생활기록부", "한국교육과정평가원", "한국사능력검정시험", "컴퓨터활용능력시험", "정보처리기사자격증", "워드프로세서자격증", "신종코로나바이러스", "개인정보보호위원회", "건강보험심사평가원", "고등학교생활기록부", "방송통신심의위원회", "빅데이터분석전문가", "가상현실시뮬레이션", "수도권순환고속도로"]
};

function getJamoCost(jamo) {
  const map = {
    'ㄱ': { gn: 1 }, 'ㄴ': { gn: 1 }, 'ㄲ': { gn: 2 },
    'ㄷ': { d: 1 }, 'ㄸ': { d: 2 }, 'ㄹ': { r: 1 }, 'ㅁ': { m: 1 },
    'ㅂ': { b: 1 }, 'ㅃ': { b: 2 }, 'ㅅ': { s: 1 }, 'ㅆ': { s: 2 },
    'ㅇ': { o: 1 }, 'ㅈ': { j: 1 }, 'ㅉ': { j: 2 }, 'ㅊ': { ch: 1 }, 'ㅋ': { k: 1 }, 'ㅌ': { t: 1 }, 'ㅍ': { p: 1 }, 'ㅎ': { h: 1 },
    'ㄳ': { gn: 1, s: 1 }, 'ㄵ': { gn: 1, j: 1 }, 'ㄶ': { gn: 1, h: 1 },
    'ㄺ': { r: 1, gn: 1 }, 'ㄻ': { r: 1, m: 1 }, 'ㄼ': { r: 1, b: 1 },
    'ㄽ': { r: 1, s: 1 }, 'ㄾ': { r: 1, t: 1 }, 'ㄿ': { r: 1, p: 1 }, 'ㅀ': { r: 1, h: 1 }, 'ㅄ': { b: 1, s: 1 },
    'ㅏ': { aou: 1 }, 'ㅓ': { aou: 1 }, 'ㅗ': { aou: 1 }, 'ㅜ': { aou: 1 },
    'ㅑ': { yau: 1 }, 'ㅕ': { yau: 1 }, 'ㅛ': { yau: 1 }, 'ㅠ': { yau: 1 },
    'ㅡ': { line: 1 }, 'ㅣ': { line: 1 },
    'ㅐ': { aou: 1, line: 1 }, 'ㅔ': { aou: 1, line: 1 }, 'ㅚ': { aou: 1, line: 1 }, 'ㅟ': { aou: 1, line: 1 },
    'ㅒ': { yau: 1, line: 1 }, 'ㅖ': { yau: 1, line: 1 },
    'ㅘ': { aou: 2 }, 'ㅝ': { aou: 2 }, 'ㅙ': { aou: 2, line: 1 }, 'ㅞ': { aou: 2, line: 1 }, 'ㅢ': { line: 2 }
  };
  return map[jamo] || {};
}

function decompose(char) {
  if (char === ' ') return [];
  const charCode = char.charCodeAt(0);
  if (charCode < 44032 || charCode > 55203) return [char];
  const offset = charCode - 44032;
  const choIdx = Math.floor(offset / 588);
  const jungIdx = Math.floor((offset % 588) / 28);
  const jongIdx = offset % 28;
  const result = [CHOSUNG[choIdx], JUNGSUNG[jungIdx]];
  if (jongIdx > 0) result.push(JONGSUNG[jongIdx]);
  return result;
}

function calculatePool(word) {
  const pool = {};
  for (const char of word) {
    const jamos = decompose(char);
    for (const jamo of jamos) {
      const cost = getJamoCost(jamo);
      for (const [res, count] of Object.entries(cost)) {
        pool[res] = (pool[res] || 0) + count;
      }
    }
  }
  return pool;
}

function validateCost(guess, targetPool) {
  const currentCost = calculatePool(guess);
  for (const [res, count] of Object.entries(currentCost)) {
    if ((targetPool[res] || 0) < count) {
      return false;
    }
  }
  return true;
}

function getFeedback(guess, target) {
  const feedback = [];
  const guessArr = guess.padEnd(target.length, ' ').split('').slice(0, target.length);
  const targetArr = target.split('');
  
  const exactMatches = guessArr.map((g, i) => g === targetArr[i]);
  let targetLeft = targetArr.filter((t, i) => !exactMatches[i]);

  guessArr.forEach((g, i) => {
    if (exactMatches[i]) {
      feedback.push({ syllable: g, color: 'G' });
    } else {
      const idx = targetLeft.indexOf(g);
      if (idx !== -1) {
        feedback.push({ syllable: g, color: 'Y' });
        targetLeft.splice(idx, 1);
      } else {
        feedback.push({ syllable: g, color: 'R' });
      }
    }
  });
  
  const isWin = exactMatches.every(m => m);
  return { feedback, isWin };
}

// --- SUBCOMPONENTS ---

const TrafficLight = ({ color }) => {
  let lightClass = "bg-[#111]";
  let shadowClass = "";
  
  if (color === 'G') {
    lightClass = "bg-[#00ff44]";
    shadowClass = "shadow-[0_0_20px_#00ff44]";
  } else if (color === 'Y') {
    lightClass = "bg-[#ffcc00]";
    shadowClass = "shadow-[0_0_20px_#ffcc00]";
  } else if (color === 'R') {
    lightClass = "bg-[#ff3333]";
    shadowClass = "shadow-[0_0_20px_#ff3333]";
  }

  return (
    <div className="w-12 h-12 bg-[#1a1a1a] border-2 border-[#333] rounded-lg flex items-center justify-center mb-4 relative shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] mx-auto">
      <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/10 rounded-full blur-[1px] transform rotate-[-45deg] z-10"></div>
      <div className={`w-8 h-8 rounded-full ${lightClass} ${shadowClass} transition-all duration-500`}></div>
    </div>
  );
};

const CyberSlot = ({ char, isEmpty }) => {
  return (
    <div className={`relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center text-4xl sm:text-5xl font-black rounded-2xl border-4 transition-all duration-300
      ${isEmpty 
        ? 'border-[#4b4bdf] bg-transparent shadow-[0_0_15px_rgba(75,75,223,0.5),inset_0_0_15px_rgba(75,75,223,0.3)] text-transparent' 
        : 'border-[#4b4bdf] bg-[#e5e7eb] text-[#111] shadow-[0_0_20px_rgba(75,75,223,0.8),inset_0_0_10px_rgba(0,0,0,0.2)]'
      }`}
    >
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white/50 rounded-tl-xl"></div>
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white/50 rounded-br-xl"></div>
      {char}
    </div>
  );
};

const PlayerIcon = ({ type, isActive, label }) => {
  const color = type === 0 ? '#ff6b6b' : '#4ade80';
  return (
    <div className={`flex flex-col items-center transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`} style={{ filter: isActive ? `drop-shadow(0 0 15px ${color})` : 'none' }}>
      <svg width="60" height="80" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="23" r="18" stroke={color} strokeWidth="6" fill="#1a1c23" />
        <path d="M15 115 V 65 Q 15 45 50 45 Q 85 45 85 65 V 115" stroke={color} strokeWidth="6" fill="#1a1c23" strokeLinecap="round" />
        <text x="50" y="95" fill={color} fontSize="32" fontWeight="900" textAnchor="middle" style={{ textShadow: `0 0 8px ${color}` }}>{label}</text>
      </svg>
    </div>
  );
};

const CrookedTitle = ({ text, size = 'large' }) => {
  const chars = text.split('');
  const rotations = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -2];
  const isSmall = size === 'small';

  return (
    <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
      {chars.map((char, i) => {
        if (char === ' ') return <div key={i} className={isSmall ? "w-2" : "w-4 sm:w-6"}></div>;
        return (
          <div key={i}
               className={`relative flex items-center justify-center font-black transition-transform hover:scale-110 
                 border-[#4b4bdf] bg-[#e5e7eb] text-[#111]
                 ${isSmall 
                   ? 'w-7 h-9 text-lg border-2 rounded-md shadow-[0_0_8px_rgba(75,75,223,0.4)]' 
                   : 'w-12 h-16 sm:w-16 sm:h-20 text-3xl sm:text-5xl border-4 rounded-xl shadow-[0_0_15px_rgba(75,75,223,0.6)]'}`}
               style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}>
            <div className="absolute -top-0.5 -left-0.5 w-2 h-2 border-t-2 border-l-2 border-white/50 rounded-tl-sm"></div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 border-b-2 border-r-2 border-white/50 rounded-br-sm"></div>
            {char}
          </div>
        );
      })}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState('TITLE'); 
  const [showRules, setShowRules] = useState(false);
  
  // Level & Score State
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [level, setLevel] = useState(1); 
  const [wins, setWins] = useState([0, 0]); // P1, P2 단어 맞춘 개수
  const wordLength = level + 1;
  const targetWins = level + 4; // Lv1: 5개, Lv2: 6개...

  const [turn, setTurn] = useState(0); 
  const [targetWord, setTargetWord] = useState('');
  const [targetPool, setTargetPool] = useState({});
  const [shuffledPool, setShuffledPool] = useState([]);
  const [hintsLeft, setHintsLeft] = useState([5, 5]); 
  const [turnHints, setTurnHints] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(60);
  const [guessInput, setGuessInput] = useState('');
  const [history, setHistory] = useState([]); 
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const inputRef = useRef(null);

  const initWord = (lvl = level) => {
    const wLen = lvl + 1;
    const wordList = WORDS[wLen];
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
    setTargetWord(selectedWord);
    
    const pool = calculatePool(selectedWord);
    setTargetPool(pool);
    
    const poolArr = Object.entries(pool).map(([res, total]) => ({ res, total }));
    setShuffledPool(poolArr.sort(() => Math.random() - 0.5));

    setHistory([]);
    setTurn(0);
    setHintsLeft([5, 5]); // 새로운 단어마다 힌트 5개씩 초기화 (난이도 완화)
    setTurnHints([]);
    setScreen('READY');
  };

  const startLevel = (lvl) => {
    setLevel(lvl);
    setWins([0, 0]);
    initWord(lvl);
  };

  useEffect(() => {
    let timer;
    if (screen === 'PLAY' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (screen === 'PLAY' && timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  useEffect(() => {
    if (screen === 'PLAY' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [screen]);

  const handleTimeUp = () => submitGuess(true);

  const handleHint = () => {
    if (hintsLeft[turn] <= 0) return;
    const availableIndices = Array.from({length: targetWord.length}, (_, i) => i)
      .filter(i => !turnHints.includes(i));
    if (availableIndices.length === 0) return;
    const randomIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setTurnHints(prev => [...prev, randomIdx]);
    const newHints = [...hintsLeft];
    newHints[turn] -= 1;
    setHintsLeft(newHints);
  };

  const handleGiveUp = () => setScreen('GAVE_UP');

  const submitGuess = (isAuto = false) => {
    let finalGuess = guessInput;
    if (isAuto && finalGuess.trim() === '') {
      finalGuess = ' '.repeat(targetWord.length);
    }

    if (!isAuto) {
      if (finalGuess.length !== targetWord.length && finalGuess.trim().length !== targetWord.length) return;
      if (!validateCost(finalGuess, targetPool)) return;
      if (!/^[\uAC00-\uD7A3\s]*$/.test(finalGuess)) return;
    }

    const { feedback, isWin } = getFeedback(finalGuess, targetWord);
    const resultObj = { player: turn, guess: finalGuess, feedback, isWin };
    
    setHistory(prev => [...prev, resultObj]);
    setCurrentFeedback(resultObj);
    setScreen('RESULT');
  };

  const nextTurn = () => {
    if (currentFeedback?.isWin) {
      const newWins = [...wins];
      newWins[turn] += 1;
      setWins(newWins);
      
      if (newWins[turn] >= targetWins) {
        setScreen('LEVEL_CLEAR');
      } else {
        setScreen('WORD_CLEAR');
      }
    } else {
      setTurn(turn === 0 ? 1 : 0);
      setScreen('READY');
    }
  };

  const startTurn = () => {
    setTimeLeft(60);
    setGuessInput('');
    setTurnHints([]); 
    setScreen('PLAY');
  };

  const currentCost = useMemo(() => calculatePool(guessInput), [guessInput]);
  const isInputValid = validateCost(guessInput, targetPool) && /^[\uAC00-\uD7A3\s]*$/.test(guessInput);

  return (
    <>
      <style>{`
        .cyber-grid {
          background-color: #0f1115;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .cyber-text-shadow {
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
      `}</style>
      
      {/* 규칙 모달 창 */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1c23] border-2 border-[#4b4bdf] shadow-[0_0_30px_rgba(75,75,223,0.3)] rounded-2xl p-6 md:p-8 max-w-lg w-full relative">
            <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
              <X size={28} />
            </button>
            <h2 className="text-2xl font-black text-[#4b4bdf] mb-6 tracking-widest cyber-text-shadow flex items-center gap-2">
              <Info size={24} /> 게임 규칙
            </h2>
            
            <div className="space-y-4 text-gray-300 font-medium text-sm md:text-base leading-relaxed h-[60vh] overflow-y-auto pr-2">
              <div>
                <span className="text-white font-black text-lg">1. 게임 목표</span><br/>
                주어진 자음/모음 타일을 조합하여 숨겨진 단어를 찾아내세요. 원하는 레벨(글자 수)을 선택하여 진행합니다.
              </div>
              <div>
                <span className="text-white font-black text-lg">2. 타일 조합</span><br/>
                타일은 <span className="text-[#00ff44]">회전 및 결합</span>이 가능합니다.<br/>
                <span className="text-gray-400 text-sm">(예: 'ㅏ'를 돌려 'ㅗ'로, 'ㅡ'와 'ㅣ'를 합쳐 'ㅢ'로 사용)</span>
              </div>
              <div>
                <span className="text-white font-black text-lg">3. 판정 시스템</span><br/>
                입력한 단어의 <span className="text-white font-bold">글자(음절) 단위</span>로 신호등이 켜집니다.
                <ul className="mt-2 space-y-2 ml-1">
                  <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00ff44] shadow-[0_0_8px_#00ff44]"></div> <span className="text-[#00ff44]">초록</span> : 글자와 위치 모두 정답</li>
                  <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ffcc00] shadow-[0_0_8px_#ffcc00]"></div> <span className="text-[#ffcc00]">노랑</span> : 글자는 있지만 위치가 틀림</li>
                  <li className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ff3333] shadow-[0_0_8px_#ff3333]"></div> <span className="text-[#ff3333]">빨강</span> : 해당 글자가 정답에 없음</li>
                </ul>
              </div>
              <div>
                <span className="text-white font-black text-lg">4. 정보의 비대칭</span><br/>
                상대방 차례일 때는 상대가 입력한 정확한 글자를 볼 수 없으며, <span className="text-[#ffcc00]">색상별 불빛 개수만 공개</span>됩니다.
              </div>
              <div>
                <span className="text-white font-black text-lg">5. 레벨 및 승리 조건</span><br/>
                레벨마다 먼저 맞혀야 하는 <span className="text-[#00ff44]">목표 단어 개수</span>가 다릅니다. (예: Lv.1은 5개, Lv.2는 6개 등)<br/>
                목표 개수를 먼저 채우는 플레이어가 해당 레벨의 승자가 됩니다!
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen cyber-grid text-gray-100 font-sans flex flex-col items-center selection:bg-[#4b4bdf] selection:text-white pb-10">
        
        {/* HEADER */}
        <div className="w-full max-w-3xl p-4 flex justify-between items-center bg-black/60 border-b border-gray-800 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            {screen !== 'TITLE' && (
              <button 
                onClick={() => setScreen('TITLE')} 
                className="p-2 bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all border border-gray-700 shadow-sm" 
                title="메인 화면으로"
              >
                <Home size={20} />
              </button>
            )}
            <CrookedTitle text="단어 맞추기 게임" size="small" />
          </div>
          <div className="flex items-center gap-6 font-bold text-sm hidden sm:flex">
            {screen !== 'TITLE' && <span className="text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">목표: {targetWins}개</span>}
            <div className={`flex items-center gap-2 ${turn === 0 ? 'text-[#ff6b6b] drop-shadow-[0_0_8px_#ff6b6b]' : 'text-gray-500'}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span> P1 : {wins[0]} / {targetWins}
            </div>
            <div className={`flex items-center gap-2 ${turn === 1 ? 'text-[#4ade80] drop-shadow-[0_0_8px_#4ade80]' : 'text-gray-500'}`}>
              <span className="w-2 h-2 rounded-full bg-current"></span> P2 : {wins[1]} / {targetWins}
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl flex-1 flex flex-col relative px-4">
          
          {/* === TITLE SCREEN === */}
          {screen === 'TITLE' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in duration-500 py-10">
              <div className="mb-10 flex flex-col gap-3">
                <CrookedTitle text="단어 맞추기" />
                <CrookedTitle text="게임" />
              </div>

              {/* 레벨 선택기 */}
              <div className="bg-black/50 p-6 rounded-2xl border border-gray-800 shadow-xl w-full max-w-lg mb-8 backdrop-blur-sm">
                <h3 className="text-lg font-black text-gray-400 mb-4 tracking-widest">진행할 레벨 선택</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                    <button key={l} onClick={() => setSelectedLevel(l)}
                      className={`py-3 rounded-lg font-black transition-all border-2 flex flex-col items-center justify-center ${selectedLevel === l ? 'border-[#4b4bdf] bg-[#4b4bdf]/20 text-[#4b4bdf] shadow-[0_0_15px_rgba(75,75,223,0.5)] scale-105' : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500 hover:text-gray-200'}`}>
                      <span>Lv.{l}</span>
                      <span className="text-xs font-bold opacity-80 mt-1">{l+1}글자</span>
                    </button>
                  ))}
                </div>
                <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-300 font-bold tracking-wide">
                    승리 조건: 먼저 <span className="text-[#00ff44] text-xl px-1">{selectedLevel + 4}개</span>의 단어 맞추기!
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <button onClick={() => setShowRules(true)} className="flex-1 bg-gray-800/80 border-2 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 px-6 py-4 rounded-xl font-black text-lg transition-all duration-300 tracking-widest flex justify-center items-center gap-2 shadow-lg">
                  <Info size={24} /> 규칙 설명
                </button>
                <button onClick={() => startLevel(selectedLevel)} className="flex-[2] bg-transparent border-2 border-[#4b4bdf] text-[#4b4bdf] hover:bg-[#4b4bdf] hover:text-white hover:shadow-[0_0_20px_#4b4bdf] px-8 py-4 rounded-xl font-black text-xl transition-all duration-300 tracking-widest shadow-lg">
                  GAME START
                </button>
              </div>
            </div>
          )}

          {/* === READY SCREEN === */}
          {screen === 'READY' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in duration-300">
              <div className="bg-[#1a1c23]/80 p-10 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-gray-800 w-full max-w-lg backdrop-blur-sm">
                <h3 className="text-[#4b4bdf] font-black mb-2 tracking-widest text-lg drop-shadow-[0_0_5px_#4b4bdf]">LEVEL {level} ({wordLength}글자)</h3>
                <h2 className="text-4xl font-black mb-8 text-white tracking-widest">
                  <span className={turn === 0 ? "text-[#ff6b6b]" : "text-[#4ade80]"}>{turn === 0 ? '선' : '후'}</span> 플레이어 대기
                </h2>
                
                {history.length > 0 && (
                  <div className="mb-10 p-5 bg-black/50 rounded-2xl border border-gray-700">
                    <p className="text-sm font-bold text-gray-400 mb-4 tracking-wider">상대방의 이전 결과</p>
                    <div className="flex flex-col gap-3">
                      {history.filter(h => h.player !== turn).slice(-1).map((h, i) => {
                        const gCount = h.feedback.filter(f => f.color === 'G').length;
                        const yCount = h.feedback.filter(f => f.color === 'Y').length;
                        const rCount = h.feedback.filter(f => f.color === 'R').length;
                        return (
                          <div key={i} className="flex justify-center gap-6 text-lg font-black tracking-widest">
                            <span className="flex items-center gap-2 text-[#00ff44] drop-shadow-[0_0_8px_#00ff44]"><div className="w-4 h-4 rounded-full bg-[#00ff44]"></div> {gCount}</span>
                            <span className="flex items-center gap-2 text-[#ffcc00] drop-shadow-[0_0_8px_#ffcc00]"><div className="w-4 h-4 rounded-full bg-[#ffcc00]"></div> {yCount}</span>
                            <span className="flex items-center gap-2 text-[#ff3333] drop-shadow-[0_0_8px_#ff3333]"><div className="w-4 h-4 rounded-full bg-[#ff3333]"></div> {rCount}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <p className="text-gray-500 mb-8 font-medium tracking-wide">준비가 완료되면 버튼을 눌러주세요.<br/>(제한시간 1분)</p>
                <button onClick={startTurn} className="w-full bg-[#e5e7eb] hover:bg-white text-black px-6 py-4 rounded-xl font-black text-xl transition-all active:scale-95 tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  차례 시작
                </button>
              </div>
            </div>
          )}

          {/* === PLAY SCREEN === */}
          {screen === 'PLAY' && (
            <div className="flex-1 flex flex-col pt-10 animate-in fade-in duration-300">
              
              <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-10 w-full max-w-3xl mx-auto px-2">
                {Array.from({ length: targetWord.length }).map((_, i) => {
                  const isHinted = turnHints.includes(i);
                  const displayChar = isHinted ? targetWord[i] : (guessInput[i] || '');
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <TrafficLight color={null} />
                      <CyberSlot char={displayChar} isEmpty={!displayChar && !isHinted} />
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-center items-center gap-8 mb-10">
                <PlayerIcon type={0} isActive={turn === 0} label="선" />
                
                <div className="flex flex-col items-center justify-center">
                  <Timer size={40} className={`mb-2 ${timeLeft <= 10 ? 'text-[#ff3333] animate-pulse drop-shadow-[0_0_10px_#ff3333]' : 'text-white'}`} />
                  <div className={`font-black text-3xl tracking-widest ${timeLeft <= 10 ? 'text-[#ff3333] drop-shadow-[0_0_10px_#ff3333]' : 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}>
                    1min
                  </div>
                  <div className="font-bold text-gray-400 mt-1">{timeLeft}s</div>
                </div>

                <PlayerIcon type={1} isActive={turn === 1} label="후" />
              </div>

              <div className="mb-6 relative w-full max-w-2xl mx-auto">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value.slice(0, targetWord.length))}
                  onKeyDown={(e) => e.key === 'Enter' && isInputValid && guessInput.length === targetWord.length && submitGuess()}
                  placeholder="정답을 입력하세요"
                  className={`w-full text-center text-2xl p-4 rounded-xl border-2 outline-none transition-all tracking-[0.3em] font-black ${!isInputValid ? 'border-[#ff3333] bg-[#ff3333]/10 text-[#ff3333] shadow-[0_0_15px_rgba(255,51,51,0.3)]' : 'border-gray-700 focus:border-[#4b4bdf] bg-black/50 text-white focus:shadow-[0_0_15px_rgba(75,75,223,0.5)]'}`}
                  autoComplete="off"
                  spellCheck="false"
                />
                {!isInputValid && (
                  <p className="text-[#ff3333] text-sm mt-3 text-center flex items-center justify-center gap-1 font-bold tracking-wide">
                    <AlertCircle size={16}/> 사용할 수 없는 타일 조합입니다
                  </p>
                )}
              </div>

              <div className="flex gap-4 justify-center mb-8 w-full max-w-2xl mx-auto">
                <button onClick={handleHint} disabled={hintsLeft[turn] === 0 || turnHints.length === targetWord.length} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-yellow-400 rounded-xl font-black disabled:opacity-50 transition-all active:scale-95 tracking-widest">
                  <Lightbulb size={20} /> 힌트 ({hintsLeft[turn]})
                </button>
                <button onClick={handleGiveUp} className="flex-1 flex justify-center items-center gap-2 px-4 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-300 rounded-xl font-black transition-all active:scale-95 tracking-widest">
                  <Flag size={20} /> 포기
                </button>
                <button onClick={() => submitGuess()} disabled={!isInputValid || (guessInput.length !== targetWord.length && guessInput.trim().length !== targetWord.length)} className="flex-[2] flex justify-center items-center gap-2 px-6 py-4 bg-[#4b4bdf] hover:bg-[#3a3ab0] disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-black transition-all active:scale-95 tracking-widest shadow-[0_0_15px_rgba(75,75,223,0.4)] disabled:shadow-none">
                  등록 <ArrowRight size={20} />
                </button>
              </div>

              <div className="w-full max-w-2xl mx-auto mb-auto">
                <h3 className="text-sm font-black text-gray-500 mb-4 text-center tracking-[0.2em]">AVAILABLE TILES</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {shuffledPool.map(({ res, total }, idx) => {
                    const used = currentCost[res] || 0;
                    const remain = total - used;
                    const isOver = remain < 0;
                    return (
                      <div key={`${res}-${idx}`} className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isOver ? 'border-[#ff3333] bg-[#ff3333]/20 text-[#ff3333]' : remain === 0 ? 'border-gray-800 bg-gray-900/50 text-gray-600' : 'border-gray-700 bg-black/60 text-gray-300'}`}>
                        <span className="font-black text-lg">{RESOURCE_LABELS[res]}</span>
                        <span className={`text-xs font-black px-1.5 py-0.5 rounded ${isOver ? 'bg-[#ff3333] text-white' : remain === 0 ? 'bg-gray-800 text-gray-500' : 'bg-gray-700 text-white'}`}>
                          {remain}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* === RESULT SCREEN === */}
          {screen === 'RESULT' && currentFeedback && (
            <div className="flex-1 flex flex-col justify-center items-center pt-10 animate-in slide-in-from-bottom-8 duration-500">
              
              <h2 className="text-3xl sm:text-4xl font-black mb-12 tracking-[0.2em] cyber-text-shadow">
                {currentFeedback.isWin ? <span className="text-[#00ff44]">정답 확인 완료</span> : <span className="text-white">판정 결과</span>}
              </h2>

              <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-16 px-2">
                {currentFeedback.feedback.map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <TrafficLight color={item.color} />
                    <CyberSlot char={item.syllable} isEmpty={false} />
                  </div>
                ))}
              </div>

              <button onClick={nextTurn} className="w-full max-w-sm bg-white text-black hover:bg-gray-200 px-8 py-5 rounded-xl font-black text-xl transition-all active:scale-95 tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                {currentFeedback.isWin ? '다음 진행' : '턴 종료'}
              </button>
            </div>
          )}

          {/* === GAVE UP SCREEN === */}
          {screen === 'GAVE_UP' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-300">
              <Flag size={60} className="text-gray-600 mb-8" />
              <h2 className="text-3xl font-black mb-4 text-white tracking-widest">단어 포기</h2>
              
              <div className="bg-black/50 p-8 rounded-2xl border border-gray-800 w-full max-w-sm mb-12">
                <p className="text-sm font-bold text-gray-500 mb-3 tracking-widest">정답 단어</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#ff3333] tracking-widest drop-shadow-[0_0_10px_rgba(255,51,51,0.5)] break-words break-all">{targetWord}</p>
              </div>

              <button onClick={() => initWord(level)} className="w-full max-w-sm bg-white text-black hover:bg-gray-200 px-8 py-5 rounded-xl font-black text-xl transition-all active:scale-95 tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                새로운 단어 받기
              </button>
            </div>
          )}

          {/* === WORD CLEAR SCREEN (단어 맞춤) === */}
          {screen === 'WORD_CLEAR' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-300">
              <CheckCircle2 size={80} className="text-[#00ff44] mb-8 drop-shadow-[0_0_15px_#00ff44]" />
              <h2 className="text-4xl font-black mb-4 text-white tracking-widest">정답입니다!</h2>
              
              <div className="bg-black/50 p-8 rounded-2xl border border-gray-800 w-full max-w-sm mb-12">
                <p className="text-sm font-bold text-gray-500 mb-3 tracking-widest">정답 단어</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black text-[#4b4bdf] tracking-widest drop-shadow-[0_0_15px_rgba(75,75,223,0.8)] break-words break-all">{targetWord}</p>
              </div>

              <button onClick={() => initWord(level)} className="w-full max-w-sm bg-[#4b4bdf] hover:bg-[#3a3ab0] text-white px-8 py-5 rounded-xl font-black text-xl transition-all active:scale-95 tracking-widest shadow-[0_0_20px_rgba(75,75,223,0.4)]">
                다음 단어 풀기
              </button>
            </div>
          )}

          {/* === LEVEL CLEAR SCREEN (최종 승리) === */}
          {screen === 'LEVEL_CLEAR' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-in zoom-in duration-500 py-10">
              <Trophy size={100} className="text-[#ffcc00] mb-8 drop-shadow-[0_0_25px_#ffcc00]" />
              <h2 className="text-5xl font-black mb-4 text-white tracking-[0.2em] cyber-text-shadow">LEVEL {level} CLEAR!</h2>
              <p className="text-2xl font-black text-[#00ff44] mb-12 tracking-widest drop-shadow-[0_0_10px_#00ff44]">
                {wins[0] >= targetWins ? '플레이어 1(선) 레벨 승리!' : '플레이어 2(후) 레벨 승리!'}
              </p>
              
              <div className="flex gap-6 mb-12 w-full max-w-md justify-center">
                <div className={`flex-1 p-6 rounded-2xl border-2 bg-black/50 ${wins[0] >= targetWins ? 'border-[#ff6b6b] shadow-[0_0_20px_rgba(255,107,107,0.3)]' : 'border-gray-800'}`}>
                  <p className="text-sm font-black text-gray-500 mb-2 tracking-widest">P1 (선)</p>
                  <p className={`text-4xl font-black ${wins[0] >= targetWins ? 'text-[#ff6b6b]' : 'text-white'}`}>{wins[0]}</p>
                </div>
                <div className={`flex-1 p-6 rounded-2xl border-2 bg-black/50 ${wins[1] >= targetWins ? 'border-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'border-gray-800'}`}>
                  <p className="text-sm font-black text-gray-500 mb-2 tracking-widest">P2 (후)</p>
                  <p className={`text-4xl font-black ${wins[1] >= targetWins ? 'text-[#4ade80]' : 'text-white'}`}>{wins[1]}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full max-w-sm">
                {level < 8 && (
                  <button onClick={() => startLevel(level + 1)} className="w-full bg-[#4b4bdf] text-white hover:bg-[#3a3ab0] px-8 py-4 rounded-xl font-black text-xl transition-all shadow-[0_0_20px_rgba(75,75,223,0.4)]">
                    다음 레벨 가기 (Lv.{level + 1})
                  </button>
                )}
                <button onClick={() => startLevel(level)} className="w-full bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-black text-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  이 레벨 다시 풀기
                </button>
                <button onClick={() => setScreen('TITLE')} className="w-full bg-gray-800 text-gray-300 hover:bg-gray-700 px-8 py-4 rounded-xl font-black text-xl transition-all">
                  메인 화면으로
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}