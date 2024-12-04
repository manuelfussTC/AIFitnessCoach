import React from 'react';
import { useFeedbackStore } from '../store/feedbackStore';

export function ImageGallery() {
    const images = useFeedbackStore((state) =>
        state.feedbacks
            .filter(f => state.responses.get(f.id)?.imageUrl)
            .map(f => ({
                id: f.id,
                url: state.responses.get(f.id)!.imageUrl!,
                text: f.content
            }))
    );

    if (images.length === 0) {
        return (
            <div className="glassmorphism p-4 text-center">
                <p className="text-blue-200">Exercise demonstrations will appear here</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {images.map((image) => (
                <div key={image.id} className="glassmorphism overflow-hidden rounded-lg">
                    <img
                        src={image.url}
                        alt={image.text}
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                        <p className="text-sm text-blue-200">{image.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}