import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { ChevronDown, LucideIcon } from "lucide-react-native";
import { ReactNode, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface ChoreListProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: "primary" | "secondary";
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function ChoreList({
  title,
  icon: Icon,
  badge,
  badgeType = "primary",
  children,
  defaultOpen = true,
}: ChoreListProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const accentColor =
    badgeType === "primary" ? colors.primary : colors.secondary;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        style={styles.header}
      >
        <View style={styles.left}>
          <Icon size={22} color={accentColor} />
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        <View style={styles.right}>
          {badge && (
            <View style={styles.badge}>
              <ThemedText style={[styles.badgeText, { color: accentColor }]}>
                {badge}
              </ThemedText>
            </View>
          )}

          <ChevronDown
            size={20}
            color={colors.textMuted}
            style={{
              transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
            }}
          />
        </View>
      </Pressable>

      {isOpen && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 18,
    gap: 12,
  },
});