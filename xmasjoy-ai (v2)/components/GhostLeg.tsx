
import React, { useState, useEffect, useRef } from 'react';
import { Network, Wand2, RefreshCw, User, Gift, Play } from 'lucide-react';
import { generateCreativePrizes } from '../services/geminiService';

interface Player {
  id: number;
  name: string;
  color: string;
  resultIndex?: number; // Calculated end column
}

const COLORS = ['#D42426', '#165B33', '#F8B229', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

const GhostLeg: React.FC = () => {
  const [step, setStep] = useState<'SETUP' | 'GAME'>('SETUP');
  const [names, setNames] = useState('');
  const [prizes, setPrizes] = useState('');
  const [theme, setTheme] = useState('瘋狂大冒險');
  const [loading, setLoading] = useState(false);
  
  // Game State
  const [players, setPlayers] = useState<Player[]>([]);
  const [prizeList, setPrizeList] = useState<string[]>([]);
  const [rungs, setRungs] = useState<{col: number, row: number}[]>([]); // Horizontal lines
  const [activePlayerId, setActivePlayerId] = useState<number | null>(null);
  const [pathHistory, setPathHistory] = useState<{x: number, y: number}[]>([]);
  
  // Canvas config
  const rows = 12; // Number of vertical segments
  const ladderHeight = 400;
  const ladderWidth = 600;

  // AI Generate Prizes
  const handleAiPrizes = async () => {
    const nameList = names.split('\n').filter(n => n.trim());
    if (nameList.length === 0) {
      alert("請先輸入參加者名單，AI 才知道要產生幾個獎項！");
      return;
    }
    setLoading(true);
    try {
      const generated = await generateCreativePrizes(nameList.length, theme);
      setPrizes(generated.join('\n'));
    } catch (e) {
      alert("AI 罷工中，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const initGame = () => {
    const nameList = names.split('\n').filter(n => n.trim());
    const prizeListRaw = prizes.split('\n').filter(p => p.trim());

    if (nameList.length < 2) {
      alert("至少需要兩個人才能玩！");
      return;
    }
    if (prizeListRaw.length < nameList.length) {
      alert("獎項數量少於參加人數，請補齊！");
      return;
    }

    // Setup Players
    const newPlayers = nameList.map((n, i) => ({
      id: i,
      name: n,
      color: COLORS[i % COLORS.length]
    }));
    setPlayers(newPlayers);
    setPrizeList(prizeListRaw.slice(0, nameList.length));

    // Generate Ladder Rungs
    // Logic: For each row, randomly place bridges between columns
    // Constraint: Cannot have consecutive bridges on same row (e.g. 0-1 and 1-2)
    const newRungs: {col: number, row: number}[] = [];
    const cols = nameList.length;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols - 1; c++) {
        // 40% chance to have a rung, and check left neighbor didn't just have one
        const hasLeftNeighbor = c > 0 && newRungs.some(rung => rung.row === r && rung.col === c - 1);
        if (Math.random() < 0.4 && !hasLeftNeighbor) {
          newRungs.push({ col: c, row: r });
        }
      }
    }
    setRungs(newRungs);
    setStep('GAME');
    setActivePlayerId(null);
  };

  const playTurn = (playerId: number) => {
    if (activePlayerId !== null) return; // Wait for current animation
    setActivePlayerId(playerId);

    const playerIndex = players.findIndex(p => p.id === playerId);
    const cols = players.length;
    let currentCol = playerIndex;
    const path: {x: number, y: number}[] = [];

    // Calculate coordinates for animation
    const colWidth = ladderWidth / (cols - 1 || 1);
    const rowHeight = ladderHeight / rows;

    path.push({ x: currentCol * colWidth, y: 0 }); // Start

    for (let r = 0; r < rows; r++) {
       // Move down to center of row
       path.push({ x: currentCol * colWidth, y: r * rowHeight + (rowHeight/2) });

       // Check for rung to the right
       const rightRung = rungs.find(rung => rung.row === r && rung.col === currentCol);
       // Check for rung to the left
       const leftRung = rungs.find(rung => rung.row === r && rung.col === currentCol - 1);

       if (rightRung) {
         currentCol++;
         path.push({ x: currentCol * colWidth, y: r * rowHeight + (rowHeight/2) });
       } else if (leftRung) {
         currentCol--;
         path.push({ x: currentCol * colWidth, y: r * rowHeight + (rowHeight/2) });
       }
    }

    path.push({ x: currentCol * colWidth, y: ladderHeight }); // End
    setPathHistory(path);

    // End Animation logic relies on CSS, but we need to mark result
    // In a real game, we might wait for animation end, but here we just show path
  };

  const getResult = (playerId: number) => {
      // Calculate logic purely for display (without animation path)
      const cols = players.length;
      let currentCol = players.findIndex(p => p.id === playerId);
      for (let r = 0; r < rows; r++) {
        const rightRung = rungs.find(rung => rung.row === r && rung.col === currentCol);
        const leftRung = rungs.find(rung => rung.row === r && rung.col === currentCol - 1);
        if (rightRung) currentCol++;
        else if (leftRung) currentCol--;
      }
      return prizeList[currentCol];
  };

  // --- Render ---

  if (step === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
         <div className="text-center mb-6">
            <h2 className="text-3xl font-christmas font-bold text-xmas-gold flex items-center justify-center gap-2">
                <Network /> AI 命運爬格子
            </h2>
            <p className="text-gray-200">輸入名單，AI 幫你想結局，一切交給命運！</p>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-medium text-xmas-green mb-2 flex items-center gap-2">
                    <User size={16}/> 參加者名單 (一人一行)
                </label>
                <textarea
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    className="w-full h-48 p-4 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-xmas-red outline-none"
                    placeholder="Alice&#10;Bob&#10;Charlie&#10;David"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-xmas-green mb-2 flex items-center gap-2">
                    <Gift size={16}/> 對應結果/獎項/懲罰 (一人一行)
                </label>
                <textarea
                    value={prizes}
                    onChange={(e) => setPrizes(e.target.value)}
                    className="w-full h-48 p-4 rounded-xl bg-white/90 text-gray-800 focus:ring-2 focus:ring-xmas-red outline-none"
                    placeholder="例如：&#10;喝一杯shot&#10;獲得100元&#10;伏地挺身10下"
                />
                
                <div className="mt-2 bg-white/20 p-3 rounded-lg flex items-center gap-2 flex-wrap">
                    <span className="text-sm">AI 靈感助手:</span>
                    <select 
                        value={theme} 
                        onChange={(e) => setTheme(e.target.value)}
                        className="bg-black/30 text-white text-sm rounded px-2 py-1 outline-none border border-white/30"
                    >
                        <option value="瘋狂大冒險">瘋狂大冒險</option>
                        <option value="地獄懲罰">地獄懲罰</option>
                        <option value="溫馨禮物">溫馨禮物</option>
                        <option value="交換禮物主題">交換禮物主題</option>
                    </select>
                    <button 
                        onClick={handleAiPrizes}
                        disabled={loading}
                        className="flex-1 bg-xmas-gold text-xmas-dark text-sm font-bold py-1.5 px-3 rounded hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={14}/> : <Wand2 size={14}/>}
                        自動生成
                    </button>
                </div>
            </div>
         </div>

         <button 
            onClick={initGame}
            className="w-full mt-6 bg-xmas-red hover:bg-red-600 text-white font-bold py-4 rounded-xl text-xl shadow-lg transition-transform hover:scale-[1.01]"
         >
            開始爬格子
         </button>
      </div>
    );
  }

  // GAME MODE
  const colWidth = ladderWidth / (players.length - 1 || 1);
  const rowHeight = ladderHeight / rows;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Network className="text-xmas-red"/> 命運時刻
            </h2>
            <button 
                onClick={() => setStep('SETUP')}
                className="text-gray-500 hover:text-gray-700 underline text-sm"
            >
                重新設定
            </button>
        </div>

        <div className="relative w-full overflow-x-auto pb-4">
             {/* The Game Board */}
            <div style={{ width: Math.max(ladderWidth, players.length * 80), minWidth: '100%' }} className="mx-auto relative select-none">
                
                {/* Top: Players */}
                <div className="flex justify-between mb-2 relative" style={{ width: ladderWidth }}>
                    {players.map((p, i) => (
                        <button
                            key={p.id}
                            onClick={() => playTurn(p.id)}
                            disabled={activePlayerId !== null}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all z-10
                                ${activePlayerId === p.id ? 'scale-125 ring-4 ring-yellow-400' : 'hover:scale-110'}
                            `}
                            style={{ 
                                backgroundColor: p.color,
                                position: 'absolute',
                                left: i * colWidth,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {p.name[0]}
                        </button>
                    ))}
                </div>

                {/* SVG Ladder */}
                <svg width={ladderWidth} height={ladderHeight} className="overflow-visible mx-auto bg-orange-50/50 rounded-lg border-2 border-orange-100">
                    {/* Vertical Lines */}
                    {players.map((_, i) => (
                        <line 
                            key={`v-${i}`}
                            x1={i * colWidth} y1={0}
                            x2={i * colWidth} y2={ladderHeight}
                            stroke="#cbd5e1" strokeWidth="4"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Rungs */}
                    {rungs.map((rung, i) => (
                        <line
                            key={`r-${i}`}
                            x1={rung.col * colWidth}
                            y1={rung.row * rowHeight + (rowHeight/2)}
                            x2={(rung.col + 1) * colWidth}
                            y2={rung.row * rowHeight + (rowHeight/2)}
                            stroke="#94a3b8" strokeWidth="4"
                            strokeLinecap="round"
                        />
                    ))}

                    {/* Active Path Animation */}
                    {activePlayerId !== null && pathHistory.length > 0 && (
                        <polyline
                            points={pathHistory.map(p => `${p.x},${p.y}`).join(' ')}
                            fill="none"
                            stroke={players.find(p => p.id === activePlayerId)?.color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-md"
                        >
                            <animate 
                                attributeName="stroke-dasharray" 
                                from="0, 10000" 
                                to="10000, 0" 
                                dur="2s" 
                                fill="freeze" 
                                calcMode="linear"
                            />
                        </polyline>
                    )}
                    
                    {/* Player Indicator (Ball) */}
                    {activePlayerId !== null && pathHistory.length > 0 && (
                        <circle r="8" fill={players.find(p => p.id === activePlayerId)?.color}>
                             <animateMotion 
                                dur="2s" 
                                fill="freeze"
                                path={`M ${pathHistory.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                             />
                        </circle>
                    )}
                </svg>

                {/* Bottom: Prizes */}
                <div className="relative mt-2 h-20" style={{ width: ladderWidth }}>
                    {players.map((_, i) => {
                         const result = prizeList[i];
                         // Highlight the result if current player reached it
                         const isTarget = activePlayerId !== null && getResult(activePlayerId) === result;
                         
                         return (
                            <div 
                                key={`prize-${i}`}
                                className={`absolute transform -translate-x-1/2 text-center w-24 transition-all duration-500
                                    ${isTarget ? 'scale-110 z-20' : 'scale-100'}
                                `}
                                style={{ left: i * colWidth }}
                            >
                                <div className={`text-xs font-bold mb-1 px-2 py-1 rounded-full ${isTarget ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600'}`}>
                                    {isTarget ? 'This one!' : `結果 ${i+1}`}
                                </div>
                                <div className="text-sm font-medium text-gray-800 break-words leading-tight bg-white/80 p-1 rounded border border-gray-200 shadow-sm">
                                    {result}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        {/* Result Text Display */}
        {activePlayerId !== null && (
             <div className="mt-8 text-center animate-fade-in-up bg-green-50 p-4 rounded-xl border border-green-200">
                <span className="text-xl text-gray-600">
                    <span className="font-bold text-2xl" style={{color: players.find(p => p.id === activePlayerId)?.color}}>
                        {players.find(p => p.id === activePlayerId)?.name}
                    </span> 
                    抽到了...
                </span>
                <div className="text-4xl font-bold text-xmas-red mt-2 drop-shadow-sm">
                     {getResult(activePlayerId)}
                </div>
                <button 
                    onClick={() => setActivePlayerId(null)}
                    className="mt-4 text-sm text-gray-500 underline hover:text-gray-800"
                >
                    換下一位
                </button>
             </div>
        )}
    </div>
  );
};

export default GhostLeg;
