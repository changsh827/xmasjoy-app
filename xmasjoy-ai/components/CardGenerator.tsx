import React, { useState } from 'react';
import { Send, Edit3, Wand2, Loader2, Copy, Check } from 'lucide-react';
import { generateGratitudeMessage } from '../services/geminiService';

const CardGenerator: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [memories, setMemories] = useState('');
  const [tone, setTone] = useState('溫馨感人');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!recipient || !memories) return;
    setLoading(true);
    try {
      const text = await generateGratitudeMessage(recipient, memories, tone);
      setGeneratedText(text);
      setCopied(false);
    } catch (e) {
      alert("Error generating card");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 p-4">
      <div className="bg-white/95 rounded-2xl p-6 text-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold text-xmas-green mb-6 flex items-center gap-2">
          <Edit3 /> 撰寫感謝信
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">收件人</label>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-xmas-red outline-none"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="親愛的老公 / 最好的閨蜜"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">語氣風格</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-xmas-red outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="溫馨感人">溫馨感人 (Touching)</option>
              <option value="幽默風趣">幽默風趣 (Funny)</option>
              <option value="正式禮貌">正式禮貌 (Formal)</option>
              <option value="熱情奔放">熱情奔放 (Enthusiastic)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">想感謝的事 / 關鍵回憶</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-xmas-red outline-none"
              rows={4}
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              placeholder="謝謝你今年陪我度過低潮，還有一起去日本旅行的回憶..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-xmas-green hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Wand2 />}
            AI 生成信件
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Card Preview Area */}
        <div className="h-full min-h-[400px] bg-[#fdf6e3] rounded-xl p-8 shadow-2xl transform rotate-1 transition-transform hover:rotate-0 flex flex-col relative border-8 border-xmas-red">
            {/* Decorative Stamps/Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 border-2 border-dashed border-red-300 rounded-full flex items-center justify-center opacity-50 rotate-12">
               <span className="text-xs text-red-300 font-bold uppercase">North Pole<br/>Post</span>
            </div>

            <div className="flex-grow flex flex-col justify-center">
              {generatedText ? (
                <div className="prose prose-stone">
                  <p className="whitespace-pre-wrap text-lg font-serif leading-relaxed text-gray-800">
                    {generatedText}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400 italic">
                  <Send className="mx-auto mb-2 opacity-50" size={32} />
                  您的 AI 聖誕感謝信將顯示於此...
                </div>
              )}
            </div>

            {generatedText && (
               <div className="mt-6 flex justify-end">
                 <button 
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-xmas-gold text-xmas-dark rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors"
                 >
                   {copied ? <Check size={16}/> : <Copy size={16}/>}
                   {copied ? '已複製' : '複製文字'}
                 </button>
               </div>
            )}
            
            {/* Decoration */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center opacity-30 pointer-events-none">
              <p className="font-christmas text-2xl text-xmas-green">Merry Christmas</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CardGenerator;