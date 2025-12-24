import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TemplateCard } from "@/components/template-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TEMPLATES } from "@/constants/templates";
import { Spacing } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleTemplateSelect = (templateId: string) => {
    router.push({
      pathname: "/edit",
      params: { templateId },
    });
  };

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
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            メッセージカードを作成
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            テンプレートを選んで、心のこもったメッセージを送りましょう
          </ThemedText>
        </View>

        {/* Template list */}
        <View style={styles.templateList}>
          {TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPress={() => handleTemplateSelect(template.id)}
            />
          ))}
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
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  templateList: {
    gap: Spacing.md,
  },
});
