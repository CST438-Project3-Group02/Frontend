import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { Check, LucideIcon } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

interface ChoreCardProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  completed?: boolean;
  onToggle?: () => void;
  accent?: boolean;
  assigneePhoto?: string;
}

export default function ChoreCard({
  title,
  subtitle,
  icon: Icon,
  completed = false,
  onToggle,
  accent = true,
  assigneePhoto,
}: ChoreCardProps) {
  return (
    <View style={[styles.card, accent && styles.accent]}>
      <View style={styles.left}>
        {assigneePhoto ? (
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: assigneePhoto }} style={styles.avatar} />
          </View>
        ) : (
          <Pressable
            onPress={onToggle}
            style={[
              styles.checkbox,
              completed ? styles.checkboxCompleted : styles.checkboxEmpty,
            ]}
          >
            {completed && <Check size={14} color="#fff" strokeWidth={4} />}
          </Pressable>
        )}

        <View style={styles.textWrapper}>
          <ThemedText
            style={[
              styles.title,
              completed && styles.completedTitle,
            ]}
          >
            {title}
          </ThemedText>

          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
        </View>
      </View>

      <View style={styles.iconWrapper}>
        <Icon size={20} color={colors.primary} opacity={0.4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  accent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    flexShrink: 0,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxEmpty: {
    backgroundColor: "transparent",
    borderColor: colors.border,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: colors.textMuted,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "700",
    color: colors.textMuted,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: colors.surfaceSoft,
  },
});