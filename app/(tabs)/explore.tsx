import FaceShapeResult from "@/components/FaceShapeResult";
import { API_URL, PORT } from "@/config";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Button, Image, ScrollView } from "react-native";

export default function Explore() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      // setImage(result,);
      // sendImage(result.base64);
    }
  };

  const sendImage = async (base64: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`http://${API_URL}:${PORT}/detect-face-shape`, {
        image: base64,
      });
      setResult(res.data);
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Button title="Зураг сонгох" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 250, height: 250, marginVertical: 10 }} />}
      {loading && <ActivityIndicator size="large" />}
      {result && <FaceShapeResult faceShape={result.face_shape} hairstyles={result.hairstyles} />}
    </ScrollView>
  );
}
