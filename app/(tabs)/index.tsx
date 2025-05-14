import { ModernColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Define types for our data
type AnalysisItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type FeatureItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Sample AI analysis results for the carousel
const aiAnalysisResults: AnalysisItem[] = [
  {
    id: '1',
    title: 'Facial Analysis',
    description: 'AI scans 68 facial points to determine your ideal face shape',
    icon: 'scan-outline',
  },
  {
    id: '2',
    title: 'Style Matching',
    description: 'Advanced algorithms match hairstyles to your unique features',
    icon: 'color-filter-outline',
  },
  {
    id: '3',
    title: 'Personalized Recommendations',
    description: 'Get customized hairstyle suggestions based on your face shape',
    icon: 'list-outline',
  },
  {
    id: '4',
    title: 'Try Before You Cut',
    description: 'Visualize how different hairstyles would look on you',
    icon: 'eye-outline',
  },
];

// App features for the feature section
const appFeatures: FeatureItem[] = [
  {
    id: '1',
    title: 'Face Shape Detection',
    description: 'Identify your face shape with precision AI technology',
    icon: 'scan',
  },
  {
    id: '2',
    title: 'Personalized Recommendations',
    description: 'Get hairstyle suggestions tailored to your unique features',
    icon: 'thumbs-up',
  },
  {
    id: '3',
    title: 'Save Favorite Styles',
    description: 'Create a collection of your favorite hairstyle ideas',
    icon: 'heart',
  },
  {
    id: '4',
    title: 'Find Stylists',
    description: 'Connect with professional stylists who can create your look',
    icon: 'people',
  },
];

export default function Home() {
  const router = useRouter();

  const renderAnalysisItem = ({ item }: { item: AnalysisItem }) => (
    <View style={styles.carouselItem}>
      <View style={styles.carouselIconContainer}>
        <Ionicons name={item.icon} size={28} color={ModernColors.primary} />
      </View>
      <Text style={styles.carouselItemTitle}>{item.title}</Text>
      <Text style={styles.carouselItemDescription}>{item.description}</Text>
    </View>
  );

  const renderFeatureItem = ({ item }: { item: FeatureItem }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Ionicons name={item.icon} size={24} color={ModernColors.text.inverse} />
      </View>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Үсний загвар AI</Text>
          <Text style={styles.subtitle}>Өөрийн нүүрний хэлбэрт тохирсон үсний засалтыг олж мэдээрэй</Text>
        </View>
        
        
        
        <View style={styles.carouselContainer}>
          <Text style={styles.sectionTitle}>AI Analysis</Text>
          <FlatList
            data={aiAnalysisResults}
            renderItem={renderAnalysisItem}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
          />
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>App Features</Text>
          <View style={styles.featuresContainer}>
            {appFeatures.map(feature => renderFeatureItem({ item: feature }))}
          </View>
        </View>

        <View style={styles.advantagesSection}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.advantageCard}>
            <Text style={styles.advantageTitle}>AI-Powered Analysis</Text>
            <Text style={styles.advantageDescription}>
              Our advanced AI technology analyzes your facial features with precision to determine your face shape and recommend the most flattering hairstyles.
            </Text>
          </View>
          <View style={styles.advantageCard}>
            <Text style={styles.advantageTitle}>Expert Stylist Input</Text>
            <Text style={styles.advantageDescription}>
              All hairstyle recommendations are verified by professional stylists to ensure they are trendy, practical, and suitable for your face shape.
            </Text>
          </View>
          <View style={styles.advantageCard}>
            <Text style={styles.advantageTitle}>Easy to Use</Text>
            <Text style={styles.advantageDescription}>
              Simply upload a photo or take a selfie, and get instant hairstyle recommendations tailored just for you.
            </Text>
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionButton}
            onPress={() => router.push("/face-analysis?mode=camera")}
          >
            <Ionicons name="camera" size={32} color={ModernColors.text.inverse} />
            <Text style={styles.optionText}>Зураг авах</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionButton, styles.secondaryButton]}
            onPress={() => router.push("/face-analysis?mode=gallery")}
          >
            <Ionicons name="image" size={32} color={ModernColors.primary} />
            <Text style={styles.secondaryOptionText}>Зураг оруулах</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.primary,
  },
  header: {
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
    color: ModernColors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: ModernColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: '80%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  carouselContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: ModernColors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  carouselContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  carouselItem: {
    width: 180,
    backgroundColor: ModernColors.background.highlight,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  carouselIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: ModernColors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
    marginBottom: 8,
  },
  carouselItemDescription: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresContainer: {
    paddingHorizontal: 24,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: ModernColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ModernColors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    lineHeight: 20,
  },
  advantagesSection: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  advantageCard: {
    backgroundColor: ModernColors.background.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: ModernColors.primary,
  },
  advantageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: ModernColors.text.primary,
    marginBottom: 8,
  },
  advantageDescription: {
    fontSize: 14,
    color: ModernColors.text.secondary,
    lineHeight: 22,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 24,
    paddingBottom: 36,
  },
  optionButton: {
    backgroundColor: ModernColors.primary,
    width: 160,
    height: 160,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: ModernColors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: ModernColors.background.primary,
    borderWidth: 2,
    borderColor: ModernColors.primary,
  },
  optionText: {
    color: ModernColors.text.inverse,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  secondaryOptionText: {
    color: ModernColors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
});
