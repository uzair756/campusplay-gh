import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export const CoordinatorLandingPage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Separate useStates for sports coach's credentials
  const [repUsername, setRepUsername] = useState('');
  const [repEmail, setRepEmail] = useState('');
  const [repPassword, setRepPassword] = useState('');


  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.1.21:3002/coordinatorlandingpage', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          Alert.alert('Error', 'User not authenticated or failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'An error occurred while fetching your profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  // Modify the handleAddRep function to include department in the request
const handleAddRep = async () => {
  try {
    const response = await fetch('http://192.168.1.21:3002/studentrepsignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: repUsername,
        email: repEmail,
        password: repPassword,
        department: user.department, // Send the department of the logged-in coordinator
      }),
    });

    const data = await response.json();
    if (data.success) {
      Alert.alert('Success', 'New student rep account created successfully');
      setIsModalVisible(false);
      setRepUsername('');
      setRepEmail('');
      setRepPassword('');
    } else {
      Alert.alert('Error', data.error || 'Failed to create student rep account');
    }
  } catch (error) {
    console.error('Error adding rep:', error);
    Alert.alert('Error', 'An error occurred while adding the rep');
  }
};

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch('http://192.168.1.21:3002/changepasswordcoordinator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Password updated successfully');
        setIsChangePasswordVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        Alert.alert('Error', data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'An error occurred while updating the password');
    }
  };

  return (
    <View style={styles.container}>
      <Button style={styles.logoutButton} title="Log Out" onPress={handleSignOut} />
      <Text style={styles.title}>Profile Details</Text>

      {user ? (
        <View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Name: </Text>
            <Text>{user.username}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Email: </Text>
            <Text>{user.email}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Id: </Text>
            <Text>{user.id}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Department: </Text>
            <Text>{user.department}</Text>
          </View>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
      <Button title="Add New Student Rep Account" onPress={() => setIsModalVisible(true)} />
      <Button title="Change Password" onPress={() => setIsChangePasswordVisible(true)}/>

<Modal isVisible={isModalVisible}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Add New Student Rep</Text>
    <TextInput
      style={styles.input}
      placeholder="Username"
      value={repUsername}
      onChangeText={setRepUsername}
    />
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={repEmail}
      onChangeText={setRepEmail}
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      value={repPassword}
      onChangeText={setRepPassword}
    />
    <Button title="Submit" onPress={handleAddRep} />
    <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
  </View>
</Modal>
<Modal isVisible={isChangePasswordVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />
          <Button title="Update Password" onPress={handleChangePassword} />
          <Button
            title="Cancel"
            onPress={() => setIsChangePasswordVisible(false)}
          />
        </View>
      </Modal>
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    width: '100%',
    borderRadius: 5,
  },
});

