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
import { supabase } from '../services/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { format } from 'date-fns';

export default function CompassScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const [latestDaily, setLatestDaily] = useState<any>(null);
  const [latestWeekly, setLatestWeekly] = useState<any>(null);
  const [latestMorning, setLatestMorning] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
      loadReflections();
    }
  }, [user]);

  const loadReflections = async () => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');

    const { data: daily } = await supabase
      .from('daily_reflection')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: weekly } = await supabase
      .from('weekly_reflection')
      .select('*')
      .eq('user_id', user.id)
      .order('week_start_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: morning } = await supabase
      .from('morning_reflection')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    setLatestDaily(daily);
    setLatestWeekly(weekly);
    setLatestMorning(morning);
  };

  const rituals = [
    {
      title: 'Morning Embodiment',
      subtitle: 'Set your frequency',
      icon: 'sun-clock',
      color: '#F59E0B',
    },
    {
      title: 'Evening Alignment',
      subtitle: 'Reflect your day',
      icon: 'moon',
      color: '#8B5CF6',
    },
    {
      title: 'Daily Journal',
      subtitle: 'Process your thoughts',
      icon: 'notebook',
      color: '#06B6D4',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome</Text>
            <Text style={styles.name}>
              {profile?.preferred_name || user?.email?.split('@')[0] || 'Friend'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.settingsButton}
          >
            <Icon name="cog" size={24} color="#5C4A3A" />
          </TouchableOpacity>
        </View>

        {profile?.identity_summary && (
          <Card>
            <Text style={styles.sectionTitle}>Your Identity</Text>
            <Text style={styles.sectionContent}>{profile.identity_summary}</Text>
          </Card>
        )}

        <View>
          <Text style={styles.sectionTitle}>Today's Rituals</Text>
          {rituals.map((ritual, index) => (
            <TouchableOpacity key={index} onPress={() => {
              if (index === 0) navigation.navigate('Main', { screen: 'Frequencies' });
              if (index === 2) navigation.navigate('DailyJournal');
            }}>
              <Card style={styles.ritualCard}>
                <View style={styles.ritualContent}>
                  <View
                    style={[
                      styles.ritualIcon,
                      { backgroundColor: ritual.color },
                    ]}
                  >
                    <Icon name={ritual.icon} size={24} color="#FFF" />
                  </View>
                  <View style={styles.ritualText}>
                    <Text style={styles.ritualTitle}>{ritual.title}</Text>
                    <Text style={styles.ritualSubtitle}>{ritual.subtitle}</Text>
                  </View>
                  <Icon name="chevron-right" size={24} color="#C4A57B" />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Card>
            <Text style={styles.sectionTitle}>Progress</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {latestDaily ? '✓' : '○'}
                </Text>
                <Text style={styles.statLabel}>Daily</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {latestWeekly ? '✓' : '○'}
                </Text>
                <Text style={styles.statLabel}>Weekly</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {latestMorning ? '✓' : '○'}
                </Text>
                <Text style={styles.statLabel}>Morning</Text>
              </View>
            </View>
          </Card>
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
    marginBottom: 32,
  },
  greeting: {
    fontSize: 14,
    color: '#C4A57B',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  settingsButton: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: '#5C4A3A',
    lineHeight: 20,
  },
  ritualCard: {
    marginBottom: 12,
  },
  ritualContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ritualIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ritualText: {
    flex: 1,
  },
  ritualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 2,
  },
  ritualSubtitle: {
    fontSize: 12,
    color: '#C4A57B',
  },
  statsContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D4AF77',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5C4A3A',
  },
});
