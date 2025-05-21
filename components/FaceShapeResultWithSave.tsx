import { ModernColors } from '@/constants/Colors';
import { SavedHairstyleSuggestion } from '@/constants/SavedImages';
import { useSavedImages } from '@/context/SavedImagesContext';
import { FaceShape } from '@/services/faceDetectionService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import FaceShapeResult, { FaceShapeResultsData } from './FaceShapeResult';

interface FaceShapeResultWithSaveProps {
  imageUri: string;
  results: FaceShapeResultsData;
}

export default function FaceShapeResultWithSave({
  imageUri,
  results
}: FaceShapeResultWithSaveProps) {
  const { saveImage } = useSavedImages();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Convert hairstyles to the saved suggestion format
      const suggestions: SavedHairstyleSuggestion[] = results.hairstyles.map((hairstyle, index) => ({
        id: `suggestion-${index}-${Date.now()}`,
        name: hairstyle.name,
        description: hairstyle.description,
        imageUrl: hairstyle.imageUrl,
        isAiGenerated: hairstyle.isAiGenerated,
        isFavorite: false
      }));
      
      // Save to context/AsyncStorage
      await saveImage(
        imageUri,
        results.faceShape.toLowerCase() as FaceShape,
        suggestions
      );
      
      setIsSaved(true);
      Alert.alert(
        'Амжилттай',
        'Таны нүүрний дүн шинжилгээ болон үсний загварын саналууд хадгалагдлаа! Та "Хадгалсан" хэсгээс дурын үед харах боломжтой.'
      );
    } catch (error) {
      console.error('Error saving face analysis:', error);
      Alert.alert(
        'Алдаа',
        'Таны нүүрний дүн шинжилгээг хадгалж чадсангүй. Дахин оролдоно уу.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <FaceShapeResult 
        imageUri={imageUri} 
        results={results} 
      />
      
      <View style={styles.saveButtonContainer}>
        {!isSaved ? (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Text style={styles.saveButtonText}>Хадгалж байна...</Text>
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={ModernColors.text.inverse} style={styles.saveIcon} />
                <Text style={styles.saveButtonText}>Дүн шинжилгээ хадгалах</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.viewSavedButton} 
              onPress={() => router.push('/saved')}
            >
              <Ionicons name="images-outline" size={18} color={ModernColors.text.inverse} style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Хадгалсныг харах</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.newAnalysisButton} 
              onPress={() => router.push('/')}
            >
              <Ionicons name="refresh-outline" size={18} color={ModernColors.primary} style={styles.saveIcon} />
              <Text style={styles.newAnalysisText}>Шинэ дүн шинжилгээ</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  saveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ModernColors.background.primary,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: ModernColors.border.light,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  saveButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  saveIcon: {
    marginRight: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewSavedButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  newAnalysisButton: {
    backgroundColor: ModernColors.background.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: ModernColors.primary,
  },
  newAnalysisText: {
    color: ModernColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}); 