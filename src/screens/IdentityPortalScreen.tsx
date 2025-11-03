import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export default function IdentityPortalScreen() {
  const user = useAuthStore((state) => state.user);
  const [identities, setIdentities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadIdentities();
    }
  }, [user]);

  const loadIdentities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('identity_rep')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setIdentities(data || []);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="eye" size={32} color="#D4AF77" />
          <Text style={styles.title}>Identity Portal</Text>
          <Text style={styles.subtitle}>Explore your authentic self</Text>
        </View>

        <Button
          title="+ Add Identity"
          onPress={() => {}}
          size="large"
          style={styles.addButton}
        />

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : identities.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Start exploring your core identities
              </Text>
            </View>
          </Card>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={identities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card>
                <Text style={styles.identityTitle}>{item.title}</Text>
                {item.description && (
                  <Text style={styles.identityDescription}>
                    {item.description}
                  </Text>
                )}
                {item.identity_level && (
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{item.identity_level}</Text>
                  </View>
                )}
              </Card>
            )}
          />
        )}
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
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#C4A57B',
    marginTop: 4,
  },
  addButton: {
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#C4A57B',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#5C4A3A',
    textAlign: 'center',
  },
  identityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  identityDescription: {
    fontSize: 14,
    color: '#5C4A3A',
    lineHeight: 20,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#F0EEE6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    color: '#D4AF77',
    fontWeight: '600',
  },
});
