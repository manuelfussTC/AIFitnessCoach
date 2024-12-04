import OpenAI from 'openai';
import {DetailedProcessingStep} from '../store/feedbackStore';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export interface OpenAIServiceResponse {
    text?: string;
    imageUrl?: string;
    audioUrl?: string;
    type: 'feedback' | 'training' | 'question';
    suggestions?: string[];
    workout?: {
        machine: string;
        number: number;
        sets: number;
        reps: number | string;
        weight: string;
        notes?: string;
    }[];
}

// Helfer-Funktion für sicheres JSON Parsing
const safeJSONParse = (text: string, fallback: any = null) => {
    try {
        const cleanText = text
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error('JSON Parse error for text:', text);
        return fallback;
    }
};

// Helfer-Funktion für kontrollierte Verzögerung
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const openAIService = {
    async generateSpeech(text: string): Promise<string> {
        try {
            const cleanText = text.replace(/[\[\]]/g, '').trim();
            console.log('Generating speech for:', cleanText);

            const mp3 = await openai.audio.speech.create({
                model: "tts-1",
                voice: "alloy",
                input: cleanText,
            });

            const audioUrl = URL.createObjectURL(new Blob([await mp3.arrayBuffer()], {type: 'audio/mpeg'}));
            console.log('Audio URL generated successfully');
            return audioUrl;
        } catch (error) {
            console.error('Speech generation failed:', error);
            throw error;
        }
    },

    async transcribeAudio(audioBlob: Blob): Promise<string> {
        const transcription = await openai.audio.transcriptions.create({
            file: new File([audioBlob], "audio.webm", {type: "audio/webm"}),
            model: "whisper-1",
        });
        return transcription.text;
    },

    async generateImage(exercise: string): Promise<string> {
        try {
            const safeExercise = exercise
                .replace(/[^\w\s-]/g, '')
                .trim();

            console.log('Generating image for:', safeExercise);

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: `Simple instructional line drawing showing perfect form for a ${safeExercise} exercise. Clean, minimal fitness illustration with black lines on white background. Focus on proper technique, anatomical accuracy, and clear demonstration of movement.`,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                style: "natural"
            });

            if (!response.data[0]?.url) {
                throw new Error('No image URL in response');
            }

            console.log('Image generated successfully');
            return response.data[0].url;
        } catch (error) {
            console.error('Image generation error:', error);
            return '';
        }
    },

    async generateMotivationalImage(context: string): Promise<string> {
        try {
            let imagePrompt = context
                .toLowerCase()
                .match(/(?:exercise|training|workout|machine)s?\s+(\w+(?:\s+\w+){0,3})/i)?.[1] || 'fitness workout';

            console.log('Generating motivational image for:', imagePrompt);

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: `Inspiring line drawing of someone performing a ${imagePrompt} with excellent form and determination. Simple, clean fitness illustration style. Black lines on white background. Focus on proper technique and motivational energy.`,
                n: 1,
                size: "1024x1024",
                quality: "standard",
                style: "natural"
            });

            if (!response.data[0]?.url) {
                throw new Error('No image URL in response');
            }

            console.log('Motivational image generated successfully');
            return response.data[0].url;
        } catch (error) {
            console.error('Motivational image generation error:', error);
            return '';
        }
    },

    async generateMotivation(context: string): Promise<string> {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "Generate a short, energetic motivational message (max 15 words) for someone heading to their next exercise."
                },
                {
                    role: "user",
                    content: `Context: ${context}`
                }
            ],
            temperature: 0.7,
            max_tokens: 50
        });

        return response.choices[0].message.content || "Let's crush this next exercise! You've got this!";
    },

    async processFeedback(
        content: string,
        type: 'text' | 'audio',
        onStepChange?: (step: DetailedProcessingStep) => void
    ): Promise<OpenAIServiceResponse> {
        try {
            // Step 1: Initial Analysis
            onStepChange?.('initial-analysis');
            console.log('Starting initial analysis...');
            await delay(1000);

            const initialResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are an experienced gym trainer and motivator. Respond EXACTLY in this format with NO markdown:

1. First line: One brief, motivating greeting/response
2. ALWAYS add:
GENERATE_IMAGE: [specific exercise or motivational fitness scene]

3. If exercise-related, also add:
WORKOUT_PLAN: [
  {
    "machine": "Machine name",
    "number": machine_number,
    "sets": 3-4,
    "reps": "8-12",
    "weight": "specific recommendation",
    "notes": "form tips and motivation"
  }
]

4. Always add:
GENERATE_AUDIO: [clear, motivating instruction or encouragement]

Keep all responses positive and motivating. Always include specific exercise names or fitness scenes for image generation.`
                    },
                    {role: "user", content}
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const responseText = initialResponse.choices[0].message.content || '';
            console.log('Response received:', responseText);

            const response: OpenAIServiceResponse = {
                text: responseText.split('\n')[0],
                type: responseText.toLowerCase().includes('machine') ||
                responseText.toLowerCase().includes('exercise') ? 'training' : 'question'
            };

            // Step 2: Parse workout plan
            onStepChange?.('plan-creation');
            console.log('Processing workout plan...');
            await delay(1000);

            const workoutMatch = responseText.match(/WORKOUT_PLAN:\s*(\[[\s\S]*?\])(?:\n|$)/);
            if (workoutMatch) {
                const workoutPlan = safeJSONParse(workoutMatch[1], []);
                if (workoutPlan) {
                    response.workout = workoutPlan;
                    console.log('Workout plan processed successfully');
                }
            }

            // Step 3: Always handle image generation
            onStepChange?.('image-generation');
            console.log('Starting image generation...');
            await delay(1000);

            let imageUrl = '';
            const imageMatch = responseText.match(/GENERATE_IMAGE:\s*(.*?)(?:\n|$)/);

            if (imageMatch) {
                const imagePrompt = imageMatch[1].trim();
                console.log('Generating specific exercise image');
                imageUrl = await this.generateImage(imagePrompt);
            }

            if (!imageUrl) {
                console.log('Falling back to motivational image');
                imageUrl = await this.generateMotivationalImage(responseText);
            }

            response.imageUrl = imageUrl;
            console.log('Image generation completed');

            // Step 4: Always handle audio generation
            onStepChange?.('audio-generation');
            console.log('Processing audio...');
            await delay(1000);

            try {
                // First: Exercise instruction if available
                const audioMatch = responseText.match(/GENERATE_AUDIO:\s*(.*?)(?:\n|$)/);
                if (audioMatch) {
                    const instructionAudio = await this.generateSpeech(audioMatch[1].trim());
                    response.audioUrl = instructionAudio;
                    console.log('Exercise instruction audio generated');
                }

                // Always add motivation
                const motivation = await this.generateMotivation(responseText);
                const motivationAudio = await this.generateSpeech(motivation);

                if (!response.audioUrl) {
                    response.audioUrl = motivationAudio;
                    console.log('Motivation audio generated');
                }
            } catch (error) {
                console.error('Audio generation failed:', error);
            }

            // Step 5: Generate follow-up suggestions
            onStepChange?.('suggestions');
            console.log('Generating follow-up suggestions...');
            await delay(1000);

            const suggestionsResponse = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: 'Generate 2-3 motivating follow-up questions about exercise form or alternatives. Return ONLY a raw JSON array of strings.'
                    },
                    {role: "user", content: responseText}
                ],
                temperature: 0.7,
                max_tokens: 150
            });

            const suggestionText = suggestionsResponse.choices[0].message.content || '[]';
            console.log('Raw suggestions:', suggestionText);

            const suggestions = safeJSONParse(suggestionText, []);
            if (Array.isArray(suggestions)) {
                response.suggestions = suggestions;
                console.log('Suggestions processed successfully');
            }

            // Fertig
            onStepChange?.(null);
            return response;

        } catch (error) {
            console.error('Process feedback error:', error);
            onStepChange?.(null);
            throw error;
        }
    }
};