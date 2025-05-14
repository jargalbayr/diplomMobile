import { ModernColors } from '@/constants/Colors';
import { SavedHairstyleSuggestion, SavedImage } from '@/constants/SavedImages';
import { useSavedImages } from '@/context/SavedImagesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SavedImageDetailsProps {
  savedImage: SavedImage;
  onClose?: () => void;
}

export default function SavedImageDetails({
  savedImage,
  onClose
}: SavedImageDetailsProps) {
  const { toggleFavoriteSuggestion } = useSavedImages();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  // Filter suggestions based on active tab
  const filteredSuggestions = savedImage.suggestions 
    ? activeTab === 'favorites'
      ? savedImage.suggestions.filter(suggestion => suggestion.isFavorite)
      : savedImage.suggestions
    : [];

  const renderSuggestionItem = ({ item }: { item: SavedHairstyleSuggestion }) => (
    <View style={styles.suggestionCard}>
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.suggestionImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.suggestionImage, styles.noImageContainer]}>
          <Ionicons name="image-outline" size={40} color={ModernColors.text.tertiary} />
        </View>
      )}
      
      <View style={styles.suggestionContent}>
        <View style={styles.suggestionHeader}>
          <Text style={styles.suggestionName}>{item.name}</Text>
          
          <TouchableOpacity
            onPress={() => toggleFavoriteSuggestion(savedImage.id, item.id)}
            style={styles.favoriteButton}
          >
            <Ionicons 
              name={item.isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={item.isFavorite ? ModernColors.error : ModernColors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.suggestionDescription}>{item.description}</Text>
        
        {item.isAiGenerated && (
          <View style={styles.aiGeneratedBadge}>
            <Text style={styles.aiGeneratedText}>AI Generated</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Ionicons 
        name="heart-outline" 
        size={50} 
        color={ModernColors.text.tertiary} 
      />
      <Text style={styles.emptyListText}>
        {activeTab === 'favorites' 
          ? 'No favorite hairstyles yet' 
          : 'No hairstyle suggestions available'}
      </Text>
      {activeTab === 'favorites' && (
        <Text style={styles.emptyListSubtext}>
          Tap the heart icon on any hairstyle to add it to your favorites
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color={ModernColors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Analysis</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: savedImage.imageUri }} 
              style={styles.image} 
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.imageInfo}>
            <View style={styles.faceShapeContainer}>
              <Text style={styles.faceShapeLabel}>Face Shape</Text>
              <Text style={styles.faceShapeValue}>{savedImage.faceShape}</Text>
            </View>
            
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Analysis Date</Text>
              <Text style={styles.dateValue}>
                {new Date(savedImage.dateAdded).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'all' && styles.activeTab
            ]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText
            ]}>
              All Suggestions
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'favorites' && styles.activeTab
            ]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'favorites' && styles.activeTabText
            ]}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredSuggestions}
          renderItem={renderSuggestionItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.suggestionsList}
          ListEmptyComponent={renderEmptyList}
          scrollEnabled={false}
        />
        
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={() => router.push("/face-analysis?mode=gallery")}
        >
          <Text style={styles.analyzeButtonText}>New Analysis</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: ModernColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: ModernColors.border.light,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
  },
  placeholder: {
    width: 40, // Same size as back button for balanced layout
  },
  scrollContainer: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: ModernColors.background.primary,
    padding: 20,
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  imageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faceShapeContainer: {
    flex: 1,
  },
  faceShapeLabel: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
    marginBottom: 4,
  },
  faceShapeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
  },
  dateContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: ModernColors.background.primary,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: ModernColors.background.highlight,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: ModernColors.text.secondary,
  },
  activeTabText: {
    color: ModernColors.primary,
  },
  suggestionsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  suggestionCard: {
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionImage: {
    width: '100%',
    height: 200,
  },
  noImageContainer: {
    backgroundColor: ModernColors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  suggestionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  suggestionDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: ModernColors.text.secondary,
    marginBottom: 12,
  },
  aiGeneratedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ModernColors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  aiGeneratedText: {
    color: ModernColors.text.inverse,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: ModernColors.background.tertiary,
    borderRadius: 16,
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyListSubtext: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    textAlign: 'center',
    maxWidth: '80%',
  },
  analyzeButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 40,
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
}); 