import SavedImageDetails from '@/components/SavedImageDetails';
import SavedImagesGallery from '@/components/SavedImagesGallery';
import { ModernColors } from '@/constants/Colors';
import { SavedImage } from '@/constants/SavedImages';
import { SavedImagesProvider } from '@/context/SavedImagesContext';
import { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function SavedScreen() {
  const [selectedImage, setSelectedImage] = useState<SavedImage | null>(null);
  
  const handleImagePress = (image: SavedImage) => {
    setSelectedImage(image);
  };
  
  const handleCloseDetails = () => {
    setSelectedImage(null);
  };

  return (
    <SavedImagesProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Хадгалсан дүн шинжилгээ</Text>
        </View>
        
        {selectedImage ? (
          <SavedImageDetails 
            savedImage={selectedImage} 
            onClose={handleCloseDetails} 
          />
        ) : (
          <SavedImagesGallery onImagePress={handleImagePress} />
        )}
      </SafeAreaView>
    </SavedImagesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.secondary,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: ModernColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: ModernColors.border.light,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
  },
}); 