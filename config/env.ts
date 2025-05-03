import Constants from 'expo-constants';

// Get environment variables from Expo's manifest
const getEnvironmentVariable = (name: string): string | undefined => {
  if (
    Constants.expoConfig &&
    Constants.expoConfig.extra &&
    Constants.expoConfig.extra[name]
  ) {
    return Constants.expoConfig.extra[name] as string;
  }
  return undefined;
};

export const ENV = {
  // OpenAI API key for generating hairstyle suggestions
  OPENAI_API_KEY: getEnvironmentVariable('OPENAI_API_KEY'),
  
  // Environment (development, production)
  APP_ENV: getEnvironmentVariable('APP_ENV') || 'development',
  
  // App configuration
  DEBUG_MODE: getEnvironmentVariable('APP_ENV') === 'development',
};

// Validate required environment variables
export const validateEnv = (): boolean => {
  const requiredVars = ['OPENAI_API_KEY'];
  
  // In development mode, we might allow missing variables
  if (ENV.APP_ENV === 'development') {
    return true;
  }
  
  const missingVars = requiredVars.filter(varName => !ENV[varName as keyof typeof ENV]);
  
  if (missingVars.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missingVars.join(', ')}`
    );
    return false;
  }
  
  return true;
}; 