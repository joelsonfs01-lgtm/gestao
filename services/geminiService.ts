
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, AIInsightResponse } from "../types";

/**
 * Generates financial insights using Gemini AI.
 * Uses structured JSON output with a predefined schema.
 */
export const getFinancialInsights = async (transactions: Transaction[]): Promise<AIInsightResponse> => {
  // Initialize Gemini with the required named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const transactionsContext = transactions.map(t => ({
    date: t.date,
    desc: t.description,
    val: t.amount,
    cat: t.category,
    type: t.type
  }));

  const prompt = `Analise os seguintes dados de fluxo de caixa de uma empresa e forneça insights estratégicos:
  ${JSON.stringify(transactionsContext)}
  
  Por favor, retorne um resumo da saúde financeira, sugestões para melhorar o lucro e avisos sobre possíveis riscos.
  Responda em Português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Resumo geral da situação financeira." },
            suggestions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de sugestões práticas."
            },
            warnings: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de avisos ou riscos detectados."
            }
          },
          required: ["summary", "suggestions", "warnings"],
          propertyOrdering: ["summary", "suggestions", "warnings"]
        }
      }
    });

    // Access .text property directly as per the latest SDK guidelines
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr.trim()) as AIInsightResponse;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return {
      summary: "Não foi possível gerar a análise no momento.",
      suggestions: ["Verifique sua conexão e tente novamente."],
      warnings: ["Erro de processamento da IA."]
    };
  }
};
