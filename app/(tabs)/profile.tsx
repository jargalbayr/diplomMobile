import { ModernColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    name: "Бат Болд",
    email: "bat.bold@example.com",
    imageUrl: "https://i.pravatar.cc/300",
    createdAt: "2023 оны 1-р сар"
  };

  const menuItems: MenuItem[] = [
    { title: "Профайл засах", icon: "person-outline", action: () => console.log("Edit profile") },
    { title: "Харагдах байдал", icon: "color-palette-outline", action: () => console.log("Appearance settings") },
    { title: "Мэдэгдлүүд", icon: "notifications-outline", action: () => console.log("Notification settings") },
    { title: "Нууцлал", icon: "lock-closed-outline", action: () => console.log("Privacy settings") },
    { title: "Тусламж", icon: "help-circle-outline", action: () => console.log("Help & Support") },
    { title: "Аппликейшны тухай", icon: "information-circle-outline", action: () => console.log("About app") },
    { title: "Гарах", icon: "log-out-outline", action: () => router.push("/login"), color: ModernColors.error }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профайл</Text>
        </View>
        
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userData.imageUrl }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.userSince}>Бүртгүүлсэн огноо: {userData.createdAt}</Text>
        </View>
        
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem} 
              onPress={item.action}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={item.icon} 
                  size={22} 
                  color={item.color || ModernColors.text.secondary}
                />
              </View>
              <Text style={[
                styles.menuText, 
                item.color ? { color: item.color } : null
              ]}>
                {item.title}
              </Text>
              <Ionicons 
                name="chevron-forward" 
                size={18} 
                color={ModernColors.text.tertiary} 
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Хувилбар 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ModernColors.background.secondary,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: ModernColors.background.primary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
  },
  profileSection: {
    alignItems: 'center',
    backgroundColor: ModernColors.background.primary,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: ModernColors.border.light,
  },
  profileImageContainer: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: ModernColors.background.primary,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ModernColors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: ModernColors.text.secondary,
    marginBottom: 8,
  },
  userSince: {
    fontSize: 14,
    color: ModernColors.text.tertiary,
  },
  menuSection: {
    backgroundColor: ModernColors.background.primary,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 2,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: ModernColors.border.light,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ModernColors.background.tertiary,
    borderRadius: 8,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: ModernColors.text.secondary,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    marginTop: 40,
  },
  version: {
    color: ModernColors.text.tertiary,
    fontSize: 14,
  },
}); 