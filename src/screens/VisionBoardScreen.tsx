import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export default function VisionBoardScreen() {
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadVisionBoard();
    }
  }, [user]);

  const loadVisionBoard = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('vision_board')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error) {
      setItems(data || []);
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from('vision_board').delete().eq('id', id);
    loadVisionBoard();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Vision Board</Text>
          <Button
            title="Add Item"
            onPress={() => {}}
            size="small"
            variant="primary"
          />
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : items.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="image-multiple" size={48} color="#C4A57B" />
              <Text style={styles.emptyText}>
                No vision items yet. Add one to get started!
              </Text>
            </View>
          </Card>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => deleteItem(item.id)}>
                    <Icon name="delete" size={20} color="#DC2626" />
                  </TouchableOpacity>
                </View>
                {item.description && (
                  <Text style={styles.itemDescription}>{item.description}</Text>
                )}
                {item.category && (
                  <Text style={styles.itemCategory}>{item.category}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  loadingText: {
    textAlign: 'center',
    color: '#C4A57B',
    fontSize: 16,
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#5C4A3A',
    marginTop: 12,
    textAlign: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    color: '#5C4A3A',
    marginBottom: 8,
  },
  itemCategory: {
    fontSize: 12,
    color: '#C4A57B',
    fontStyle: 'italic',
  },
});
