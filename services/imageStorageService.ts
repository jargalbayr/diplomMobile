import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { getCurrentUserId } from './authService';

// Directory for storing user images
const IMAGE_DIR = 'face-style-images';
const UPLOADED_DIR = 'uploaded';
const GENERATED_DIR = 'generated';

// Ensure the directory exists
const ensureDirectoryExists = async (dirName: string): Promise<string> => {
  const dirPath = `${FileSystem.documentDirectory}${dirName}`;
  const dirInfo = await FileSystem.getInfoAsync(dirPath);
  
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dirPath, { intermediates: true });
  }
  
  return dirPath;
};

// Initialize the image directories
export const initImageStorage = async (): Promise<void> => {
  try {
    // Create main directory
    const mainDir = await ensureDirectoryExists(IMAGE_DIR);
    
    // Create subdirectories
    await ensureDirectoryExists(`${IMAGE_DIR}/${UPLOADED_DIR}`);
    await ensureDirectoryExists(`${IMAGE_DIR}/${GENERATED_DIR}`);
    
    console.log('[ImageStorage] Initialized successfully', mainDir);
  } catch (error) {
    console.error('[ImageStorage] Initialization error:', error);
  }
};

// Save image from URI (for uploaded images from gallery/camera)
export const saveUploadedImage = async (
  imageUri: string,
  name?: string
): Promise<string | null> => {
  try {
    await initImageStorage();
    
    // Get current user ID for storing in user-specific folders
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Create user directory if it doesn't exist
    const userDir = `${IMAGE_DIR}/${UPLOADED_DIR}/${userId}`;
    await ensureDirectoryExists(userDir);
    
    // Generate a filename if not provided
    const filename = name || `image_${Date.now()}.jpg`;
    const destUri = `${FileSystem.documentDirectory}${userDir}/${filename}`;
    
    // Resize and compress the image before saving
    const processedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    
    // Copy the file to our app's documents directory
    await FileSystem.copyAsync({
      from: processedImage.uri,
      to: destUri
    });
    
    console.log('[ImageStorage] Uploaded image saved:', destUri);
    return destUri;
  } catch (error) {
    console.error('[ImageStorage] Error saving uploaded image:', error);
    return null;
  }
};

// Save an image from base64 data (for AI-generated images)
export const saveGeneratedImage = async (
  base64Data: string,
  name?: string
): Promise<string | null> => {
  try {
    await initImageStorage();
    
    // Get current user ID for storing in user-specific folders
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    // Create user directory if it doesn't exist
    const userDir = `${IMAGE_DIR}/${GENERATED_DIR}/${userId}`;
    await ensureDirectoryExists(userDir);
    
    // Generate a filename if not provided
    const filename = name || `generated_${Date.now()}.jpg`;
    const fileUri = `${FileSystem.documentDirectory}${userDir}/${filename}`;
    
    // Add data URI prefix if not present
    const dataToWrite = base64Data.startsWith('data:')
      ? base64Data
      : `data:image/jpeg;base64,${base64Data}`;
    
    // Write the base64 data to a file
    await FileSystem.writeAsStringAsync(fileUri, dataToWrite, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    console.log('[ImageStorage] Generated image saved:', fileUri);
    return fileUri;
  } catch (error) {
    console.error('[ImageStorage] Error saving generated image:', error);
    return null;
  }
};

// Get all saved images for a user
export const getUserImages = async (
  type: 'uploaded' | 'generated' | 'all' = 'all'
): Promise<string[]> => {
  try {
    await initImageStorage();
    
    // Get current user ID
    const userId = await getCurrentUserId();
    if (!userId) return [];
    
    const images: string[] = [];
    
    // Get uploaded images
    if (type === 'uploaded' || type === 'all') {
      const uploadedDir = `${IMAGE_DIR}/${UPLOADED_DIR}/${userId}`;
      await ensureDirectoryExists(uploadedDir);
      const uploadedImages = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}${uploadedDir}`
      );
      
      images.push(
        ...uploadedImages.map(
          filename => `${FileSystem.documentDirectory}${uploadedDir}/${filename}`
        )
      );
    }
    
    // Get generated images
    if (type === 'generated' || type === 'all') {
      const generatedDir = `${IMAGE_DIR}/${GENERATED_DIR}/${userId}`;
      await ensureDirectoryExists(generatedDir);
      const generatedImages = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}${generatedDir}`
      );
      
      images.push(
        ...generatedImages.map(
          filename => `${FileSystem.documentDirectory}${generatedDir}/${filename}`
        )
      );
    }
    
    return images;
  } catch (error) {
    console.error('[ImageStorage] Error getting user images:', error);
    return [];
  }
};

// Delete an image
export const deleteImage = async (imageUri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(imageUri);
      console.log('[ImageStorage] Image deleted:', imageUri);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[ImageStorage] Error deleting image:', error);
    return false;
  }
}; 