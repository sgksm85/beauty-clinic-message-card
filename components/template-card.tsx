import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { Template } from "@/constants/templates";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

interface TemplateCardProps {
  template: Template;
  onPress: () => void;
}

export function TemplateCard({ template, onPress }: TemplateCardProps) {
  const borderColor = useThemeColor({}, "border");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { borderColor },
        pressed && styles.pressed,
      ]}
    >
      {/* Preview area with template background color */}
      <View
        style={[
          styles.preview,
          { backgroundColor: template.backgroundColor },
        ]}
      >
        <View style={[styles.accentBar, { backgroundColor: template.accentColor }]} />
        <ThemedText
          style={[styles.previewText, { color: template.textColor }]}
          numberOfLines={2}
        >
          メッセージプレビュー
        </ThemedText>
      </View>

      {/* Template info */}
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {template.name}
        </ThemedText>
        <ThemedText style={styles.description} numberOfLines={2}>
          {template.description}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  preview: {
    aspectRatio: 3 / 4,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  accentBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  info: {
    padding: Spacing.md,
    gap: Spacing.xs / 2,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
});
