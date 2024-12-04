import React from 'react';
import {
    Brain,
    Image,
    Volume2,
    Dumbbell,
    MessageSquare,
    Sparkles,
    ListChecks
} from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';

export type DetailedProcessingStep =
    | 'initial-analysis'
    | 'plan-creation'
    | 'image-generation'
    | 'audio-generation'
    | 'suggestions'
    | null;

const ProcessingSteps = () => {
    const currentStep = useFeedbackStore((state) => state.currentProcessingStep);

    const steps = [
        {
            id: 'initial-analysis',
            icon: Brain,
            title: "Analyzing Request",
            description: "Processing your fitness query"
        },
        {
            id: 'plan-creation',
            icon: Dumbbell,
            title: "Creating Workout Plan",
            description: "Designing your exercise routine"
        },
        {
            id: 'image-generation',
            icon: Image,
            title: "Generating Visuals",
            description: "Creating exercise demonstrations"
        },
        {
            id: 'audio-generation',
            icon: Volume2,
            title: "Preparing Audio",
            description: "Creating vocal form cues"
        },
        {
            id: 'suggestions',
            icon: ListChecks,
            title: "Finalizing Response",
            description: "Preparing follow-up suggestions"
        }
    ];

    // Find the index of the current step
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);

    return (
        <div className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-sm rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
                <h3 className="text-lg font-medium text-white">AI Coach Working</h3>
            </div>

            <div className="space-y-4">
                {steps.map((step, index) => {
                    const isPast = currentStepIndex > -1 && index < currentStepIndex;
                    const isCurrent = step.id === currentStep;
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                                isCurrent ? 'bg-blue-500/20 border border-blue-500/30' :
                                    isPast ? 'opacity-50' : 'opacity-30'
                            }`}
                        >
                            <div className={`p-2 rounded-full ${
                                isCurrent ? 'bg-blue-500/20' : 'bg-white/10'
                            }`}>
                                <Icon className={`w-5 h-5 ${
                                    isCurrent ? 'text-blue-400 animate-pulse' : 'text-blue-200'
                                }`} />
                            </div>

                            <div className="flex-1">
                                <h4 className="text-white font-medium">{step.title}</h4>
                                <p className="text-sm text-blue-200">{step.description}</p>
                            </div>

                            {isCurrent && (
                                <div className="flex space-x-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                                            style={{
                                                animationDelay: `${i * 0.2}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {!currentStep && (
                <div className="text-center text-blue-200 text-sm">
                    Ready for your next question
                </div>
            )}
        </div>
    );
};

export default ProcessingSteps;