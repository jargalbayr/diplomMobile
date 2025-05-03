import { saveGeneratedImage, saveUploadedImage } from '@/services/imageStorageService';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from 'react-native';

interface ImagePickerProps {
  onImageSelected?: (imageUri: string) => void;
}

export default function ImagePickerComponent({ onImageSelected }: ImagePickerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Pick an image from the device gallery
  const pickImage = async () => {
    try {
      // Request permission if needed
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access media library is required!');
        return;
      }
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setLoading(true);
        const selectedImage = result.assets[0];
        
        // Save the image locally
        const savedImageUri = await saveUploadedImage(selectedImage.uri);
        
        if (savedImageUri) {
          setImage(savedImageUri);
          if (onImageSelected) {
            onImageSelected(savedImageUri);
          }
        } else {
          alert('Failed to save the image');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error selecting image');
      setLoading(false);
    }
  };

  // Take a photo with the camera
  const takePhoto = async () => {
    try {
      // Request permission if needed
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access camera is required!');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setLoading(true);
        const capturedImage = result.assets[0];
        
        // Save the image locally
        const savedImageUri = await saveUploadedImage(capturedImage.uri);
        
        if (savedImageUri) {
          setImage(savedImageUri);
          if (onImageSelected) {
            onImageSelected(savedImageUri);
          }
        } else {
          alert('Failed to save the image');
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Error capturing image');
      setLoading(false);
    }
  };

  // Example of saving a generated image (in a real app, this would come from an API)
  const mockGenerateImage = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // This is just a placeholder. In a real app, you would get base64 data from your AI API
      const sampleBase64 = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
      
      // Save the generated image
      const savedImageUri = await saveGeneratedImage(sampleBase64);
      
      if (savedImageUri) {
        setImage(savedImageUri);
        if (onImageSelected) {
          onImageSelected(savedImageUri);
        }
      } else {
        alert('Failed to save the generated image');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Pick from Gallery" onPress={pickImage} />
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#5048E5" style={styles.loader} />
      ) : (
        image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <Text style={styles.caption}>Image saved locally</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginVertical: 10,
  },
  caption: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
}); 