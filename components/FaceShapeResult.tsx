import { ModernColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type FaceShapeResultsData = {
  faceShape: string;
  description: string;
  markdownContent?: string;
  hairstyles: Array<{
    id?: string;
    name: string;
    description: string;
    imageUrl?: string;
    isAiGenerated?: boolean;
  }>;
};

interface FaceShapeResultProps {
  imageUri: string;
  results: FaceShapeResultsData;
  onHairstylePress?: (hairstyle: FaceShapeResultsData['hairstyles'][0]) => void;
}

const { width } = Dimensions.get('window');
const CAROUSEL_ITEM_WIDTH = width * 0.75;
const CAROUSEL_SPACING = 12;

export default function FaceShapeResult({ imageUri, results, onHairstylePress }: FaceShapeResultProps) {
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    // Remove markdown formatting characters
    let cleanText = text;
    cleanText = cleanText.replace(/\*\*(.*?)\*\*/g, '$1'); // Bold
    cleanText = cleanText.replace(/\*(.*?)\*/g, '$1');     // Italic
    cleanText = cleanText.replace(/`(.*?)`/g, '$1');       // Inline code
    cleanText = cleanText.replace(/~~(.*?)~~/g, '$1');     // Strikethrough
    cleanText = cleanText.replace(/\[(.*?)\]\((.*?)\)/g, '$1'); // Links
    
    const lines = cleanText.split('\n');
    
    return lines.map((line, lineIndex) => {
      let bulletMatch = line.match(/^(\s*[\*\-•]|\s*\d+\.)\s(.+)$/);
      if (bulletMatch) {
        return (
          <View key={lineIndex} style={styles.bulletPointContainer}>
            <Text style={styles.bulletPoint}>{bulletMatch[1].trim()}</Text>
            <Text style={[styles.bodyText, {flex: 1}]}>{bulletMatch[2]}</Text>
          </View>
        );
      }
      
      if (line.startsWith('# ')) {
        return <Text key={lineIndex} style={styles.headerOne}>{line.substring(2)}</Text>;
      }
      
      if (line.startsWith('## ')) {
        return <Text key={lineIndex} style={styles.headerTwo}>{line.substring(3)}</Text>;
      }
      
      return line.trim() ? <Text key={lineIndex} style={styles.bodyText}>{line}</Text> : <View key={lineIndex} style={styles.spacer} />;
    });
  };

  const renderHairstyleItem = ({ item, index }: { item: FaceShapeResultsData['hairstyles'][0], index: number }) => (
    <TouchableOpacity 
      style={styles.carouselItem}
      onPress={() => onHairstylePress?.(item)}
      activeOpacity={0.9}
    >
      {item.imageUrl ? (
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.hairstyleImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.hairstyleImage, styles.noImageContainer]}>
          <Ionicons name="image-outline" size={40} color={ModernColors.text.tertiary} />
        </View>
      )}
      
      <View style={styles.carouselContent}>
        <View style={styles.hairstyleIndexContainer}>
          <Text style={styles.hairstyleIndexText}>{index + 1}</Text>
        </View>
        
        <Text style={styles.hairstyleName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.hairstyleDescription} numberOfLines={3}>{item.description}</Text>
        
        {item.isAiGenerated && (
          <View style={styles.aiGeneratedBadge}>
            <Text style={styles.aiGeneratedText}>AI Generated</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.imageWrapper}>
            <Image 
              source={{ uri: imageUri }} 
              style={styles.profileImage} 
            />
          </View>
          <View style={styles.faceShapeContainer}>
            <Text style={styles.faceShapeLabel}>Your Face Shape</Text>
            <Text style={styles.faceShapeValue}>{results.faceShape}</Text>
            <Text style={styles.faceShapeDescription}>{results.description}</Text>
          </View>
        </View>
      </View>

      {results.markdownContent && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>AI Analysis</Text>
          
          <View style={styles.analysisCard}>
            {renderFormattedText(results.markdownContent)}
          </View>
        </View>
      )}
      
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommended Hairstyles</Text>
        <Text style={styles.sectionSubtitle}>
          for {results.faceShape.toLowerCase()} face shape
        </Text>
        
        <FlatList
          data={results.hairstyles}
          keyExtractor={(item, index) => item.id || `hairstyle-${index}`}
          renderItem={renderHairstyleItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CAROUSEL_ITEM_WIDTH + CAROUSEL_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          initialNumToRender={3}
        />
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="thumbs-up" size={20} color={ModernColors.text.inverse} />
            </View>
            <Text style={styles.featureText}>Matches your face shape</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="cut" size={20} color={ModernColors.text.inverse} />
            </View>
            <Text style={styles.featureText}>Stylist verified</Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="trending-up" size={20} color={ModernColors.text.inverse} />
            </View>
            <Text style={styles.featureText}>Currently trending</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Recommendations based on AI facial analysis
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.secondary,
  },
  header: {
    backgroundColor: ModernColors.background.primary,
    paddingTop: 20,
    paddingBottom: 24,
    marginBottom: 24,
    shadowColor: 'rgba(0,0,0,0.06)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageWrapper: {
    padding: 4,
    borderRadius: 54,
    backgroundColor: ModernColors.background.primary,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
    marginRight: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  faceShapeContainer: {
    flex: 1,
  },
  faceShapeLabel: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  faceShapeValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 8,
  },
  faceShapeDescription: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    lineHeight: 20,
  },
  sectionContainer: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: ModernColors.text.primary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: ModernColors.text.secondary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  analysisCard: {
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    padding: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  carouselContainer: {
    paddingLeft: 4,
    paddingRight: 20,
    paddingVertical: 8,
  },
  carouselItem: {
    width: CAROUSEL_ITEM_WIDTH,
    marginLeft: CAROUSEL_SPACING,
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  hairstyleImage: {
    width: '100%',
    height: 200,
    backgroundColor: ModernColors.background.tertiary,
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselContent: {
    padding: 16,
  },
  hairstyleIndexContainer: {
    position: 'absolute',
    top: -30,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ModernColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  hairstyleIndexText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ModernColors.text.inverse,
  },
  hairstyleName: {
    fontSize: 18,
    fontWeight: '700',
    color: ModernColors.text.primary,
    marginBottom: 8,
  },
  hairstyleDescription: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    lineHeight: 20,
  },
  aiGeneratedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  aiGeneratedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    marginRight: 8,
    color: ModernColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerOne: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 12,
    marginTop: 12,
  },
  headerTwo: {
    fontSize: 18,
    fontWeight: '600',
    color: ModernColors.text.primary,
    marginBottom: 10,
    marginTop: 10,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: ModernColors.text.secondary,
    marginBottom: 8,
  },
  spacer: {
    height: 12,
  },
  featuresContainer: {
    marginTop: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ModernColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
    textAlign: 'center',
  },
});
