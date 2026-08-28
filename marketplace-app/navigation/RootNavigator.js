import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../lib/AuthContext';
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
import SettingsScreen from '../screens/SettingsScreen';

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

function EspaceVendeur() {
  return (
    <VendeurTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COULEURS.vert,
        tabBarInactiveTintColor: COULEURS.texteDoux,
        headerShown: false,
      }}
    >
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
        options={{ title: 'Ventes', headerShown: true, tabBarIcon: icone('💶') }}
      />
      <VendeurTab.Screen
        name="Clients"
        component={ClientsScreen}
        options={{ title: 'Clients', headerShown: true, tabBarIcon: icone('👥') }}
      />
    </VendeurTab.Navigator>
  );
}

export default function RootNavigator() {
  const { estVendeur } = useAuth();

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
          options={{ title: 'Mes achats', tabBarIcon: icone('🧺') }}
        />
        <Tab.Screen
          name="Favoris"
          component={FavorisScreen}
          options={{ title: 'Favoris', tabBarIcon: icone('★') }}
        />
        {estVendeur && (
          <Tab.Screen
            name="Vendre"
            component={EspaceVendeur}
            options={{ headerShown: false, tabBarIcon: icone('🌾') }}
          />
        )}
        <Tab.Screen
          name="Réglages"
          component={SettingsScreen}
          options={{ title: 'Réglages', tabBarIcon: icone('⚙️') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
