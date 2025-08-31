import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DataProvider } from "./context/DataContext";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/Settingsscreen";
import SplashScreen from "./screens/SplashScreen";
import { colors } from "./theme/theme";

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <DataProvider>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarLabelStyle: {
                fontFamily: "Inter_600SemiBold",
                fontSize: 12,
                marginTop: 2,
              },
              tabBarStyle: {
                backgroundColor: colors.card,
                borderTopWidth: 1,
                borderTopColor: colors.borderLight,
                paddingTop: 12,
                paddingBottom: 16,
                height: 90,
                elevation: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              },
              tabBarIconStyle: {
                marginBottom: 2,
              },
            }}
          >
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Add"
              component={AddExpenseScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons
                    name="add-circle-outline"
                    color={color}
                    size={size}
                  />
                ),
                title: "Add Expense",
              }}
            />
            <Tab.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </DataProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
