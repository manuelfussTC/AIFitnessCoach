import React from 'react';
import { Dumbbell, Trash2 } from 'lucide-react';
import { FeedbackInput } from './components/FeedbackInput';
import { ChatHistory } from './components/ChatHistory';
import { useFeedbackStore } from './store/feedbackStore';

function App() {
    const clearHistory = useFeedbackStore((state) => state.clearHistory);

    // Clear history on page load
    React.useEffect(() => {
        clearHistory();
    }, []);

    const handleLogoClick = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
            <header className="bg-black/50 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={handleLogoClick}
                        >
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Dumbbell className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">GymAI Coach</h1>
                                <p className="text-blue-200 text-sm">Your personal fitness assistant</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear the chat history?')) {
                                    clearHistory();
                                }
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            title="Clear chat history"
                        >
                            <Trash2 className="w-5 h-5 text-blue-200" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    <section>
                        <FeedbackInput />
                    </section>

                    <section className="space-y-6">
                        <ChatHistory />
                    </section>
                </div>
            </main>
        </div>
    );
}

export default App;