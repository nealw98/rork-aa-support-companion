import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Clock,
  Trash2,
} from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

import Colors from "@/constants/colors";
import { bigBookData, aaPrayers } from "@/constants/bigbook";
import { BigBookStoreProvider, useBigBookStore } from "@/hooks/use-bigbook-store";
import { BigBookCategory, BigBookSection } from "@/types/bigbook";

const SectionItem = ({ section, categoryId }: { section: BigBookSection; categoryId: string }) => {
  const { addBookmark, removeBookmark, isBookmarked, addToRecent } = useBigBookStore();
  const bookmarked = isBookmarked(section.id);

  const handlePress = async () => {
    try {
      addToRecent(section.id, section.title, section.url);
      const supported = await Linking.canOpenURL(section.url);
      
      if (supported) {
        await Linking.openURL(section.url);
      } else {
        Alert.alert("Error", "Unable to open this document");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Unable to open this document");
    }
  };

  const toggleBookmark = () => {
    if (bookmarked) {
      removeBookmark(section.id);
    } else {
      addBookmark(section.id, section.title, section.url);
    }
  };

  return (
    <View style={styles.sectionItem}>
      <TouchableOpacity style={styles.sectionContent} onPress={handlePress} testID={`section-${section.id}`}>
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.pages && <Text style={styles.sectionPages}>Pages {section.pages}</Text>}
          {section.description && <Text style={styles.sectionDescription}>{section.description}</Text>}
        </View>
        <ExternalLink size={16} color={Colors.light.muted} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.bookmarkButton} onPress={toggleBookmark} testID={`bookmark-${section.id}`}>
        {bookmarked ? (
          <BookmarkCheck size={20} color={Colors.light.accent} />
        ) : (
          <Bookmark size={20} color={Colors.light.muted} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const CategorySection = ({ category }: { category: BigBookCategory }) => {
  // Auto-expand the "forewords" and "chapters" categories by default
  const [expanded, setExpanded] = useState<boolean>(
    category.id === "forewords" || category.id === "chapters"
  );

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => setExpanded(!expanded)}
        testID={`category-${category.id}`}
      >
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        {expanded ? (
          <ChevronDown size={20} color={Colors.light.muted} />
        ) : (
          <ChevronRight size={20} color={Colors.light.muted} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.sectionsContainer}>
          {category.sections.map((section) => (
            <SectionItem key={section.id} section={section} categoryId={category.id} />
          ))}
        </View>
      )}
    </View>
  );
};

const BookmarksSection = () => {
  const { bookmarks, removeBookmark, addToRecent } = useBigBookStore();

  const handleBookmarkPress = async (bookmark: any) => {
    try {
      addToRecent(bookmark.sectionId, bookmark.title, bookmark.url);
      const supported = await Linking.canOpenURL(bookmark.url);
      
      if (supported) {
        await Linking.openURL(bookmark.url);
      } else {
        Alert.alert("Error", "Unable to open this document");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Unable to open this document");
    }
  };

  if (bookmarks.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Bookmark size={48} color={Colors.light.muted} />
        <Text style={styles.emptyStateText}>No bookmarks yet</Text>
        <Text style={styles.emptyStateSubtext}>Bookmark sections to access them quickly</Text>
      </View>
    );
  }

  return (
    <View style={styles.bookmarksContainer}>
      {bookmarks.map((bookmark) => (
        <View key={bookmark.sectionId} style={styles.bookmarkItem}>
          <TouchableOpacity
            style={styles.bookmarkContent}
            onPress={() => handleBookmarkPress(bookmark)}
            testID={`bookmark-item-${bookmark.sectionId}`}
          >
            <Text style={styles.bookmarkTitle}>{bookmark.title}</Text>
            <Text style={styles.bookmarkDate}>
              Added {new Date(bookmark.dateAdded).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeBookmarkButton}
            onPress={() => removeBookmark(bookmark.sectionId)}
            testID={`remove-bookmark-${bookmark.sectionId}`}
          >
            <Trash2 size={16} color={Colors.light.muted} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const RecentSection = () => {
  const { recentlyViewed, clearRecent, addToRecent } = useBigBookStore();

  const handleRecentPress = async (recent: any) => {
    try {
      addToRecent(recent.sectionId, recent.title, recent.url);
      const supported = await Linking.canOpenURL(recent.url);
      
      if (supported) {
        await Linking.openURL(recent.url);
      } else {
        Alert.alert("Error", "Unable to open this document");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "Unable to open this document");
    }
  };

  if (recentlyViewed.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Clock size={48} color={Colors.light.muted} />
        <Text style={styles.emptyStateText}>No recent items</Text>
        <Text style={styles.emptyStateSubtext}>Recently viewed sections will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.recentContainer}>
      <View style={styles.recentHeader}>
        <Text style={styles.recentTitle}>Recently Viewed</Text>
        <TouchableOpacity onPress={clearRecent} testID="clear-recent">
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      {recentlyViewed.map((recent) => (
        <TouchableOpacity
          key={recent.sectionId}
          style={styles.recentItem}
          onPress={() => handleRecentPress(recent)}
          testID={`recent-item-${recent.sectionId}`}
        >
          <Text style={styles.recentItemTitle}>{recent.title}</Text>
          <Text style={styles.recentItemDate}>
            {new Date(recent.dateAdded).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const PrayersSection = () => {
  const [expandedPrayer, setExpandedPrayer] = useState<number | null>(null);

  return (
    <View style={styles.prayersContainer}>
      <Text style={styles.prayersTitle}>AA Prayers</Text>
      <Text style={styles.prayersSubtitle}>Essential prayers for recovery and reflection</Text>
      
      {aaPrayers.map((prayer, index) => (
        <View key={index} style={styles.prayerCard}>
          <TouchableOpacity
            style={styles.prayerHeader}
            onPress={() => setExpandedPrayer(expandedPrayer === index ? null : index)}
            testID={`prayer-${index}`}
          >
            <Text style={styles.prayerTitle}>{prayer.title}</Text>
            {expandedPrayer === index ? (
              <ChevronDown size={20} color={Colors.light.muted} />
            ) : (
              <ChevronRight size={20} color={Colors.light.muted} />
            )}
          </TouchableOpacity>
          
          {expandedPrayer === index && (
            <View style={styles.prayerContent}>
              <Text style={styles.prayerText}>{prayer.content}</Text>
              <Text style={styles.prayerSource}>— {prayer.source}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

function BigBookBrowserContent() {
  const [activeTab, setActiveTab] = useState<"browse" | "bookmarks" | "recent" | "prayers">("browse");

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(74, 144, 226, 0.1)', 'rgba(78, 205, 196, 0.05)', 'rgba(92, 184, 92, 0.02)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "browse" && styles.activeTab]}
          onPress={() => setActiveTab("browse")}
          testID="browse-tab"
        >
          <Text style={[styles.tabText, activeTab === "browse" && styles.activeTabText]}>Browse</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "bookmarks" && styles.activeTab]}
          onPress={() => setActiveTab("bookmarks")}
          testID="bookmarks-tab"
        >
          <Text style={[styles.tabText, activeTab === "bookmarks" && styles.activeTabText]}>Bookmarks</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "recent" && styles.activeTab]}
          onPress={() => setActiveTab("recent")}
          testID="recent-tab"
        >
          <Text style={[styles.tabText, activeTab === "recent" && styles.activeTabText]}>Recent</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "prayers" && styles.activeTab]}
          onPress={() => setActiveTab("prayers")}
          testID="prayers-tab"
        >
          <Text style={[styles.tabText, activeTab === "prayers" && styles.activeTabText]}>Prayers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "browse" && (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Alcoholics Anonymous</Text>
              <Text style={styles.subtitle}>The Big Book - Fourth Edition</Text>
              <Text style={styles.description}>
                The basic text for Alcoholics Anonymous. Tap any section to open the official PDF.
              </Text>
            </View>
            
            {/* Display all categories in the correct order */}
            {bigBookData.map((category) => (
              <CategorySection key={category.id} category={category} />
            ))}
          </View>
        )}
        
        {activeTab === "bookmarks" && <BookmarksSection />}
        {activeTab === "recent" && <RecentSection />}
        {activeTab === "prayers" && <PrayersSection />}
      </ScrollView>
    </View>
  );
}

export default function BigBookBrowser() {
  return (
    <BigBookStoreProvider>
      <BigBookBrowserContent />
    </BigBookStoreProvider>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.tint,
  },
  tabText: {
    fontSize: 14,
    color: Colors.light.muted,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.light.tint,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.muted,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.light.muted,
    lineHeight: 20,
  },
  categoryContainer: {
    marginBottom: 8,
    backgroundColor: Colors.light.background,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: Colors.light.muted,
  },
  sectionsContainer: {
    backgroundColor: Colors.light.background,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 32,
    paddingRight: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  sectionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionInfo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
  },
  sectionPages: {
    fontSize: 12,
    color: Colors.light.muted,
    marginBottom: 2,
  },
  sectionDescription: {
    fontSize: 12,
    color: Colors.light.muted,
    lineHeight: 16,
  },
  bookmarkButton: {
    padding: 8,
    marginLeft: 8,
  },
  bookmarksContainer: {
    padding: 16,
  },
  bookmarkItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
  },
  bookmarkDate: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  removeBookmarkButton: {
    padding: 8,
  },
  recentContainer: {
    padding: 16,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  clearText: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: "500",
  },
  recentItem: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
  },
  recentItemDate: {
    fontSize: 12,
    color: Colors.light.muted,
  },
  prayersContainer: {
    padding: 16,
  },
  prayersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  prayersSubtitle: {
    fontSize: 14,
    color: Colors.light.muted,
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.tint,
  },
  prayerHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  prayerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  prayerContent: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
  },
  prayerText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: "italic",
  },
  prayerSource: {
    fontSize: 12,
    color: Colors.light.muted,
    textAlign: "right",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.muted,
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.light.muted,
    textAlign: "center",
  },
});