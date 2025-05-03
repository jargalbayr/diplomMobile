import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Face Style AI</Text>
      <Text style={styles.subtitle}>Discover the perfect hairstyle for your face shape</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push("/face-analysis?mode=camera")}
        >
          <Ionicons name="camera" size={32} color="#fff" />
          <Text style={styles.optionText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => router.push("/face-analysis?mode=gallery")}
        >
          <Ionicons name="image" size={32} color="#fff" />
          <Text style={styles.optionText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "#5048E5",
    width: 150,
    height: 150,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
});
