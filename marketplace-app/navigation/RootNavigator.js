import { Text } from 'react-native';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../lib/AuthContext';
import { useCommandes } from '../lib/CommandesContext';
import { useMessages } from '../lib/MessagesContext';
import { COULEURS } from '../lib/constants';

import ProductsListScreen from '../screens/buyer/ProductsListScreen';
import ProductDetailScreen from '../screens/buyer/ProductDetailScreen';
import SellerProfileScreen from '../screens/buyer/SellerProfileScreen';
import MyOrdersScreen from '../screens/buyer/MyOrdersScreen';
import FavorisScreen from '../screens/buyer/FavorisScreen';
import MyProductsScreen from '../screens/seller/MyProductsScreen';
import ProductFormScreen from '../screens/seller/ProductFormScreen';
import StockScreen from '../screens/seller/StockScreen';
import SalesScreen from '../screens/seller/SalesScreen';
import ClientsScreen from '../screens/seller/ClientsScreen';
import DashboardScreen from '../screens/seller/DashboardScreen';
import CoutsScreen from '../screens/seller/CoutsScreen';
import ConsommationScreen from '../screens/seller/ConsommationScreen';
import InvestissementsScreen from '../screens/seller/InvestissementsScreen';
import PlusScreen from '../screens/seller/PlusScreen';
import SettingsScreen from '../screens/SettingsScreen';
import MonProfilScreen from '../screens/MonProfilScreen';
import ConversationsScreen from '../screens/messages/ConversationsScreen';
import ConversationScreen from '../screens/messages/ConversationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const VendeurTab = createBottomTabNavigator();

function icone(emoji) {
  return ({ color }) => <Text style={{ fontSize: 20, color }}>{emoji}</Text>;
}

function DecouvrirStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductsList" component={ProductsListScreen} options={{ title: 'Autour de moi' }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Le produit' }} />
      <Stack.Screen name="SellerProfile" component={SellerProfileScreen} options={{ title: 'Le producteur' }} />
    </Stack.Navigator>
  );
}

function MesProduitsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProductsList" component={MyProductsScreen} options={{ title: 'Mes annonces' }} />
      <Stack.Screen name="ProductForm" component={ProductFormScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Conversations"
        component={ConversationsScreen}
        options={{ title: 'Messages' }}
      />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}

function ProfilStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MonProfil" component={MonProfilScreen} options={{ title: 'Mon profil' }} />
      <Stack.Screen
        name="ReglagesProfil"
        component={SettingsScreen}
        options={{ title: 'Modifier mon profil' }}
      />
    </Stack.Navigator>
  );
}

// Gestion : ce qui ne tient pas dans la barre d'onglets du vendeur.
function GestionStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlusMenu" component={PlusScreen} options={{ title: 'Gestion' }} />
      <Stack.Screen name="Clients" component={ClientsScreen} options={{ title: 'Mes clients' }} />
      <Stack.Screen name="Couts" component={CoutsScreen} options={{ title: 'Coûts' }} />
      <Stack.Screen
        name="Consommation"
        component={ConsommationScreen}
        options={{ title: 'Consommation personnelle' }}
      />
      <Stack.Screen
        name="Investissements"
        component={InvestissementsScreen}
        options={{ title: 'Investissements' }}
      />
    </Stack.Navigator>
  );
}

function EspaceVendeur() {
  const { enAttente } = useCommandes();
  return (
    <VendeurTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COULEURS.vert,
        tabBarInactiveTintColor: COULEURS.texteDoux,
        headerShown: false,
      }}
    >
      <VendeurTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Bilan', headerShown: true, tabBarIcon: icone('📊') }}
      />
      <VendeurTab.Screen
        name="MyProducts"
        component={MesProduitsStack}
        options={{ title: 'Annonces', tabBarIcon: icone('🏷️') }}
      />
      <VendeurTab.Screen
        name="Stock"
        component={StockScreen}
        options={{ title: 'Stock', headerShown: true, tabBarIcon: icone('📦') }}
      />
      <VendeurTab.Screen
        name="Sales"
        component={SalesScreen}
        options={{
          title: 'Ventes',
          headerShown: true,
          tabBarIcon: icone('💶'),
          tabBarBadge: enAttente > 0 ? enAttente : undefined,
        }}
      />
      <VendeurTab.Screen
        name="Gestion"
        component={GestionStack}
        options={{ title: 'Gestion', tabBarIcon: icone('⋯') }}
      />
    </VendeurTab.Navigator>
  );
}

export default function RootNavigator() {
  const { estVendeur } = useAuth();
  const { enAttente, misesAJourAchats, marquerAchatsVus } = useCommandes();
  const { nonLus } = useMessages();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COULEURS.vert,
          tabBarInactiveTintColor: COULEURS.texteDoux,
        }}
      >
        <Tab.Screen
          name="Découvrir"
          component={DecouvrirStack}
          options={{ headerShown: false, tabBarIcon: icone('🌱') }}
        />
        <Tab.Screen
          name="Achats"
          component={MyOrdersScreen}
          options={{
            title: 'Mes achats',
            tabBarIcon: icone('🧺'),
            tabBarBadge: misesAJourAchats > 0 ? misesAJourAchats : undefined,
          }}
          listeners={{ tabPress: marquerAchatsVus }}
        />
        <Tab.Screen
          name="Favoris"
          component={FavorisScreen}
          options={{ title: 'Favoris', tabBarIcon: icone('★') }}
        />
        <Tab.Screen
          name="Messages"
          component={MessagesStack}
          options={({ route }) => ({
            headerShown: false,
            tabBarIcon: icone('💬'),
            tabBarBadge: nonLus > 0 ? nonLus : undefined,
            // Dans un fil de discussion, la barre d'onglets laisse la place
            // au clavier et à la barre de saisie.
            tabBarStyle:
              getFocusedRouteNameFromRoute(route) === 'Conversation'
                ? { display: 'none' }
                : undefined,
          })}
        />
        {estVendeur && (
          <Tab.Screen
            name="Vendre"
            component={EspaceVendeur}
            options={{
              headerShown: false,
              tabBarIcon: icone('🌾'),
              tabBarBadge: enAttente > 0 ? enAttente : undefined,
            }}
          />
        )}
        <Tab.Screen
          name="Profil"
          component={ProfilStack}
          options={{ headerShown: false, tabBarIcon: icone('👤') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
