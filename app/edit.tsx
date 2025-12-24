import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { getTemplateById } from "@/constants/templates";
import { BorderRadius, Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { trpc } from "@/lib/trpc";

const MAX_MESSAGE_LENGTH = 200;

export default function EditScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ templateId: string }>();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  const template = getTemplateById(params.templateId || "template1");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createCardMutation = trpc.cards.create.useMutation();

  const handleCreate = async () => {
    if (message.trim().length === 0) {
      alert("メッセージを入力してください");
      return;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      alert(`メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`);
      return;
    }

    setIsCreating(true);
    try {
      const result = await createCardMutation.mutateAsync({
        templateId: template?.id || "template1",
        message: message.trim(),
        senderName: senderName.trim() || undefined,
      });

      router.push({
        pathname: "/complete",
        params: { cardId: result.id },
      });
    } catch (error) {
      console.error("Failed to create card:", error);
      alert("カードの作成に失敗しました。もう一度お試しください。");
    } finally {
      setIsCreating(false);
    }
  };

  const isValid = message.trim().length > 0 && message.length <= MAX_MESSAGE_LENGTH;

  if (!template) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>テンプレートが見つかりません</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, Spacing.lg) + Spacing.md,
            paddingBottom: Math.max(insets.bottom, Spacing.lg) + 80, // Space for button
          },
        ]}
      >
        {/* Preview */}
        <View style={styles.previewSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            プレビュー
          </ThemedText>
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
              {message || "ここにメッセージが表示されます"}
            </ThemedText>
            {senderName && (
              <ThemedText
                style={[
                  styles.previewSender,
                  { color: template.textColor },
                ]}
              >
                {senderName}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Input form */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              メッセージ *
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor, color: textColor, borderColor },
              ]}
              placeholder="心のこもったメッセージを入力してください"
              placeholderTextColor={Colors[colorScheme ?? "light"].textDisabled}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={MAX_MESSAGE_LENGTH}
              textAlignVertical="top"
            />
            <ThemedText style={styles.charCount}>
              {message.length} / {MAX_MESSAGE_LENGTH}
            </ThemedText>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText type="defaultSemiBold" style={styles.label}>
              差出人名 (任意)
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor, color: textColor, borderColor },
              ]}
              placeholder="例: 美容クリニック スタッフ一同"
              placeholderTextColor={Colors[colorScheme ?? "light"].textDisabled}
              value={senderName}
              onChangeText={setSenderName}
              maxLength={100}
            />
          </View>
        </View>
      </ScrollView>

      {/* Create button (fixed at bottom) */}
      <View
        style={[
          styles.buttonContainer,
          {
            paddingBottom: Math.max(insets.bottom, Spacing.md),
            backgroundColor,
            borderTopColor: borderColor,
          },
        ]}
      >
        <Pressable
          onPress={handleCreate}
          disabled={!isValid || isCreating}
          style={({ pressed }) => [
            styles.createButton,
            { backgroundColor: Colors[colorScheme ?? "light"].tint },
            (!isValid || isCreating) && styles.createButtonDisabled,
            pressed && styles.createButtonPressed,
          ]}
        >
          {isCreating ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.createButtonText}>カードを作成</ThemedText>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  previewSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  preview: {
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    padding: Spacing.xl,
    justifyContent: "center",
    alignItems: "center",
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
  formSection: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
  },
  charCount: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.5,
    textAlign: "right",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  createButton: {
    borderRadius: BorderRadius.button,
    paddingVertical: Spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
});
