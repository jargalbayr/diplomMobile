import { FaceShape } from "@/services/faceDetectionService";

export interface SavedImage {
  id: string;
  imageUri: string;
  faceShape: FaceShape;
  dateAdded: string;
  suggestions?: SavedHairstyleSuggestion[];
}

export interface SavedHairstyleSuggestion {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  isAiGenerated?: boolean;
  isFavorite?: boolean;
}

// Key for AsyncStorage
export const SAVED_IMAGES_STORAGE_KEY = 'saved_images'; 