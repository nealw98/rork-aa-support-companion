import { Tabs, router } from "expo-router";
import { Home, MessageCircle, Book, Heart, Smile, Moon, ArrowLeft } from "lucide-react-native";
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
  backButton: {
    padding: 8,
    marginLeft: 4
  }
});

const BackButton = () => (
  <TouchableOpacity 
    style={styles.backButton}
    onPress={() => router.push('/')}
    testID="back-button"
  >
    <ArrowLeft color={Colors.light.tint} size={24} />
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
          headerLeft: () => <BackButton />,
          tabBarIcon: ({ color }) => <Smile color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="evening-review"
        options={{
          title: "Review",
          headerTitle: "Evening Review",
          headerLeft: () => <BackButton />,
          tabBarIcon: ({ color }) => <Moon color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Sponsor",
          headerTitle: "AI Sponsor",
          headerLeft: () => <BackButton />,
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: "Prayers",
          headerTitle: "AA Prayers",
          headerLeft: () => <BackButton />,
          tabBarIcon: ({ color }) => <Heart color={color} size={22} style={styles.tabIcon} />,
        }}
      />
      <Tabs.Screen
        name="literature"
        options={{
          title: "Literature",
          headerTitle: "AA Literature",
          headerLeft: () => <BackButton />,
          tabBarIcon: ({ color }) => <Book color={color} size={22} style={styles.tabIcon} />,
        }}
      />

      <Tabs.Screen
        name="bigbook"
        options={{
          href: null,
          title: "Big Book",
          headerTitle: "Big Book",
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="twelve-and-twelve"
        options={{
          href: null,
          title: "Twelve and Twelve",
          headerTitle: "Twelve and Twelve",
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="reflection"
        options={{
          href: null,
          title: "Daily Reflection",
          headerTitle: "Daily Reflection",
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          href: null,
          title: "Insights",
          headerTitle: "Insights",
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          href: null,
          title: "Inventory",
          headerTitle: "Inventory",
          headerLeft: () => <BackButton />
        }}
      />
      <Tabs.Screen
        name="nightly-review"
        options={{
          href: null,
          title: "Nightly Review",
          headerTitle: "Nightly Review",
          headerLeft: () => <BackButton />
        }}
      />

    </Tabs>
  );
}