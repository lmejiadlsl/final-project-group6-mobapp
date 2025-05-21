import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, SafeAreaView} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type Pet = {
  id: string;
  name: string;
  breed: string;
  age: string;
  description: string;
  type: string;
  location: string;
  images: string[];
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type AdoptionApplication = {
  id: string;
  pet: Pet;
  user: User;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

type ScreenMode = 'pets' | 'applications';

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
  });

  useEffect(() => {
  }, [screenMode]);

  const handleAddPet = () => {
    const newId = Date.now().toString();
    const pet: Pet = { id: newId, ...newPet };
    setPets([...pets, pet]);
    setNewPet({ name: '', breed: '', age: '', description: '', type: '', location: '', images: [] });
    Alert.alert('Success', 'Pet added!');
  };

  const handleUpdatePet = () => {
    if (!editingPet) return;
    setPets(pets.map(p => (p.id === editingPet.id ? editingPet : p)));
    setEditingPet(null);
    Alert.alert('Updated', 'Pet info updated.');
  };

  const handleDeletePet = (id: string) => {
    setPets(pets.filter(p => p.id !== id));
    Alert.alert('Deleted', 'Pet removed.');
  };

  const handleApplicationStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    Alert.alert('Success', `Application ${status}`);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPet({ ...newPet, images: [...newPet.images, result.assets[0].uri] });
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
          <Text style={[styles.toggleText, screenMode === 'applications' && styles.activeText]}>Adoption Management</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {screenMode === 'pets' ? (
          <>
            {pets.map((pet) => (
              <View key={pet.id} style={styles.card}>
                <Image
                  source={{ uri: pet.images[0] || 'https://via.placeholder.com/150' }}
                  style={styles.image}
                />
                <View style={styles.info}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petDetails}>{pet.breed} • {pet.age} • {pet.type} • {pet.location}</Text>
                  <Text style={styles.petDescription}>{pet.description}</Text>
                </View>
                <View style={styles.cardActions}>
                  <Ionicons name="pencil" size={24} color="#5D3FD3" onPress={() => setEditingPet(pet)} />
                  <Ionicons name="trash" size={24} color="#F44336" onPress={() => handleDeletePet(pet.id)} />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.fab} onPress={() => setIsAddingPet(true)}>
              <Ionicons name="add" size={36} color="#fff" />
            </TouchableOpacity>
          </>
        ) : (
          applications.map((app) => (
            <View key={app.id} style={styles.card}>
              <Text style={styles.petName}>{app.pet.name}</Text>
              <Text>By: {app.user.name}</Text>
              <Text>Email: {app.user.email}</Text>
              <Text>Status: {app.status}</Text>
              <View style={styles.cardActions}>
                {app.status === 'pending' && (
                  <>
                    <Button mode="contained" onPress={() => handleApplicationStatus(app.id, 'approved')} style={styles.btnApprove}>Approve</Button>
                    <Button mode="outlined" onPress={() => handleApplicationStatus(app.id, 'rejected')} style={styles.btnReject}>Reject</Button>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {(isAddingPet || editingPet) && (
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingPet ? 'Edit Pet' : 'Add Pet'}</Text>
            <TextInput
              label="Name"
              value={editingPet ? editingPet.name : newPet.name}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, name: text }) : setNewPet({ ...newPet, name: text })}
              style={styles.input}
            />
            <TextInput
              label="Breed"
              value={editingPet ? editingPet.breed : newPet.breed}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, breed: text }) : setNewPet({ ...newPet, breed: text })}
              style={styles.input}
            />
            <TextInput
              label="Age"
              value={editingPet ? editingPet.age : newPet.age}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, age: text }) : setNewPet({ ...newPet, age: text })}
              style={styles.input}
            />
            <TextInput
              label="Type (e.g., Dog, Cat, Bird)"
              value={editingPet ? editingPet.type : newPet.type}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, type: text }) : setNewPet({ ...newPet, type: text })}
              style={styles.input}
            />
            <TextInput
              label="Location"
              value={editingPet ? editingPet.location : newPet.location}
              onChangeText={(text) => editingPet ? setEditingPet({ ...editingPet, location: text }) : setNewPet({ ...newPet, location: text })}
              style={styles.input}
            />
            <Button mode="contained" onPress={pickImage} style={styles.imageButton}>
              Take a Picture
            </Button>
            <View style={styles.modalActions}>
              <Button onPress={() => editingPet ? setEditingPet(null) : setIsAddingPet(false)}>Cancel</Button>
              <Button mode="contained" onPress={editingPet ? handleUpdatePet : handleAddPet}>Save</Button>
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
    justifyContent: 'flex-start', 
    paddingHorizontal: 0, 
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 6,
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
    shadowOpacity: 0.5,
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
  },
  petDetails: {
    fontSize: 16,
    color: '#666',
  },
  petDescription: {
    fontSize: 14,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
fab: {
    position: 'absolute',
    margin: 16,
    right: 0, 
    bottom: 0, 
    top:  500,
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

  btnApprove: {
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  btnReject: {
    borderColor: '#F44336',
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  imageButton: {
    marginBottom: 12,
  },
});

export default PetAdoptionManager;
