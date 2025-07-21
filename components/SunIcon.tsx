import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

export default function SunIcon({ size = 120 }: { size?: number }) {
  const iconSize = size;
  const rayLength = iconSize * 0.15;
  const rayWidth = iconSize * 0.05;
  const sunRadius = iconSize * 0.25;
  const horizonWidth = iconSize * 0.6;
  const horizonHeight = iconSize * 0.04;

  return (
    <View style={[styles.container, { width: iconSize, height: iconSize }]}>
      {/* Top ray */}
      <View 
        style={[
          styles.ray,
          {
            width: rayWidth,
            height: rayLength,
            top: 0,
            left: (iconSize - rayWidth) / 2,
          }
        ]} 
      />
      
      {/* Left ray */}
      <View 
        style={[
          styles.ray,
          {
            width: rayLength,
            height: rayWidth,
            top: (iconSize * 0.3) - (rayWidth / 2),
            left: iconSize * 0.15,
          }
        ]} 
      />
      
      {/* Right ray */}
      <View 
        style={[
          styles.ray,
          {
            width: rayLength,
            height: rayWidth,
            top: (iconSize * 0.3) - (rayWidth / 2),
            right: iconSize * 0.15,
          }
        ]} 
      />
      
      {/* Sun circle */}
      <View 
        style={[
          styles.sun,
          {
            width: sunRadius * 2,
            height: sunRadius * 2,
            borderRadius: sunRadius,
            top: iconSize * 0.3 - sunRadius,
            left: (iconSize - sunRadius * 2) / 2,
            borderWidth: rayWidth,
          }
        ]} 
      />
      
      {/* Horizon line */}
      <View 
        style={[
          styles.horizon,
          {
            width: horizonWidth,
            height: horizonHeight,
            bottom: iconSize * 0.2,
            left: (iconSize - horizonWidth) / 2,
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  ray: {
    backgroundColor: Colors.light.tint,
    borderRadius: 100,
    position: 'absolute',
  },
  sun: {
    backgroundColor: 'transparent',
    borderColor: Colors.light.tint,
    position: 'absolute',
  },
  horizon: {
    backgroundColor: Colors.light.tint,
    borderRadius: 100,
    position: 'absolute',
  },
});