import { create } from 'zustand';
import { openAIService, OpenAIServiceResponse } from '../services/openai';

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    response?: OpenAIServiceResponse;
}

export type DetailedProcessingStep =
    | 'initial-analysis'
    | 'plan-creation'
    | 'image-generation'
    | 'audio-generation'
    | 'suggestions'
    | null;

interface FeedbackState {
    chatHistory: ChatMessage[];
    isProcessing: boolean;
    currentProcessingStep: DetailedProcessingStep;
    addMessage: (content: string, type: 'text' | 'audio') => Promise<void>;
    clearHistory: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
    chatHistory: [],
    isProcessing: false,
    currentProcessingStep: null,
    addMessage: async (content, type) => {
        const messageId = crypto.randomUUID();

        set((state) => ({
            isProcessing: true,
            currentProcessingStep: 'initial-analysis',
            chatHistory: [
                {
                    id: messageId,
                    type: 'user',
                    content,
                    timestamp: new Date()
                },
                ...state.chatHistory
            ]
        }));

        try {
            const response = await openAIService.processFeedback(
                content,
                type,
                (step: DetailedProcessingStep) => set({ currentProcessingStep: step })
            );

            set((state) => ({
                isProcessing: false,
                currentProcessingStep: null,
                chatHistory: [
                    {
                        id: crypto.randomUUID(),
                        type: 'assistant',
                        content: response.text || '',
                        timestamp: new Date(),
                        response
                    },
                    ...state.chatHistory
                ]
            }));
        } catch (error) {
            console.error('Error processing message:', error);
            set((state) => ({
                isProcessing: false,
                currentProcessingStep: null,
                chatHistory: [
                    {
                        id: crypto.randomUUID(),
                        type: 'assistant',
                        content: 'Sorry, there was an error processing your request.',
                        timestamp: new Date(),
                        response: {
                            text: 'Sorry, there was an error processing your request.',
                            type: 'feedback'
                        }
                    },
                    ...state.chatHistory
                ]
            }));
        }
    },
    clearHistory: () => set({
        chatHistory: [],
        currentProcessingStep: null,
        isProcessing: false
    })
}));