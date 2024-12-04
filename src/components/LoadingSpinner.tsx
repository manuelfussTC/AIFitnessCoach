import React from 'react';

export function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-4">
            <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
                <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

export function DumbbellLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-4 text-blue-400">
            <div className="relative">
                <div className="w-16 h-4 bg-current rounded-full absolute top-6 animate-pulse" />
                <div className="w-4 h-16 bg-current rounded-full animate-bounce">
                    <div className="w-8 h-8 bg-current rounded-full absolute -left-2 -top-2" />
                    <div className="w-8 h-8 bg-current rounded-full absolute -left-2 -bottom-2" />
                </div>
            </div>
            <p className="mt-4 text-sm text-blue-200">Loading your workout plan...</p>
        </div>
    );
}