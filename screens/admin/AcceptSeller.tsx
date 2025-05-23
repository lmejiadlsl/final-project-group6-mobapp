import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../contexts/AuthContext'; // adjust path as needed

type SellerRequest = {
  id: string;
  name: string;
  password: string;
  role: string;
};

const AcceptSeller = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'sellerapply'));
      const data: SellerRequest[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        name: docSnap.data().name,
        password: docSnap.data().password,
        role: docSnap.data().role,
      }));
      setRequests(data);
    } catch (error) {
      console.error('Error fetching seller applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const acceptRequest = async (request: SellerRequest) => {
    try {
      await setDoc(doc(db, 'seller', request.id), {
        name: request.name,
        password: request.password,
        role: request.role,
      });
      await deleteDoc(doc(db, 'sellerapply', request.id));
      Alert.alert('Success', `${request.name} has been approved as a seller.`);
      fetchRequests();  // refresh after accepting
    } catch (error) {
      console.error('Error accepting request:', error);
      Alert.alert('Error', 'Failed to accept seller application.');
    }
  };

  const rejectRequest = async (id: string, name: string) => {
    try {
      await deleteDoc(doc(db, 'sellerapply', id));
      Alert.alert('Rejected', `${name}'s application has been rejected.`);
      fetchRequests();  // refresh after rejecting
    } catch (error) {
      console.error('Error rejecting request:', error);
      Alert.alert('Error', 'Failed to reject seller application.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5D3FD3" />
      </View>
    );
  }

  if (requests.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No pending seller applications.</Text>
        <Button title="Refresh" onPress={fetchRequests} disabled={loading} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f6f4ff' }}>
      {/* Refresh button at top */}
      <View style={{ padding: 16 }}>
        <Button title="Refresh" onPress={fetchRequests} disabled={loading} />
      </View>

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>Role: {item.role}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => acceptRequest(item)}>
                <Text style={styles.buttonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => rejectRequest(item.id, item.name)}>
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    backgroundColor: '#f6f4ff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f4ff',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
  },
});

export default AcceptSeller;
