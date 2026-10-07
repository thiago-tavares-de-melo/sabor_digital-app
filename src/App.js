import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { ThemeProvider, useTema } from './context/ThemeContext';
import { CarrinhoProvider, useCarrinho } from './context/CarrinhoContext';
import ListaProdutos from './screens/ListaProdutos';
import DetalheProduto from './screens/DetalheProduto';
import Carrinho from './screens/Carrinho';
import Pedidos from './screens/Pedidos';
import Configuracoes from './screens/Configuracoes';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function CardapioStack() {
  const { cores } = useTema();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: cores.header },
        headerTintColor: cores.headerText,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="ListaProdutos" component={ListaProdutos} options={{ title: 'Sabor Digital' }} />
      <Stack.Screen name="DetalheProduto" component={DetalheProduto} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}

const icone = (emoji) => ({ color }) => <Text style={{ fontSize: 20, color }}>{emoji}</Text>;

function Navegacao() {
  const { cores } = useTema();
  const { quantidadeTotal } = useCarrinho();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: cores.tabBar, borderTopColor: cores.border },
          tabBarActiveTintColor: cores.primary,
          tabBarInactiveTintColor: cores.textSecondary,
          headerStyle: { backgroundColor: cores.header },
          headerTintColor: cores.headerText,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Tab.Screen name="Cardapio" component={CardapioStack} options={{ headerShown: false, tabBarLabel: 'Cardapio', tabBarIcon: icone('🍝') }} />
        <Tab.Screen
          name="Carrinho"
          component={Carrinho}
          options={{ tabBarIcon: icone('🛒'), tabBarBadge: quantidadeTotal > 0 ? quantidadeTotal : undefined }}
        />
        <Tab.Screen name="Pedidos" component={Pedidos} options={{ tabBarIcon: icone('🧾') }} />
        <Tab.Screen name="Configuracoes" component={Configuracoes} options={{ title: 'Configuracoes', tabBarLabel: 'Config', tabBarIcon: icone('⚙️') }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CarrinhoProvider>
        <Navegacao />
      </CarrinhoProvider>
    </ThemeProvider>
  );
}
