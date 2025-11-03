import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/TextInput';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((state) => state.signIn);
  const error = useAuthStore((state) => state.error);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      Alert.alert('Sign In Failed', err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Mind Frame</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleSignIn}
            disabled={loading}
            size="large"
            style={styles.signInButton}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('SignUp')}
              variant="outline"
              size="small"
              disabled={loading}
            />
          </View>
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
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#5C4A3A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#C4A57B',
  },
  form: {
    gap: 16,
  },
  signInButton: {
    marginTop: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#5C4A3A',
  },
});
