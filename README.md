# GymAI Coach - Your Personal Fitness Assistant 💪

GymAI Coach is an interactive fitness assistant powered by advanced AI technology. It provides personalized workout guidance, form demonstrations, audio instructions, and motivational support to help users achieve their fitness goals.

## Features

- **Real-time AI Interaction**: Get instant responses to your fitness questions
- **Visual Demonstrations**: AI-generated illustrations showing proper exercise form
- **Audio Guidance**: Voice instructions and motivational cues
- **Workout Planning**: Detailed exercise plans with sets, reps, and form tips
- **Progress Tracking**: Chat history to review your training journey
- **Voice Input**: Speak your questions for hands-free interaction
- **Follow-up Suggestions**: Smart recommendations for continued progress

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI GPT-4, DALL-E 3, TTS
- **State Management**: Zustand
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom configuration
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/manuelfussTC/AIFitnessCoach.git
cd AIFitnessCoach
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:
```env
VITE_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
AIFitnessCoach/
├── src/
│   ├── components/         # React components
│   ├── services/          # API services
│   ├── store/             # State management
│   ├── types/             # TypeScript definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── public/               # Static assets
└── ...config files
```

## Key Components

### FeedbackInput
Handles user input through text and voice, providing an intuitive interface for interacting with the AI coach.

### ProcessingSteps
Shows real-time progress of AI processing, including:
- Initial analysis
- Workout plan creation
- Image generation
- Audio generation
- Follow-up suggestions

### ResponseMessage
Displays AI responses including:
- Exercise instructions
- Workout plans
- Form demonstrations
- Audio guidance
- Motivational content

## AI Features

### Text Generation (GPT-4)
- Exercise advice and form tips
- Workout planning
- Follow-up suggestions
- Motivational messages

### Image Generation (DALL-E 3)
- Exercise form demonstrations
- Motivational fitness illustrations
- Technical diagrams

### Audio Features
- Text-to-speech instructions (TTS-1)
- Voice input transcription (Whisper)
- Motivational audio cues

## Configuration

### Tailwind CSS
Custom configuration includes:
- Custom animations
- Custom colors
- Typography plugin
- Responsive design utilities

### Vite
Optimized build configuration with:
- React plugin
- TypeScript support
- Environment variable handling
- Module optimization

## Development Guidelines

### Adding New Features
1. Create new components in `src/components`
2. Update types in `src/types` if needed
3. Add new services in `src/services` if required
4. Update state management in `src/store` as necessary

### Code Style
- Use TypeScript for type safety
- Follow React hooks guidelines
- Implement error boundaries where needed
- Use Tailwind CSS for styling
- Maintain component modularity

## Environment Variables

Required environment variables:
- `VITE_OPENAI_API_KEY`: Your OpenAI API key

## Build and Deployment

Build the project:
```bash
npm run build
# or
yarn build
```

Preview the build:
```bash
npm run preview
# or
yarn preview
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository:
[https://github.com/manuelfussTC/AIFitnessCoach/issues](https://github.com/manuelfussTC/AIFitnessCoach/issues)

## Author

Manuel Fuss ([GitHub](https://github.com/manuelfussTC))

---

Built with ❤️ using React, TypeScript, and OpenAI