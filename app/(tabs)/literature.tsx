import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Book, ChevronRight } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

import Colors from "@/constants/colors";
import ScreenContainer from "@/components/ScreenContainer";
import { adjustFontWeight } from "@/constants/fonts";

interface LiteratureOption {
  id: string;
  title: string;
  description: string;
  route: string;
}

const literatureOptions: LiteratureOption[] = [
  {
    id: "bigbook",
    title: "Alcoholics Anonymous",
    description: "The basic text of the Alcoholics Anonymous program",
    route: "/bigbook"
  },
  {
    id: "twelve-and-twelve",
    title: "Twelve Steps and Twelve Traditions",
    description: "Detailed exploration of the Steps and Traditions",
    route: "/twelve-and-twelve"
  }
];

const LiteratureCard = ({ option }: { option: LiteratureOption }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(option.route as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      testID={`literature-${option.id}`}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Book size={24} color={Colors.light.tint} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{option.title}</Text>
          <Text style={styles.cardDescription}>{option.description}</Text>
        </View>
        <ChevronRight size={20} color={Colors.light.muted} />
      </View>
    </TouchableOpacity>
  );
};

export default function LiteratureScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.3)', 'rgba(92, 184, 92, 0.1)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>AA Literature</Text>
          <Text style={styles.subtitle}>
            Access the foundational texts of Alcoholics Anonymous
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {literatureOptions.map((option) => (
            <LiteratureCard key={option.id} option={option} />
          ))}
        </View>
        
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            All literature is provided courtesy of Alcoholics Anonymous World Services, Inc.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: adjustFontWeight("bold", true),
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    lineHeight: 22,
    textAlign: "center",
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: adjustFontWeight("600", true),
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
  },
  copyrightContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: "center",
    lineHeight: 18,
  },
});