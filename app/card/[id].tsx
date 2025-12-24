import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getTemplateById } from "@/constants/templates";
import { BorderRadius, Spacing } from "@/constants/theme";
import { trpc } from "@/lib/trpc";

const ANIMATION_DURATION = 2000; // 2 seconds total
const STORAGE_KEY_PREFIX = "card_viewed_";

export default function CardViewScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [hasViewed, setHasViewed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const { data: card, isLoading, error } = trpc.cards.getById.useQuery(
    { id: params.id || "" },
    { enabled: !!params.id },
  );

  const template = card ? getTemplateById(card.templateId) : null;

  // Animation values
  const containerOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(50);
  const cardScale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const checkViewStatus = async () => {
      if (!params.id) return;

      try {
        const viewed = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${params.id}`);
        setHasViewed(viewed === "true");
      } catch (error) {
        console.error("Failed to check view status:", error);
      }
    };

    checkViewStatus();
  }, [params.id]);

  useEffect(() => {
    if (!card || !template) return;

    const markAsViewed = async () => {
      if (!params.id) return;
      try {
        await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${params.id}`, "true");
      } catch (error) {
        console.error("Failed to mark as viewed:", error);
      }
    };

    if (hasViewed) {
      // Skip animation if already viewed
      containerOpacity.value = 1;
      cardTranslateY.value = 0;
      cardScale.value = 1;
      textOpacity.value = 1;
      setAnimationComplete(true);
    } else {
      // Play opening animation
      containerOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });

      cardTranslateY.value = withSequence(
        withTiming(0, {
          duration: 1000,
          easing: Easing.out(Easing.cubic),
        }),
      );

      cardScale.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.back(1.2)),
      });

      textOpacity.value = withSequence(
        withTiming(0, { duration: 800 }),
        withTiming(1, {
          duration: 500,
          easing: Easing.out(Easing.ease),
        }),
      );

      // Mark as viewed and set animation complete after animation finishes
      setTimeout(() => {
        runOnJS(markAsViewed)();
        runOnJS(setAnimationComplete)(true);
      }, ANIMATION_DURATION);
    }
  }, [card, template, hasViewed, params.id]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }, { scale: cardScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>読み込み中...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !card || !template) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="title" style={styles.errorTitle}>
          カードが見つかりません
        </ThemedText>
        <ThemedText style={styles.errorText}>
          URLが正しいか確認してください
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          paddingTop: Math.max(insets.top, Spacing.lg),
          paddingBottom: Math.max(insets.bottom, Spacing.lg),
        },
      ]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.card,
            cardStyle,
            { backgroundColor: template.backgroundColor },
          ]}
        >
          <View style={[styles.accentBar, { backgroundColor: template.accentColor }]} />
          
          <Animated.View style={textStyle}>
            <ThemedText
              style={[
                styles.message,
                { color: template.textColor },
              ]}
            >
              {card.message}
            </ThemedText>
            
            {card.senderName && (
              <ThemedText
                style={[
                  styles.sender,
                  { color: template.textColor },
                ]}
              >
                {card.senderName}
              </ThemedText>
            )}
          </Animated.View>
        </Animated.View>

        {/* Footer (optional) */}
        {animationComplete && (
          <Animated.View style={[styles.footer, textStyle]}>
            <ThemedText style={styles.footerText}>
              美容クリニックより
            </ThemedText>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  errorTitle: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  sender: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    textAlign: "center",
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
  },
});
