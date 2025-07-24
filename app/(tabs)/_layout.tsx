import { Tabs } from "expo-router";
import { Home, MessageCircle, Book, Heart, Moon } from "lucide-react-native";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import SunIcon from "@/components/SunIcon";

import Colors from "@/constants/colors";

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8
  },
  chatHeaderContainer: {
    paddingVertical: 4,
    alignItems: 'center'
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.light.muted,
    textAlign: 'center'
  }
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: "#f8f9fa",
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          height: 60,
          paddingBottom: 8,
        },
        headerStyle: {
          backgroundColor: "#f8f9fa",
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <SunIcon size={24} />
              <Text style={styles.headerTitle}>Sober Dailies</Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Sober Chat",
          headerTitle: () => (
            <View style={styles.chatHeaderContainer}>
              <Text style={styles.chatHeaderTitle}>Choose Your AI Sponsor</Text>
              <Text style={styles.chatHeaderSubtitle}>
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