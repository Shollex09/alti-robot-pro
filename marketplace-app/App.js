import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { CommandesProvider } from './lib/CommandesContext';
import { COULEURS } from './lib/constants';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import RootNavigator from './navigation/RootNavigator';

function Racine() {
  const { session, profile, loading, rechargerProfil } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COULEURS.vert} />
      </View>
    );
  }

  // Trois états : pas connecté → profil incomplet (pas de position) → l'appli complète.
  if (!session) return <AuthScreen />;
  if (!profile || profile.latitude == null) {
    return <ProfileScreen session={session} profile={profile} onSaved={rechargerProfil} />;
  }
  return <RootNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CommandesProvider>
          <View style={styles.container}>
            <Racine />
            <StatusBar style="auto" />
          </View>
        </CommandesProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COULEURS.fond },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
