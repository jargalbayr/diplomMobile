import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mock data for saved hairstyles
const SAVED_HAIRSTYLES = [
  {
    id: '1',
    name: 'Textured Pixie Cut',
    description: 'Short and stylish with texture on top for added volume.',
    imageUrl: 'https://i.imgur.com/example2.jpg',
    dateAdded: '2023-05-15',
    faceShape: 'Oval'
  },
  {
    id: '2',
    name: 'Long Layers with Side-Swept Bangs',
    description: 'Elegant style with face-framing layers and soft side-swept bangs.',
    imageUrl: 'https://i.imgur.com/example3.jpg',
    dateAdded: '2023-05-20',
    faceShape: 'Heart'
  },
  {
    id: '3',
    name: 'Shoulder-Length Waves',
    description: 'Medium length with natural waves adding width to the face.',
    imageUrl: 'https://i.imgur.com/example28.jpg',
    dateAdded: '2023-06-01',
    faceShape: 'Rectangular'
  },
  {
    id: '4',
    name: 'Side-Parted Bob',
    description: 'Chic asymmetrical bob with a deep side part for added angles.',
    imageUrl: 'https://i.imgur.com/example7.jpg',
    dateAdded: '2023-06-05',
    faceShape: 'Round'
  },
];

export default function SavedScreen() {
  const router = useRouter();
  const [savedHairstyles, setSavedHairstyles] = useState(SAVED_HAIRSTYLES);
  
  const handleRemoveItem = (id) => {
    setSavedHairstyles(current => current.filter(item => item.id !== id));
  };
  
  const handleItemPress = (item) => {
    // Navigate to hairstyle details
    router.push({
      pathname: '/hairstyle-details',
      params: { id: item.id }
    });
  };
  
  const renderHairstyleItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.hairstyleCard} 
      onPress={() => handleItemPress(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.hairstyleImage}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.hairstyleName}>{item.name}</Text>
          <TouchableOpacity
            onPress={() => handleRemoveItem(item.id)}
            style={styles.removeButton}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        <Text style={styles.faceShape}>Best for {item.faceShape} face shape</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.dateAdded}>Saved on {new Date(item.dateAdded).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No saved hairstyles</Text>
      <Text style={styles.emptySubtitle}>
        Your saved hairstyles will appear here. Go to the home screen to analyze your face shape and discover hairstyles.
      </Text>
      <TouchableOpacity 
        style={styles.findButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.findButtonText}>Find Hairstyles</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Hairstyles</Text>
      </View>
      
      <FlatList
        data={savedHairstyles}
        renderItem={renderHairstyleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyListComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra space at the bottom
  },
  hairstyleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  hairstyleImage: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hairstyleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  removeButton: {
    padding: 4,
  },
  faceShape: {
    fontSize: 12,
    color: '#5048E5',
    marginTop: 2,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateAdded: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  findButton: {
    backgroundColor: '#5048E5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  findButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 