import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  adoptedPets: number;
  avatar?: string;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  adoptionUpdates: boolean;
  newPetAlerts: boolean;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    memberSince: 'January 2024',
    adoptedPets: 2,
  });

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    adoptionUpdates: true,
    newPetAlerts: false,
  });

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Navigate back to login screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' as never }],
            });
          },
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setShowEditProfile(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been deleted.', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' as never }],
                  });
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        {userProfile.avatar ? (
          <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
        )}
        <TouchableOpacity style={styles.editAvatarButton}>
          <Ionicons name="camera" size={16} color="#5D3FD3" />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{userProfile.name}</Text>
      <Text style={styles.userEmail}>{userProfile.email}</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userProfile.adoptedPets}</Text>
          <Text style={styles.statLabel}>Pets Adopted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = (title: string, items: any[]) => (
    <View style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.settingsItem,
            index === items.length - 1 && styles.lastItem,
            item.danger && styles.dangerItem,
          ]}
          onPress={item.onPress}
        >
          <View style={styles.settingsItemLeft}>
            <View style={[styles.settingsIcon, item.danger && styles.dangerIcon]}>
              <Ionicons
                name={item.icon}
                size={20}
                color={item.danger ? '#FF6B6B' : '#5D3FD3'}
              />
            </View>
            <Text style={[styles.settingsItemText, item.danger && styles.dangerText]}>
              {item.title}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEditProfileModal = () => (
    <Modal
      visible={showEditProfile}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditProfile(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.editForm}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name</Text>
            <TextInput
              style={styles.formInput}
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              placeholder="Enter your full name"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email</Text>
            <TextInput
              style={styles.formInput}
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone</Text>
            <TextInput
              style={styles.formInput}
              value={editForm.phone}
              onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Address</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={editForm.address}
              onChangeText={(text) => setEditForm({ ...editForm, address: text })}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const renderNotificationModal = () => (
    <Modal
      visible={showNotificationSettings}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowNotificationSettings(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Notifications</Text>
          <TouchableOpacity onPress={() => setShowNotificationSettings(false)}>
            <Text style={styles.saveButton}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.notificationSettings}>
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>Push Notifications</Text>
              <Text style={styles.notificationDescription}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={notifications.pushNotifications}
              onValueChange={(value) =>
                setNotifications({ ...notifications, pushNotifications: value })
              }
              trackColor={{ false: '#ccc', true: '#5D3FD3' }}
            />
          </View>
          
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>Email Notifications</Text>
              <Text style={styles.notificationDescription}>
                Receive updates via email
              </Text>
            </View>
            <Switch
              value={notifications.emailNotifications}
              onValueChange={(value) =>
                setNotifications({ ...notifications, emailNotifications: value })
              }
              trackColor={{ false: '#ccc', true: '#5D3FD3' }}
            />
          </View>
          
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>Adoption Updates</Text>
              <Text style={styles.notificationDescription}>
                Get notified about your adoption applications
              </Text>
            </View>
            <Switch
              value={notifications.adoptionUpdates}
              onValueChange={(value) =>
                setNotifications({ ...notifications, adoptionUpdates: value })
              }
              trackColor={{ false: '#ccc', true: '#5D3FD3' }}
            />
          </View>
          
          <View style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationTitle}>New Pet Alerts</Text>
              <Text style={styles.notificationDescription}>
                Be notified when new pets match your preferences
              </Text>
            </View>
            <Switch
              value={notifications.newPetAlerts}
              onValueChange={(value) =>
                setNotifications({ ...notifications, newPetAlerts: value })
              }
              trackColor={{ false: '#ccc', true: '#5D3FD3' }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const accountSettings = [
    {
      title: 'Edit Profile',
      icon: 'person-outline',
      onPress: () => setShowEditProfile(true),
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline',
      onPress: () => setShowNotificationSettings(true),
    },
    {
      title: 'Privacy Settings',
      icon: 'shield-outline',
      onPress: () => Alert.alert('Coming Soon', 'Privacy settings will be available soon.'),
    },
  ];

  const applicationSettings = [
    {
      title: 'My Applications',
      icon: 'document-text-outline',
      onPress: () => Alert.alert('Coming Soon', 'Application history will be available soon.'),
    },
    {
      title: 'Adoption History',
      icon: 'heart-outline',
      onPress: () => Alert.alert('Coming Soon', 'Adoption history will be available soon.'),
    },
    {
      title: 'Saved Searches',
      icon: 'bookmark-outline',
      onPress: () => Alert.alert('Coming Soon', 'Saved searches will be available soon.'),
    },
  ];

  const supportSettings = [
    {
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => Alert.alert('Help Center', 'Contact support at help@pawfectmatch.com'),
    },
    {
      title: 'Terms of Service',
      icon: 'document-outline',
      onPress: () => Alert.alert('Coming Soon', 'Terms of service will be available soon.'),
    },
    {
      title: 'Privacy Policy',
      icon: 'lock-closed-outline',
      onPress: () => Alert.alert('Coming Soon', 'Privacy policy will be available soon.'),
    },
  ];

  const dangerZone = [
    {
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout,
      danger: true,
    },
    {
      title: 'Delete Account',
      icon: 'trash-outline',
      onPress: handleDeleteAccount,
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileHeader()}
        {renderSettingsSection('Account', accountSettings)}
        {renderSettingsSection('Applications', applicationSettings)}
        {renderSettingsSection('Support', supportSettings)}
        {renderSettingsSection('', dangerZone)}
      </ScrollView>
      
      {renderEditProfileModal()}
      {renderNotificationModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ff',
  },
  profileHeader: {
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5D3FD3',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  settingsSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f6f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#333',
  },
  dangerItem: {
    backgroundColor: '#fff5f5',
  },
  dangerIcon: {
    backgroundColor: '#ffebeb',
  },
  dangerText: {
    color: '#FF6B6B',
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f6f4ff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelButton: {
    fontSize: 16,
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#5D3FD3',
    fontWeight: '600',
  },
  
  // Form Styles
  editForm: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  
  // Notification Styles
  notificationSettings: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileScreen;