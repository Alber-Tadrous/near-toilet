import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { 
  User, 
  MapPin, 
  Star, 
  Settings, 
  LogOut, 
  HelpCircle, 
  Shield, 
  Bell, 
  Heart,
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        }
      ]
    );
  };

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    dangerous = false,
    showArrow = true
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress: () => void;
    dangerous?: boolean;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuItemIcon, dangerous && styles.menuItemIconDangerous]}>
          {icon}
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, dangerous && styles.menuItemTitleDangerous]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Text style={styles.menuItemArrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    color 
  }: { 
    icon: React.ReactNode; 
    value: string; 
    label: string; 
    color: string; 
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" translucent />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <Award size={16} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.username || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Community Helper</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <StatCard
            icon={<MapPin size={20} color="#2563EB" />}
            value="12"
            label="Added"
            color="#2563EB"
          />
          <StatCard
            icon={<Star size={20} color="#F59E0B" />}
            value="28"
            label="Reviews"
            color="#F59E0B"
          />
          <StatCard
            icon={<Heart size={20} color="#EF4444" />}
            value="156"
            label="Helpful"
            color="#EF4444"
          />
        </View>

        {/* Achievement Section */}
        <View style={styles.achievementSection}>
          <Text style={styles.sectionTitle}>Recent Achievement</Text>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <TrendingUp size={24} color="#059669" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Rising Contributor</Text>
              <Text style={styles.achievementDescription}>
                You've helped 50+ people find restrooms this month!
              </Text>
            </View>
          </View>
        </View>

        {/* Activity Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Activity</Text>
          
          <MenuItem
            icon={<Calendar size={20} color="#6B7280" />}
            title="Recent Activity"
            subtitle="View your contributions and reviews"
            onPress={() => Alert.alert('Coming Soon', 'Activity history will be available soon')}
          />
          
          <MenuItem
            icon={<TrendingUp size={20} color="#6B7280" />}
            title="Impact Stats"
            subtitle="See how you've helped the community"
            onPress={() => Alert.alert('Coming Soon', 'Impact statistics will be available soon')}
          />
        </View>

        {/* Account Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <MenuItem
            icon={<Settings size={20} color="#6B7280" />}
            title="Settings"
            subtitle="Privacy, notifications, and preferences"
            onPress={() => Alert.alert('Coming Soon', 'Settings page will be available soon')}
          />
          
          <MenuItem
            icon={<Bell size={20} color="#6B7280" />}
            title="Notifications"
            subtitle="Manage your notification preferences"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          />
          
          <MenuItem
            icon={<Shield size={20} color="#6B7280" />}
            title="Privacy & Safety"
            subtitle="Control your privacy settings"
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}
          />
        </View>

        {/* Support Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <MenuItem
            icon={<HelpCircle size={20} color="#6B7280" />}
            title="Help & Support"
            subtitle="Get help or contact us"
            onPress={() => Alert.alert('Help', 'For support, please email: support@restroomfinder.com')}
          />
        </View>

        {/* Sign Out */}
        <View style={styles.menuSection}>
          <MenuItem
            icon={<LogOut size={20} color="#EF4444" />}
            title="Sign Out"
            onPress={handleSignOut}
            dangerous
            showArrow={false}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Restroom Finder v1.0.0</Text>
          <Text style={styles.footerText}>Making public restrooms accessible to everyone</Text>
        </View>
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
    backgroundColor: '#2563EB',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 2,
  },
  achievementSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  achievementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 20,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 24,
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemIconDangerous: {
    backgroundColor: '#FEE2E2',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuItemTitleDangerous: {
    color: '#EF4444',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 18,
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#D1D5DB',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});