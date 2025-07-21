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
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { useAuth } from '@/context/AuthContext';
import { restroomService } from '@/lib/restrooms';
import { MapPin, Clock, Info, Accessibility, Camera, Check, Plus, CircleAlert as AlertCircle, X } from 'lucide-react-native'BILITY_FEATURES = [
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

  const AccessibilityFeatureItem = ({ feature }: { feature: string }) => {
    const isSelected = formData.accessibility_features.includes(feature);
    
    return (
      <TouchableOpacity
        style={[styles.featureItem, isSelected && styles.featureItemSelected]}
        onPress={() => handleAccessibilityFeature(feature)}
      >
        <View style={[styles.featureCheckbox, isSelected && styles.featureCheckboxSelected]}>
          {isSelected && <Check size={16} color="#FFFFFF" />}
        </View>
        <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
          {feature}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Add Restroom</Text>
          <Text style={styles.subtitle}>Help others find clean, accessible restrooms</Text>
        </View>
        <View style={styles.headerIcon}>
          <Plus size={24} color="#2563EB" />
        </View>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=800' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Make a difference in your community</Text>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Basic Information</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Restroom Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Starbucks - Main Street, City Hall Restroom"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address *</Text>
            <View style={styles.inputWithButton}>
              <TextInput
                style={[styles.input, styles.inputFlexible]}
                placeholder="Street address or landmark"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                multiline
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                <MapPin size={20} color="#2563EB" />
              </TouchableOpacity>
            </View>
            {currentLocation && (
              <Text style={styles.locationStatus}>✓ Location captured</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Additional details about cleanliness, facilities, or special features..."
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Hours & Access */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Hours & Access</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Operating Hours</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 6:00 AM - 10:00 PM, 24 hours, Business hours"
              value={formData.operating_hours}
              onChangeText={(text) => setFormData(prev => ({ ...prev, operating_hours: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Access Requirements</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Purchase required, Ask for key, Customer only"
              value={formData.access_requirements}
              onChangeText={(text) => setFormData(prev => ({ ...prev, access_requirements: text }))}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Accessibility Features */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Accessibility size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Accessibility Features</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Select all accessibility features available at this restroom
          </Text>
          
          <View style={styles.featuresGrid}>
            {ACCESSIBILITY_FEATURES.map((feature) => (
              <AccessibilityFeatureItem key={feature} feature={feature} />
            ))}
          </View>
        </View>

        {/* Photo Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Camera size={20} color="#2563EB" />
            <Text style={styles.sectionTitle}>Photos (Optional)</Text>
          </View>
          <Text style={styles.sectionDescription}>
            Add photos to help others identify the restroom
          </Text>
          
          <TouchableOpacity style={styles.photoUpload}>
            <Camera size={32} color="#9CA3AF" />
            <Text style={styles.photoUploadText}>Tap to add photos</Text>
            <Text style={styles.photoUploadSubtext}>Coming soon</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding Restroom...' : 'Add Restroom'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.submitNote}>
            Your submission will be reviewed before appearing on the map
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
  },
  heroSection: {
    height: 160,
    position: 'relative',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374751',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  inputFlexible: {
    flex: 1,
  },
  locationButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
  },
  locationStatus: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontWeight: '500',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  featureItemSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  featureCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCheckboxSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#2563EB',
  },
  featureText: {
    fontSize: 16,
    color: '#374751',
    flex: 1,
  },
  featureTextSelected: {
    color: '#2563EB',
    fontWeight: '500',
  },
  photoUpload: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  photoUploadText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    fontWeight: '500',
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  submitContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitNote: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 16,
  },
  bottomPadding: {
    height: 100,
  },
});