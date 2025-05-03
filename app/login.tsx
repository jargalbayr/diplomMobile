import { isAuthenticated, login, register } from '@/services/authService';
import { initDatabase, initMockData } from '@/services/databaseService';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Initialize the database
        await initDatabase();
        await initMockData();
        
        // Check if the user is already authenticated
        const authenticated = await isAuthenticated();
        if (authenticated) {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };

    initApp();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Error', 'Please enter your name to register.');
      return;
    }

    setLoading(true);

    try {
      let response;
      
      if (isLogin) {
        response = await login({ email, password });
      } else {
        response = await register({ email, password, name });
      }

      if (response.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', response.error || 'Authentication failed.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Convenience function for dev/demo
  const handleDemoLogin = async () => {
    setEmail('demo@example.com');
    setPassword('password123');
    setLoading(true);
    
    try {
      const response = await login({ 
        email: 'demo@example.com', 
        password: 'password123' 
      });
      
      if (response.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', response.error || 'Demo login failed.');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert('Error', 'Failed to login with demo account.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5048E5" />
        <Text style={styles.loadingText}>Initializing app...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.logo}
        />
        <Text style={styles.appTitle}>Face Style AI</Text>
        <Text style={styles.appSubtitle}>
          Your personal hairstyle recommendation assistant
        </Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </Text>
        
        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.demoButton}
          onPress={handleDemoLogin}
        >
          <Text style={styles.demoButtonText}>
            Try Demo Account
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © {new Date().getFullYear()} Face Style AI
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 40,
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5048E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    padding: 8,
  },
  switchText: {
    fontSize: 16,
    color: '#5048E5',
  },
  demoButton: {
    marginTop: 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5048E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#5048E5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
