import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  onItemPress: (id: string) => void;
}

export default function BottomNavigation({
  items,
  onItemPress,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: colors.borderSoft,
        backgroundColor: colors.surface,
        paddingBottom: insets.bottom + 8,
        paddingTop: 8,
      }}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 8,
          }}
          onPress={() => onItemPress(item.id)}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={item.active ? colors.primary : colors.textMuted}
          />
          <ThemedText
            style={{
              fontSize: 11,
              color: item.active ? colors.primary : colors.textMuted,
              marginTop: 4,
            }}
          >
            {item.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}
