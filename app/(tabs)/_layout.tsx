import { Tabs } from "expo-router";
import { Home, MessageCircle, Book, Heart, Moon, Smile, BarChart3 } from "lucide-react-native";
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
        name="gratitude"
        options={{
          title: "Gratitude",
          headerTitle: "Daily Gratitude",
          tabBarIcon: ({ color }) => <Smile color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="nightly-review"
        options={{
          title: "Review",
          headerTitle: "Evening Review",
          tabBarIcon: ({ color }) => <Moon color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: "Insights",
          headerTitle: "Recovery Insights",
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Sponsor",
          headerTitle: "AI Sponsor",
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
        name="literature"
        options={{
          title: "Literature",
          headerTitle: "AA Literature",
          tabBarIcon: ({ color }) => <Book color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="evening-review"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
}