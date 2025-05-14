import { ModernColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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
        <ActivityIndicator size="large" color={ModernColors.primary} />
        <Text style={styles.loadingText}>Loading hairstyle details...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: hairstyle.name,
          headerRight: () => (
            <TouchableOpacity onPress={shareHairstyle} style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color={ModernColors.text.secondary} />
            </TouchableOpacity>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: hairstyle.imageUrl }}
            style={styles.image}
          />
        </View>
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{hairstyle.name}</Text>
            <TouchableOpacity 
              onPress={toggleSave}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isSaved ? "heart" : "heart-outline"} 
                size={28} 
                color={isSaved ? ModernColors.error : ModernColors.text.secondary} 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.faceShape}>Best for {hairstyle.faceShape} face shape</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Difficulty</Text>
              <Text style={styles.statValue}>{hairstyle.difficulty}</Text>
            </View>
            <View style={[styles.statItem, styles.statItemBorder]}>
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
            <View style={styles.stylistCard}>
              <Ionicons name="person-circle-outline" size={32} color={ModernColors.primary} />
              <View style={styles.stylistInfo}>
                <Text style={styles.stylistName}>{hairstyle.stylist}</Text>
                <Text style={styles.salonName}>{hairstyle.salon}</Text>
              </View>
            </View>
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
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.primary,
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ModernColors.background.primary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: ModernColors.text.secondary,
  },
  headerButton: {
    padding: 10,
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    backgroundColor: ModernColors.background.tertiary,
  },
  image: {
    width: width,
    height: width * 0.8,
  },
  content: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    flex: 1,
    marginRight: 12,
  },
  faceShape: {
    fontSize: 16,
    color: ModernColors.primary,
    marginBottom: 24,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: ModernColors.background.highlight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: ModernColors.border.light,
  },
  statLabel: {
    fontSize: 13,
    color: ModernColors.text.tertiary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: ModernColors.text.primary,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: ModernColors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: ModernColors.text.secondary,
  },
  stylistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ModernColors.background.tertiary,
    padding: 16,
    borderRadius: 12,
  },
  stylistInfo: {
    marginLeft: 16,
  },
  stylistName: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
    marginBottom: 4,
  },
  salonName: {
    fontSize: 14,
    color: ModernColors.text.secondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: ModernColors.background.highlight,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: ModernColors.primary,
    fontWeight: '500',
  },
  findStylistButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  findStylistButtonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
}); 