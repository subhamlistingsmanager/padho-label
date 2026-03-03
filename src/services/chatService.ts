/**
 * chatService.ts
 *
 * Service to interact with an LLM for nutrition questions.
 */

import axios from 'axios';

// Note: Expo uses EXPO_PUBLIC_ prefix to expose environment variables to the app.
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export type ChatMessage = {
    role: 'user' | 'model';
    text: string;
};

export const sendMessageToAI = async (message: string, context: string): Promise<string> => {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
        return "I'm the Padho Label AI Assistant! Please configure the GEMINI_API_KEY in chatService.ts to enable my full intelligence.";
    }

    try {
        const prompt = `
            You are a helpful nutrition assistant for the 'Padho Label' mobile app. 
            User's goal is to understand if a food product is healthy for them based on its label.

            PRODUCT CONTEXT:
            ${context}

            USER QUESTION:
            ${message}

            Provide a concise, evidence-based answer. Avoid medical advice.
        `;

        const response = await axios.post(GEMINI_URL, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        });

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Chat AI Error:', error);
        return "I'm having trouble connecting to my brain right now. Please try again later!";
    }
};
