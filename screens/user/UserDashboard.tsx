import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  Image, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UserDashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Pets');
  
  const categories = ['All Pets', 'Dogs', 'Cats', 'Birds'];
  
  const featuredPets = [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      age: '2 months old',
      image: require (''), // You'll need to add these images
      available: true,
    },
    {
      id: '2',
      name: 'Luna',
      breed: 'Siamese Cat',
      age: '3 months old',
      image: require ('../assets/pets/Golden-Retriever-puppy.jpg'),
      available: true,
    },
  ];
  
  const nearbyShelters = [
    {
      id: '1',
      name: 'Happy Paws Shelter',
      distance: '2.5 miles away',
      petsAvailable: 15,
    },
    {
      id: '2',
      name: 'Furry Friends Center',
      distance: '3.8 miles away',
      petsAvailable: 23,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>PawfectMatch</Text>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#5D3FD3" />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pets..."
            placeholderTextColor="#8E8E93"
          />
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
          <Text style={styles.sectionTitle}>Featured Pets</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsContainer}
          >
            {featuredPets.map((pet) => (
              <TouchableOpacity key={pet.id} style={styles.petCard}>
                <View style={styles.imageContainer}>
                  <Image source={pet.image} style={styles.petImage} />
                  {pet.available && (
                    <View style={styles.availableTag}>
                      <Text style={styles.availableText}>Available</Text>
                    </View>
                  )}
                </View>
                <View style={styles.petInfo}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petBreed}>{pet.breed}</Text>
                  <Text style={styles.petAge}>{pet.age}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Nearby Shelters Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Nearby Shelters</Text>
          {nearbyShelters.map((shelter) => (
            <TouchableOpacity key={shelter.id} style={styles.shelterCard}>
              <View style={styles.shelterIconContainer}>
                <Ionicons name="home" size={24} color="#fff" />
              </View>
              <View style={styles.shelterInfo}>
                <Text style={styles.shelterName}>{shelter.name}</Text>
                <Text style={styles.shelterDistance}>{shelter.distance}</Text>
                <Text style={styles.shelterPets}>{shelter.petsAvailable} pets available</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D3FD3',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'transparent',
  },
  selectedCategory: {
    backgroundColor: '#5D3FD3',
  },
  categoryText: {
    fontSize: 16,
    color: '#5D3FD3',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  petsContainer: {
    paddingBottom: 12,
  },
  petCard: {
    width: 150,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  availableTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  petInfo: {
    padding: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  petBreed: {
    fontSize: 14,
    color: '#666',
  },
  petAge: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  shelterCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  shelterIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#5D3FD3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shelterInfo: {
    flex: 1,
  },
  shelterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  shelterDistance: {
    fontSize: 14,
    color: '#666',
  },
  shelterPets: {
    fontSize: 14,
    color: '#5D3FD3',
  },
});

export default UserDashboard;