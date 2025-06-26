import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { restroomService } from '@/lib/restrooms';
import { MapPin, Clock, Info, Accessibility, Camera } from 'lucide-react-native';

const ACCESSIBILITY_FEATURES = [
  'Wheelchair Accessible',
  'Baby Changing Station',
  'Grab Bars',
  'Wide Doorway',
  'Lowered Sink',
  'Braille Signage',
];

export default function AddRestroomScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    operating_hours: '',
    access_requirements: '',
    accessibility_features: [] as string[],
  });
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      
      // Reverse geocode to get address
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      if (geocode.length > 0) {
        const address = `${geocode[0].street || ''} ${geocode[0].city || ''} ${geocode[0].region || ''}`.trim();
        setFormData(prev => ({ ...prev, address }));
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location');
    }
  };

  const handleAccessibilityFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      accessibility_features: prev.accessibility_features.includes(feature)
        ? prev.accessibility_features.filter(f => f !== feature)
        : [...prev.accessibility_features, feature]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a name for the restroom');
      return;
    }

    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter an address');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Error', 'Please get your current location first');
      return;
    }

    setLoading(true);
    try {
      await restroomService.createRestroom({
        name: formData.name,
        address: formData.address,
        description: formData.description || null,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        operating_hours: formData.operating_hours || null,
        access_requirements: formData.access_requirements || null,
        accessibility_features: formData.accessibility_features,
        created_by: user!.id,
        status: 'pending_review',
      });

      Alert.alert('Success', 'Restroom added successfully! It will be reviewed before appearing on the map.', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              name: '',
              address: '',
              description: '',
              operating_hours: '',
              access_requirements: '',
              accessibility_features: [],
            });
            setCurrentLocation(null);
          }
        }
      ]);
    } catch (error) {
      console.error('Error adding restroom:', error);
      Alert.alert('Error', 'Failed to add restroom');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Restroom</Text>
        <Text style={styles.subtitle}>Help others find clean, accessible restrooms</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Starbucks - Main St"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, styles.inputFlexible]}
                placeholder="Street address"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                multiline
              />
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <MapPin size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional details about the restroom..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hours & Access</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Operating Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 6:00 AM - 10:00 PM"
              value={formData.operating_hours}
              onChangeText={(text) => setFormData(prev => ({ ...prev, operating_hours: text }))}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Access Requirements</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Purchase required, Key from staff"
              value={formData.access_requirements}
              onChangeText={(text) => setFormData(prev => ({ ...prev, access_requirements: text }))}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility Features</Text>
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <TouchableOpacity
              key={feature}
              style={styles.checkboxRow}
              onPress={() => handleAccessibilityFeature(feature)}
            >
              <View style={[
                styles.checkbox,
                formData.accessibility_features.includes(feature) && styles.checkboxChecked
              ]}>
                {formData.accessibility_features.includes(feature) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>{feature}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Adding Restroom...' : 'Add Restroom'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374751',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  inputFlexible: {
    flex: 1,
  },
  locationButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374751',
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginTop: 24,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});