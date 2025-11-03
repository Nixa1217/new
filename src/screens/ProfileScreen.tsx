import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { Card } from '../components/Card';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';

export default function ProfileScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [preferredName, setPreferredName] = useState('');
  const [identitySummary, setIdentitySummary] = useState('');
  const [lifePurpose, setLifePurpose] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setPreferredName(profile.preferred_name || '');
      setIdentitySummary(profile.identity_summary || '');
      setLifePurpose(profile.life_purpose_summary || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      await updateProfile({
        id: profile.id,
        user_id: profile.user_id,
        preferred_name: preferredName,
        identity_summary: identitySummary,
        life_purpose_summary: lifePurpose,
      });
      Alert.alert('Success', 'Profile updated!');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={28} color="#5C4A3A" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 28 }} />
        </View>

        <Card>
          <View style={styles.userInfo}>
            <Icon name="account-circle" size={48} color="#D4AF77" />
            <View style={styles.userDetails}>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.subscriptionTier}>
                {profile?.subscription_tier || 'Free'} Plan
              </Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TextInput
            label="Preferred Name"
            placeholder="How would you like to be called?"
            value={preferredName}
            onChangeText={setPreferredName}
          />

          <TextInput
            label="Core Identity Summary"
            placeholder="Describe your core identity"
            value={identitySummary}
            onChangeText={setIdentitySummary}
            multiline
            numberOfLines={4}
          />

          <TextInput
            label="Life Purpose"
            placeholder="What is your life purpose?"
            value={lifePurpose}
            onChangeText={setLifePurpose}
            multiline
            numberOfLines={4}
          />

          <Button
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving}
            size="large"
            style={styles.saveButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card>
            <Text style={styles.preferenceLabel}>Theme</Text>
            <Text style={styles.preferenceValue}>Light (Default)</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="large"
            style={styles.signOutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5EFE7',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: 14,
    color: '#5C4A3A',
    marginBottom: 4,
  },
  subscriptionTier: {
    fontSize: 12,
    color: '#C4A57B',
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 20,
  },
  preferenceLabel: {
    fontSize: 12,
    color: '#C4A57B',
    marginBottom: 8,
  },
  preferenceValue: {
    fontSize: 14,
    color: '#5C4A3A',
  },
  signOutButton: {
    borderColor: '#DC2626',
  },
});
