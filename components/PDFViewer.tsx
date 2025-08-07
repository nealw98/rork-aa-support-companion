import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adjustFontWeight } from '@/constants/fonts';

interface PDFViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  // For web, we can embed the PDF directly
  // For mobile, we'll use Google Docs viewer which works well in WebView
  const viewerUrl = Platform.OS === 'web' 
    ? url 
    : `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onClose}
          testID="pdf-close-button"
        >
          <ArrowLeft size={20} color={Colors.light.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={onClose}
          testID="pdf-x-button"
        >
          <X size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      
      <WebView
        source={{ uri: viewerUrl }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading PDF...</Text>
          </View>
        )}
        onError={(syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error: ', nativeEvent);
        }}
        allowsFullscreenVideo={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },
  backText: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 4,
    fontWeight: adjustFontWeight('500'),
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: adjustFontWeight('600'),
    color: Colors.light.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.muted,
    fontWeight: adjustFontWeight('500'),
  },
});