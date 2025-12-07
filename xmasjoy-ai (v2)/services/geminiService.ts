onst API_BASE = import.meta.env.DEV
  ? "/api"
  : "https://xmasjoy-backend.onrender.com";

// services/aiService.ts（檔名隨你，重點是內容）

import { GiftIdea, TriviaQuestion, TruthOrDareItem, QuickFireItem } from "../types";

// 通用呼叫後端 AI 的 helper
async function callAI(prompt: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    console.error("Backend AI error", await res.text());
    throw new Error("AI backend error");
  }

  const data = await res.json() as { reply?: string };
  const text = data.reply?.trim();

  if (!text) {
    throw new Error("Empty AI reply");
  }

  return text;
}

// --- Gift Ideas ---
export const generateGiftIdeas = async (
  recipientRelation: string,
  age: string,
  interests: string,
  budget: string
): Promise<GiftIdea[]> => {
  const prompt = `
你是一位貼心的聖誕禮物顧問，請只輸出 JSON 陣列，不要任何多餘說明或文字。

請產生 5 個聖誕禮物建議，條件如下：
- 對象關係：${recipientRelation}
- 年齡：${age}
- 興趣：${interests}
- 預算：約 ${budget}

回傳格式為 JSON 陣列，每一個物件包含：
[
  {
    "item": "禮物名稱（短句）",
    "description": "簡短描述，說明這個禮物是什麼",
    "priceRange": "大約價位範圍，例如：NT$500–800",
    "reason": "為什麼這個禮物適合這個人"
  },
  ...
]

請務必保證輸出是「有效 JSON」，不要有註解、說明文字或多餘標點。
語言使用繁體中文（台灣用語）。
`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text) as GiftIdea[];
  } catch (error) {
    console.error("Error generating gifts:", error);
    return [];
  }
};

// --- Trivia Game ---
export const generateTriviaQuestions = async (
  topic: string = "Christmas General Knowledge",
  count: number = 5
): Promise<TriviaQuestion[]> => {
  const prompt = `
請為主題「${topic}」產生 ${count} 題四選一的問答題（Trivia）。
只輸出 JSON 陣列，不要任何多餘說明。

格式：
[
  {
    "question": "題目內容",
    "options": ["選項A", "選項B", "選項C", "選項D"],
    "correctAnswerIndex": 0,
    "explanation": "為什麼這個答案是正確的，簡短說明"
  },
  ...
]

要求：
- "correctAnswerIndex" 為 0~3 的整數，對應 options 陣列的索引。
- 語言：繁體中文（台灣）。
- 題目與解釋要跟主題「${topic}」明確相關。

請務必只輸出合法 JSON。
`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text) as TriviaQuestion[];
  } catch (error) {
    console.error("Error generating trivia:", error);
    return [];
  }
};

// --- Lucky Draw Blessing ---
export const generateWinnerBlessing = async (name: string): Promise<string> => {
  const prompt = `
使用繁體中文（台灣），為名字叫「${name}」的得獎者寫一段聖誕抽獎得主祝福。

條件：
- 最多 2 句話
- 要有一點幽默、也要吉祥
- 提到 2025 年會有好運、貴人或有趣的發展
- 不要輸出 JSON，只要純文字內容
`;

  try {
    const text = await callAI(prompt);
    return text || "恭喜你中獎！祝你來年好運連連！";
  } catch (error) {
    console.error("Error generating blessing:", error);
    return "恭喜你中獎！聖誕快樂！";
  }
};

// --- Ghost Leg Prizes ---
export const generateCreativePrizes = async (count: number, theme: string): Promise<string[]> => {
  const prompt = `
請為主題「${theme}」的阿彌陀籤（Ghost Leg）遊戲產生 ${count} 個結果內容。

要求：
- 每個結果字數不超過 10 個字
- 可以是獎品、懲罰、挑戰或好運籤詩等
- 語言：繁體中文（台灣）
- 風格可以幽默、有創意

只輸出 JSON 陣列，例如：
[
  "被請喝一杯熱可可",
  "唱一首聖誕歌",
  ...
]

請務必只輸出合法 JSON。
`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Error generating prizes:", error);
    return Array(count).fill("神秘禮物");
  }
};

// --- Truth or Dare ---
export const generateTruthOrDare = async (
  category: 'TRUTH' | 'DARE' | 'MIXED',
  intensity: string = "Fun and Safe"
): Promise<TruthOrDareItem[]> => {
  const count = 5;
  const prompt = `
請為聖誕派對產生 ${count} 個 Truth or Dare 題目。
類型（category）：${category}
強度／氛圍（intensity）：${intensity}
語言：繁體中文（台灣）。

只輸出 JSON 陣列，格式如下：
[
  {
    "type": "TRUTH" 或 "DARE",
    "content": "題目內容"
  },
  ...
]

要求：
- 若 category 為 "TRUTH"：全部 type = "TRUTH"
- 若 category 為 "DARE"：全部 type = "DARE"
- 若 category 為 "MIXED"：TRUTH 與 DARE 要混合
- 所有題目都要「好玩但安全」，避免尷尬或過度隱私。

請務必只輸出合法 JSON。
`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text) as TruthOrDareItem[];
  } catch (error) {
    console.error("Error generating TruthOrDare:", error);
    return [];
  }
};

// --- Quick Fire (This or That) ---
export const generateQuickFireQuestions = async (
  topic: string = "Christmas"
): Promise<QuickFireItem[]> => {
  const count = 10;
  const prompt = `
請為「${topic}」主題的派對產生 ${count} 題 This or That（快速二選一）問題。

要求：
- 每一題給兩個對比強烈的選項
- 語言：繁體中文（台灣）
- 題目與選項都要跟「${topic}」有關

只輸出 JSON 陣列，格式例如：
[
  {
    "question": "請選擇其一",
    "optionA": "熱紅酒",
    "optionB": "熱可可"
  },
  ...
]

請務必只輸出合法 JSON。
`;

  try {
    const text = await callAI(prompt);
    return JSON.parse(text) as QuickFireItem[];
  } catch (error) {
    console.error("Error generating QuickFire:", error);
    return [];
  }
};

// --- Gratitude Card Message ---
export const generateGratitudeMessage = async (
  recipient: string,
  memories: string,
  tone: string
): Promise<string> => {
  const prompt = `
請寫一段感人的聖誕卡片內文。

條件：
- 收件人：${recipient}
- 共同回憶或細節：${memories}
- 語氣風格：${tone}
- 語言：繁體中文（台灣）
- 長度約 150 字
- 不要輸出 JSON，只要純文字內容
`;

  try {
    const text = await callAI(prompt);
    return text || "聖誕快樂！";
  } catch (error) {
    console.error("Error generating card message:", error);
    throw error;
  }
};
