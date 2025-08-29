import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons"; // optional
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DataProvider } from "./context/DataContext";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import HomeScreen from "./screens/HomeScreen";
import SettingsScreen from "./screens/Settingsscreen";

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  if (!fontsLoaded) return <View />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <DataProvider>
          <Tab.Navigator
            screenOptions={{
              headerTitleAlign: "center",
              headerTitleStyle: { fontFamily: "Inter_600SemiBold" },
              tabBarActiveTintColor: "#0ea5e9",
              tabBarLabelStyle: { fontFamily: "Inter_500Medium" },
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
