import * as FileSystem from 'expo-file-system';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import FaceShapeResult, { FaceShapeResultsData } from '@/components/FaceShapeResult';
import { detectFaceShape, getHairstyleSuggestions } from '@/services/faceDetectionService';

export default function HairstyleResultsScreen() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<FaceShapeResultsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[DEBUG] HairstyleResults: Component mounted with imageUri:', imageUri ? (imageUri as string).substring(0, 30) + '...' : 'null');
    
    if (!imageUri) {
      console.error('[DEBUG] HairstyleResults: No image provided');
      setError('No image provided.');
      setLoading(false);
      return;
    }

    const analyzeImage = async () => {
      console.log('[DEBUG] HairstyleResults: Starting image analysis');
      try {
        // Convert image to base64 for API calls
        console.log('[DEBUG] HairstyleResults: Reading image as base64');
        const base64Image = await FileSystem.readAsStringAsync(imageUri as string, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log('[DEBUG] HairstyleResults: Base64 image length:', base64Image.length);

        // Detect face shape
        console.log('[DEBUG] HairstyleResults: Calling detectFaceShape');
        const faceShapeResult = await detectFaceShape(imageUri as string);
        console.log('[DEBUG] HairstyleResults: Face shape detected:', faceShapeResult);

        // Get hairstyle suggestions based on face shape
        console.log('[DEBUG] HairstyleResults: Calling getHairstyleSuggestions');
        const hairstyleSuggestions = await getHairstyleSuggestions(
          faceShapeResult.faceShape,
          base64Image
        );
        console.log('[DEBUG] HairstyleResults: Got hairstyle suggestions:', 
          hairstyleSuggestions ? `${hairstyleSuggestions.hairstyles?.length} hairstyles for ${hairstyleSuggestions.faceShape}` : 'null');

        setResults(hairstyleSuggestions);
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
  }, [imageUri]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Analyzing' }} />
        <ActivityIndicator size="large" color="#5048E5" />
        <Text style={styles.loadingText}>Analyzing your face shape...</Text>
      </View>
    );
  }

  if (error || !results) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ title: 'Error' }} />
        <Text style={styles.errorText}>{error || 'Unknown error occurred'}</Text>
        <Text 
          style={styles.backLink}
          onPress={() => router.back()}
        >
          Try Again
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Your Results' }} />
      <FaceShapeResult 
        imageUri={imageUri as string} 
        results={results} 
      />
    </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backLink: {
    fontSize: 16,
    color: '#5048E5',
    fontWeight: 'bold',
  },
}); 