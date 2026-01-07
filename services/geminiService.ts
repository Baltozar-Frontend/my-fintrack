
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const transactionsSummary = transactions.map(t => 
    `${t.date}: [${t.type.toUpperCase()}] ${t.description} - ${t.amount} руб. (${t.category})`
  ).join('\n');

  const prompt = `
    Анализируй мои финансы в рублях (доходы и расходы):
    ${transactionsSummary}

    Пожалуйста, предоставь:
    1. Краткий обзор баланса в рублях.
    2. Три конкретных совета по оптимизации расходов или увеличению накоплений.
    3. Выдели самую крупную статью расходов и предложи альтернативу.
    
    Ответ должен быть на русском языке, профессиональным, но дружелюбным. Используй эмодзи для наглядности.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Не удалось получить совет от ИИ. Проверьте подключение или попробуйте позже.";
  }
};
