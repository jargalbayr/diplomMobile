import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FaceAnalysisScreen() {
  const { mode } = useLocalSearchParams();
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        setImage(result.assets[0].uri);
      } else {
        router.back();
      }
    } catch (err) {
      console.error("Image picker error:", err);
      Alert.alert("Error", "Could not access your photos. Please try again.");
      router.back();
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to results
      router.push({
        pathname: '/hairstyle-results',
        params: { imageUri: image }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to analyze image. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imagePreviewContainer}>
        {image ? (
          <>
            <Image 
              source={{ uri: image }} 
              style={styles.imagePreview} 
            />
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]} 
                onPress={() => {
                  setImage(null);
                  pickImage();
                }}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Try Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={analyzeImage}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>
                    Analyze Face
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <ActivityIndicator size="large" color="#5048E5" />
            <Text style={styles.loadingText}>Loading image picker...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#5048E5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5048E5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#5048E5',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#5048E5',
    marginTop: 10,
  },
}); 