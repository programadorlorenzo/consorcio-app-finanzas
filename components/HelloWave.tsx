import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";

export function HelloWave({
  emoji = "👋",
  waveCount = Infinity,
  waveAngle = 20,
  waveDuration = 150,
  pauseDuration = 1000,
  style,
}: {
  emoji?: string;
  waveCount?: number;
  waveAngle?: number;
  waveDuration?: number;
  pauseDuration?: number;
  style?: any;
}) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(waveAngle, { duration: waveDuration }),
        withTiming(-waveAngle / 2, { duration: waveDuration }),
        withTiming(waveAngle / 3, { duration: waveDuration }),
        withTiming(0, { duration: waveDuration }),
        withTiming(0, { duration: pauseDuration })
      ),
      waveCount
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: waveDuration * 2 }),
        withTiming(1, { duration: waveDuration * 2 + pauseDuration })
      ),
      waveCount
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={[styles.text, style]}>{emoji}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
});
