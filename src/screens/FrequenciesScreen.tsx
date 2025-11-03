import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Card } from '../components/Card';

export default function FrequenciesScreen() {
  const frequencies = [
    { title: 'Gratitude', description: 'Feel abundance and appreciation' },
    { title: 'Abundance', description: 'Attract prosperity and opportunities' },
    { title: 'Love', description: 'Open your heart to connection' },
    { title: 'Confidence', description: 'Step into your power' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Frequencies</Text>
          <Text style={styles.subtitle}>Tune into your energy</Text>
        </View>

        {frequencies.map((freq, index) => (
          <Card key={index}>
            <Text style={styles.frequencyTitle}>{freq.title}</Text>
            <Text style={styles.frequencyDescription}>{freq.description}</Text>
          </Card>
        ))}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#C4A57B',
  },
  frequencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF77',
    marginBottom: 8,
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#5C4A3A',
  },
});
