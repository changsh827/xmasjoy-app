import React, { useState } from 'react';
import { Gift, Sparkles, Loader2, DollarSign, User, Heart } from 'lucide-react';
import { generateGiftIdeas } from '../services/geminiService';
import { GiftIdea } from '../types';

const GiftGuide: React.FC = () => {
  const [relation, setRelation] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [gifts, setGifts] = useState<GiftIdea[]>([]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relation || !interests) return;

    setLoading(true);
    try {
      const ideas = await generateGiftIdeas(relation, age, interests, budget);
      setGifts(ideas);
    } catch (error) {
      alert("無法產生禮物建議，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-christmas font-bold text-xmas-gold mb-2">AI 聖誕送禮顧問</h2>
        <p className="text-gray-200">不知道送什麼？讓 AI 幫你挑選最完美的禮物！</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="md:col-span-1 bg-white/90 p-6 rounded-xl text-gray-800 h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-xmas-green mb-1 flex items-center gap-2">
                <User size={16} /> 對象關係
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="例如：男朋友、媽媽、同事"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-xmas-red focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-xmas-green mb-1 flex items-center gap-2">
                <Sparkles size={16} /> 年齡
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-xmas-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-xmas-green mb-1 flex items-center gap-2">
                <Heart size={16} /> 興趣/愛好
              </label>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="喜歡咖啡、健身、貓咪..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-xmas-red focus:outline-none"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-xmas-green mb-1 flex items-center gap-2">
                <DollarSign size={16} /> 預算 (TWD)
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-xmas-red focus:outline-none"
              >
                <option value="">選擇預算範圍</option>
                <option value="500元以下">500元以下 (交換禮物)</option>
                <option value="500-1000元">500 - 1000元</option>
                <option value="1000-3000元">1000 - 3000元</option>
                <option value="3000元以上">3000元以上 (豪華)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-xmas-red hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Gift />}
              尋找靈感
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-4">
          {gifts.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 min-h-[300px] border-2 border-dashed border-white/20 rounded-xl">
              <Gift size={48} className="mb-4 opacity-50" />
              <p>輸入資料後，AI 推薦禮物將顯示於此</p>
            </div>
          )}
          
          {loading && (
             <div className="h-full flex flex-col items-center justify-center text-white min-h-[300px]">
               <Loader2 size={48} className="animate-spin mb-4 text-xmas-gold" />
               <p className="animate-pulse">正在搜尋北極的禮物倉庫...</p>
             </div>
          )}

          {gifts.map((gift, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-lg transform transition hover:scale-[1.02] text-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-xmas-green">{gift.item}</h3>
                <span className="bg-xmas-gold text-xmas-dark px-3 py-1 rounded-full text-xs font-bold">
                  {gift.priceRange}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{gift.description}</p>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-sm text-green-800 italic flex gap-2">
                  <Sparkles size={16} className="shrink-0 mt-1" />
                  {gift.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftGuide;