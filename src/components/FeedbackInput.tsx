import React, { useState, useRef } from 'react';
import { Mic, Send } from 'lucide-react';
import { useFeedbackStore } from '../store/feedbackStore';
import { openAIService } from '../services/openai';

export function FeedbackInput() {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const addMessage = useFeedbackStore((state) => state.addMessage);
  const isProcessing = useFeedbackStore((state) => state.isProcessing);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isProcessing) {
      const message = text;
      setText('');
      await addMessage(message, 'text');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        try {
          const transcription = await openAIService.transcribeAudio(audioBlob);
          await addMessage(transcription, 'audio');
        } catch (error) {
          console.error('Error processing audio:', error);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
      <form onSubmit={handleSubmit} className="sticky top-4 w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-sm rounded-lg p-4 z-10">
        <div className="flex gap-2">
          <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask your fitness coach anything..."
              disabled={isRecording || isProcessing}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white/20"
          />
          <button
              type="button"
              onClick={toggleRecording}
              disabled={isProcessing}
              className={`p-3 rounded-lg ${
                  isRecording ? 'bg-red-500' : 'bg-white/10 border border-white/20'
              } hover:bg-opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Mic className={`w-6 h-6 ${isRecording ? 'text-white' : 'text-blue-200'}`} />
          </button>
          <button
              type="submit"
              disabled={!text.trim() || isProcessing || isRecording}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </form>
  );
}