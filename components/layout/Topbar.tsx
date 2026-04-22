import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface TopbarProps {
  onSearch?: (query: string) => void;
  userName?: string;
}

export default function Topbar({ onSearch, userName = "User" }: TopbarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#D8C0B7",
        backgroundColor: "#EEDBD5",
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Search the sanctuary..."
          placeholderTextColor="#999"
          onChangeText={onSearch}
          style={{
            borderRadius: 8,
            backgroundColor: "#F6E7E2",
            paddingHorizontal: 16,
            paddingVertical: 8,
            color: "#4A342E",
            minHeight: 40,
          }}
        />
      </View>
      <TouchableOpacity>
        <Ionicons name="notifications" size={24} color="#A86651" />
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
            backgroundColor: "#A86651",
          }}
        />
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#4A342E",
          }}
        >
          {userName}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
