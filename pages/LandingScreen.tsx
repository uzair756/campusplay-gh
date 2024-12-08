import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
const CP = require('../assets/iconcp.png');
const UserIcon = require('../assets/user.png');

export const LandingScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image source={CP} style={styles.icon} />
            <View style={styles.iconsRow}>
                <TouchableOpacity>
                  <Image style={[styles.homeicon, styles.leftIcon]} source={UserIcon} />
                  </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Image style={[styles.homeicon, styles.centerIcon]} source={UserIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image style={[styles.homeicon, styles.rightIcon]} source={UserIcon} />
                  </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    icon: {
        width: 210,  // Set width of the icon
        height: 50, // Set height of the icon
        marginTop: 10, // Add space between text and icon
    },
    iconsRow: {
        width: '100%', // Make the row span the full width
        height: 50,
        position: 'relative', // Enable absolute positioning for icons
        marginTop: 20,
    },
    homeicon: {
        width: 30,
        height: 30,
    },
    leftIcon: {
        position: 'absolute',
        left: 40, // Distance from the left edge
        top: 10, // Center vertically within the row
    },
    centerIcon: {
        position: 'absolute',
        alignSelf: 'center', // Center horizontally
        top: 10,
    },
    rightIcon: {
        position: 'absolute',
        right: 40, // Distance from the right edge
        top: 10,
    },
});
