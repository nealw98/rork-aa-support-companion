import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { getScreenPadding } from '@/constants/fonts';

interface ScreenContainerProps {
  children: ReactNode;
  style?: object;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...getScreenPadding()
  }
});

export default ScreenContainer;