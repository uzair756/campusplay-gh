import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

export const CoachLandingPage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isCoordinatorModalVisible, setIsCoordinatorModalVisible] = useState(false);
  const [coordinatorUsername, setCoordinatorUsername] = useState('');
  const [coordinatorEmail, setCoordinatorEmail] = useState('');
  const [coordinatorPassword, setCoordinatorPassword] = useState('');
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [sportRules, setSportRules] = useState(''); // Renamed from 'rules'
const [updatedSportRules, setUpdatedSportRules] = useState(''); // Renamed from 'newRules'
const [lastUpdatedBy, setLastUpdatedBy] = useState('');
const [updatedAt, setUpdatedAt] = useState('');
const [isUpdatingSportRules, setIsUpdatingSportRules] = useState(false); // Renamed from 'isUpdatingRules'

  const [isSportsModalVisible, setIsSportsModalVisible] = useState(false);

  const sportsCategories = ['Football', 'Cricket', 'Volleyball', 'Tennis', 'Badminton'];
  const [department, setDepartment] = useState('');
  const [departments] = useState([
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Materials Engineering',
    'Avionics Engineering',
    'Aerospace Engineering',
    'Mathematics',
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.1.21:3002/coachlandingpage', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          Alert.alert('Error', 'User not authenticated');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile');
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  const handleAddCoordinator = async () => {
    if (!department) {
      Alert.alert('Error', 'Please select a department');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.21:3002/addcoordinator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: coordinatorUsername,
          email: coordinatorEmail,
          password: coordinatorPassword,
          department: department,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'New coordinator account created successfully');
        setIsCoordinatorModalVisible(false);
        setCoordinatorUsername('');
        setCoordinatorEmail('');
        setCoordinatorPassword('');
        setDepartment('');
      } else if (data.error === 'CoordinatorExists') {
        Alert.alert('Error', 'A coordinator for this department already exists');
      } else {
        Alert.alert('Error', data.error || 'Failed to create coordinator account');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while adding the coordinator');
    }
  };

  // Fetch Sport Rules
const fetchSportRules = async (sport) => {
  setSelectedSport(sport);
  setIsUpdatingSportRules(false);

  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`http://192.168.1.21:3002/getrules/${sport.toLowerCase()}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (data.success) {
      const { rules: ruleData } = data.rules;
      setSportRules(ruleData); // Updated
      setUpdatedSportRules(ruleData || ''); // Updated
      setLastUpdatedBy(data.rules.lastUpdatedBy || 'Unknown');
      setUpdatedAt(new Date(data.rules.updatedAt).toLocaleString());
      setIsSportsModalVisible(true);
    } else {
      Alert.alert('Error', data.message || 'Failed to fetch rules');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to fetch rules');
  }
};


  // Update Sport Rules
const updateSportRules = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }

    const response = await fetch(`http://192.168.1.21:3002/updaterules/${selectedSport.toLowerCase()}`, {
      method: 'PUT', // Use PUT for updates
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rules: updatedSportRules, // Updated variable
      }),
    });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Success', 'Rules updated successfully');
      setSportRules(updatedSportRules); // Updated frontend state
      setLastUpdatedBy(data.updated.lastUpdatedBy); // Updated "last updated by"
      setUpdatedAt(new Date(data.updated.updatedAt).toLocaleString()); // Updated timestamp
      setIsUpdatingSportRules(false); // Exit update mode
    } else {
      Alert.alert('Error', data.error || 'Failed to update rules');
    }
  } catch (error) {
    console.error('Error updating rules:', error);
    Alert.alert('Error', 'An error occurred while updating the rules');
  }
};
  

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.1.21:3002/changepasswordcoach', {
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
      Alert.alert('Error', 'An error occurred while changing the password');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, {user?.username || 'Coach'}</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Change Password" onPress={() => setIsChangePasswordVisible(true)} />
      <Button title="Add Coordinator" onPress={() => setIsCoordinatorModalVisible(true)} />

      <Text style={styles.sectionTitle}>Sports Categories Rules</Text>
      {sportsCategories.map((sport) => (
        <Button key={sport} title={sport} onPress={() => fetchSportRules(sport)} />
      ))}

      {/* Add Coach Modal */}
      {/* Modal for adding Coordinator */}
      <Modal isVisible={isCoordinatorModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Coordinator</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={coordinatorUsername}
            onChangeText={setCoordinatorUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={coordinatorEmail}
            onChangeText={setCoordinatorEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={coordinatorPassword}
            secureTextEntry
            onChangeText={setCoordinatorPassword}
          />
          <Picker
            selectedValue={department}
            style={styles.picker}
            onValueChange={(itemValue) => setDepartment(itemValue)}
          >
            <Picker.Item label="Select Department" value="" />
            {departments.map((dept, index) => (
              <Picker.Item key={index} label={dept} value={dept} />
            ))}
          </Picker>
          <Button title="Submit" onPress={handleAddCoordinator} />
          <Button title="Cancel" onPress={() => setIsCoordinatorModalVisible(false)} />
        </View>
      </Modal>
      {/* Change Password Modal */}
      <Modal isVisible={isChangePasswordVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            value={currentPassword}
            secureTextEntry
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            secureTextEntry
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            secureTextEntry
            onChangeText={setConfirmNewPassword}
          />
          <Button title="Submit" onPress={handleChangePassword} />
          <Button title="Cancel" onPress={() => setIsChangePasswordVisible(false)} />
        </View>
      </Modal>

      {/* Sports Rules Modal */}
{/* Sports Rules Modal */}
<Modal isVisible={isSportsModalVisible}>
  <ScrollView style={styles.modalContent}>
    <Text style={styles.modalTitle}>{selectedSport} Rules</Text>
    <Text style={styles.rulesText}>{sportRules}</Text> {/* Renamed from 'rules' */}
    <Text style={styles.updatedByText}>
      Last updated by: {lastUpdatedBy} on {updatedAt}
    </Text>
    {isUpdatingSportRules ? ( // Renamed from 'isUpdatingRules'
      <>
        <TextInput
          style={styles.input}
          placeholder="Update Rules"
          value={updatedSportRules} // Renamed from 'newRules'
          onChangeText={setUpdatedSportRules} // Renamed from 'setNewRules'
        />
        <Button title="Submit" onPress={updateSportRules} /> {/* Renamed */}
      </>
    ) : (
      <Button title="Update Rules" onPress={() => setIsUpdatingSportRules(true)} />
    )}
    <Button title="Close" onPress={() => setIsSportsModalVisible(false)} />
  </ScrollView>
</Modal>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rulesText: {
    marginVertical: 10,
  },
  updatedByText: {
    fontSize: 14,
    color: 'gray',
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});
