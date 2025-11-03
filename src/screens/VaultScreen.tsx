import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '../components/Card';

export default function VaultScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const vaultTools = [
    {
      id: 'goal-action',
      title: 'Goal Action Generator',
      description: 'Transform goals into actionable steps',
      icon: 'target',
    },
    {
      id: 'seven-layers',
      title: 'Seven Layers Deep',
      description: 'Explore topics from multiple angles',
      icon: 'layers',
    },
    {
      id: 'alchemist-forge',
      title: 'Alchemist Forge',
      description: 'Transmute challenges into wisdom',
      icon: 'flash',
    },
    {
      id: 'flow-command',
      title: 'Flow Command',
      description: 'Execute commands for flow state',
      icon: 'lightning-bolt',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="treasure-chest" size={32} color="#D4AF77" />
          <Text style={styles.title}>The Vault</Text>
          <Text style={styles.subtitle}>Powerful tools for transformation</Text>
        </View>

        {vaultTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            onPress={() =>
              setExpanded(expanded === tool.id ? null : tool.id)
            }
          >
            <Card>
              <View style={styles.toolHeader}>
                <View style={styles.toolIcon}>
                  <Icon name={tool.icon} size={24} color="#D4AF77" />
                </View>
                <View style={styles.toolContent}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </View>
                <Icon
                  name={
                    expanded === tool.id ? 'chevron-up' : 'chevron-down'
                  }
                  size={24}
                  color="#C4A57B"
                />
              </View>
              {expanded === tool.id && (
                <Text style={styles.expandedContent}>
                  This tool helps you unlock deeper insights and transformation.
                </Text>
              )}
            </Card>
          </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 32,
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
  toolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0EEE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolContent: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C4A3A',
    marginBottom: 2,
  },
  toolDescription: {
    fontSize: 12,
    color: '#C4A57B',
  },
  expandedContent: {
    fontSize: 14,
    color: '#5C4A3A',
    marginTop: 12,
    lineHeight: 20,
  },
});
