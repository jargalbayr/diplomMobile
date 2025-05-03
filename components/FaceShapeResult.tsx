import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export type FaceShapeResultsData = {
  faceShape: string;
  description: string;
  markdownContent?: string;
  hairstyles: Array<{
    name: string;
    description: string;
    imageUrl?: string;
    isAiGenerated?: boolean;
  }>;
};

interface FaceShapeResultProps {
  imageUri: string;
  results: FaceShapeResultsData;
}

export default function FaceShapeResult({ imageUri, results }: FaceShapeResultProps) {
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      let bulletMatch = line.match(/^(\s*[\*\-•]|\s*\d+\.)\s(.+)$/);
      if (bulletMatch) {
        return (
          <View key={lineIndex} style={styles.bulletPointContainer}>
            <Text style={styles.bulletPoint}>{bulletMatch[1].trim()}</Text>
            <Text style={[styles.hairstyleDescription, {flex: 1}]}>{bulletMatch[2]}</Text>
          </View>
        );
      }
      
      if (line.startsWith('# ')) {
        return <Text key={lineIndex} style={styles.headerOne}>{line.substring(2)}</Text>;
      }
      
      if (line.startsWith('## ')) {
        return <Text key={lineIndex} style={styles.headerTwo}>{line.substring(3)}</Text>;
      }
      
      let formattedLine = line;
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '$1');
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, '$1');
      
      return <Text key={lineIndex} style={styles.hairstyleDescription}>{formattedLine}</Text>;
    });
  };

  const renderHairstyleGallery = () => {
    return (
      <View style={styles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>Personalized Hairstyles</Text>
          <Text style={styles.gallerySubtitle}>
            For {results.faceShape.toLowerCase()} face shape
          </Text>
          <View style={styles.decorativeLine} />
        </View>
        
        {results.hairstyles.map((hairstyle, index) => (
          <View key={index} style={styles.hairstyleCard}>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>{index + 1}</Text>
            </View>
            
            <Text style={styles.hairstyleName}>{hairstyle.name}</Text>
            
            {hairstyle.imageUrl && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: hairstyle.imageUrl }} 
                  style={styles.hairstyleImage} 
                />
                {hairstyle.isAiGenerated && (
                  <View style={styles.aiGeneratedBadge}>
                    <Text style={styles.aiGeneratedText}>DALL·E 3</Text>
                  </View>
                )}
              </View>
            )}
            
            <Text style={styles.hairstyleDescription}>{hairstyle.description}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.profileImage} 
          />
          <View style={styles.faceShapeContainer}>
            <Text style={styles.faceShapeLabel}>Your Face Shape</Text>
            <Text style={styles.faceShapeValue}>{results.faceShape}</Text>
            <Text style={styles.faceShapeDescription}>{results.description}</Text>
          </View>
        </View>
        <View style={styles.headerDivider} />
      </View>

      {results.markdownContent && (
        <View style={styles.markdownContainer}>
          <Text style={styles.markdownTitle}>AI Analysis</Text>
          <View style={styles.markdownContent}>
            {renderFormattedText(results.markdownContent)}
          </View>
        </View>
      )}
      
      {renderHairstyleGallery()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f0f0f0',
    marginRight: 20,
  },
  faceShapeContainer: {
    flex: 1,
  },
  faceShapeLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  faceShapeValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  faceShapeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 15,
    marginHorizontal: 20,
  },
  markdownContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  markdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  markdownContent: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  galleryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  galleryHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  gallerySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: '#5048E5',
    marginTop: 10,
  },
  hairstyleCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardNumber: {
    position: 'absolute',
    top: -10,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#5048E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  cardNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hairstyleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  hairstyleImage: {
    width: '100%',
    height: 350,
    borderRadius: 8,
  },
  aiGeneratedBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  aiGeneratedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  hairstyleDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  headerOne: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  headerTwo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 8,
  },
  bulletPointContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bulletPoint: {
    width: 20,
    fontSize: 14,
    color: '#5048E5',
    marginRight: 8,
  },
});
