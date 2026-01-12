import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors } from '../constants/theme';

interface CelebrationAnimationProps {
  visible: boolean;
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

export function CelebrationAnimation({ visible, onComplete }: CelebrationAnimationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      rotationAnim.setValue(0);

      // Create rotation animation
      const rotation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );

      // Create scale and opacity animation
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 3,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        rotation.stop();
        onComplete();
      });

      rotation.start();
    }
  }, [visible]);

  if (!visible) return null;

  const rotate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ scale: scaleAnim }, { rotate }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={[styles.innerCircle, { backgroundColor: Colors.primary }]} />
        <View style={[styles.innerCircle, styles.innerCircle2, { backgroundColor: Colors.accent }]} />
        <View style={[styles.innerCircle, styles.innerCircle3, { backgroundColor: Colors.secondary }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  circle: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.7,
  },
  innerCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.8,
  },
  innerCircle3: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.9,
  },
});

