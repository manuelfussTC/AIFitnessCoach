import React from 'react';
import { Volume2, Dumbbell, MessageSquare, HelpCircle } from 'lucide-react';
import { OpenAIServiceResponse } from '../services/openai';
import { useFeedbackStore } from '../store/feedbackStore';

interface ResponseMessageProps {
    response: OpenAIServiceResponse;
}

export function ResponseMessage({ response }: ResponseMessageProps) {
    const addMessage = useFeedbackStore((state) => state.addMessage);

    const TypeIcon = {
        feedback: MessageSquare,
        training: Dumbbell,
        question: HelpCircle
    }[response.type];

    const handleSuggestionClick = (suggestion: string) => {
        addMessage(suggestion, 'text');
    };

    const renderSuggestions = () => {
        if (!response.suggestions || !Array.isArray(response.suggestions)) {
            return null;
        }

        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {response.suggestions.map((suggestion, index) => {
                    // Stelle sicher, dass wir einen String haben
                    const suggestionText = typeof suggestion === 'string'
                        ? suggestion
                        : typeof suggestion === 'object' && suggestion.question
                            ? suggestion.question
                            : String(suggestion);

                    return (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestionText)}
                            className="text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 hover:bg-blue-500/30 transition-colors"
                        >
                            {suggestionText}
                        </button>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                {TypeIcon && <TypeIcon className="w-5 h-5 text-blue-400" />}
                <span className="text-sm font-medium text-blue-200 capitalize">
                    {response.type} Response
                </span>
            </div>

            <div className="flex flex-col gap-6">
                {response.text && (
                    <p className="text-white text-lg">{response.text}</p>
                )}

                {response.workout && Array.isArray(response.workout) && (
                    <div className="space-y-4">
                        {response.workout.map((exercise, index) => (
                            <div key={index} className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-white font-medium flex items-center gap-2">
                                        <Dumbbell className="w-4 h-4" />
                                        {exercise.machine}
                                    </h3>
                                    <span className="text-blue-200 text-sm">Machine #{exercise.number}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-3">
                                    <div>
                                        <span className="text-blue-200 text-xs block">Sets</span>
                                        <span className="text-white font-medium">{exercise.sets}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-200 text-xs block">Reps</span>
                                        <span className="text-white font-medium">{exercise.reps}</span>
                                    </div>
                                    <div>
                                        <span className="text-blue-200 text-xs block">Weight</span>
                                        <span className="text-white font-medium">{exercise.weight}</span>
                                    </div>
                                </div>
                                {exercise.notes && (
                                    <p className="text-blue-200 text-sm italic">{exercise.notes}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {response.imageUrl && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                        <img
                            src={response.imageUrl}
                            alt="Exercise Demonstration"
                            className="w-full h-64 object-cover"
                        />
                    </div>
                )}

                {response.audioUrl && (
                    <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-lg">
                        <Volume2 className="w-5 h-5 text-blue-400" />
                        <audio controls className="flex-1">
                            <source src={response.audioUrl} type="audio/mpeg" />
                        </audio>
                    </div>
                )}

                {renderSuggestions()}
            </div>
        </div>
    );
}