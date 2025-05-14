import { ModernColors } from '@/constants/Colors';
import { SavedImage } from '@/constants/SavedImages';
import { useSavedImages } from '@/context/SavedImagesContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface SavedImagesGalleryProps {
  onImagePress?: (image: SavedImage) => void;
}

export default function SavedImagesGallery({ onImagePress }: SavedImagesGalleryProps) {
  const { savedImages, isLoading, deleteImage } = useSavedImages();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={ModernColors.primary} />
        <Text style={styles.loadingText}>Loading saved images...</Text>
      </View>
    );
  }

  if (savedImages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="images-outline" size={70} color={ModernColors.text.tertiary} />
        </View>
        <Text style={styles.emptyTitle}>No saved images</Text>
        <Text style={styles.emptySubtitle}>
          Your face analysis images and AI suggestions will appear here.
        </Text>
        <TouchableOpacity 
          style={styles.analyzeButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.analyzeButtonText}>Analyze Your Face</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderImageItem = ({ item }: { item: SavedImage }) => (
    <TouchableOpacity 
      style={styles.imageCard} 
      onPress={() => onImagePress ? onImagePress(item) : null}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.image} />
        <View style={styles.faceShapeBadge}>
          <Text style={styles.faceShapeText}>{item.faceShape}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>
            {new Date(item.dateAdded).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => deleteImage(item.id)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color={ModernColors.error} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.suggestionCountContainer}>
          <Ionicons name="cut-outline" size={16} color={ModernColors.text.secondary} />
          <Text style={styles.suggestionCountText}>
            {item.suggestions?.length || 0} Suggestions
          </Text>
        </View>

        {item.suggestions && item.suggestions.length > 0 && (
          <View style={styles.previewChips}>
            {item.suggestions.slice(0, 2).map((suggestion, index) => (
              <View key={index} style={styles.previewChip}>
                <Text style={styles.previewChipText} numberOfLines={1}>
                  {suggestion.name}
                </Text>
              </View>
            ))}
            {item.suggestions.length > 2 && (
              <View style={[styles.previewChip, styles.moreChip]}>
                <Text style={styles.moreChipText}>+{item.suggestions.length - 2}</Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={savedImages}
      renderItem={renderImageItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80, // Extra space at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: ModernColors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: ModernColors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: ModernColors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    maxWidth: '90%',
  },
  analyzeButton: {
    backgroundColor: ModernColors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonText: {
    color: ModernColors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  imageCard: {
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 100,
    height: 130,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 130,
  },
  faceShapeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  faceShapeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    color: ModernColors.text.tertiary,
  },
  deleteButton: {
    padding: 2,
  },
  suggestionCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionCountText: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    marginLeft: 6,
  },
  previewChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewChip: {
    backgroundColor: ModernColors.background.tertiary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    maxWidth: 120,
  },
  previewChipText: {
    fontSize: 12,
    color: ModernColors.text.secondary,
  },
  moreChip: {
    backgroundColor: ModernColors.background.highlight,
  },
  moreChipText: {
    fontSize: 12,
    color: ModernColors.primary,
    fontWeight: '500',
  },
}); 