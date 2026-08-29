import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Les notifications s'affichent même quand l'appli est au premier plan.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let dejaPrepare = false;

export async function preparerNotifications() {
  if (dejaPrepare) return;
  dejaPrepare = true;

  if (Platform.OS === 'android') {
    // Une notification envoyée sans délai utilise le canal "default" :
    // on lui met une importance haute pour qu'elle s'affiche en bandeau.
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Commandes',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') await Notifications.requestPermissionsAsync();
}

// Notification locale immédiate : c'est ce qui fonctionne dans Expo Go.
// Les notifications à distance (appli fermée) demanderont un build dédié.
export async function prevenir(titre, corps) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;
  await Notifications.scheduleNotificationAsync({
    content: { title: titre, body: corps, sound: true },
    trigger: null,
  });
}
