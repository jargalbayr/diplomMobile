import { ModernColors } from '@/constants/Colors';
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
    SafeAreaView,
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
      Alert.alert('Алдаа', 'И-мэйл болон нууц үгээ оруулна уу.');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('Алдаа', 'Бүртгүүлэхийн тулд нэрээ оруулна уу.');
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
        Alert.alert('Алдаа', response.error || 'Нэвтрэх үйлдэл амжилтгүй.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('Алдаа', 'Гэнэтийн алдаа гарлаа. Дахин оролдоно уу.');
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
        Alert.alert('Алдаа', response.error || 'Демо эрхээр нэвтрэх амжилтгүй.');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      Alert.alert('Алдаа', 'Демо эрхээр нэвтрэх боломжгүй байна.');
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ModernColors.primary} />
        <Text style={styles.loadingText}>Аппликейшн ачааллаж байна...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logo}
          />
          <Text style={styles.appTitle}>Үсний загвар AI</Text>
          <Text style={styles.appSubtitle}>
            Танд тохирсон үсний засалт өгөх хувийн туслах
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
          </Text>
          
          {!isLogin && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Таны нэр"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor={ModernColors.text.tertiary}
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="И-мэйл хаяг"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={ModernColors.text.tertiary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Нууц үг"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor={ModernColors.text.tertiary}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={ModernColors.text.inverse} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Бүртгэлгүй юу? Бүртгүүлэх" 
                : "Бүртгэлтэй юу? Нэвтрэх"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={handleDemoLogin}
          >
            <Text style={styles.demoButtonText}>
              Демо эрхээр нэвтрэх
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Үсний загвар AI
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.primary,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ModernColors.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: ModernColors.text.secondary,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 12,
  },
  appSubtitle: {
    fontSize: 16,
    color: ModernColors.text.secondary,
    marginHorizontal: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: ModernColors.background.tertiary,
    overflow: 'hidden',
  },
  input: {
    padding: 18,
    fontSize: 16,
    color: ModernColors.text.primary,
  },
  primaryButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    padding: 12,
  },
  switchText: {
    fontSize: 16,
    color: ModernColors.primary,
    fontWeight: '500',
  },
  demoButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: ModernColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    color: ModernColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
  },
});
