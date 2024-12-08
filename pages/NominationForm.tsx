import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NominationForm = ({ route }) => {
  const { sport, repId, repName, repEmail, repDepartment } = route.params;
  const [nominations, setNominations] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nominationData, setNominationData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const playerLimit = sport === 'Football' ? 15 : sport === 'Futsal' ? 10 : sport === 'Basketball' ? 10 : sport === 'Volleyball' ? 12 : 0;

  useEffect(() => {
    const fetchNominationData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await fetch(`http://192.168.1.21:3002/getNominationForm/${sport}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.data) {
          setNominationData(data.data);
          const nominations = data.data.nominations || new Array(playerLimit).fill({ name: '', cnic: '', section: '' });
          setNominations(nominations);
          setIsSubmitted(true);
          setLastUpdated(`Last updated by ${data.data.lastUpdatedBy} at ${data.data.lastUpdatedAt}`);
        } else {
          setNominations(new Array(playerLimit).fill({ name: '', cnic: '', section: '' }));
        }
      } catch (error) {
        console.error('Error fetching nomination data:', error);
      }
    };

    fetchNominationData();
  }, [sport]);

  const handleSubmit = async () => {
    if (!isFormComplete()) {
      Alert.alert('Error', 'Please fill all the entries');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const currentDateTime = new Date().toLocaleString();

    const dataToSubmit = {
      nominations,
      repId,
      repName,
      repEmail,
      repDepartment,
      lastUpdatedBy: repName,
      lastUpdatedAt: currentDateTime,
    };

    try {
      let response;
      if (nominationData && nominationData._id) {
        // If nomination form already exists, update it
        response = await fetch(`http://192.168.1.21:3002/updateNominationForm/${sport}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...dataToSubmit, id: nominationData._id }),
        });
      } else {
        // If nomination form does not exist, submit it
        response = await fetch(`http://192.168.1.21:3002/submitNominationForm/${sport}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        });
      }

      const data = await response.json();
      if (data.success) {
        if (nominationData && nominationData._id) {
          Alert.alert('Success', 'Nomination updated successfully');
        } else {
          Alert.alert('Success', 'Nomination submitted successfully');
        }
        setIsSubmitted(true);
        setLastUpdated(`Last updated by ${repName} at ${currentDateTime}`);
      } else {
        Alert.alert('Error', data.error || 'Failed to submit nominations');
      }
    } catch (error) {
      console.error('Error submitting nominations:', error);
      Alert.alert('Error', 'An error occurred while submitting nominations');
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedNominations = [...nominations];
    updatedNominations[index] = {
      ...updatedNominations[index],
      [field]: value,
    };
    setNominations(updatedNominations);
  };

  const isFormComplete = () => {
    const isFilled = nominations.some(player => player.name && player.cnic && player.section);
    return isFilled;
  };

  const renderPlayerFields = () => {
    const fields = [];
    for (let i = 0; i < playerLimit; i++) {
      const playerLabel = i === 0 ? "Captain" : `Player ${i + 1}`;
      const isRowFilled = nominations[i]?.name && nominations[i]?.cnic && nominations[i]?.section;

      fields.push(
        <View key={i} style={styles.row}>
          <Text style={styles.playerLabel}>{playerLabel}</Text>
          <TextInput
            style={styles.input}
            placeholder={`${playerLabel} Name`}
            placeholderTextColor={'black'}
            value={nominations[i]?.name || ''}
            onChangeText={(text) => handleInputChange(i, 'name', text)}
            editable={i === 0 || Boolean(nominations[i-1]?.name)}
          />
          <TextInput
            style={styles.input}
            placeholder="CNIC"
            placeholderTextColor={'black'}
            value={nominations[i]?.cnic || ''}
            onChangeText={(text) => handleInputChange(i, 'cnic', text)}
            editable={i === 0 || Boolean(nominations[i-1]?.name)}
          />
          <TextInput
            style={styles.input}
            placeholder="Section"
            placeholderTextColor={'black'}
            value={nominations[i]?.section || ''}
            onChangeText={(text) => handleInputChange(i, 'section', text)}
            editable={i === 0 || Boolean(nominations[i-1]?.name)}
          />
        </View>
      );
    }
    return fields;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{sport} Nomination Form</Text>


      {renderPlayerFields()}

      
      {lastUpdated && (
        <Text style={styles.lastUpdated}>{lastUpdated}</Text>
      )}

      <Button
        title={isSubmitted ? 'Update' : 'Submit'}
        onPress={handleSubmit}
        disabled={!isFormComplete()}
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  playerLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 5,
    paddingLeft: 8,
  },
  userInfo: {
    marginBottom: 20,
  },
  userDetail: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  lastUpdated: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

