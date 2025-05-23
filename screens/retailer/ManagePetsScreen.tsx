import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Alert, ScrollView, Image,
  TouchableOpacity, SafeAreaView, TextInput as NativeTextInput,
  FlatList, Modal, Pressable
} from 'react-native';
import { Button, Card, Title, Paragraph, FAB, TextInput, Chip, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../user/AccountSettings';

// --- Type Definitions ---
type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  type: string;
  location: string;
  images: string[];
  available: boolean;
};

type AdoptionApplication = {
  id: string;
  petId: string;
  petName: string;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  livingSituation: string;
  hasYard: boolean;
  otherPets: string;
  reasonForAdoption: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type ScreenMode = 'pets' | 'applications' | 'profile';

// --- Default Pet State ---
const defaultNewPet: Omit<Pet, 'id'> = {
  name: '', breed: '', age: '', description: '',
  type: '', location: '', images: [], available: true,
};

// --- Main Component ---
const PetAdoptionManager: React.FC = () => {
  const [screenMode, setScreenMode] = useState<ScreenMode>('pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [currentPetData, setCurrentPetData] = useState<Omit<Pet, 'id'>>(defaultNewPet);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Search functionality ---
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPets(pets);
    } else {
      const filtered = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPets(filtered);
    }
  }, [searchQuery, pets]);

  // --- Data Loading ---
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedPets, storedApplications] = await Promise.all([
          AsyncStorage.getItem('pets'),
          AsyncStorage.getItem('applications')
        ]);
        if (storedPets) {
          const loadedPets = JSON.parse(storedPets);
          setPets(loadedPets);
          setFilteredPets(loadedPets);
        }
        if (storedApplications) setApplications(JSON.parse(storedApplications));
        console.log("Data loaded.");
      } catch (error) {
        console.error('Failed to load data:', error);
        Alert.alert('Error', 'Failed to load your data.');
      }
    };
    loadData();
  }, []);

  // --- Data Saving ---
  const saveData = useCallback(async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      Alert.alert('Error', `Failed to save ${key}.`);
    }
  }, []);

  useEffect(() => { saveData('pets', pets); }, [pets, saveData]);
  useEffect(() => { saveData('applications', applications); }, [applications, saveData]);

  // --- Image Picker ---
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
        setCurrentPetData(prev => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
    }
  };

  const removeImage = (uriToRemove: string) => {
      setCurrentPetData(prev => ({ ...prev, images: prev.images.filter(uri => uri !== uriToRemove) }));
  };

  // --- Modal Management ---
  const openAddModal = () => {
    setEditingPet(null);
    setCurrentPetData(defaultNewPet);
    setIsModalVisible(true);
  };

  const openEditModal = (pet: Pet) => {
    setEditingPet(pet);
    setCurrentPetData({ ...pet });
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setEditingPet(null);
    setCurrentPetData(defaultNewPet);
  };

  // --- Pet CRUD Operations ---
  const handleSavePet = () => {
    const { name, breed, age, type, location } = currentPetData;
    if (!name || !breed || !age || !type || !location) {
      Alert.alert('Missing Info', 'Please fill in all required fields (*).');
      return;
    }

    if (editingPet) {
      const updatedPets = pets.map(p => (p.id === editingPet.id ? { ...currentPetData, id: editingPet.id } : p));
      setPets(updatedPets);
      setFilteredPets(updatedPets);
      Alert.alert('Success', 'Pet updated successfully!');
    } else {
      const newId = `pet_${Date.now()}`;
      const newPets = [...pets, { id: newId, ...currentPetData }];
      setPets(newPets);
      setFilteredPets(newPets);
      Alert.alert('Success', 'Pet added successfully!');
    }
    closeModal();
  };

  const handleDeletePet = (id: string) => {
    Alert.alert('Confirm Deletion', 'Are you sure you want to delete this pet?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedPets = pets.filter(p => p.id !== id);
          setPets(updatedPets);
          setFilteredPets(updatedPets);
          setApplications(apps => apps.filter(app => app.petId !== id || app.status !== 'pending'));
          Alert.alert('Deleted', 'Pet removed.');
        },
      },
    ]);
  };

  // --- Application Management ---
  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    const updatedApplications = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );

    const targetApp = updatedApplications.find(app => app.id === id);

    if (targetApp && status === 'approved') {
        const updatedPets = pets.map(p =>
            p.id === targetApp.petId ? { ...p, available: false } : p
        );
        setPets(updatedPets);
        setFilteredPets(updatedPets);
        
        setApplications(updatedApplications.map(app =>
            (app.petId === targetApp.petId && app.id !== id && app.status === 'pending')
                ? { ...app, status: 'rejected' }
                : app
        ));
    } else {
        setApplications(updatedApplications);
    }

    Alert.alert('Status Updated', `Application ${status}.`);
  };

  // --- Render Functions ---
  const renderPetItem = ({ item }: { item: Pet }) => (
  <Card style={styles.card}>
    <Card.Cover source={{ uri: item.images[0] || 'https://via.placeholder.com/300x200.png?text=No+Image' }} />
    <Card.Content>
      <Title>{item.name}</Title>
      <Paragraph>{item.breed} • {item.age} • {item.type}</Paragraph>
      <Paragraph>📍 {item.location}</Paragraph>
      <Paragraph numberOfLines={2}>{item.description}</Paragraph>
      <Chip
        icon={item.available ? "check-circle" : "close-circle"}
        style={[styles.chip, item.available ? styles.availableChip : styles.unavailableChip]}
        textStyle={styles.chipText}
      >
        {item.available ? 'Available' : 'Not Available'}
      </Chip>
    </Card.Content>
    <Card.Actions style={{ justifyContent: 'flex-end', paddingHorizontal: 10, paddingBottom: 10 }}>
      <Button
        icon="pencil"
        onPress={() => openEditModal(item)}
        style={{ marginRight: 8 }}
        mode="outlined"
      >
        Edit
      </Button>
      <Button
        icon="delete"
        onPress={() => handleDeletePet(item.id)}
        color="#F44336"
        mode="outlined"
      >
        Delete
      </Button>
    </Card.Actions>
  </Card>
);

  const renderApplicationItem = ({ item }: { item: AdoptionApplication }) => {
     const statusConfig = {
        pending: { color: '#FF9800', icon: 'clock-outline' },
        approved: { color: '#4CAF50', icon: 'check-circle' },
        rejected: { color: '#F44336', icon: 'close-circle' },
     };

     return (
        <Card style={styles.card}>
            <Card.Content>
                <Title>Pet: {item.petName}</Title>
                <Paragraph>Applicant: {item.applicantName}</Paragraph>
                <Paragraph>Email: {item.email}</Paragraph>
                <Paragraph>Phone: {item.phone}</Paragraph>
                <Paragraph>Reason: {item.reasonForAdoption || 'N/A'}</Paragraph>
                 <Chip
                    icon={statusConfig[item.status].icon}
                    style={[styles.chip, { backgroundColor: statusConfig[item.status].color }]}
                    textStyle={styles.chipText}
                 >
                    {item.status.toUpperCase()}
                 </Chip>
            </Card.Content>
            {item.status === 'pending' && (
                <Card.Actions style={styles.appActions}>
                    <Button
                        mode="contained"
                        icon="check"
                        onPress={() => handleApplicationStatus(item.id, 'approved')}
                        style={styles.approveButton}
                    >
                        Approve
                    </Button>
                    <Button
                        mode="outlined"
                        icon="close"
                        onPress={() => handleApplicationStatus(item.id, 'rejected')}
                        style={styles.rejectButton}
                        color="#F44336"
                    >
                        Reject
                    </Button>
                </Card.Actions>
            )}
        </Card>
     );
  };

  const renderEmptyList = (title: string, subtitle: string, icon: keyof typeof Ionicons.glyphMap) => (
      <View style={styles.emptyState}>
          <Ionicons name={icon} size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>{title}</Text>
          <Text style={styles.emptyStateSubtext}>{subtitle}</Text>
      </View>
  );

  const pendingApplicationsCount = applications.filter(app => app.status === 'pending').length;

  // --- Main Render ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Branding and Search */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Ionicons name="paw" size={20} color="#6200ee" style={styles.pawIcon} />
            <Text style={styles.appTitle}>PawfectMatch</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={20} color="#6200ee" />
            {pendingApplicationsCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{pendingApplicationsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Search Bar - only show on pets screen */}
        {screenMode === 'pets' && (
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={16} color="#666" style={styles.searchIcon} />
              <NativeTextInput
                style={styles.searchInput}
                placeholder="Search your pets..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#999"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearButton}
                >
                  <Ionicons name="close-circle" size={16} color="#999" />
                </TouchableOpacity>
              )}
            </View>

            {/* Results counter */}
            {searchQuery.length > 0 && (
              <Text style={styles.resultsCounter}>
                {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} found
              </Text>
            )}
          </>
        )}
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          onPress={() => setScreenMode('pets')}
          style={[styles.segmentButton, screenMode === 'pets' && styles.activeSegment]}
        >
          <Ionicons name="list" size={20} color={screenMode === 'pets' ? '#fff' : '#6200ee'} />
          <Text style={[styles.segmentText, screenMode === 'pets' && styles.activeText]}>My Pets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreenMode('applications')}
          style={[styles.segmentButton, screenMode === 'applications' && styles.activeSegment]}
        >
          <Ionicons name="document-text" size={20} color={screenMode === 'applications' ? '#fff' : '#6200ee'} />
          <Text style={[styles.segmentText, screenMode === 'applications' && styles.activeText]}>Applications</Text>
          {pendingApplicationsCount > 0 && (
            <View style={styles.segmentBadge}>
              <Text style={styles.segmentBadgeText}>{pendingApplicationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreenMode('profile')}
          style={[styles.segmentButton, screenMode === 'profile' && styles.activeSegment]}
        >
          <Ionicons name="person" size={20} color={screenMode === 'profile' ? '#fff' : '#6200ee'} />
          <Text style={[styles.segmentText, screenMode === 'profile' && styles.activeText]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {screenMode === 'pets' && (
          <FlatList
            data={filteredPets}
            renderItem={renderPetItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => 
              searchQuery.length > 0 
                ? renderEmptyList(`No pets found matching "${searchQuery}"`, 'Try a different search term.', 'search-outline')
                : renderEmptyList('No Pets Listed', 'Add your first pet to start.', 'paw-outline')
            }
          />
        )}
        {screenMode === 'applications' && (
          <FlatList
            data={applications.filter(app => pets.some(p => p.id === app.petId))}
            renderItem={renderApplicationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => renderEmptyList('No Applications', 'Adoption applications will show here.', 'file-tray-outline')}
          />
        )}
        {screenMode === 'profile' && <ProfileScreen />}
      </View>

      {/* FAB */}
      {screenMode === 'pets' && (
        <FAB
          style={styles.fab}
          icon="plus"
          color="#fff"
          onPress={openAddModal}
        />
      )}

      {/* --- Add/Edit Pet Modal --- */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeModal}
        transparent={true}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                    <View style={styles.modalHeader}>
                        <Title>{editingPet ? 'Edit Pet Details' : 'Add a New Pet'}</Title>
                        <IconButton icon="close" size={24} onPress={closeModal} />
                    </View>

                    <TextInput label="Pet Name *" value={currentPetData.name} onChangeText={text => setCurrentPetData(p => ({ ...p, name: text }))} style={styles.input} mode="outlined" />
                    <TextInput label="Breed *" value={currentPetData.breed} onChangeText={text => setCurrentPetData(p => ({ ...p, breed: text }))} style={styles.input} mode="outlined" />
                    <TextInput label="Age *" value={currentPetData.age} onChangeText={text => setCurrentPetData(p => ({ ...p, age: text }))} style={styles.input} mode="outlined" keyboardType="numeric" />
                    <TextInput label="Type (Dog, Cat...) *" value={currentPetData.type} onChangeText={text => setCurrentPetData(p => ({ ...p, type: text }))} style={styles.input} mode="outlined" />
                    <TextInput label="Location *" value={currentPetData.location} onChangeText={text => setCurrentPetData(p => ({ ...p, location: text }))} style={styles.input} mode="outlined" />
                    <TextInput label="Description" value={currentPetData.description} onChangeText={text => setCurrentPetData(p => ({ ...p, description: text }))} style={styles.input} multiline numberOfLines={4} mode="outlined" />

                    <Button icon="camera" mode="outlined" onPress={pickImage} style={styles.imageButton}>
                        Add Image(s)
                    </Button>

                    <ScrollView horizontal style={styles.imagePreviewContainer}>
                        {currentPetData.images.map((uri, index) => (
                            <View key={index} style={styles.imagePreviewWrapper}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                                <IconButton
                                    icon="close-circle"
                                    iconColor="#F44336"
                                    size={20}
                                    onPress={() => removeImage(uri)}
                                    style={styles.removeImageButton}
                                />
                            </View>
                        ))}
                    </ScrollView>

                    <Button mode="contained" onPress={handleSavePet} style={styles.saveButton}>
                       {editingPet ? 'Update Pet' : 'Add Pet'}
                    </Button>
                    <Button mode="text" onPress={closeModal} style={styles.cancelButton}>
                       Cancel
                    </Button>
                </ScrollView>
            </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pawIcon: {
    marginRight: 6,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 4,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
  clearButton: {
    padding: 2,
  },
  resultsCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  segmentedControl: {
    flexDirection: 'row',
    margin: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    position: 'relative',
  },
  activeSegment: {
    backgroundColor: '#6200ee',
  },
  segmentText: {
    color: '#6200ee',
    fontWeight: '600',
    fontSize: 13,
  },
  activeText: {
    color: '#fff',
  },
  segmentBadge: {
    position: 'absolute',
    top: 4,
    right: 8,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentArea: {
      flex: 1,
  },
  listContent: {
      paddingHorizontal: 15,
      paddingBottom: 90,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
  },
  chip: {
      marginTop: 10,
      alignSelf: 'flex-start',
  },
  availableChip: {
      backgroundColor: '#4CAF50',
  },
  unavailableChip: {
      backgroundColor: '#F44336',
  },
  chipText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  appActions: {
      justifyContent: 'flex-end',
      paddingBottom: 10,
      paddingRight: 10,
  },
  approveButton: {
      backgroundColor: '#4CAF50',
  },
  rejectButton: {
      borderColor: '#F44336',
      marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#adb5bd',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ced4da',
    marginTop: 6,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    marginBottom: 12,
  },
  imageButton: {
    marginVertical: 10,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  imagePreviewWrapper: {
      position: 'relative',
      marginRight: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
      position: 'absolute',
      top: -10,
      right: -10,
      backgroundColor: '#fff',
      borderRadius: 15,
  },
  saveButton: {
    paddingVertical: 8,
    marginTop: 10,
  },
  cancelButton: {
      marginTop: 5,
  },
});

export default PetAdoptionManager;