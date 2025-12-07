
import React, { useState } from 'react';
import { Gamepad2, Play, CheckCircle, XCircle, RefreshCw, Trophy, MessageCircle, Zap, ArrowLeft, Heart, Flame } from 'lucide-react';
import { generateTriviaQuestions, generateTruthOrDare, generateQuickFireQuestions } from '../services/geminiService';
import { TriviaQuestion, TruthOrDareItem, QuickFireItem } from '../types';

type GameMode = 'MENU' | 'TRIVIA' | 'TRUTH_DARE' | 'QUICK_FIRE';

const PartyGames: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('MENU');

  const renderGame = () => {
    switch (mode) {
      case 'TRIVIA':
        return <TriviaGame onBack={() => setMode('MENU')} />;
      case 'TRUTH_DARE':
        return <TruthOrDareGame onBack={() => setMode('MENU')} />;
      case 'QUICK_FIRE':
        return <QuickFireGame onBack={() => setMode('MENU')} />;
      default:
        return <GameMenu onSelect={setMode} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {renderGame()}
    </div>
  );
};

// --- Sub-components ---

const GameMenu: React.FC<{ onSelect: (m: GameMode) => void }> = ({ onSelect }) => (
  <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
    <div 
      onClick={() => onSelect('TRIVIA')}
      className="bg-white/10 backdrop-blur border border-white/20 p-8 rounded-2xl text-center cursor-pointer hover:bg-white/20 hover:scale-105 transition-all shadow-xl group"
    >
      <Trophy size={64} className="mx-auto mb-4 text-yellow-400 group-hover:animate-bounce" />
      <h3 className="text-2xl font-bold font-christmas text-white mb-2">Trivia Quiz</h3>
      <p className="text-gray-300">冷知識大考驗<br/>看誰是聖誕聰明王</p>
    </div>

    <div 
      onClick={() => onSelect('TRUTH_DARE')}
      className="bg-white/10 backdrop-blur border border-white/20 p-8 rounded-2xl text-center cursor-pointer hover:bg-white/20 hover:scale-105 transition-all shadow-xl group"
    >
      <Heart size={64} className="mx-auto mb-4 text-pink-400 group-hover:animate-pulse" />
      <h3 className="text-2xl font-bold font-christmas text-white mb-2">Truth or Dare</h3>
      <p className="text-gray-300">真心話大冒險<br/>AI 出題，沒有極限</p>
    </div>

    <div 
      onClick={() => onSelect('QUICK_FIRE')}
      className="bg-white/10 backdrop-blur border border-white/20 p-8 rounded-2xl text-center cursor-pointer hover:bg-white/20 hover:scale-105 transition-all shadow-xl group"
    >
      <Zap size={64} className="mx-auto mb-4 text-blue-400 group-hover:animate-spin-slow" />
      <h3 className="text-2xl font-bold font-christmas text-white mb-2">Quick Fire</h3>
      <p className="text-gray-300">快問快答<br/>二選一，憑直覺！</p>
    </div>
  </div>
);

// --- 1. Trivia Game ---
const TriviaGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [topic, setTopic] = useState('聖誕節冷知識');
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'SETUP' | 'PLAYING' | 'FINISHED'>('SETUP');
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startGame = async () => {
    setLoading(true);
    try {
      const qs = await generateTriviaQuestions(topic, 5);
      setQuestions(qs);
      setScore(0);
      setCurrentIndex(0);
      setGameState('PLAYING');
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (e) {
      alert("無法建立遊戲，請檢查網路或稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameState('FINISHED');
    }
  };

  if (gameState === 'SETUP') {
    return (
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-white/70 hover:text-white"><ArrowLeft /></button>
        <Gamepad2 size={48} className="mx-auto text-xmas-gold mb-4" />
        <h2 className="text-3xl font-bold text-white mb-6">知識大考驗</h2>
        <div className="mb-6 max-w-md mx-auto">
            <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/30 border border-white/30 text-white focus:ring-2 focus:ring-xmas-gold outline-none"
                placeholder="輸入主題 (Ex: 90年代流行歌)"
            />
        </div>
        <button
          onClick={startGame}
          disabled={loading}
          className="bg-xmas-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center gap-2 mx-auto"
        >
          {loading ? <RefreshCw className="animate-spin" /> : <Play />} 開始出題
        </button>
      </div>
    );
  }

  if (gameState === 'FINISHED') {
    return (
      <div className="bg-white p-8 rounded-3xl text-center shadow-2xl text-gray-800">
        <Trophy size={80} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold mb-2">遊戲結束!</h2>
        <p className="text-xl mb-6">你的得分: <span className="text-4xl font-bold text-xmas-red">{score}</span> / {questions.length}</p>
        <button
          onClick={() => setGameState('SETUP')}
          className="bg-xmas-green text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-colors mr-4"
        >
          再玩一次
        </button>
        <button onClick={onBack} className="text-gray-500 hover:underline">回選單</button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div className="relative">
      <button onClick={onBack} className="absolute -top-10 left-0 text-white/70 hover:text-white flex items-center gap-1"><ArrowLeft size={16}/> Back</button>
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl text-gray-800">
        <div className="flex justify-between text-sm text-gray-500 font-bold mb-4">
             <span>Q {currentIndex + 1} / {questions.length}</span>
             <span>Score: {score}</span>
        </div>
        <h3 className="text-2xl font-bold mb-6 text-center">{currentQ.question}</h3>
        <div className="grid gap-3 mb-6">
          {currentQ.options.map((option, idx) => {
            let btnClass = "p-4 rounded-xl border-2 text-left font-medium transition-all ";
            if (showResult) {
                if (idx === currentQ.correctAnswerIndex) btnClass += "bg-green-100 border-green-500 text-green-800";
                else if (idx === selectedAnswer) btnClass += "bg-red-100 border-red-500 text-red-800";
                else btnClass += "bg-gray-50 border-gray-200 opacity-50";
            } else {
                btnClass += "bg-white border-gray-200 hover:border-xmas-gold hover:bg-yellow-50";
            }
            return (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResult} className={btnClass}>
                <div className="flex justify-between items-center">
                    <span>{option}</span>
                    {showResult && idx === currentQ.correctAnswerIndex && <CheckCircle className="text-green-600"/>}
                    {showResult && idx === selectedAnswer && idx !== currentQ.correctAnswerIndex && <XCircle className="text-red-600"/>}
                </div>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className="animate-fade-in">
            <div className="bg-blue-50 p-3 rounded mb-4 text-blue-900 text-sm">
                <strong>解析：</strong> {currentQ.explanation}
            </div>
            <button onClick={nextQuestion} className="w-full bg-xmas-red hover:bg-red-700 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2">
              {currentIndex < questions.length - 1 ? "下一題" : "看結果"} <Play size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. Truth or Dare Game ---
const TruthOrDareGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [items, setItems] = useState<TruthOrDareItem[]>([]);
  const [currentItem, setCurrentItem] = useState<TruthOrDareItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [intensity, setIntensity] = useState('有趣好玩');
  const [revealed, setRevealed] = useState(false);

  const fetchItems = async (type: 'TRUTH' | 'DARE' | 'MIXED') => {
    setLoading(true);
    setRevealed(false);
    setCurrentItem(null);
    try {
      const newItems = await generateTruthOrDare(type, intensity);
      setItems(newItems);
      // Pick one immediately
      if(newItems.length > 0) {
        setCurrentItem(newItems[0]);
        setRevealed(true);
      }
    } catch(e) {
      alert("AI 罷工中");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 relative min-h-[400px] flex flex-col items-center justify-center">
        <button onClick={onBack} className="absolute top-6 left-6 text-white/70 hover:text-white"><ArrowLeft /></button>
        
        {!currentItem && !loading && (
           <div className="text-center w-full max-w-md">
             <Heart size={60} className="mx-auto text-pink-400 mb-4 animate-pulse"/>
             <h2 className="text-3xl font-bold text-white mb-6">真心話大冒險</h2>
             
             <div className="mb-6 text-left">
                <label className="text-xmas-gold text-sm font-bold mb-2 block">選擇刺激程度</label>
                <select 
                   value={intensity} 
                   onChange={(e) => setIntensity(e.target.value)}
                   className="w-full p-2 rounded bg-black/40 text-white border border-white/30"
                >
                   <option value="有趣好玩 (Fun & Safe)">有趣好玩 (適合闔家)</option>
                   <option value="有點尷尬 (Awkward)">有點尷尬 (適合朋友)</option>
                   <option value="辛辣刺激 (Spicy)">辛辣刺激 (慎選對象!)</option>
                   <option value="深度感性 (Deep)">深度感性 (適合交心)</option>
                </select>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => fetchItems('TRUTH')}
                 className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105"
               >
                 真心話
               </button>
               <button 
                 onClick={() => fetchItems('DARE')}
                 className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold text-xl shadow-lg transition-transform hover:scale-105"
               >
                 大冒險
               </button>
             </div>
             <button 
                onClick={() => fetchItems('MIXED')}
                className="mt-4 w-full bg-xmas-gold text-xmas-dark py-3 rounded-xl font-bold hover:bg-yellow-400"
             >
                隨機命運
             </button>
           </div>
        )}

        {loading && (
           <div className="text-white text-center">
              <RefreshCw className="animate-spin mx-auto mb-4" size={40}/>
              <p>AI 正在想最狠的題目...</p>
           </div>
        )}

        {currentItem && !loading && revealed && (
            <div className="w-full max-w-lg text-center animate-fade-in-up">
                <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl transform rotate-1 border-8 border-xmas-gold">
                    <div className="uppercase tracking-widest text-sm font-bold text-gray-400 mb-2">
                        {currentItem.type === 'TRUTH' ? 'Truth · 真心話' : 'Dare · 大冒險'}
                    </div>
                    <div className={`text-3xl font-bold mb-8 leading-snug ${currentItem.type === 'DARE' ? 'text-red-600' : 'text-blue-600'}`}>
                        {currentItem.content}
                    </div>
                    
                    <div className="flex gap-2 justify-center">
                        <button 
                            onClick={() => setCurrentItem(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full font-bold"
                        >
                            回首頁
                        </button>
                        <button 
                            onClick={() => fetchItems(currentItem.type === 'TRUTH' ? 'TRUTH' : 'DARE')}
                            className="bg-xmas-dark text-white px-6 py-2 rounded-full font-bold hover:bg-green-900"
                        >
                            再來一個
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// --- 3. Quick Fire Game ---
const QuickFireGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [topic, setTopic] = useState('情侶二選一');
  const [questions, setQuestions] = useState<QuickFireItem[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = async () => {
    setLoading(true);
    try {
      const qs = await generateQuickFireQuestions(topic);
      setQuestions(qs);
      setIndex(0);
      setGameStarted(true);
    } catch (e) {
      alert("AI 忙線中");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if(index < questions.length - 1) setIndex(i => i + 1);
    else setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center relative">
        <button onClick={onBack} className="absolute top-4 left-4 text-white/70 hover:text-white"><ArrowLeft /></button>
        <Zap size={48} className="mx-auto text-blue-400 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-6">快問快答</h2>
        <div className="mb-6 max-w-md mx-auto">
             <label className="block text-left text-xmas-gold text-sm mb-1">題目主題</label>
             <input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/30 border border-white/30 text-white focus:ring-2 focus:ring-blue-400 outline-none"
             />
             <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
                {['聖誕節', '情侶', '職場', '食物', '超級英雄'].map(t => (
                    <button key={t} onClick={() => setTopic(t)} className="bg-white/10 px-3 py-1 rounded-full text-xs text-gray-300 hover:bg-white/30 whitespace-nowrap">
                        {t}
                    </button>
                ))}
             </div>
        </div>
        <button
          onClick={startGame}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-full transition-all flex items-center gap-2 mx-auto shadow-lg shadow-blue-900/50"
        >
           {loading ? <RefreshCw className="animate-spin"/> : <Play />} 開始
        </button>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="relative h-[500px] flex items-center justify-center">
       <button onClick={() => setGameStarted(false)} className="absolute top-0 left-0 text-white/70 hover:text-white flex items-center gap-1 z-10"><ArrowLeft size={16}/> Quit</button>
       
       <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[400px]">
          <div className="bg-blue-600 p-4 text-center text-white font-bold text-xl relative">
             Question {index + 1}
          </div>
          
          <div className="flex-1 grid grid-cols-2 relative">
             <div className="bg-red-50 flex flex-col items-center justify-center p-6 border-r border-gray-200 hover:bg-red-100 transition-colors cursor-pointer group" onClick={next}>
                <span className="text-6xl font-bold text-red-300 mb-4 group-hover:scale-110 transition-transform">A</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-800 text-center">{current.optionA}</span>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-4 shadow-lg z-10 font-bold text-gray-400 border-4 border-gray-100">
                VS
             </div>

             <div className="bg-blue-50 flex flex-col items-center justify-center p-6 hover:bg-blue-100 transition-colors cursor-pointer group" onClick={next}>
                <span className="text-6xl font-bold text-blue-300 mb-4 group-hover:scale-110 transition-transform">B</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-800 text-center">{current.optionB}</span>
             </div>
          </div>

          <div className="bg-gray-50 p-3 text-center text-gray-500 text-sm">
             點擊任一選項進入下一題
          </div>
       </div>
    </div>
  );
};

export default PartyGames;
