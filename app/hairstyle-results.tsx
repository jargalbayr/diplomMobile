import FaceShapeResultWithSave from '@/components/FaceShapeResultWithSave';
import { ModernColors } from '@/constants/Colors';
import { SavedImagesProvider } from '@/context/SavedImagesContext';
import { detectFaceShape, getDirectHairstyleSuggestions, getHairstyleSuggestions } from '@/services/faceDetectionService';
import * as FileSystem from 'expo-file-system';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FaceShapeResultsData } from '@/components/FaceShapeResult';

export default function HairstyleResultsScreen() {
  const { imageUri, directGptAnalysis } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<FaceShapeResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validatedImageUri, setValidatedImageUri] = useState<string | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('Анализ бэлтгэж байна...');

  // First validate the image exists
  useEffect(() => {
    console.log('[DEBUG] HairstyleResults: Component mounted with imageUri:', imageUri ? (imageUri as string).substring(0, 30) + '...' : 'null');
    console.log('[DEBUG] Direct GPT Analysis enabled:', directGptAnalysis === 'true');
    
    if (!imageUri) {
      console.error('[DEBUG] HairstyleResults: No image provided');
      setError('Зураг өгөөгүй байна.');
      setLoading(false);
      return;
    }

    const validateImage = async () => {
      try {
        const imgUri = imageUri as string;
        // Check if file exists before proceeding
        const fileInfo = await FileSystem.getInfoAsync(imgUri);
        
        console.log('[DEBUG] File info:', fileInfo);
        
        if (fileInfo.exists && !fileInfo.isDirectory) {
          setValidatedImageUri(imgUri);
        } else {
          console.error('[DEBUG] HairstyleResults: Image file not found:', imgUri);
          setError('Зураг олдсонгүй эсвэл хандах боломжгүй байна.');
          setLoading(false);
        }
      } catch (err) {
        console.error('[DEBUG] HairstyleResults: Error validating image:', err);
        setError('Зурагт хандаж чадсангүй. Өөр зураг ашиглан дахин оролдоно уу.');
        setLoading(false);
      }
    };

    validateImage();
  }, [imageUri, directGptAnalysis]);

  // Once we have a validated image URI, proceed with analysis
  useEffect(() => {
    if (!validatedImageUri) return;

    const analyzeImage = async () => {
      console.log('[DEBUG] HairstyleResults: Starting image analysis');
      try {
        // Try to read the image with error handling
        let base64Image;
        try {
          console.log('[DEBUG] HairstyleResults: Reading image as base64');
          setAnalysisStep('Зураг уншиж байна...');
          base64Image = await FileSystem.readAsStringAsync(validatedImageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          console.log('[DEBUG] HairstyleResults: Base64 image length:', base64Image.length);
        } catch (readError) {
          console.error('[DEBUG] Error reading image file:', readError);
          
          // If reading fails, we'll use mock data without the base64 image
          console.log('[DEBUG] HairstyleResults: Calling detectFaceShape without image data');
          const faceShapeResult = await detectFaceShape(validatedImageUri);
          
          // Get mock hairstyle suggestions
          const mockSuggestions = {
            faceShape: faceShapeResult.faceShape,
            description: getDescriptionForFaceShape(faceShapeResult.faceShape),
            hairstyles: getMockHairstyles(faceShapeResult.faceShape)
          };
          
          setResults(mockSuggestions);
          return;
        }

        if (directGptAnalysis === 'true') {
          // Use direct GPT-4o analysis without face shape detection
          setAnalysisStep('AI-аар таны төрхийг шинжилж байна...');
          console.log('[DEBUG] HairstyleResults: Using direct GPT-4o analysis');
          
          const hairstyleSuggestions = await getDirectHairstyleSuggestions(base64Image);
          console.log('[DEBUG] HairstyleResults: Got direct hairstyle suggestions:', 
            hairstyleSuggestions ? `${hairstyleSuggestions.hairstyles?.length} hairstyles suggested` : 'null');
            
          setResults(hairstyleSuggestions);
        } else {
          // Traditional flow: Detect face shape first, then get hairstyle suggestions
          setAnalysisStep('Нүүрний хэлбэрийг илрүүлж байна...');
          console.log('[DEBUG] HairstyleResults: Calling detectFaceShape');
          const faceShapeResult = await detectFaceShape(validatedImageUri);
          console.log('[DEBUG] HairstyleResults: Face shape detected:', faceShapeResult);

          // Get hairstyle suggestions based on face shape
          setAnalysisStep('Үсний загварын санал бэлтгэж байна...');
          console.log('[DEBUG] HairstyleResults: Calling getHairstyleSuggestions');
          const hairstyleSuggestions = await getHairstyleSuggestions(
            faceShapeResult.faceShape,
            base64Image
          );
          console.log('[DEBUG] HairstyleResults: Got hairstyle suggestions:', 
            hairstyleSuggestions ? `${hairstyleSuggestions.hairstyles?.length} hairstyles for ${hairstyleSuggestions.faceShape}` : 'null');

          setResults(hairstyleSuggestions);
        }
        
        console.log('[DEBUG] HairstyleResults: Results set successfully');
      } catch (err) {
        console.error('[DEBUG] HairstyleResults: Error analyzing image:', err);
        setError('Failed to analyze image. Please try again.');
      } finally {
        console.log('[DEBUG] HairstyleResults: Analysis complete, setting loading to false');
        setLoading(false);
      }
    };

    analyzeImage();
  }, [validatedImageUri, directGptAnalysis]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Анализ хийж байна' }} />
        <ActivityIndicator size="large" color={ModernColors.primary} />
        <Text style={styles.loadingText}>{analysisStep}</Text>
      </View>
    );
  }

  if (error || !results) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Алдаа' }} />
        <Text style={styles.errorText}>{error || 'Тодорхойгүй алдаа гарлаа'}</Text>
        <Text 
          style={styles.backLink}
          onPress={() => router.back()}
        >
          Дахин оролдох
        </Text>
      </View>
    );
  }

  return (
    <SavedImagesProvider>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Таны үр дүн' }} />
        <FaceShapeResultWithSave 
          imageUri={validatedImageUri || (imageUri as string)} 
          results={results} 
        />
      </View>
    </SavedImagesProvider>
  );
}

// Helper function to get description for a face shape
function getDescriptionForFaceShape(faceShape: string): string {
  const descriptions: Record<string, string> = {
    'oval': 'Oval face shapes are versatile and balanced, with a slightly wider forehead and cheekbones compared to the jawline.',
    'round': 'Round face shapes have soft features with a similar width and length, and a rounded jawline.',
    'square': 'Square face shapes have strong, angular jawlines with roughly equal width and length dimensions.',
    'heart': 'Heart face shapes have a wider forehead and cheekbones with a narrower jawline and chin.',
    'diamond': 'Diamond face shapes have narrow foreheads and jawlines with wide cheekbones.',
    'rectangular': 'Rectangular face shapes are longer than they are wide, with a straight cheek line.',
    'oblong': 'Oblong face shapes are longer than they are wide, similar to rectangular but with more curved edges.'
  };
  
  return descriptions[faceShape.toLowerCase()] || 
    'This face shape has unique proportions that can be complemented with the right hairstyle.';
}

// Helper function to get mock hairstyles
function getMockHairstyles(faceShape: string): any[] {
  return [
    {
      name: 'Layered Bob',
      description: `A versatile style that works well with ${faceShape} face shapes. The layers add texture and dimension.`,
      imageUrl: 'https://i.imgur.com/example1.jpg'
    },
    {
      name: 'Side-Swept Bangs',
      description: `Perfect for ${faceShape} face shapes, adding softness and asymmetry that complements your features.`,
      imageUrl: 'https://i.imgur.com/example2.jpg'
    },
    {
      name: 'Textured Pixie',
      description: `A bold choice that emphasizes facial features and adds height, ideal for ${faceShape} face shapes.`,
      imageUrl: 'https://i.imgur.com/example3.jpg'
    },
    {
      name: 'Long Layers',
      description: `Creates movement and frames the face beautifully, enhancing ${faceShape} face shapes.`,
      imageUrl: 'https://i.imgur.com/example4.jpg'
    },
    {
      name: 'Curtain Bangs',
      description: `Trendy style that works wonderfully with ${faceShape} face shapes by softening the forehead.`,
      imageUrl: 'https://i.imgur.com/example5.jpg'
    }
  ];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ModernColors.background.secondary,
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: ModernColors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ModernColors.background.secondary,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: ModernColors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  backLink: {
    fontSize: 16,
    color: ModernColors.primary,
    fontWeight: 'bold',
  },
}); 