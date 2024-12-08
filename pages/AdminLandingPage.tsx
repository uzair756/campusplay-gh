import React, { useEffect, useState } from 'react';
import {View,Text,Button,TextInput,StyleSheet,Alert,Image,FlatList,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';

export const AdminLandingPage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // For storing user posts
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postVisible, setPostVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  // For sports coach modal
  const [coachUsername, setCoachUsername] = useState('');
  const [coachEmail, setCoachEmail] = useState('');
  const [coachPassword, setCoachPassword] = useState('');

  // For announcement post modal
  const [postDescription, setPostDescription] = useState('');
  const [postImage, setPostImage] = useState(null); // Store selected image

  // For update modal
  const [selectedPost, setSelectedPost] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null);




  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.1.21:3002/dsalandingpage', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
          setPosts(data.posts || []); // Set posts for the logged-in user
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

  const handleAddCoach = async () => {
    try {
      const response = await fetch('http://192.168.1.21:3002/dsasportscoachuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: coachUsername,
          email: coachEmail,
          password: coachPassword,
        }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'New sports coach account created successfully');
        setIsModalVisible(false);
        setCoachUsername('');
        setCoachEmail('');
        setCoachPassword('');
      } else {
        Alert.alert('Error', data.error || 'Failed to create sports coach account');
      }
    } catch (error) {
      console.error('Error adding coach:', error);
      Alert.alert('Error', 'An error occurred while adding the coach');
    }
  };

  const handleAddAnnouncement = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch('http://192.168.1.21:3002/adminpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminpostdescription: postDescription,
          adminimagepost: postImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Announcement posted successfully');
        setPostVisible(false);
        setPostDescription('');
        setPostImage(null);
        setPosts((prevPosts) => [...prevPosts, data.post]); // Add the new post to the list
      } else {
        Alert.alert('Error', data.error || 'Failed to post the announcement');
      }
    } catch (error) {
      console.error('Error posting announcement:', error);
      Alert.alert('Error', 'An error occurred while posting the announcement');
    }
  };

  const handleImageSelection = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    const result = await launchImageLibrary(options);
    if (result.assets && result.assets.length > 0) {
      setPostImage(result.assets[0].uri); // Set the image URI
    }
  };

  const handleUpdatePost = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found');
        return;
      }

      const response = await fetch(`http://192.168.1.21:3002/adminpost/${selectedPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          adminpostdescription: updatedDescription,
          adminimagepost: updatedImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Post updated successfully');
        setUpdateModalVisible(false);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? { ...post, ...data.updatedPost } : post
          )
        ); // Update the post list
      } else {
        Alert.alert('Error', data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'An error occurred while updating the post');
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

      const response = await fetch('http://192.168.1.21:3002/changepasswordadmin', {
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
        </View>
      ) : (
        <Text>Loading...</Text>
      )}

      <Button title="Add New Sports Coach Account" onPress={() => setIsModalVisible(true)} />
      <Button title="Add Announcement Post" onPress={() => setPostVisible(true)} />
      <Button title="Change Password" onPress={() => setIsChangePasswordVisible(true)}/>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Coach</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={coachUsername}
            onChangeText={setCoachUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={coachEmail}
            onChangeText={setCoachEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={coachPassword}
            onChangeText={setCoachPassword}
          />
          <Button title="Submit" onPress={handleAddCoach} />
          <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>

      <Modal isVisible={postVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Announcement Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={postDescription}
            onChangeText={setPostDescription}
          />
          {postImage && (
            <Image source={{ uri: postImage }} style={styles.imagePreview} />
          )}
          <Button title="Select Image" onPress={handleImageSelection} />
          <Button title="Post" onPress={handleAddAnnouncement} />
          <Button title="Cancel" onPress={() => setPostVisible(false)} />
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

      <Modal isVisible={updateModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Update Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Update Description"
            value={updatedDescription}
            onChangeText={setUpdatedDescription}
          />
          {updatedImage && <Image source={{ uri: updatedImage }} style={styles.imagePreview} />}
          <Button title="Select New Image" onPress={handleImageSelection} />
          <Button title="Update" onPress={handleUpdatePost} />
          <Button title="Cancel" onPress={() => setUpdateModalVisible(false)} />
        </View>
      </Modal>

      <Text style={styles.subTitle}>Existing Posts</Text>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Text>{item.adminpostdescription}</Text>
              {item.adminimagepost && <Image source={{ uri: item.adminimagepost }} style={styles.imagePreview} />}
              <Button
                title="Update"
                onPress={() => {
                  setSelectedPost(item);
                  setUpdatedDescription(item.adminpostdescription);
                  setUpdatedImage(item.adminimagepost);
                  setUpdateModalVisible(true);
                }}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>No posts available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
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
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  post: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default AdminLandingPage;
