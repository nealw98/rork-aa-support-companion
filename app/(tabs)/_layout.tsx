import { Tabs } from "expo-router";
import { BookOpen, MessageCircle, Book } from "lucide-react-native";
import React from "react";

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
          title: "Daily Reflection",
          tabBarIcon: ({ color }) => <BookOpen color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Sober Chat",
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
    </Tabs>
  );
}