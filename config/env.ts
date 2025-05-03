import Constants from 'expo-constants';

// Load environment variables 
// In production, these should come from environment variables or a secure source
// For development, you can set them here temporarily but don't commit API keys
const ENV = {
  dev: {
    OPENAI_API_KEY: '', // Add your API key during development but never commit it
    API_URL: 'localhost',
    PORT: '3000',
  },
  prod: {
    OPENAI_API_KEY: '', // Should be loaded from a secure source in production
    API_URL: 'api.yourdomain.com',
    PORT: '443',
  }
};

// Determine the environment
const getEnvVars = () => {
  const env = Constants.expoConfig?.extra?.env || process.env.NODE_ENV || 'dev';
  console.log(`[ENV] Loading environment: ${env}`);
  if (env === 'prod') {
    return ENV.prod;
  }
  return ENV.dev;
};

export default getEnvVars();

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