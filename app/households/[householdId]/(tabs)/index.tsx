import Greeting from "@/components/dashboard/Greeting";
import RightPanel from "@/components/dashboard/RightPanel";
import ComposerCard from "@/components/feed/ComposerCard";
import FeedList from "@/components/feed/FeedList";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, useWindowDimensions } from "react-native";

export default function Index() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePostCreated = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

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
            { id: "chat", label: "Chat", icon: "chatbubble" },
            { id: "household", label: "My Household", icon: "home" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar householdId={householdId} />
        <Greeting />
        {householdId && (
          <>
            <View style={{ paddingHorizontal: 16 }}>
              <ComposerCard
                householdId={householdId}
                onPostCreated={handlePostCreated}
              />
            </View>
            <FeedList
              householdId={householdId}
              refreshTrigger={refreshTrigger}
            />
          </>
        )}
        {isMobile && householdId && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list", active: true },
              { id: "chat", label: "Chat", icon: "chatbubble" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}
