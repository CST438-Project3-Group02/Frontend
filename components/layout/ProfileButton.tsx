import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { router } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";

interface TopbarProps {
  onSearch?: (query: string) => void;
  userName?: string;
}

export default function ProfileButton() {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuthContext();

  if (!profile) return;

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const avatarUrl = profile?.profilePicUrl;

  const handleProfilePress = () => {
    router.push("/settings");
  };

  return (
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
  );
}
