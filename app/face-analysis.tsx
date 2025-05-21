import { ModernColors } from '@/constants/Colors';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function FaceAnalysisScreen() {
  const { mode } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  useEffect(() => {
    if (mode === 'camera' || mode === 'gallery') {
      pickImage();
    }
  }, [mode]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        
        // For Android, make sure we have a reliable file path by copying to app's cache directory
        if (Platform.OS === 'android') {
          try {
            const fileName = `face_image_${new Date().getTime()}.jpg`;
            const destUri = `${FileSystem.cacheDirectory}${fileName}`;
            
            console.log(`[DEBUG] Copying image from ${selectedImage.uri} to ${destUri}`);
            
            // Copy the file to cache directory
            await FileSystem.copyAsync({
              from: selectedImage.uri,
              to: destUri
            });
            
            // Verify the file exists
            const fileInfo = await FileSystem.getInfoAsync(destUri);
            if (fileInfo.exists) {
              console.log('[DEBUG] Image copied successfully to:', destUri);
              setImage(destUri);
            } else {
              console.error('[DEBUG] Failed to copy image to cache');
              setImage(selectedImage.uri); // Fallback to original URI
            }
          } catch (err) {
            console.error('[DEBUG] Error copying image file:', err);
            setImage(selectedImage.uri); // Fallback to original URI
          }
        } else {
          // iOS should work fine with the original URI
          setImage(selectedImage.uri);
        }
      } else {
        router.back();
      }
    } catch (err) {
      console.error("Image picker error:", err);
      Alert.alert("Алдаа", "Таны зургийг хандах боломжгүй байна. Дахин оролдоно уу.");
      router.back();
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    setLoadingMessage('Таны зургийг үнэлж байна...');
    
    try {
      // Verify the image exists before proceeding
      const fileInfo = await FileSystem.getInfoAsync(image);
      if (!fileInfo.exists) {
        throw new Error('Image file not found');
      }
      
      // Convert image to base64 for API calls
      setLoadingMessage('Зургийг анализд бэлтгэж байна...');
      let base64Image;
      try {
        base64Image = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch (error) {
        console.error('[DEBUG] Error reading image as base64:', error);
        throw new Error('Failed to prepare image for analysis');
      }
      
      // Navigate to results with the image
      // The hairstyle suggestions will be generated directly in the results page
      // with GPT-4o analyzing the full photo
      router.push({
        pathname: '/hairstyle-results',
        params: { 
          imageUri: image,
          directGptAnalysis: 'true' // Flag to indicate we're using direct GPT-4o analysis without face shape detection
        }
      });
    } catch (error) {
      console.error('[DEBUG] Error analyzing image:', error);
      Alert.alert('Алдаа', 'Зургийг боловсруулж чадсангүй. Өөр зураг оруулна уу.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Үсний загварын санал</Text>
      </View>
      
      <View style={styles.imagePreviewContainer}>
        {image ? (
          <>
            <View style={styles.imageFrame}>
              <Image 
                source={{ uri: image }} 
                style={styles.imagePreview} 
              />
            </View>
            <Text style={styles.helperText}>
              Өөрийн тань зурагт үндэслэн танд тохирсон үсний загваруудыг санал болгоно
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={() => {
                  setImage(null);
                  pickImage();
                }}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Дахин оролдох
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={analyzeImage}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={ModernColors.text.inverse} />
                ) : (
                  <Text style={styles.buttonText}>
                    Үсний загвар санал болгох
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {loading && loadingMessage ? (
              <Text style={styles.loadingMessage}>{loadingMessage}</Text>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={styles.loadingIconContainer}>
              <ActivityIndicator size="large" color={ModernColors.primary} />
            </View>
            <Text style={styles.loadingText}>Зураг ачаалж байна...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.primary,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  imageFrame: {
    width: 320,
    height: 320,
    borderRadius: 20,
    padding: 4,
    backgroundColor: ModernColors.background.primary,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  helperText: {
    fontSize: 16,
    color: ModernColors.text.secondary,
    textAlign: 'center',
    marginBottom: 36,
    maxWidth: '80%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: ModernColors.background.primary,
    borderWidth: 1.5,
    borderColor: ModernColors.primary,
    shadowColor: 'transparent',
  },
  buttonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: ModernColors.primary,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: ModernColors.background.tertiary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  loadingText: {
    color: ModernColors.text.secondary,
    fontSize: 16,
  },
  loadingMessage: {
    marginTop: 16,
    color: ModernColors.text.tertiary,
    fontSize: 14,
    textAlign: 'center',
  },
}); 