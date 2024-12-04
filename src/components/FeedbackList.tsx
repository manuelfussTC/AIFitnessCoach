import React from 'react';
import { MessageSquare, Mic } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';

export function FeedbackList() {
    const feedbacks = useFeedbackStore((state) => state.feedbacks);

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            {feedbacks.map((feedback) => (
                <div
                    key={feedback.id}
                    className={`flex items-start gap-3 p-4 rounded-lg ${
                        feedback.processed
                            ? 'bg-white/5 border border-white/10'
                            : 'bg-white/10 border border-white/20'
                    }`}
                >
                    {feedback.type === 'text' ? (
                        <MessageSquare className="w-5 h-5 text-blue-400" />
                    ) : (
                        <Mic className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                        <p className="text-white">{feedback.content}</p>
                        <span className="text-sm text-blue-200">
              {new Date(feedback.timestamp).toLocaleString()}
            </span>
                    </div>
                    {!feedback.processed && (
                        <div className="animate-pulse-slow w-2 h-2 rounded-full bg-blue-500" />
                    )}
                </div>
            ))}
            {feedbacks.length === 0 && (
                <p className="text-center text-blue-200">No messages yet</p>
            )}
        </div>
    );
}