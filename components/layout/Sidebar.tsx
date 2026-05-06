import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
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
  householdId: string;
  onRoomiePress?: () => void;
}

const DEFAULT_ITEMS: MenuItem[] = [
  { id: "activity", label: "Activity", icon: "list", active: true },
  { id: "chores", label: "Chores", icon: "checkbox" },
  { id: "expenses", label: "Expenses", icon: "receipt" },
  { id: "groceries", label: "Groceries", icon: "cart" },
  { id: "household", label: "My Household", icon: "home"},
  { id: "settings", label: "Settings", icon: "settings" },
];

export default function Sidebar({
  items = DEFAULT_ITEMS,
  onRoomiePress,
  householdId
}: SidebarProps) {
  const router = useRouter()

  const bottomItemIds = ['household', 'settings']

  const topItems = items.filter(item => !bottomItemIds.includes(item.id))
  const bottomItems = items.filter(item => bottomItemIds.includes(item.id))

  const handleNavigation = (id: string) => {
    console.log(householdId)
    const routes = {
      activity: { pathname: '/households/[householdId]', params: { householdId } },
      chores: { pathname: '/households/[householdId]/chores', params: { householdId } },
      expenses: { pathname: '/households/[householdId]/expenses', params: { householdId } },
      groceries: { pathname: '/households/[householdId]/groceries', params: { householdId } },
      chat: { pathname: '/households/[householdId]/chat', params: { householdId } },
      household: { pathname: '/households/[householdId]/householdsettings', params: { householdId } },
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
      <View style={{ flex: 1, justifyContent: 'space-between', paddingHorizontal: 8 }}>
          <View style={{ gap: 8 }}>
              {topItems.map((item) => (
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

          <View style={{ gap: 8, borderTopWidth: 1, borderTopColor: colors.borderSoft, paddingTop: 8 }}>
              {bottomItems.map((item) => (
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
      </View>
    </View>
  );
}
