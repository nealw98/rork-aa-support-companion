import { Tabs } from "expo-router";
import { Home, MessageCircle, Book, Heart, Moon } from "lucide-react-native";
import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import SunIcon from "@/components/SunIcon";

import Colors from "@/constants/colors";
import { adjustFontWeight, getScreenPadding } from "@/constants/fonts";

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight('600', true)
  },
  screenContainer: {
    ...getScreenPadding()
  },
  tabIcon: {
    ...(Platform.OS === 'android' ? { marginTop: 2 } : {})
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
        },
        headerStyle: {
          backgroundColor: "#f8f9fa",
        }
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
          tabBarIcon: ({ color }) => <Home color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Sober Chat",
          headerTitle: () => (
            <View>
              <Text style={{ fontSize: 18, fontWeight: adjustFontWeight("600", true) }}>Choose Your AI Sponsor</Text>
              <Text style={{ fontSize: 12, fontStyle: "italic", fontWeight: adjustFontWeight("400"), color: Colors.light.muted }}>
                Select a voice that fits your mood
              </Text>
            </View>
          ),
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          headerTitle: "AA Prayers",
          tabBarIcon: ({ color }) => <Heart color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="bigbook"
        options={{
          title: "Big Book",
          tabBarIcon: ({ color }) => <Book color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="evening-review"
        options={{
          title: "Review",
          headerTitle: "Evening Review",
          tabBarIcon: ({ color }) => <Moon color={color} size={22} style={styles.tabIcon} />,
        }}
      />
    </Tabs>
  );
}