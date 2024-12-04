import React from 'react';
import { useFeedbackStore } from '../store/feedbackStore';
import { ResponseMessage } from './ResponseMessage';
import ProcessingSteps from './ProcessingSteps';

export function ChatHistory() {
    const { chatHistory, isProcessing } = useFeedbackStore();

    return (
        <div className="space-y-6">
            {isProcessing && (
                <div className="mb-6">
                    <ProcessingSteps />
                </div>
            )}

            {chatHistory.map((message) => (
                <div
                    key={message.id}
                    className={`${
                        message.type === 'user' ? 'ml-auto max-w-xl' : 'mr-auto max-w-2xl'
                    }`}
                >
                    {message.type === 'user' ? (
                        <div className="bg-blue-500/20 rounded-lg p-4">
                            <p className="text-white">{message.content}</p>
                            <span className="text-xs text-blue-200">
                                {message.timestamp.toLocaleTimeString()}
                            </span>
                        </div>
                    ) : (
                        message.response && <ResponseMessage response={message.response} />
                    )}
                </div>
            ))}

            {chatHistory.length === 0 && !isProcessing && (
                <div className="text-center space-y-4">
                    <p className="text-blue-200">
                        Welcome to your AI Fitness Coach! Ask me anything about workouts,
                        exercises, or fitness advice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            "Create a beginner workout plan",
                            "How to do a proper squat?",
                            "Best exercises for core strength"
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => {
                                    const addMessage = useFeedbackStore.getState().addMessage;
                                    addMessage(suggestion, 'text');
                                }}
                                className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition-colors"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}