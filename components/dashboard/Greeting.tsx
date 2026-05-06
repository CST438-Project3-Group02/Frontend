import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { View } from "react-native";

export default function Greeting() {
  const { profile, user } = useAuthContext();

  // Determine greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const displayName =
    profile?.name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Roomies";

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
      <ThemedText
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: colors.text,
          marginBottom: 4,
        }}
      >
        {getGreeting()},{" "}
        <ThemedText style={{ color: colors.primary }}>{displayName}</ThemedText>
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 14,
          color: colors.textMuted,
        }}
      >
        The sanctuary is humming with activity today.
      </ThemedText>
    </View>
  );
}
