import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

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
    color: "#A86651",
    progress: 80,
  },
  {
    id: "spent",
    label: "Total Spent",
    value: "$1,240",
    icon: "wallet",
    color: "#B6433C",
  },
];

const MOCK_TASKS: PendingTask[] = [
  { id: "1", title: "Clean the air filter", priority: "high" },
  { id: "2", title: "Trash pickup tomorrow", priority: "medium" },
  { id: "3", title: "Restock bathroom tissue", priority: "medium" },
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
        backgroundColor: "#F6E7E2",
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
              color: "#8D746B",
              marginBottom: 4,
            }}
          >
            {stat.label}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#4A342E",
            }}
          >
            {stat.value}
          </ThemedText>
        </View>
        {stat.icon && (
          <Ionicons
            name={stat.icon as any}
            size={32}
            color={stat.color || "#A86651"}
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
            backgroundColor: "#D8C0B7",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${stat.progress}%`,
              backgroundColor: "#A86651",
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
    high: "#B6433C",
    medium: "#E8C66A",
    low: "#7A8A4A",
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
        backgroundColor: "#F6E7E2",
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
            color: "#4A342E",
          }}
        >
          {task.title}
        </ThemedText>
        {task.dueDate && (
          <ThemedText
            style={{
              fontSize: 12,
              color: "#8D746B",
            }}
          >
            {task.dueDate}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity>
        <Ionicons name="chevron-forward" size={16} color="#A86651" />
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
        borderLeftColor: "#D8C0B7",
        backgroundColor: "#EEDBD5",
        padding: 16,
      }}
    >
      <ThemedText
        style={{
          marginBottom: 16,
          fontSize: 18,
          fontWeight: "bold",
          color: "#4A342E",
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
              color: "#4A342E",
            }}
          >
            Pending Tasks
          </ThemedText>
          <TouchableOpacity onPress={onViewMore}>
            <ThemedText
              style={{
                fontSize: 12,
                color: "#A86651",
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
    </View>
  );
}
