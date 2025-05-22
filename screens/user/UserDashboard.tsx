import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, SafeAreaView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const PetBuyerScreen: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [applicationForm, setApplicationForm] = useState({
    applicantName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    livingSituation: 'house',
    hasYard: false,
    otherPets: '',
    reasonForAdoption: ''
  });

  useEffect(() => {
    const loadPets = async () => {
      try {
        const storedPets = await AsyncStorage.getItem('pets');
        if (storedPets) {
          setPets(JSON.parse(storedPets));
        }
      } catch (error) {
        console.error('Failed to load pets from storage:', error);
      }
    };

    loadPets();
  }, []);

  const handleApply = (pet: Pet) => {
    setSelectedPet(pet);
    setShowAdoptionForm(true);
  };

  const handleSubmitApplication = async () => {
    if (!applicationForm.applicantName || !applicationForm.email || !applicationForm.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedPet) return;

    try {
      const newApplication: AdoptionApplication = {
        id: Date.now().toString(),
        petId: selectedPet.id,
        petName: selectedPet.name,
        ...applicationForm,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      
      const existingApplications = await AsyncStorage.getItem('applications');
      let applications = existingApplications ? JSON.parse(existingApplications) : [];
      
     
      applications.push(newApplication);
      
      
      await AsyncStorage.setItem('applications', JSON.stringify(applications));

      Alert.alert(
        'Application Submitted!',
        `Thank you for your interest in adopting ${selectedPet.name}. The shelter will contact you within 24-48 hours.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowAdoptionForm(false);
              setApplicationForm({
                applicantName: '',
                email: '',
                phone: '',
                address: '',
                experience: '',
                livingSituation: 'house',
                hasYard: false,
                otherPets: '',
                reasonForAdoption: ''
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Failed to save application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const renderAdoptionFormModal = () => (
    <Modal
      visible={showAdoptionForm}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity
            onPress={() => setShowAdoptionForm(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Adoption Application</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.formContainer}>
          <Text style={styles.formSubtitle}>
            Apply to adopt {selectedPet?.name}
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Full Name *</Text>
            <TextInput
              style={styles.formInput}
              value={applicationForm.applicantName}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, applicantName: text })}
              placeholder="Enter your full name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Email Address *</Text>
            <TextInput
              style={styles.formInput}
              value={applicationForm.email}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Phone Number *</Text>
            <TextInput
              style={styles.formInput}
              value={applicationForm.phone}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Home Address</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={applicationForm.address}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, address: text })}
              placeholder="Enter your full address"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Living Situation</Text>
            <View style={styles.radioGroup}>
              {['house', 'apartment', 'other'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => setApplicationForm({ ...applicationForm, livingSituation: option })}
                >
                  <View style={[
                    styles.radioCircle,
                    applicationForm.livingSituation === option && styles.radioSelected
                  ]} />
                  <Text style={styles.radioText}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Experience with Pets</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={applicationForm.experience}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, experience: text })}
              placeholder="Tell us about your experience with pets..."
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Why do you want to adopt this pet?</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={applicationForm.reasonForAdoption}
              onChangeText={(text) => setApplicationForm({ ...applicationForm, reasonForAdoption: text })}
              placeholder="Share your reasons for wanting to adopt..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitApplication}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Pets for Adoption</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="paw" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No pets available for adoption</Text>
          </View>
        ) : (
          pets.map((pet) => (
            <View key={pet.id} style={styles.card}>
              <Image
                source={{ uri: pet.images[0] || 'https://via.placeholder.com/150' }} 
                style={styles.image}
              />
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
                {pet.available && (
                  <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(pet)}>
                    <Text style={styles.applyButtonText}>Apply for Adoption</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {renderAdoptionFormModal()}
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D3FD3',
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
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  applyButton: {
    marginTop: 10,
    backgroundColor: '#5D3FD3',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
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
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: '#5D3FD3',
    backgroundColor: '#5D3FD3',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#5D3FD3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PetBuyerScreen;