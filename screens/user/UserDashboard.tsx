  import React, { useState } from 'react';
  import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    Alert,
    Dimensions
  } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';

  const { width } = Dimensions.get('window');

  // Types for better type safety
  interface Pet {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: any;
    available: boolean;
    description?: string;
    size?: string;
    gender?: string;
    vaccinated?: boolean;
    neutered?: boolean;
    shelter?: string;
    location?: string;
  }

  interface Shelter {
    id: string;
    name: string;
    distance: string;
    petsAvailable: number;
    address?: string;
    phone?: string;
  }

  interface AdoptionApplication {
    petId: string;
    petName: string;
    applicantName: string;
    email: string;
    phone: string;
    address: string;
    experience: string;
    livingSituation: 'house' | 'apartment' | 'other';
    hasYard: boolean;
    otherPets: string;
    reasonForAdoption: string;
  }

  const UserDashboard = () => {
    const [selectedCategory, setSelectedCategory] = useState('All Pets');
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [showPetDetails, setShowPetDetails] = useState(false);
    const [showAdoptionForm, setShowAdoptionForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Application form state
    const [applicationForm, setApplicationForm] = useState<Partial<AdoptionApplication>>({
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

    const categories = ['All Pets', 'Dogs', 'Cats', 'Birds', 'Rabbits'];

    const featuredPets: Pet[] = [
      {
        id: '1',
        name: 'Max',
        breed: 'Golden Retriever',
        age: '2 months old',
        image: require('../../assets/Golden-Retriever-puppy.jpg'),
        available: true,
        description: 'Max is a playful and energetic puppy who loves to fetch and play with children. He\'s great with other dogs and is looking for an active family.',
        size: 'Large',
        gender: 'Male',
        vaccinated: true,
        neutered: false,
        shelter: 'Happy Paws Shelter',
        location: 'New York, NY'
      },
      {
        id: '2',
        name: 'Luna',
        breed: 'Siamese Cat',
        age: '3 months old',
        image: require('../../assets/Golden-Retriever-puppy.jpg'),
        available: true,
        description: 'Luna is a gentle and affectionate kitten who loves to cuddle. She enjoys playing with toys and is very social with humans.',
        size: 'Medium',
        gender: 'Female',
        vaccinated: true,
        neutered: true,
        shelter: 'Furry Friends Center',
        location: 'Brooklyn, NY'
      },
      {
        id: '3',
        name: 'Charlie',
        breed: 'Beagle Mix',
        age: '1 year old',
        image: require('../../assets/Golden-Retriever-puppy.jpg'),
        available: true,
        description: 'Charlie is a friendly and loyal companion who loves walks and outdoor adventures. Perfect for an active lifestyle.',
        size: 'Medium',
        gender: 'Male',
        vaccinated: true,
        neutered: true,
        shelter: 'Happy Paws Shelter',
        location: 'Manhattan, NY'
      }
    ];

    const nearbyShelters: Shelter[] = [
      {
        id: '1',
        name: 'Happy Paws Shelter',
        distance: '2.5 miles away',
        petsAvailable: 15,
        address: '123 Pet Street, New York, NY 10001',
        phone: '(555) 123-4567'
      },
      {
        id: '2',
        name: 'Furry Friends Center',
        distance: '3.8 miles away',
        petsAvailable: 23,
        address: '456 Animal Ave, Brooklyn, NY 11201',
        phone: '(555) 987-6543'
      },
      {
        id: '3',
        name: 'Rescue Haven',
        distance: '5.2 miles away',
        petsAvailable: 18,
        address: '789 Care Lane, Queens, NY 11435',
        phone: '(555) 456-7890'
      }
    ];

    const filteredPets = featuredPets.filter(pet => {
      const matchesCategory = selectedCategory === 'All Pets' ||
        pet.breed.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    const handlePetPress = (pet: Pet) => {
      setSelectedPet(pet);
      setShowPetDetails(true);
    };

    const handleAdoptPress = () => {
      if (selectedPet) {
        setApplicationForm({
          ...applicationForm,
          petId: selectedPet.id,
          petName: selectedPet.name
        });
        setShowPetDetails(false);
        setShowAdoptionForm(true);
      }
    };

    const handleSubmitApplication = () => {
      // Validate form
      if (!applicationForm.applicantName || !applicationForm.email || !applicationForm.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Here you would typically submit to your backend
      Alert.alert(
        'Application Submitted!',
        `Thank you for your interest in adopting ${applicationForm.petName}. The shelter will contact you within 24-48 hours.`,
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
    };

    const renderPetDetailsModal = () => (
      <Modal
        visible={showPetDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowPetDetails(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Pet Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {selectedPet && (
            <ScrollView style={styles.petDetailsContent}>
              <Image source={selectedPet.image} style={styles.petDetailImage} />

              <View style={styles.petDetailsInfo}>
                <View style={styles.petHeader}>
                  <Text style={styles.petDetailName}>{selectedPet.name}</Text>
                  {selectedPet.available && (
                    <View style={styles.availableTag}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.petDetailBreed}>{selectedPet.breed}</Text>
                <Text style={styles.petDetailAge}>{selectedPet.age}</Text>

                <View style={styles.petSpecs}>
                  <View style={styles.specItem}>
                    <Ionicons name="resize" size={16} color="#666" />
                    <Text style={styles.specText}>{selectedPet.size}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Ionicons name="person" size={16} color="#666" />
                    <Text style={styles.specText}>{selectedPet.gender}</Text>
                  </View>
                  <View style={styles.specItem}>
                    <Ionicons name="medical" size={16} color="#666" />
                    <Text style={styles.specText}>
                      {selectedPet.vaccinated ? 'Vaccinated' : 'Not Vaccinated'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.descriptionTitle}>About {selectedPet.name}</Text>
                <Text style={styles.petDescription}>{selectedPet.description}</Text>

                <View style={styles.shelterInfo}>
                  <Ionicons name="location" size={20} color="#5D3FD3" />
                  <View style={styles.shelterDetails}>
                    <Text style={styles.shelterName}>{selectedPet.shelter}</Text>
                    <Text style={styles.shelterLocation}>{selectedPet.location}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.adoptButton}
                  onPress={handleAdoptPress}
                >
                  <Text style={styles.adoptButtonText}>Apply for Adoption</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    );

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
              Apply to adopt {applicationForm.petName}
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={styles.formInput}
                value={applicationForm.applicantName}
                onChangeText={(text) => setApplicationForm({...applicationForm, applicantName: text})}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address *</Text>
              <TextInput
                style={styles.formInput}
                value={applicationForm.email}
                onChangeText={(text) => setApplicationForm({...applicationForm, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number *</Text>
              <TextInput
                style={styles.formInput}
                value={applicationForm.phone}
                onChangeText={(text) => setApplicationForm({...applicationForm, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Home Address</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={applicationForm.address}
                onChangeText={(text) => setApplicationForm({...applicationForm, address: text})}
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
                    onPress={() => setApplicationForm({...applicationForm, livingSituation: option as any})}
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
                onChangeText={(text) => setApplicationForm({...applicationForm, experience: text})}
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
                onChangeText={(text) => setApplicationForm({...applicationForm, reasonForAdoption: text})}
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>PawfectMatch</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#5D3FD3" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search pets by name or breed..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Pets Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Search Results (${filteredPets.length})` : 'Featured Pets'}
              </Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.petsContainer}
            >
              {filteredPets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  onPress={() => handlePetPress(pet)}
                >
                  <View style={styles.imageContainer}>
                    <Image source={pet.image} style={styles.petImage} />
                    {pet.available && (
                      <View style={styles.availableTag}>
                        <Text style={styles.availableText}>Available</Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.favoriteButton}>
                      <Ionicons name="heart-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.petInfo}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petBreed}>{pet.breed}</Text>
                    <Text style={styles.petAge}>{pet.age}</Text>
                    <View style={styles.petLocation}>
                      <Ionicons name="location-outline" size={12} color="#999" />
                      <Text style={styles.locationText}>{pet.location}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredPets.length === 0 && (
              <View style={styles.noResultsContainer}>
                <Ionicons name="paw" size={48} color="#ccc" />
                <Text style={styles.noResultsText}>No pets found</Text>
                <Text style={styles.noResultsSubtext}>Try adjusting your search or filters</Text>
              </View>
            )}
          </View>

          {/* Nearby Shelters Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Shelters</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View Map</Text>
              </TouchableOpacity>
            </View>

            {nearbyShelters.map((shelter) => (
              <TouchableOpacity key={shelter.id} style={styles.shelterCard}>
                <View style={styles.shelterIconContainer}>
                  <Ionicons name="home" size={24} color="#fff" />
                </View>
                <View style={styles.shelterInfo}>
                  <Text style={styles.shelterName}>{shelter.name}</Text>
                  <Text style={styles.shelterDistance}>{shelter.distance}</Text>
                  <Text style={styles.shelterPets}>{shelter.petsAvailable} pets available</Text>
                  {shelter.phone && (
                    <Text style={styles.shelterPhone}>{shelter.phone}</Text>
                  )}
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" size={20} color="#5D3FD3" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="calendar" size={24} color="#5D3FD3" />
                <Text style={styles.quickActionText}>Schedule Visit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="document-text" size={24} color="#5D3FD3" />
                <Text style={styles.quickActionText}>My Applications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <Ionicons name="information-circle" size={24} color="#5D3FD3" />
                <Text style={styles.quickActionText}>Adoption Guide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {renderPetDetailsModal()}
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    appName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#5D3FD3',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      marginHorizontal: 16,
      borderRadius: 12,
      paddingHorizontal: 12,
      marginVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 16,
      color: '#333',
    },
    categoriesContainer: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    categoryButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      marginHorizontal: 4,
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#5D3FD3',
    },
    selectedCategory: {
      backgroundColor: '#5D3FD3',
    },
    categoryText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#5D3FD3',
    },
    selectedCategoryText: {
      color: '#fff',
    },
    sectionContainer: {
      paddingHorizontal: 16,
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
    },
    seeAllText: {
      fontSize: 14,
      color: '#5D3FD3',
      fontWeight: '600',
    },
    petsContainer: {
      paddingBottom: 12,
    },
    petCard: {
      width: 160,
      marginRight: 12,
      borderRadius: 16,
      backgroundColor: '#fff',
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      position: 'relative',
    },
    petImage: {
      width: '100%',
      height: 140,
      resizeMode: 'cover',
    },
    availableTag: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: '#4ECDC4',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    availableText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    favoriteButton: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    petInfo: {
      padding: 12,
    },
    petName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 2,
    },
    petBreed: {
      fontSize: 13,
      color: '#666',
      marginBottom: 2,
    },
    petAge: {
      fontSize: 12,
      color: '#999',
      marginBottom: 4,
    },
    petLocation: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 11,
      color: '#999',
      marginLeft: 2,
    },
    noResultsContainer: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    noResultsText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#999',
      marginTop: 8,
    },
    noResultsSubtext: {
      fontSize: 14,
      color: '#ccc',
      marginTop: 4,
    },
    shelterCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    shelterIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: '#5D3FD3',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    shelterInfo: {
      flex: 1,
    },
    shelterName: { // This is the single, correct definition
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 2,
    },
    shelterDistance: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
    },
    shelterPets: {
      fontSize: 14,
      color: '#5D3FD3',
      fontWeight: '600',
    },
    shelterPhone: {
      fontSize: 12,
      color: '#999',
      marginTop: 2,
    },
    callButton: {
      padding: 8,
    },
    quickActionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    quickActionButton: {
      flex: 1,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quickActionText: {
      fontSize: 12,
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      marginTop: 8,
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
    petDetailsContent: {
      flex: 1,
    },
    petDetailImage: {
      width: '100%',
      height: 250,
      resizeMode: 'cover',
    },
    petDetailsInfo: {
      padding: 16,
    },
    petHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    petDetailName: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      flex: 1,
    },
    petDetailBreed: {
      fontSize: 18,
      color: '#666',
      marginBottom: 4,
    },
    petDetailAge: {
      fontSize: 16,
      color: '#999',
      marginBottom: 16,
    },
    petSpecs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    specItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
      marginRight: 8,
      marginBottom: 8,
    },
    specText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 4,
    },
    descriptionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    petDescription: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24,
      marginBottom: 20,
    },
    shelterInfoFlex: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    shelterDetails: {
      marginLeft: 12,
    },
    shelterLocation: { // This is now correctly placed and unique
      fontSize: 14,
      color: '#999',
    },
    adoptButton: {
      backgroundColor: '#5D3FD3',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginBottom: 20,
    },
    adoptButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },

    // Form Styles
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
    }
  });

  export default UserDashboard;