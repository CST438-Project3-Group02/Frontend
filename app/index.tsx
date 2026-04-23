import BottomNavigation from "@/components/layout/BottomNavigation";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import RightPanel from "../components/dashboard/RightPanel";
import FeedList from "../components/feed/FeedList";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const handleNavigation = (id: string) => {
    const routes: Record<string, string> = {
      activity: "/",
      chores: "/chores",
      expenses: "/expenses",
      groceries: "/groceries",
      settings: "/settings",
    };
    if (routes[id]) {
      router.push(routes[id] as any);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: isMobile ? "column" : "row",
        backgroundColor: colors.background,
      }}
    >
      {!isMobile && (
        <Sidebar
          items={[
            { id: "activity", label: "Activity", icon: "list", active: true },
            { id: "chores", label: "Chores", icon: "checkbox" },
            { id: "expenses", label: "Expenses", icon: "receipt" },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          onItemPress={handleNavigation}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar />
        <FeedList />
        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list", active: true },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
            ]}
            onItemPress={handleNavigation}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}
