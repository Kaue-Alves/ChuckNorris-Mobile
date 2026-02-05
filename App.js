import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/HomeScreen";
import SavedScreen from "./screens/SavedScreen";
import { JokesProvider } from "./context/JokesContext";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <JokesProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarActiveTintColor: "#B9C2FF",
                        tabBarInactiveTintColor: "rgba(232, 236, 255, 0.55)",
                        tabBarStyle: {
                            backgroundColor: "#0B1020",
                            borderTopColor: "rgba(185, 194, 255, 0.16)",
                        },
                        tabBarIcon: ({ color, size }) => {
                            const name =
                                route.name === "Piada"
                                    ? "sparkles"
                                    : "bookmark";
                            return (
                                <Ionicons
                                    name={name}
                                    size={size}
                                    color={color}
                                />
                            );
                        },
                    })}
                >
                    <Tab.Screen name="Piada" component={HomeScreen} />
                    <Tab.Screen name="Salvas" component={SavedScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </JokesProvider>
    );
}
