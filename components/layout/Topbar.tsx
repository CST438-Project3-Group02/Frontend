import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

interface TopbarProps {
  onSearch?: (query: string) => void;
  userName?: string;
}

export default function Topbar({ onSearch, userName = "User" }: TopbarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSoft,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: insets.top + 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Search the sanctuary..."
          placeholderTextColor="#999"
          onChangeText={onSearch}
          style={{
            borderRadius: 8,
            backgroundColor: colors.surfaceSoft,
            paddingHorizontal: 16,
            paddingVertical: 8,
            color: colors.text,
            minHeight: 40,
          }}
        />
      </View>
      <TouchableOpacity>
        <Ionicons name="notifications" size={24} color={colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            height: 32,
            width: 32,
            borderRadius: 16,
            backgroundColor: colors.primary,
          }}
        />
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {userName}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
