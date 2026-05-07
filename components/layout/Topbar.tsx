import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";
import ProfileButton from "./ProfileButton";

interface TopbarProps {
  title?: string;
}

export default function Topbar({ title }: TopbarProps) {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuthContext();
  const router = useRouter();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSoft,
        backgroundColor: colors.surface,
        paddingHorizontal: 24,
        paddingVertical: 14,
        paddingTop: insets.top + 14,
      }}
    >

      <ThemedText style={{
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.3,
      }}>
        {title ?? 'Roomie'}
      </ThemedText>

      <ProfileButton />
    </View>
  );
}