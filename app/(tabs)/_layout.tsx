import { Tabs } from "expo-router";
import { Home, MessageCircle, Book, Heart, Moon } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#f8f9fa",
        },
        headerStyle: {
          backgroundColor: "#f8f9fa",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Sober Dailies",
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Sober Chat",
          headerTitle: () => (
            <View>
              <Text style={{ fontSize: 18, fontWeight: "600" }}>Choose Your AI Sponsor</Text>
              <Text style={{ fontSize: 12, fontStyle: "italic", color: Colors.light.muted }}>
                Select a voice that fits your mood
              </Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="bigbook"
        options={{
          title: "Big Book",
          tabBarIcon: ({ color }) => <Book color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          headerTitle: "AA Prayers",
          tabBarIcon: ({ color }) => <Heart color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="evening-review"
        options={{
          title: "Review",
          headerTitle: "Evening Review",
          tabBarIcon: ({ color }) => <Moon color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}