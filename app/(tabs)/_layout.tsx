import { Tabs, router } from "expo-router";
import { Home, MessageCircle, Book, Heart, Moon, Smile } from "lucide-react-native";
import React from "react";
import { Text, View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import SunIcon from "@/components/SunIcon";

import Colors from "@/constants/colors";
import { adjustFontWeight, getScreenPadding } from "@/constants/fonts";

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    maxWidth: '100%'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: adjustFontWeight('600', true),
    flexShrink: 0,
    textAlign: 'center'
  },
  screenContainer: {
    ...getScreenPadding()
  },
  tabIcon: {
    ...(Platform.OS === 'android' ? { marginTop: 2 } : {})
  },
  homeButton: {
    padding: 8,
    marginRight: 4
  }
});

const HomeButton = () => (
  <TouchableOpacity 
    style={styles.homeButton}
    onPress={() => router.push('/')}
    testID="home-button"
  >
    <Home color={Colors.light.tint} size={24} />
  </TouchableOpacity>
);

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
          headerRight: () => <HomeButton />,
          tabBarIcon: ({ color }) => <Smile color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="nightly-review"
        options={{
          title: "Review",
          headerTitle: "Evening Review",
          headerRight: () => <HomeButton />,
          tabBarIcon: ({ color }) => <Moon color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Sponsor",
          headerTitle: "AI Sponsor",
          headerRight: () => <HomeButton />,
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          headerTitle: "AA Prayers",
          headerRight: () => <HomeButton />,
          tabBarIcon: ({ color }) => <Heart color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="literature"
        options={{
          title: "Literature",
          headerTitle: "AA Literature",
          headerRight: () => <HomeButton />,
          tabBarIcon: ({ color }) => <Book color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="evening-review"
        options={{
          href: null
        }}
      />
      <Tabs.Screen
        name="bigbook"
        options={{
          href: null,
          title: "Big Book",
          headerTitle: "Big Book",
          headerRight: () => <HomeButton />
        }}
      />
      <Tabs.Screen
        name="twelve-and-twelve"
        options={{
          href: null,
          title: "Twelve and Twelve",
          headerTitle: "Twelve and Twelve",
          headerRight: () => <HomeButton />
        }}
      />
      <Tabs.Screen
        name="reflection"
        options={{
          href: null,
          title: "Daily Reflection",
          headerTitle: "Daily Reflection",
          headerRight: () => <HomeButton />
        }}
      />
    </Tabs>
  );
}