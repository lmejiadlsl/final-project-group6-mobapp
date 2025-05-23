import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../contexts/AuthContext'; // adjust path as needed
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../contexts/UserContext'; // adjust path as needed

type UserRole = 'buyer' | 'seller' | 'admin';

type LoginScreenProps = {
  navigation: StackNavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { setUser } = useUser();

  const handleRoleSelection = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
  };

  const validateInputs = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email format is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      const docRef = doc(db, selectedRole, email);
      const docSnap = await getDoc(docRef);

      setIsLoading(false);

 if (docSnap.exists()) {
  const userData = docSnap.data();

  if (userData.password === password && userData.role === selectedRole) {
    const user = {
      name: userData.name,
      email: docSnap.id,   // Use doc ID as email here
      role: userData.role,
    };

    setUser(user);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    
    Alert.alert('Success', `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} logged in successfully`);
    navigation.replace('App', { role: selectedRole });
  } else {
    setErrors({ password: 'Invalid credentials for selected role' });
  }
} else {
  setErrors({ email: 'Account not found' });
}

    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Pawfect Match</Text>
          <Text style={styles.tagline}>Find your perfect furry friend</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.roleTabsContainer}>
            {(['buyer', 'seller', 'admin'] as UserRole[]).map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleTab,
                  selectedRole === role && styles.selectedRoleTab,
                ]}
                onPress={() => handleRoleSelection(role)}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    selectedRole === role && styles.selectedRoleTabText,
                  ]}
                >
                  {role === 'buyer' ? 'Pet Buyer' : role === 'seller' ? 'Pet Seller' : 'Admin'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={20} color="#9e9e9e" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#9e9e9e"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={20} color="#9e9e9e" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9e9e9e"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#9e9e9e"
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {selectedRole !== 'admin' && (
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register', { initialRole: selectedRole })}>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 30, paddingHorizontal: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100, marginBottom: 10 },
  appName: { fontSize: 28, fontWeight: 'bold', color: '#4a6eb5', marginBottom: 5 },
  tagline: { fontSize: 16, color: '#888', textAlign: 'center' },
  formContainer: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, marginBottom: 10 },
  roleTabsContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f0f0f0', borderRadius: 12, overflow: 'hidden' },
  roleTab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  selectedRoleTab: { backgroundColor: '#4a6eb5' },
  roleTabText: { fontSize: 14, fontWeight: '500', color: '#666' },
  selectedRoleTabText: { color: '#ffffff', fontWeight: '600' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, backgroundColor: '#fdfdfd' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#333' },
  eyeIcon: { padding: 10 },
  errorText: { color: '#f44336', fontSize: 12, marginTop: -10, marginBottom: 15, marginLeft: 5 },
  forgotPasswordContainer: { alignItems: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { color: '#4a6eb5', fontSize: 14 },
  loginButton: { backgroundColor: '#4a6eb5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 14, color: '#666' },
  signupLink: { fontSize: 14, color: '#4a6eb5', fontWeight: '600' },
});

export default LoginScreen;
