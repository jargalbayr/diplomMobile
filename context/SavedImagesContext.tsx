import { SAVED_IMAGES_STORAGE_KEY, SavedHairstyleSuggestion, SavedImage } from '@/constants/SavedImages';
import { FaceShape } from '@/services/faceDetectionService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SavedImagesContextType {
  savedImages: SavedImage[];
  isLoading: boolean;
  saveImage: (imageUri: string, faceShape: FaceShape, suggestions?: SavedHairstyleSuggestion[]) => Promise<SavedImage>;
  deleteImage: (id: string) => Promise<void>;
  toggleFavoriteSuggestion: (imageId: string, suggestionId: string) => Promise<void>;
  getSavedImageById: (id: string) => SavedImage | undefined;
}

const SavedImagesContext = createContext<SavedImagesContextType | undefined>(undefined);

export function SavedImagesProvider({ children }: { children: ReactNode }) {
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved images from AsyncStorage on component mount
  useEffect(() => {
    loadSavedImages();
  }, []);

  // Load saved images from AsyncStorage
  const loadSavedImages = async () => {
    try {
      setIsLoading(true);
      const storedImages = await AsyncStorage.getItem(SAVED_IMAGES_STORAGE_KEY);
      if (storedImages) {
        setSavedImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Error loading saved images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save images to AsyncStorage
  const persistSavedImages = async (images: SavedImage[]) => {
    try {
      await AsyncStorage.setItem(SAVED_IMAGES_STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Error persisting saved images:', error);
    }
  };

  // Save a new image
  const saveImage = async (
    imageUri: string, 
    faceShape: FaceShape, 
    suggestions?: SavedHairstyleSuggestion[]
  ): Promise<SavedImage> => {
    const newImage: SavedImage = {
      id: Date.now().toString(),
      imageUri,
      faceShape,
      dateAdded: new Date().toISOString(),
      suggestions: suggestions?.map(s => ({
        ...s,
        id: s.id || Date.now() + Math.random().toString(36).substring(2, 9),
        isFavorite: false
      }))
    };

    const updatedImages = [...savedImages, newImage];
    setSavedImages(updatedImages);
    await persistSavedImages(updatedImages);
    return newImage;
  };

  // Delete an image
  const deleteImage = async (id: string) => {
    const updatedImages = savedImages.filter(image => image.id !== id);
    setSavedImages(updatedImages);
    await persistSavedImages(updatedImages);
  };

  // Toggle favorite status for a hairstyle suggestion
  const toggleFavoriteSuggestion = async (imageId: string, suggestionId: string) => {
    const updatedImages = savedImages.map(image => {
      if (image.id === imageId && image.suggestions) {
        const updatedSuggestions = image.suggestions.map(suggestion => {
          if (suggestion.id === suggestionId) {
            return {
              ...suggestion,
              isFavorite: !suggestion.isFavorite
            };
          }
          return suggestion;
        });
        return {
          ...image,
          suggestions: updatedSuggestions
        };
      }
      return image;
    });

    setSavedImages(updatedImages);
    await persistSavedImages(updatedImages);
  };

  // Get a specific saved image by ID
  const getSavedImageById = (id: string) => {
    return savedImages.find(image => image.id === id);
  };

  return (
    <SavedImagesContext.Provider
      value={{
        savedImages,
        isLoading,
        saveImage,
        deleteImage,
        toggleFavoriteSuggestion,
        getSavedImageById
      }}
    >
      {children}
    </SavedImagesContext.Provider>
  );
}

// Custom hook to use the saved images context
export function useSavedImages() {
  const context = useContext(SavedImagesContext);
  if (context === undefined) {
    throw new Error('useSavedImages must be used within a SavedImagesProvider');
  }
  return context;
} 