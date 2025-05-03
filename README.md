# Face Style AI

A mobile app that analyzes users' face shapes and recommends personalized hairstyles using AI. Built with React Native and Expo.

## Features

- Face shape detection and analysis
- Personalized hairstyle recommendations based on face shape
- AI-generated hairstyle images with DALL-E 3
- Local image storage for uploaded and generated images
- User authentication and account management
- Saved hairstyles library
- Mongolian language support

## Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Expo CLI
- An OpenAI API key for AI features

### Installation

1. Clone the repository
   ```
   git clone https://github.com/jargalbayr/diplomMobile.git
   cd diplomMobile
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a local `.env` file in the project root with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Update the API key in `config/env.ts` for development:
   ```typescript
   dev: {
     OPENAI_API_KEY: 'your_api_key_here', // Add for local development
     API_URL: 'localhost',
     PORT: '3000',
   },
   ```
   
   > ⚠️ **IMPORTANT**: Never commit your API keys to GitHub. The `.env` file and the API keys in `config/env.ts` should be added to `.gitignore`.

### Running the App

Start the development server:
```
npx expo start
```

## Security Notes

This project uses environment variables for sensitive data like API keys. When sharing or pushing this code:

1. Always use environment variables for API keys
2. Keep `.env` files in `.gitignore`
3. Don't hardcode API keys in any files that will be committed
4. For production, use secure environment variable management
5. If you need to share API keys with team members, use a secure method

## Technology Stack

- React Native
- Expo
- TypeScript
- OpenAI API (GPT-4o and DALL-E 3)
- SQLite for local database
- Expo FileSystem for image storage
