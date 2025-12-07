
import React, { useState } from 'react';
import { Gift, Gamepad2, Clover, Network } from 'lucide-react';
import Snowfall from './components/Snowfall';
import GiftGuide from './components/GiftGuide';
import PartyGames from './components/PartyGames';
import LuckyDraw from './components/LuckyDraw';
import GhostLeg from './components/GhostLeg';
import { AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.GIFT:
        return <GiftGuide />;
      case AppTab.GAME:
        return <PartyGames />;
      case AppTab.LUCKY:
        return <LuckyDraw />;
      case AppTab.GHOST_LEG:
        return <GhostLeg />;
      default:
        return (
          <div className="text-center max-w-4xl mx-auto py-12 px-4 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-christmas text-xmas-gold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              XmasJoy AI
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200">
              你的 AI 聖誕派對超級助手
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={<Gift size={48} />}
                title="AI 送禮顧問"
                desc="不知道送什麼？輸入對象與預算，AI 立刻推薦完美禮物！"
                onClick={() => setActiveTab(AppTab.GIFT)}
                color="bg-red-900/40"
              />
              <FeatureCard 
                icon={<Gamepad2 size={48} />}
                title="派對冷知識"
                desc="AI 出題考驗大家！炒熱氣氛必備的互動遊戲。"
                onClick={() => setActiveTab(AppTab.GAME)}
                color="bg-yellow-900/40"
              />
              <FeatureCard 
                icon={<Network size={48} />}
                title="AI 命運爬格子"
                desc="經典團康遊戲！AI 幫你想瘋狂懲罰，看誰是倒霉鬼。"
                onClick={() => setActiveTab(AppTab.GHOST_LEG)}
                color="bg-purple-900/40"
              />
              <FeatureCard 
                icon={<Clover size={48} />}
                title="幸運大抽獎"
                desc="不僅僅是抽獎，AI 還會送給中獎者一句專屬運勢祝福！"
                onClick={() => setActiveTab(AppTab.LUCKY)}
                color="bg-blue-900/40"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden bg-gradient-to-b from-[#0B3D25] via-[#1a4a33] to-[#2d1b2e]">
      <Snowfall />
      
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-[#0B3D25]/90 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setActiveTab(AppTab.HOME)}
            >
              <span className="text-2xl font-christmas text-xmas-red">XmasJoy</span>
              <span className="text-xs bg-xmas-gold text-xmas-dark px-2 py-0.5 rounded font-bold">AI</span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              <NavBtn active={activeTab === AppTab.GIFT} onClick={() => setActiveTab(AppTab.GIFT)} icon={<Gift size={18}/>} label="送禮" />
              <NavBtn active={activeTab === AppTab.GAME} onClick={() => setActiveTab(AppTab.GAME)} icon={<Gamepad2 size={18}/>} label="遊戲" />
              <NavBtn active={activeTab === AppTab.GHOST_LEG} onClick={() => setActiveTab(AppTab.GHOST_LEG)} icon={<Network size={18}/>} label="爬格子" />
              <NavBtn active={activeTab === AppTab.LUCKY} onClick={() => setActiveTab(AppTab.LUCKY)} icon={<Clover size={18}/>} label="抽獎" />
            </div>

             {/* Mobile Menu Icon (Simplified for this demo, usually would toggle a menu) */}
             <div className="md:hidden flex gap-2">
                <button onClick={() => setActiveTab(AppTab.HOME)} className="text-gray-300">Home</button>
             </div>
          </div>
        </div>
        {/* Mobile secondary nav */}
        <div className="md:hidden flex justify-around p-2 bg-[#092e1c] text-xs">
           <button onClick={() => setActiveTab(AppTab.GIFT)} className={`p-2 ${activeTab === AppTab.GIFT ? 'text-xmas-red' : 'text-gray-400'}`}><Gift className="mx-auto mb-1" size={20}/></button>
           <button onClick={() => setActiveTab(AppTab.GAME)} className={`p-2 ${activeTab === AppTab.GAME ? 'text-xmas-red' : 'text-gray-400'}`}><Gamepad2 className="mx-auto mb-1" size={20}/></button>
           <button onClick={() => setActiveTab(AppTab.GHOST_LEG)} className={`p-2 ${activeTab === AppTab.GHOST_LEG ? 'text-xmas-red' : 'text-gray-400'}`}><Network className="mx-auto mb-1" size={20}/></button>
           <button onClick={() => setActiveTab(AppTab.LUCKY)} className={`p-2 ${activeTab === AppTab.LUCKY ? 'text-xmas-red' : 'text-gray-400'}`}><Clover className="mx-auto mb-1" size={20}/></button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm pb-8">
        <p>© 2024 XmasJoy AI Platform. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

// Helper Components
const NavBtn = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
      active 
        ? 'bg-xmas-red text-white shadow-[0_0_15px_rgba(212,36,38,0.5)] scale-105' 
        : 'text-gray-300 hover:text-white hover:bg-white/10'
    }`}
  >
    {icon}
    {label}
  </button>
);

const FeatureCard = ({ icon, title, desc, onClick, color }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void, color: string }) => (
  <div 
    onClick={onClick}
    className={`${color} hover:bg-opacity-60 backdrop-blur-sm border border-white/10 p-8 rounded-2xl cursor-pointer transition-all transform hover:-translate-y-2 hover:shadow-2xl group`}
  >
    <div className="bg-white/10 w-fit p-4 rounded-full mb-4 group-hover:bg-xmas-gold group-hover:text-xmas-dark transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{desc}</p>
  </div>
);

export default App;
