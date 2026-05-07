import { getAllActivities } from "@/api/activities";
import { colors } from "@/constants/colors";
import { useHouseholdContext } from "@/hooks/use-household-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface Activity {
  activityId: string;
  activityType: number;
  isCompleted: boolean;
  profile: {
    name: string;
    profilePicUrl?: string;
  };
  postComment?: string;
  picUrl?: string;
  activityComments: any[];
  activityReactions: any[];
  createdAt?: string;
}

const ACTIVITY_LABELS: Record<number, (name: string) => string> = {
  1: (name) => `${name} completed a chore!`,
  2: (name) => `${name} created a new chore.`,
  3: (name) => `${name} created an expense.`,
  4: (name) => `${name} paid a bill!`,
  5: (name) => `${name} joined the household!`,
  6: (name) => `${name} left the household.`,
};

const ACTIVITY_ICONS: Record<number, { name: string; color: string }> = {
  1: { name: "checkmark-circle", color: colors.success },
  2: { name: "add-circle", color: colors.primary },
  3: { name: "receipt", color: colors.warning },
  4: { name: "cash", color: colors.success },
  5: { name: "person-add", color: colors.primary },
  6: { name: "person-remove", color: colors.danger },
};

function ActivityCard({ activity }: { activity: Activity }) {
  const label = ACTIVITY_LABELS[activity.activityType]?.(activity.profile?.name ?? 'Someone') ?? 'Something happened.';
  const icon = ACTIVITY_ICONS[activity.activityType] ?? { name: "ellipse", color: colors.textMuted };

  return (
    <View
      style={{
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        backgroundColor: colors.surface,
        padding: 16,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
        {activity.profile?.profilePicUrl ? (
          <Image
            source={{ uri: activity.profile.profilePicUrl }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceSoft,
              borderWidth: 1,
              borderColor: colors.borderSoft,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontWeight: "600", color: colors.primary }}>
              {activity.profile?.name?.charAt(0).toUpperCase() ?? "?"}
            </ThemedText>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name={icon.name as any} size={16} color={icon.color} />
            <ThemedText style={{ fontWeight: "600", color: colors.text, fontSize: 14 }}>
              {label}
            </ThemedText>
          </View>
          {activity.createdAt && (
            <ThemedText style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
              {new Date(activity.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </ThemedText>
          )}
        </View>
      </View>

      {/* Optional comment */}
      {activity.postComment && (
        <ThemedText style={{ fontSize: 14, color: colors.text, marginBottom: 10 }}>
          {activity.postComment}
        </ThemedText>
      )}

      {/* Optional image */}
      {activity.picUrl && (
        <Image
          source={{ uri: activity.picUrl }}
          style={{
            height: 180,
            width: "100%",
            borderRadius: 8,
            backgroundColor: colors.surfaceSoft,
            marginBottom: 10,
          }}
        />
      )}

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          gap: 20,
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
          paddingTop: 10,
          marginTop: 4,
        }}
      >
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="heart-outline" size={18} color={colors.textMuted} />
          <ThemedText style={{ fontSize: 13, color: colors.textMuted }}>
            {activity.activityReactions?.length ?? 0}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
          <ThemedText style={{ fontSize: 13, color: colors.textMuted }}>
            {activity.activityComments?.length ?? 0}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FeedList() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { household } = useHouseholdContext();

  useEffect(() => {
    if (!household?.householdId) return;

    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await getAllActivities(household.householdId);
        setActivities(data ?? []);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [household?.householdId]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText style={{ color: colors.textMuted }}>Loading activity...</ThemedText>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
        <Ionicons name="newspaper-outline" size={40} color={colors.borderSoft} />
        <ThemedText style={{ color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
          No activity yet. Complete chores, pay bills, or invite members to get started!
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      {activities.map((activity) => (
        <ActivityCard key={activity.activityId} activity={activity} />
      ))}
    </ScrollView>
  );
}