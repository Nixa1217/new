import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './store/authStore';
import { authService } from './services/auth';

export default function App() {
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((event, session) => {
      if (session?.user) {
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: session.user.user_metadata,
          },
        });
      } else {
        useAuthStore.setState({ user: null });
      }
    });

    return () => {
      unsubscribe?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
