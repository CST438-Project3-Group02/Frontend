import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
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
  householdId: string;
}

export default function BottomNavigation({
  items,
  householdId,
}: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  const handleNavigation = (id: string) => {
    const routes = {
      activity: { pathname: '/households/[householdId]', params: { householdId } },
      chores: { pathname: '/households/[householdId]/chores', params: { householdId } },
      expenses: { pathname: '/households/[householdId]/expenses', params: { householdId } },
      groceries: { pathname: '/households/[householdId]/groceries', params: { householdId } },
      chat: { pathname: '/households/[householdId]/chat', params: { householdId } },
      settings: { pathname: '/households/[householdId]/settings', params: { householdId } },
    } as const;

    const route = routes[id as keyof typeof routes];
    if (route) {
      router.push(route);
    }
  };

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
          onPress={() => handleNavigation(item.id)}
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
