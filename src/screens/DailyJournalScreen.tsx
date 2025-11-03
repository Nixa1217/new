import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase';
import { Card } from '../components/Card';
import { TextInput } from '../components/TextInput';
import { Button } from '../components/Button';
import { format } from 'date-fns';

const WRITING_PROMPTS = [
  'What\'s one thing that went right today?',
  'Who made your life easier today?',
  'What pattern showed up again?',
  'When did you feel most like your future self?',
  'What would your highest self do differently?',
];

export default function DailyJournalScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const [entries, setEntries] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(WRITING_PROMPTS[0]);
  const [isWriting, setIsWriting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('journal_entry')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (!error) {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please write something');
      return;
    }

    const { error } = await supabase.from('journal_entry').insert({
      user_id: user!.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      title: title || 'Untitled',
      content,
      prompt: currentPrompt,
    });

    if (error) {
      Alert.alert('Error', 'Failed to save entry');
    } else {
      setTitle('');
      setContent('');
      setIsWriting(false);
      loadEntries();
      Alert.alert('Success', 'Entry saved!');
    }
  };

  if (isWriting) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsWriting(false)}>
              <Icon name="chevron-left" size={28} color="#5C4A3A" />
            </TouchableOpacity>
            <Text style={styles.title}>New Entry</Text>
            <View style={{ width: 28 }} />
          </View>

          <Card>
            <Text style={styles.promptLabel}>Today's Prompt</Text>
            <Text style={styles.promptText}>{currentPrompt}</Text>
          </Card>

          <TextInput
            label="Title (optional)"
            placeholder="Give your entry a title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            label="Your Reflection"
            placeholder="Write your thoughts here..."
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={8}
          />

          <Button
            title="Save Entry"
            onPress={handleSave}
            size="large"
            style={styles.saveButton}
          />

          <TouchableOpacity
            onPress={() => {
              const nextIndex =
                (WRITING_PROMPTS.indexOf(currentPrompt) + 1) %
                WRITING_PROMPTS.length;
              setCurrentPrompt(WRITING_PROMPTS[nextIndex]);
            }}
            style={styles.nextPromptButton}
          >
            <Text style={styles.nextPromptText}>Next Prompt</Text>
            <Icon name="chevron-right" size={20} color="#D4AF77" />
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={28} color="#5C4A3A" />
          </TouchableOpacity>
          <Text style={styles.title}>Daily Journal</Text>
          <Button
            title="New"
            onPress={() => setIsWriting(true)}
            size="small"
          />
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : entries.length === 0 ? (
          <Card>
            <View style={styles.emptyState}>
              <Icon name="notebook" size={48} color="#C4A57B" />
              <Text style={styles.emptyText}>No entries yet. Start writing!</Text>
            </View>
          </Card>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card>
                <Text style={styles.entryDate}>{item.date}</Text>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text
                  style={styles.entryContent}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.content}
                </Text>
                {item.prompt && (
                  <Text style={styles.entryPrompt}>Prompt: {item.prompt}</Text>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5C4A3A',
  },
  promptLabel: {
    fontSize: 12,
    color: '#C4A57B',
    marginBottom: 8,
  },
  promptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    lineHeight: 24,
  },
  saveButton: {
    marginTop: 20,
  },
  nextPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
  },
  nextPromptText: {
    fontSize: 14,
    color: '#D4AF77',
    fontWeight: '600',
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
    marginTop: 12,
  },
  entryDate: {
    fontSize: 12,
    color: '#C4A57B',
    marginBottom: 4,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  entryContent: {
    fontSize: 14,
    color: '#5C4A3A',
    lineHeight: 20,
    marginBottom: 8,
  },
  entryPrompt: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#C4A57B',
  },
});
