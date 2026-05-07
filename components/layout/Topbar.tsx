import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

interface TopbarProps {
  onSearch?: (query: string) => void;
  userName?: string;
  householdId?: string;
}

export default function Topbar({
  onSearch,
  userName,
  householdId,
}: TopbarProps) {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuthContext();
  const router = useRouter();

  const displayName =
    userName ||
    profile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarUrl = profile?.profilePicUrl;

  const handleProfilePress = () => {
    if (householdId) {
      router.push({
        pathname: "/households/[householdId]/settings",
        params: { householdId },
      });
    }
  };

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
        onPress={handleProfilePress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={{
              height: 32,
              width: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
            }}
          />
        ) : (
          <View
            style={{
              height: 32,
              width: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontSize: 12, fontWeight: "bold" }}>
              {displayName.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
        )}
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {displayName}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}
