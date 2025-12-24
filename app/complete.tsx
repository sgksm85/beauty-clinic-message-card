import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getTemplateById } from "@/constants/templates";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { trpc } from "@/lib/trpc";

export default function CompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cardId: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const borderColor = useThemeColor({}, "border");
  const [copied, setCopied] = useState(false);

  const { data: card, isLoading } = trpc.cards.getById.useQuery(
    { id: params.cardId || "" },
    { enabled: !!params.cardId },
  );

  const template = card ? getTemplateById(card.templateId) : null;

  // Generate card URL for web access
  const cardUrl = card
    ? Platform.OS === "web"
      ? `${window.location.origin}/card/${card.id}`
      : `https://8081-i8rers6ai8c5o93ivbea1-27d8f976.sg1.manus.computer/card/${card.id}`
    : "";

  const handleCopyUrl = async () => {
    try {
      await Clipboard.setStringAsync(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      Alert.alert("エラー", "URLのコピーに失敗しました");
    }
  };

  const handleShareLine = () => {
    const message = card?.senderName
      ? `${card.senderName}からメッセージカードが届きました!\n${cardUrl}`
      : `メッセージカードが届きました!\n${cardUrl}`;

    const lineUrl = `line://msg/text/${encodeURIComponent(message)}`;

    Linking.canOpenURL(lineUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(lineUrl);
        } else {
          Alert.alert("エラー", "LINEアプリがインストールされていません");
        }
      })
      .catch((error) => {
        console.error("Failed to open LINE:", error);
        Alert.alert("エラー", "LINEを開けませんでした");
      });
  };

  const handleCreateNew = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>読み込み中...</ThemedText>
      </ThemedView>
    );
  }

  if (!card || !template) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>カードが見つかりません</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, Spacing.lg) + Spacing.md,
            paddingBottom: Math.max(insets.bottom, Spacing.lg),
          },
        ]}
      >
        {/* Success message */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            カードが完成しました!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            LINEで送信するか、URLをコピーして共有してください
          </ThemedText>
        </View>

        {/* Card preview */}
        <View
          style={[
            styles.preview,
            { backgroundColor: template.backgroundColor, borderColor },
          ]}
        >
          <View style={[styles.accentBar, { backgroundColor: template.accentColor }]} />
          <ThemedText
            style={[
              styles.previewMessage,
              { color: template.textColor },
            ]}
          >
            {card.message}
          </ThemedText>
          {card.senderName && (
            <ThemedText
              style={[
                styles.previewSender,
                { color: template.textColor },
              ]}
            >
              {card.senderName}
            </ThemedText>
          )}
        </View>

        {/* URL display */}
        <View style={[styles.urlContainer, { borderColor }]}>
          <ThemedText style={styles.urlLabel}>カードURL</ThemedText>
          <ThemedText style={styles.url} numberOfLines={2}>
            {cardUrl}
          </ThemedText>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          <Pressable
            onPress={handleShareLine}
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: Colors[colorScheme ?? "light"].tint },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>LINEで送る</ThemedText>
          </Pressable>

          <Pressable
            onPress={handleCopyUrl}
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor },
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText style={styles.secondaryButtonText}>
              {copied ? "コピーしました!" : "URLをコピー"}
            </ThemedText>
          </Pressable>

          <Pressable onPress={handleCreateNew} style={styles.linkButton}>
            <ThemedText type="link" style={styles.linkText}>
              新しいカードを作る
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    textAlign: "center",
  },
  preview: {
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    padding: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  previewMessage: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  previewSender: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
    textAlign: "center",
  },
  urlContainer: {
    borderWidth: 1,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.xs,
  },
  urlLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  url: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  actions: {
    gap: Spacing.md,
  },
  primaryButton: {
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: BorderRadius.button,
    borderWidth: 2,
    paddingVertical: Spacing.md - 2, // Adjust for border
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  secondaryButtonText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  linkButton: {
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  linkText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
