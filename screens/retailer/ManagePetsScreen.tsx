import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreen from '../user/AccountSettings';

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  type: string;
  location: string;
  images: string[];
  available?: boolean;
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

const PetAdoptionManager: React.FC = () => {
  const [screenMode, setScreenMode] = useState<ScreenMode>('pets');
  const [pets, setPets] = useState<Pet[]>([]);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [newPet, setNewPet] = useState<Omit<Pet, 'id'>>({
    name: '',
    breed: '',
    age: '',
    description: '',
    type: '',
    location: '',
    images: [],
    available: true,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedPets, storedApplications] = await Promise.all([
          AsyncStorage.getItem('pets'),
          AsyncStorage.getItem('applications')
        ]);
        
        if (storedPets) setPets(JSON.parse(storedPets));
        if (storedApplications) setApplications(JSON.parse(storedApplications));
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const savePets = async () => {
      try {
        await AsyncStorage.setItem('pets', JSON.stringify(pets));
      } catch (error) {
        console.error('Failed to save pets:', error);
      }
    };

    savePets();
  }, [pets]);

  const handleAddPet = () => {
    if (!newPet.name || !newPet.breed || !newPet.age || !newPet.type) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const newId = Date.now().toString();
    const pet: Pet = { id: newId, ...newPet };
    setPets([...pets, pet]);
    setNewPet({ name: '', breed: '', age: '', description: '', type: '', location: '', images: [], available: true });
    setIsAddingPet(false);
    Alert.alert('Success', 'Pet added successfully!');
  };

  const handleUpdatePet = () => {
    if (!editingPet) return;
    setPets(pets.map(p => (p.id === editingPet.id ? editingPet : p)));
    setEditingPet(null);
    Alert.alert('Updated', 'Pet info updated.');
  };

  const handleDeletePet = (id: string) => {
    Alert.alert(
      'Delete Pet',
      'Are you sure you want to delete this pet?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setPets(pets.filter(p => p.id !== id));
            Alert.alert('Deleted', 'Pet removed.');
          }
        }
      ]
    );
  };

  const handleApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const updatedApplications = applications.map(app => 
        app.id === id ? { ...app, status } : app
      );

      if (status === 'approved') {
        const application = updatedApplications.find(app => app.id === id);
        if (application) {
          setPets(pets.map(p => 
            p.id === application.petId ? { ...p, available: false } : p
          ));
        }
      }

      await AsyncStorage.setItem('applications', JSON.stringify(updatedApplications));
      setApplications(updatedApplications);
      
      Alert.alert('Success', `Application ${status}`);
    } catch (error) {
      console.error('Failed to update application status:', error);
      Alert.alert('Error', 'Failed to update application status');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (editingPet) {
        setEditingPet({ ...editingPet, images: [...editingPet.images, result.assets[0].uri] });
      } else {
        setNewPet({ ...newPet, images: [...newPet.images, result.assets[0].uri] });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pet Seller</Text>
        <Ionicons name="paw" size={28} color="#5D3FD3" />
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          onPress={() => setScreenMode('pets')}
          style={[styles.toggleBtn, screenMode === 'pets' && styles.activeToggle]}
        >
          <Ionicons name="list" size={20} color={screenMode === 'pets' ? '#fff' : '#5D3FD3'} style={styles.toggleIcon} />
          <Text style={[styles.toggleText, screenMode === 'pets' && styles.activeText]}>Pet Management</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setScreenMode('applications')}
          style={[styles.toggleBtn, screenMode === 'applications' && styles.activeToggle]}
        >
          <Ionicons name="document-text" size={20} color={screenMode === 'applications' ? '#fff' : '#5D3FD3'} style={styles.toggleIcon} />
          <Text style={[styles.toggleText, screenMode === 'applications' && styles.activeText]}>Applications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setScreenMode('profile')}
          style={[styles.toggleBtn, screenMode === 'profile' && styles.activeToggle]}
        >
          <Ionicons name="person" size={20} color={screenMode === 'profile' ? '#fff' : '#5D3FD3'} style={styles.toggleIcon} />
          <Text style={[styles.toggleText, screenMode === 'profile' && styles.activeText]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {screenMode === 'pets' ? (
          <>
            {pets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="paw" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No pets added yet</Text>
                <Text style={styles.emptyStateSubtext}>Add your first pet to get started</Text>
              </View>
            ) : (
              pets.map((pet) => (
                <View key={pet.id} style={styles.card}>
                  {pet.images.length > 0 && (
                    <Image
                      source={{ uri: pet.images[0] }}
                      style={styles.image}
                    />
                  )}
                  <View style={styles.info}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petDetails}>{pet.breed} • {pet.age} • {pet.type}</Text>
                    <Text style={styles.petDescription}>{pet.description}</Text>
                    <Text style={styles.petLocation}>📍 {pet.location}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusTag, pet.available ? styles.availableTag : styles.unavailableTag]}>
                        <Text style={styles.statusText}>{pet.available ? 'Available' : 'Not Available'}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => setEditingPet(pet)}>
                      <Ionicons name="pencil" size={24} color="#5D3FD3" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePet(pet.id)}>
                      <Ionicons name="trash" size={24} color="#F44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.fab} onPress={() => setIsAddingPet(true)}>
              <Ionicons name="add" size={36} color="#fff" />
            </TouchableOpacity>
          </>
        ) : screenMode === 'applications' ? (
          <>
            {applications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No applications yet</Text>
                <Text style={styles.emptyStateSubtext}>Applications will appear here when buyers apply</Text>
              </View>
            ) : (
              applications.map((app) => (
                <View key={app.id} style={styles.card}>
                  <Text style={styles.petName}>{app.petName}</Text>
                  <Text style={styles.applicantInfo}>👤 {app.applicantName}</Text>
                  <Text style={styles.applicantInfo}>📧 {app.email}</Text>
                  <Text style={styles.applicantInfo}>📱 {app.phone}</Text>
                  {app.address && <Text style={styles.applicantInfo}>🏠 {app.address}</Text>}
                  {app.reasonForAdoption && (
                    <Text style={styles.applicationReason}>
                      <Text style={{ fontWeight: 'bold' }}>Reason: </Text>
                      {app.reasonForAdoption}
                    </Text>
                  )}
                  <View style={[styles.statusTag, 
                    app.status === 'approved' ? styles.approvedTag : 
                    app.status === 'rejected' ? styles.rejectedTag : styles.pendingTag]}>
                    <Text style={styles.statusText}>{app.status.toUpperCase()}</Text>
                  </View>
                  {app.status === 'pending' && (
                    <View style={styles.cardActions}>
                      <Button 
                        mode="contained" 
                        onPress={() => handleApplicationStatus(app.id, 'approved')} 
                        style={styles.btnApprove}
                        labelStyle={styles.buttonLabel}
                      >
                        Approve
                      </Button>
                      <Button 
                        mode="outlined" 
                        onPress={() => handleApplicationStatus(app.id, 'rejected')} 
                        style={styles.btnReject}
                        labelStyle={[styles.buttonLabel, { color: '#F44336' }]}
                      >
                        Reject
                      </Button>
                    </View>
                  )}
                </View>
              ))
            )}
          </>
        ) : (
          <ProfileScreen />
        )}
      </ScrollView>

      {(isAddingPet || editingPet) && (
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingPet ? 'Edit Pet' : 'Add New Pet'}</Text>
            <TextInput
              placeholder="Pet Name *"
              value={editingPet ? editingPet.name : newPet.name}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, name: text }) : setNewPet({ ...newPet, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Breed *"
              value={editingPet ? editingPet.breed : newPet.breed}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, breed: text }) : setNewPet({ ...newPet, breed: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Age *"
              value={editingPet ? editingPet.age : newPet.age}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, age: text }) : setNewPet({ ...newPet, age: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Type (Dog, Cat, Bird, etc.) *"
              value={editingPet ? editingPet.type : newPet.type}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, type: text }) : setNewPet({ ...newPet, type: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Location *"
              value={editingPet ? editingPet.location : newPet.location}  
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, location: text }) : setNewPet({ ...newPet, location: text })}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={editingPet ? editingPet.description : newPet.description}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, description: text }) : setNewPet({ ...newPet, description: text })}
              style={[styles.input, styles.textArea]}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>Add Photo</Text>
            </TouchableOpacity>
            
            {(editingPet ? editingPet.images : newPet.images).length > 0 && (
              <ScrollView horizontal style={styles.imagePreviewContainer}>
                {(editingPet ? editingPet.images : newPet.images).map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.imagePreview} />
                ))}
              </ScrollView>
            )}
            
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => editingPet ? setEditingPet(null) : setIsAddingPet(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={editingPet ? handleUpdatePet : handleAddPet} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Pet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f4ff',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-around',
    paddingHorizontal: 0,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  toggleIcon: {
    marginRight: 6,
  },
  activeToggle: {
    backgroundColor: '#5D3FD3',
  },
  toggleText: {
    color: '#5D3FD3',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeText: {
    color: '#fff',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 8,
  },
  info: {
    marginBottom: 10,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  petDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  petLocation: {
    fontSize: 14,
    color: '#5D3FD3',
    marginBottom: 8,
  },
  applicantInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  applicationReason: {
    fontSize: 14,
    color: '#888',
    marginVertical: 8,
    lineHeight: 20,
  },
  statusContainer: {
    marginTop: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  availableTag: {
    backgroundColor: '#4ECDC4',
  },
  unavailableTag: {
    backgroundColor: '#F44336',
  },
  pendingTag: {
    backgroundColor: '#FF9800',
  },
  approvedTag: {
    backgroundColor: '#4CAF50',
  },
  rejectedTag: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnApprove: {
    backgroundColor: '#4CAF50',
    flex: 1,
  },
  btnReject: {
    borderColor: '#F44336',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#5D3FD3',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modal: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#5D3FD3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#5D3FD3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default PetAdoptionManager;
