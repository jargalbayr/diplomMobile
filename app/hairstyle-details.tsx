import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define a type for hairstyles
type Hairstyle = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  faceShape: string;
  difficulty: string;
  maintenance: string;
  idealHairType: string;
  popularityScore: number;
  stylist: string;
  salon: string;
  tags: string[];
};

// Mock data for hairstyles - in a real app, this would come from a database or API
const HAIRSTYLES: Hairstyle[] = [
  {
    id: '1',
    name: 'Textured Pixie Cut',
    description: 'Short and stylish with texture on top for added volume.',
    longDescription: 'The textured pixie cut is a short, low-maintenance hairstyle that adds volume on top while keeping the sides neat. It works particularly well for oval face shapes as it accentuates facial features and draws attention to the eyes. This versatile style can be dressed up for formal occasions or kept casual for everyday wear. Regular trims every 4-6 weeks help maintain its shape.',
    imageUrl: 'https://i.imgur.com/example2.jpg',
    faceShape: 'Oval',
    difficulty: 'Low',
    maintenance: 'Medium',
    idealHairType: 'Fine to Medium',
    popularityScore: 4.8,
    stylist: 'Sarah Johnson',
    salon: 'Chic Cuts',
    tags: ['Short', 'Modern', 'Low-maintenance', 'Professional']
  },
  {
    id: '2',
    name: 'Long Layers with Side-Swept Bangs',
    description: 'Elegant style with face-framing layers and soft side-swept bangs.',
    longDescription: 'Long layers with side-swept bangs create a soft, romantic look that works beautifully for heart-shaped faces. The side-swept bangs help to balance a wider forehead, while the layers add movement and volume around the jawline. This hairstyle is versatile and can be worn straight or wavy depending on the occasion. It requires regular trims every 8-10 weeks to maintain the shape of the layers.',
    imageUrl: 'https://i.imgur.com/example3.jpg',
    faceShape: 'Heart',
    difficulty: 'Medium',
    maintenance: 'Medium',
    idealHairType: 'Medium to Thick',
    popularityScore: 4.6,
    stylist: 'Michael Chen',
    salon: 'Tress Trends',
    tags: ['Long', 'Romantic', 'Versatile', 'Feminine']
  },
  {
    id: '3',
    name: 'Shoulder-Length Waves',
    description: 'Medium length with natural waves adding width to the face.',
    longDescription: 'Shoulder-length waves are a perfect choice for rectangular face shapes as they add width to the sides of the face, creating a more balanced appearance. The waves soften angular features while the length is still manageable for daily styling. This hairstyle is extremely versatile and works well for both casual and formal settings. It requires medium maintenance with trims recommended every 8 weeks.',
    imageUrl: 'https://i.imgur.com/example28.jpg',
    faceShape: 'Rectangular',
    difficulty: 'Medium',
    maintenance: 'Medium',
    idealHairType: 'Medium to Thick',
    popularityScore: 4.7,
    stylist: 'Emily Rodriguez',
    salon: 'Wave Studio',
    tags: ['Medium-length', 'Wavy', 'Natural', 'Balanced']
  },
  {
    id: '4',
    name: 'Side-Parted Bob',
    description: 'Chic asymmetrical bob with a deep side part for added angles.',
    longDescription: 'The side-parted bob is a sophisticated choice for round face shapes. The asymmetrical cut and deep side part create the illusion of length and angles, which helps to elongate a round face. This chic style works well in professional environments while still being trendy. It requires maintenance every 4-6 weeks to keep the sharp lines of the bob looking fresh and polished.',
    imageUrl: 'https://i.imgur.com/example7.jpg',
    faceShape: 'Round',
    difficulty: 'Medium-high',
    maintenance: 'High',
    idealHairType: 'Fine to Medium',
    popularityScore: 4.5,
    stylist: 'David Kim',
    salon: 'Precision Cuts',
    tags: ['Bob', 'Modern', 'Professional', 'Structured']
  },
];

export default function HairstyleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [hairstyle, setHairstyle] = useState<Hairstyle | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    // Find the hairstyle with the matching ID
    const foundHairstyle = HAIRSTYLES.find(item => item.id === id);
    if (foundHairstyle) {
      setHairstyle(foundHairstyle);
      // In a real app, you would check if this is saved in user's favorites
      setIsSaved(Math.random() > 0.5); // Random for demo purposes
    }
  }, [id]);
  
  const toggleSave = () => {
    setIsSaved(!isSaved);
    // In a real app, this would update a database or local storage
    Alert.alert(
      isSaved ? 'Removed from Saved' : 'Added to Saved', 
      isSaved ? 'This hairstyle has been removed from your saved list.' : 'This hairstyle has been added to your saved list.'
    );
  };
  
  const shareHairstyle = () => {
    // In a real app, this would open a share dialog
    Alert.alert('Share', 'Sharing functionality would be implemented here.');
  };
  
  if (!hairstyle) {
    return (
      <View style={styles.loadingContainer}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <Text>Loading hairstyle details...</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: hairstyle.name,
          headerRight: () => (
            <TouchableOpacity onPress={shareHairstyle} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
          )
        }} 
      />
      
      <Image
        source={{ uri: hairstyle.imageUrl }}
        style={styles.image}
      />
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{hairstyle.name}</Text>
          <TouchableOpacity onPress={toggleSave}>
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={28} 
              color={isSaved ? "#FF3B30" : "#333"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.faceShape}>Best for {hairstyle.faceShape} face shape</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Difficulty</Text>
            <Text style={styles.statValue}>{hairstyle.difficulty}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Maintenance</Text>
            <Text style={styles.statValue}>{hairstyle.maintenance}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Hair Type</Text>
            <Text style={styles.statValue}>{hairstyle.idealHairType}</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{hairstyle.longDescription}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stylist Recommendation</Text>
          <Text style={styles.stylistInfo}>
            Recommended by {hairstyle.stylist} from {hairstyle.salon}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {hairstyle.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.findStylistButton}
          onPress={() => Alert.alert('Find Stylist', 'This would connect you with a hairstylist who specializes in this style.')}
        >
          <Text style={styles.findStylistButtonText}>Find a Stylist</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  image: {
    width: width,
    height: width * 0.75,
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  faceShape: {
    fontSize: 16,
    color: '#5048E5',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  stylistInfo: {
    fontSize: 16,
    color: '#666',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EEF1FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#5048E5',
  },
  findStylistButton: {
    backgroundColor: '#5048E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  findStylistButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 