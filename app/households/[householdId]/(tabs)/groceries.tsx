import {
  createGroceryItem,
  createGroceryList,
  deleteGroceryItem,
  getFullGroceryListsByHousehold,
  updateGroceryItem,
} from "@/api/groceries";

import RightPanel from "@/components/dashboard/RightPanel";
import ItemCard from "@/components/groceries/ItemCard";
import SearchBar from "@/components/groceries/SearchBar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { colors } from "@/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";
import { useAuthContext } from "@/hooks/use-auth-context";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

type GroceryItem = {
  groceryItemId: number;
  itemName: string;
  purchased: boolean;
};

type GroceryList = {
  groceryListId: number;
  listName: string;
  profileId?: number;
  profileName?: string;
  householdId?: number;
  householdName?: string;
  groceryItems?: GroceryItem[];
};

// const initialGroceries: GroceryItem[] = [
//   {
//     id: 1,
//     name: "Milk",
//     count: 2,
//     addedBy: "Maya",
//     isUrgent: true,
//     isChecked: false,
//   },
//   {
//     id: 2,
//     name: "Bread",
//     count: 1,
//     addedBy: "Alex",
//     isUrgent: false,
//     isChecked: false,
//   },
//   {
//     id: 3,
//     name: "Eggs",
//     count: 12,
//     addedBy: "Jordan",
//     isUrgent: false,
//     isChecked: true,
//   },
//   {
//     id: 4,
//     name: "Cheese",
//     count: 1,
//     addedBy: "Chris",
//     isUrgent: false,
//     isChecked: false,
//   },
//   {
//     id: 5,
//     name: "Fruits",
//     count: 5,
//     addedBy: "Taylor",
//     isUrgent: true,
//     isChecked: false,
//   },
// ];

export default function GroceriesPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [groceryListId, setGroceryListId] = useState<number | null>(null);
  const [groceries, setGroceries] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthContext();
  const profileId = profile?.profileId;

  async function refreshGroceries() {
    if (!householdId) return;

    try {
      setLoading(true);

      const lists: GroceryList[] = await getFullGroceryListsByHousehold(
        householdId
      );

      let list = lists?.[0];

      // CHANGE: create default list if household has none
      if (!list) {
        list = await createGroceryList({
          listName: "Household Groceries",
          profileId,
          householdId: Number(householdId),
        });
      }

      setGroceryListId(list.groceryListId);
      setGroceries(list.groceryItems ?? []);
    } catch (err) {
      console.error("Failed to load groceries", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshGroceries();
  }, [householdId]);

  async function handleAddItem(text: string) {
    if (!text.trim() || !groceryListId) return;

    try {
      await createGroceryItem({
        itemName: text.trim(),
        isPurchased: false,
        profileId,
        groceryListId,
      });

      refreshGroceries();
    } catch (err) {
      console.error("Failed to add grocery item", err);
    }
  }


  async function handleToggleItem(item: GroceryItem) {
    try {
      await updateGroceryItem(item.groceryItemId, {
        ...item,
        isPurchased: !item.purchased,
      });

      setGroceries((prev) =>
        prev.map((grocery) =>
          grocery.groceryItemId === item.groceryItemId
            ? { ...grocery, purchased: !grocery.purchased }
            : grocery
        )
      );
    } catch (err) {
      console.error("Failed to update grocery item", err);
    }
  }

  async function handleIncrement(item: GroceryItem) {
    const nextQuantity = item.quantity + 1;

    try {
      await updateGroceryItem(item.groceryItemId, {
        ...item,
        quantity: nextQuantity,
      });

      setGroceries((prev) =>
        prev.map((grocery) =>
          grocery.groceryItemId === item.groceryItemId
            ? { ...grocery, quantity: nextQuantity }
            : grocery
        )
      );
    } catch (err) {
      console.error("Failed to increment grocery item", err);
    }
  }

  async function handleDecrement(item: GroceryItem) {
    const nextQuantity = Math.max(1, item.quantity - 1);

    try {
      await updateGroceryItem(item.groceryItemId, {
        ...item,
        quantity: nextQuantity,
      });

      setGroceries((prev) =>
        prev.map((grocery) =>
          grocery.groceryItemId === item.groceryItemId
            ? { ...grocery, quantity: nextQuantity }
            : grocery
        )
      );
    } catch (err) {
      console.error("Failed to decrement grocery item", err);
    }
  }

  async function handleCountChange(item: GroceryItem, value: string) {
    const parsed = parseInt(value, 10);
    const nextQuantity = Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;

    try {
      await updateGroceryItem(item.groceryItemId, {
        ...item,
        quantity: nextQuantity,
      });

      setGroceries((prev) =>
        prev.map((grocery) =>
          grocery.groceryItemId === item.groceryItemId
            ? { ...grocery, quantity: nextQuantity }
            : grocery
        )
      );
    } catch (err) {
      console.error("Failed to update grocery quantity", err);
    }
  }

  async function handleDeleteSelected() {
    const selectedItems = groceries.filter((item) => item.purchased);

    try {
      await Promise.all(
        selectedItems.map((item) => deleteGroceryItem(item.groceryItemId))
      );

      setGroceries((prev) => prev.filter((item) => !item.isPurchased));
    } catch (err) {
      console.error("Failed to delete selected grocery items", err);
    }
  }

  const selectedCount = groceries.filter(item => item.purchased).length;

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
            { id: "household", label: "My Household", icon: "home" },
          ]}
          householdId={householdId}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{ flex: 1, padding: 24, backgroundColor: colors.background }}></View>

        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            isMobile && styles.mobileContentContainer,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with title, subtitle, and delete button */}
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
          {/* Using SearchBar adds grocery item */}
          <SearchBar onAdd={handleAddItem} />

          {/*  List of grocery items */}
          <View style={styles.list}>
            {loading ? (
              <Text style={styles.emptyText}>Loading groceries...</Text>
            ) : groceries.length === 0 ? (
              <Text style={styles.emptyText}>
                No grocery items yet. Add one above.
              </Text>
            ) : (
              groceries.map((item) => (
                <View key={item.groceryItemId} style={styles.cardWrapper}>
                  <ItemCard
                    name={item.itemName}
                    count={1} // ❗ no quantity exists yet
                    addedBy="You" // ❗ no profile info returned
                    avatarUrl={`https://i.pravatar.cc/150?u=${item.groceryItemId}`}
                    isUrgent={false} // ❗ not in backend
                    isChecked={item.purchased}
                    onToggle={() => handleToggleItem(item)}
                  />
                </View>
              ))
            )}
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
  emptyText: {
    color: "#71717a",
    fontSize: 14,
    marginTop: 16,
  },
});