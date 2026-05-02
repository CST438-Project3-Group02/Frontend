import RightPanel from "@/components/dashboard/RightPanel";
import ItemCard from "@/components/groceries/ItemCard";
import SearchBar from "@/components/groceries/SearchBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type GroceryItem = {
  id: number;
  name: string;
  count: number;
  addedBy: string;
  isUrgent: boolean;
  isChecked: boolean;
};

const initialGroceries: GroceryItem[] = [
  {
    id: 1,
    name: "Milk",
    count: 2,
    addedBy: "Maya",
    isUrgent: true,
    isChecked: false,
  },
  {
    id: 2,
    name: "Bread",
    count: 1,
    addedBy: "Alex",
    isUrgent: false,
    isChecked: false,
  },
  {
    id: 3,
    name: "Eggs",
    count: 12,
    addedBy: "Jordan",
    isUrgent: false,
    isChecked: true,
  },
  {
    id: 4,
    name: "Cheese",
    count: 1,
    addedBy: "Chris",
    isUrgent: false,
    isChecked: false,
  },
  {
    id: 5,
    name: "Fruits",
    count: 5,
    addedBy: "Taylor",
    isUrgent: true,
    isChecked: false,
  },
];

export default function GroceriesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [groceries, setGroceries] = useState<GroceryItem[]>(initialGroceries);

  const handleToggleItem = (itemId: number) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isChecked: !item.isChecked }
          : item
      )
    );
  };

  const handleIncrement = (itemId: number) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, count: item.count + 1 }
          : item
      )
    );
  };

  const handleDecrement = (itemId: number) => {
    setGroceries((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, count: Math.max(1, item.count - 1) }
          : item
      )
    );
  };

  const handleCountChange = (itemId: number, value: string) => {
    const parsed = parseInt(value, 10);

    setGroceries((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
            ...item,
            count:
              Number.isNaN(parsed) || parsed < 1
                ? 1
                : parsed,
          }
          : item
      )
    );
  };

  const handleDeleteSelected = () => {
    setGroceries((prev) => prev.filter((item) => !item.isChecked));
  };

  const selectedCount = useMemo(
    () => groceries.filter((item) => item.isChecked).length,
    [groceries]
  );

  const hasSelectedItems = selectedCount > 0;

  return (
    <View
      style={[
        styles.page,
        {
          flexDirection: isMobile ? "column" : "row",
          backgroundColor: colors.background,
        },
      ]}
    >
      {!isMobile && (
        <Sidebar
          items={[
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox" },
            { id: "expenses", label: "Expenses", icon: "receipt" },
            { id: "groceries", label: "Groceries", icon: "cart", active: true },
            { id: "chat", label: "Chat", icon: "chatbubble" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar />
        <View
          style={{ flex: 1, padding: 24, backgroundColor: colors.background }}></View>

        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            isMobile && styles.mobileContentContainer,
          ]}
          showsVerticalScrollIndicator={false}
        >
          // Header with title, subtitle, and delete button
          <View style={styles.headerBlock}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Groceries</Text>
                <Text style={styles.subtitle}>
                  Keep track of what the house needs
                </Text>
              </View>

              <View style={styles.deleteButtonSlot}>
                {hasSelectedItems ? (
                  <Pressable
                    style={styles.deleteButton}
                    onPress={handleDeleteSelected}
                  >
                    <Text style={styles.deleteButtonText}>
                      Remove Selected ({selectedCount})
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>

          <SearchBar onAdd={(text) => console.log("Add item:", text)} />

          // List of grocery items
          <View style={styles.list}>
            {groceries.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <ItemCard
                  name={item.name}
                  count={item.count}
                  addedBy={item.addedBy}
                  avatarUrl={`https://i.pravatar.cc/150?u=${item.id}`}
                  isUrgent={item.isUrgent}
                  isChecked={item.isChecked}
                  onToggle={() => handleToggleItem(item.id)}
                  onIncrement={() => handleIncrement(item.id)}
                  onDecrement={() => handleDecrement(item.id)}
                  onCountChange={(value) => handleCountChange(item.id, value)}
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart", active: true },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  mainColumn: {
    flex: 1,
    flexDirection: "column",
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 32,
  },
  mobileContentContainer: {
    paddingBottom: 100,
  },

  headerBlock: {
    marginBottom: 20,
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#18181b",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#71717a",
  },

  deleteButtonSlot: {
    minHeight: 44,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    minWidth: 190,
  },

  deleteButton: {
    backgroundColor: "#FDE7DF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  deleteButtonText: {
    color: "#C16D4F",
    fontWeight: "700",
    fontSize: 14,
  },

  list: {
    marginTop: 18,
  },

  cardWrapper: {
    marginBottom: 12,
  },
});