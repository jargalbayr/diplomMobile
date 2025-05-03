import { getCurrentUserId } from '@/services/authService';
import { saveHairstyle } from '@/services/databaseService';
import { saveGeneratedImage } from '@/services/imageStorageService';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Sample hairstyle data structure
interface Hairstyle {
  name: string;
  description: string;
  imageBase64?: string; // The AI-generated image in base64 format
  faceShape: string;
}

interface HairstyleResultProps {
  hairstyles: Hairstyle[];
  faceShape: string;
  onSaved?: () => void;
}

export default function HairstyleResultWithLocalStorage({
  hairstyles,
  faceShape,
  onSaved
}: HairstyleResultProps) {
  const [saving, setSaving] = useState(false);
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());

  // Save hairstyle and its image locally
  const handleSave = async (hairstyle: Hairstyle, index: number) => {
    try {
      setSaving(true);

      // Check if user is logged in
      const userId = await getCurrentUserId();
      if (!userId) {
        Alert.alert('Error', 'You need to be logged in to save hairstyles');
        setSaving(false);
        return;
      }

      // Save image locally if it has a base64 image
      let localImageUri = null;
      if (hairstyle.imageBase64) {
        localImageUri = await saveGeneratedImage(
          hairstyle.imageBase64,
          `hairstyle_${faceShape}_${index}.jpg`
        );
        
        if (!localImageUri) {
          Alert.alert('Error', 'Failed to save the image');
          setSaving(false);
          return;
        }
      }

      // Save hairstyle to database
      const hairstyleId = await saveHairstyle({
        userId,
        name: hairstyle.name,
        description: hairstyle.description,
        imageUrl: localImageUri || undefined,
        faceShape,
        isAiGenerated: true
      });

      if (hairstyleId) {
        // Mark as saved in the UI
        setSavedItems(prev => new Set(prev).add(index));
        
        // Notify parent component if needed
        if (onSaved) onSaved();
        
        Alert.alert('Success', 'Hairstyle saved to your favorites');
      } else {
        Alert.alert('Error', 'Failed to save hairstyle to database');
      }
    } catch (error) {
      console.error('Error saving hairstyle:', error);
      Alert.alert('Error', 'An error occurred while saving the hairstyle');
    } finally {
      setSaving(false);
    }
  };

  if (!hairstyles || hairstyles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hairstyle recommendations available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Hairstyles</Text>
        <Text style={styles.subtitle}>
          Based on your {faceShape} face shape
        </Text>
      </View>

      {hairstyles.map((hairstyle, index) => (
        <View key={index} style={styles.card}>
          {hairstyle.imageBase64 ? (
            <Image
              source={{ 
                uri: `data:image/jpeg;base64,${hairstyle.imageBase64}` 
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No image available</Text>
            </View>
          )}

          <View style={styles.cardContent}>
            <Text style={styles.hairstyleName}>{hairstyle.name}</Text>
            <Text style={styles.description}>{hairstyle.description}</Text>

            <TouchableOpacity
              style={[
                styles.saveButton,
                savedItems.has(index) && styles.savedButton
              ]}
              onPress={() => handleSave(hairstyle, index)}
              disabled={saving || savedItems.has(index)}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {savedItems.has(index) ? 'Saved' : 'Save to Favorites'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 250,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  hairstyleName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: '#5048E5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 