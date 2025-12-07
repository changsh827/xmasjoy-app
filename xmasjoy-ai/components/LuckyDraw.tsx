import React, { useState, useRef } from 'react';
import { Gift, Trash2, Plus, Sparkles } from 'lucide-react';
import { generateWinnerBlessing } from '../services/geminiService';
import { LuckyDrawParticipant } from '../types';

const LuckyDraw: React.FC = () => {
  const [nameInput, setNameInput] = useState('');
  const [participants, setParticipants] = useState<LuckyDrawParticipant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<LuckyDrawParticipant | null>(null);
  const [blessing, setBlessing] = useState('');
  const [loadingBlessing, setLoadingBlessing] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const newParticipant: LuckyDrawParticipant = {
      id: Date.now().toString(),
      name: nameInput.trim()
    };
    setParticipants([...participants, newParticipant]);
    setNameInput('');
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const spinWheel = async () => {
    if (participants.length < 2) {
      alert("至少需要兩個人才能抽獎！");
      return;
    }
    
    setIsSpinning(true);
    setWinner(null);
    setBlessing('');

    // Simulate spinning effect visually
    let duration = 3000; // 3 seconds
    // In a real app, you might want a canvas wheel. Here we'll do a simple rapid name shuffle.
    
    // After spin logic
    setTimeout(async () => {
        setIsSpinning(false);
        const randomIndex = Math.floor(Math.random() * participants.length);
        const win = participants[randomIndex];
        setWinner(win);
        
        // Generate AI Blessing
        setLoadingBlessing(true);
        try {
            const bless = await generateWinnerBlessing(win.name);
            setBlessing(bless);
        } catch {
            setBlessing("恭喜！祝你聖誕快樂！");
        } finally {
            setLoadingBlessing(false);
        }

    }, duration);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Participant List */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-xmas-gold">
          <Plus size={24} /> 參加名單 ({participants.length})
        </h3>
        
        <form onSubmit={addParticipant} className="flex gap-2 mb-6">
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="輸入名字..."
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 outline-none"
          />
          <button type="submit" className="bg-xmas-green hover:bg-green-600 px-6 py-2 rounded-lg font-bold transition-colors">
            加入
          </button>
        </form>

        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {participants.map(p => (
            <div key={p.id} className="flex justify-between items-center bg-white/20 p-3 rounded-lg">
              <span className="font-medium">{p.name}</span>
              <button onClick={() => removeParticipant(p.id)} className="text-red-300 hover:text-red-100 p-1">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {participants.length === 0 && (
            <div className="text-center text-gray-400 py-8">目前名單為空</div>
          )}
        </div>
      </div>

      {/* Draw Area */}
      <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-8 border border-white/10 relative overflow-hidden">
        {/* Decorative Background Spin */}
        <div className={`absolute inset-0 bg-gradient-radial from-xmas-red/20 to-transparent transition-opacity duration-1000 ${isSpinning ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>

        {winner ? (
            <div className="z-10 text-center animate-fade-in-up">
                <div className="text-xmas-gold font-christmas text-3xl mb-2">Winner!</div>
                <div className="text-6xl font-bold mb-6 text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                    {winner.name}
                </div>
                
                <div className="bg-white/90 text-gray-800 p-6 rounded-xl max-w-sm mx-auto shadow-2xl transform rotate-1">
                    <h4 className="text-xmas-red font-bold mb-2 flex items-center justify-center gap-2">
                        <Sparkles size={16}/> AI 聖誕祝福
                    </h4>
                    {loadingBlessing ? (
                        <p className="animate-pulse text-gray-500">正在接收來自聖誕老人的訊息...</p>
                    ) : (
                        <p className="text-lg leading-relaxed font-serif">{blessing}</p>
                    )}
                </div>

                <button 
                    onClick={() => setWinner(null)}
                    className="mt-8 px-8 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                >
                    重新抽獎
                </button>
            </div>
        ) : (
            <div className="z-10 text-center w-full">
                {isSpinning ? (
                    <div className="text-6xl font-bold animate-bounce text-xmas-gold">
                        {participants.length > 0 ? participants[Math.floor(Math.random() * participants.length)].name : '...'}
                    </div>
                ) : (
                    <div className="text-center">
                        <Gift size={120} className="mx-auto text-xmas-red mb-8 animate-bounce-slow" />
                        <button
                            onClick={spinWheel}
                            disabled={participants.length < 2}
                            className={`
                                text-2xl font-bold py-4 px-12 rounded-full shadow-lg transform transition-all
                                ${participants.length < 2 
                                    ? 'bg-gray-500 cursor-not-allowed opacity-50' 
                                    : 'bg-xmas-gold hover:bg-yellow-400 hover:scale-110 text-xmas-dark'}
                            `}
                        >
                            開始抽獎
                        </button>
                        {participants.length < 2 && (
                            <p className="mt-4 text-sm text-gray-400">請先加入至少兩位參加者</p>
                        )}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default LuckyDraw;