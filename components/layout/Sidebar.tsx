import SignOutButton from "@/components/social-auth-buttons/SignOutButton";
import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface SidebarProps {
  items?: MenuItem[];
  onItemPress?: (id: string) => void;
  onRoomiePress?: () => void;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: "activity", label: "Activity", icon: "list", active: true },
  { id: "chores", label: "Chores", icon: "checkbox" },
  { id: "expenses", label: "Expenses", icon: "receipt" },
  { id: "groceries", label: "Groceries", icon: "cart" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function Sidebar({
  items = DEFAULT_ITEMS,
  onItemPress,
  onRoomiePress,
}: SidebarProps) {
  return (
    <View
      style={{
        width: 256,
        borderRightWidth: 1,
        borderRightColor: colors.borderSoft,
        backgroundColor: colors.surface,
        paddingVertical: 16,
      }}
    >
      <TouchableOpacity onPress={onRoomiePress}>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "bold",
            paddingHorizontal: 16,
            paddingVertical: 16,
            color: colors.text,
          }}
        >
          Roomie
        </ThemedText>
      </TouchableOpacity>
      <View style={{ flex: 1, gap: 8, paddingHorizontal: 8 }}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress?.(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: item.active ? "#A86651" : "transparent",
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.active ? colors.background : colors.primary}
            />
            <ThemedText
              style={{
                fontSize: 14,
                fontWeight: item.active ? "600" : "400",
                color: item.active ? colors.whiteSoft : colors.text,
              }}
            >
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      <SignOutButton />
    </View>
  );
}
