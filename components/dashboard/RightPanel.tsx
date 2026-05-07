import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import Calendar from "./Calendar";

export interface HouseholdStat {
  id: string;
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  progress?: number;
}

export interface PendingTask {
  id: string;
  title: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
}

interface RightPanelProps {
  stats?: HouseholdStat[];
  tasks?: PendingTask[];
  onStatPress?: (id: string) => void;
  onTaskPress?: (id: string) => void;
  onViewMore?: () => void;
}

const MOCK_STATS: HouseholdStat[] = [
  {
    id: "chores",
    label: "Chores Done",
    value: "24/30",
    icon: "checkmark-circle",
    color: colors.primary,
    progress: 80,
  },
  {
    id: "spent",
    label: "Total Spent",
    value: "$1,240",
    icon: "wallet",
    color: colors.danger,
  },
];

const MOCK_TASKS: PendingTask[] = [
  { id: "1", title: "Clean the air filter", priority: "high" },
  { id: "2", title: "Trash pickup tomorrow", priority: "medium" },
  { id: "3", title: "Restock bathroom tissue", priority: "medium" },
];

const MOCK_EVENTS = [
  { date: 7, title: "Internet Bill/Aug 7", color: colors.warning },
  { date: 24, title: "Sarah's Birthday/Aug 24", color: colors.primary },
];

function StatCard({
  stat,
  onPress,
}: {
  stat: HouseholdStat;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 12,
        borderRadius: 8,
        backgroundColor: colors.surfaceSoft,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{
              fontSize: 12,
              color: colors.textMuted,
              marginBottom: 4,
            }}
          >
            {stat.label}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.text,
            }}
          >
            {stat.value}
          </ThemedText>
        </View>
        {stat.icon && (
          <Ionicons
            name={stat.icon as any}
            size={32}
            color={stat.color || colors.primary}
          />
        )}
      </View>
      {stat.progress !== undefined && (
        <View
          style={{
            marginTop: 8,
            height: 8,
            width: "100%",
            borderRadius: 4,
            backgroundColor: colors.borderSoft,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${stat.progress}%`,
              backgroundColor: colors.primary,
              borderRadius: 4,
            }}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

function TaskItem({
  task,
  onPress,
}: {
  task: PendingTask;
  onPress?: () => void;
}) {
  const priorityColor = {
    high: colors.danger,
    medium: colors.warning,
    low: colors.success,
  }[task.priority || "medium"];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        borderRadius: 8,
        backgroundColor: colors.surfaceSoft,
        padding: 12,
      }}
    >
      <View
        style={{
          marginTop: 4,
          height: 8,
          width: 8,
          borderRadius: 4,
          backgroundColor: priorityColor,
        }}
      />
      <View style={{ flex: 1 }}>
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: colors.text,
          }}
        >
          {task.title}
        </ThemedText>
        {task.dueDate && (
          <ThemedText
            style={{
              fontSize: 12,
              color: colors.textMuted,
            }}
          >
            {task.dueDate}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity>
        <Ionicons name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function RightPanel({
  stats = MOCK_STATS,
  tasks = MOCK_TASKS,
  onStatPress,
  onTaskPress,
  onViewMore,
}: RightPanelProps) {
  return (
    <View
      style={{
        width: 256,
        borderLeftWidth: 1,
        borderLeftColor: colors.borderSoft,
        backgroundColor: colors.surface,
        height: "100%",
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 16 }}
      >
        <ThemedText
          style={{
            marginBottom: 16,
            fontSize: 18,
            fontWeight: "bold",
            color: colors.text,
          }}
        >
          Household Stats
        </ThemedText>

        <View style={{ marginBottom: 24 }}>
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              stat={stat}
              onPress={() => onStatPress?.(stat.id)}
            />
          ))}
        </View>

        {/* Calendar */}
        <Calendar events={MOCK_EVENTS} />

        <View>
          <View
            style={{
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ThemedText
              style={{
                fontWeight: "600",
                color: colors.text,
              }}
            >
              Pending Tasks
            </ThemedText>
            <TouchableOpacity onPress={onViewMore}>
              <ThemedText
                style={{
                  fontSize: 12,
                  color: colors.primary,
                }}
              >
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onPress={() => onTaskPress?.(task.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
