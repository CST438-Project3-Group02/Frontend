import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import ProfileButton from "./ProfileButton";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface SidebarProps {
  items?: MenuItem[];
  householdId: string;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: "activity", label: "Activity", icon: "list", active: true },
  { id: "chores", label: "Chores", icon: "checkbox" },
  { id: "expenses", label: "Expenses", icon: "receipt" },
  { id: "groceries", label: "Groceries", icon: "cart" },
  { id: "household", label: "My Household", icon: "home" }
];

export default function Sidebar({
  items = DEFAULT_ITEMS,
  householdId
}: SidebarProps) {
  const router = useRouter()

  const handleNavigation = (id: string) => {
    const routes = {
      activity: { pathname: '/households/[householdId]', params: { householdId } },
      chores: { pathname: '/households/[householdId]/chores', params: { householdId } },
      expenses: { pathname: '/households/[householdId]/expenses', params: { householdId } },
      groceries: { pathname: '/households/[householdId]/groceries', params: { householdId } },
      chat: { pathname: '/households/[householdId]/chat', params: { householdId } },
      household: { pathname: '/households/[householdId]/householdsettings', params: { householdId } }
    } as const;

    const route = routes[id as keyof typeof routes];
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={{
      width: 256,
      borderRightWidth: 1,
      borderRightColor: colors.borderSoft,
      backgroundColor: colors.surface,
      paddingVertical: 16,
    }}>
      <ThemedText style={{
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
        paddingHorizontal: 24,
        paddingBottom: 24,
      }}>
        Roomie
      </ThemedText>

      <View style={{ flex: 1, paddingHorizontal: 8, justifyContent: 'space-between' }}>
        <View style={{ gap: 4, paddingTop: '10%' }}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigation(item.id)}
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
              <ThemedText style={{
                fontSize: 14,
                fontWeight: item.active ? "600" : "400",
                color: item.active ? colors.whiteSoft : colors.text,
              }}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
          paddingTop: 12,
          paddingHorizontal: 8,
        }}>
          <ProfileButton />
        </View>
      </View>
    </View>
  );
}