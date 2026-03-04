import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import HomeScanScreen from './src/screens/HomeScanScreen';
import ScanScreen from './src/screens/ScanScreen';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import IngredientsSnap from './src/screens/IngredientsSnap';
import ChatScreen from './src/screens/ChatScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import { View, TouchableOpacity } from 'react-native';
import { Settings, History } from 'lucide-react-native';
import { RootStackParamList } from './src/types';
import { Colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                style={{ marginRight: 15 }}
              >
                <History color={Colors.textPrimary} size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                <Settings color={Colors.textPrimary} size={24} />
              </TouchableOpacity>
            </View>
          ),
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        <Stack.Screen name="Home" component={HomeScanScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ title: 'Scan Barcode' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ headerShown: false }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'History' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen
          name="IngredientsSnap"
          component={IngredientsSnap}
          options={{ title: 'Snap Ingredients', headerTransparent: true, headerTintColor: '#fff' }}
        />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'AI Assistant' }} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
