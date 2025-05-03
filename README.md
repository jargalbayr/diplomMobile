# Face Style AI - Mobile App

A mobile application that suggests personalized hairstyles using AI based on the user's face shape.

## Features

- Capture photo using device camera or select from gallery
- AI-powered face shape detection using TensorFlow.js
- Personalized hairstyle recommendations based on face shape
- Privacy-safe image processing (all processing done on device)

## Tech Stack

- React Native with Expo
- TypeScript
- TensorFlow.js for face detection and analysis
- OpenAI API for personalized hairstyle suggestions
- Expo Camera and Image Picker

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (optional)
- [Expo Go](https://expo.dev/client) app on your physical device (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd diplommobile
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory based on `.env.example`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   APP_ENV=development
   ```

4. Start the development server:
   ```bash
   yarn start
   # or
   npm start
   ```

5. Follow the instructions in the terminal to open the app on your device or emulator.

## Usage

1. Open the app
2. Choose either "Take Photo" or "Upload Photo"
3. Center your face in the camera view or select a photo showing your face clearly
4. Wait for the AI to analyze your face shape
5. View your personalized hairstyle recommendations

## Privacy

The app processes all images locally on your device. When using the OpenAI API:
- Images are sent securely to OpenAI's servers
- Images are not stored permanently and are deleted after processing
- No personal identification information is shared

## License

MIT
