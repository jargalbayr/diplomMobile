import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Define a type for menu items to avoid type errors
type MenuItem = {
  title: string;
  icon: any; // Using any for Ionicons names
  action: () => void;
  color?: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  
  // Mock user data - in a real app, this would come from authentication/database
  const userData = {
    name: "John Doe",
    email: "john.doe@example.com",
    imageUrl: "https://i.pravatar.cc/300",
    createdAt: "January 2023"
  };

  const menuItems: MenuItem[] = [
    { title: "Edit Profile", icon: "person-outline", action: () => console.log("Edit profile") },
    { title: "Appearance", icon: "color-palette-outline", action: () => console.log("Appearance settings") },
    { title: "Notifications", icon: "notifications-outline", action: () => console.log("Notification settings") },
    { title: "Privacy", icon: "lock-closed-outline", action: () => console.log("Privacy settings") },
    { title: "Help & Support", icon: "help-circle-outline", action: () => console.log("Help & Support") },
    { title: "About", icon: "information-circle-outline", action: () => console.log("About app") },
    { title: "Log Out", icon: "log-out-outline", action: () => router.push("/login"), color: "#FF3B30" }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image
          source={{ uri: userData.imageUrl }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
        <Text style={styles.userSince}>Member since {userData.createdAt}</Text>
      </View>
      
      <View style={styles.menuSection}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem} 
            onPress={item.action}
          >
            <Ionicons 
              name={item.icon} 
              size={24} 
              color={item.color || "#333"} 
              style={styles.menuIcon} 
            />
            <Text style={[styles.menuText, item.color ? { color: item.color } : null]}>
              {item.title}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  userSince: {
    fontSize: 14,
    color: '#999',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    color: '#999',
    fontSize: 14,
  },
}); 