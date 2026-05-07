import { colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface CalendarEvent {
  date: number;
  title: string;
  color?: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDatePress?: (date: number) => void;
}

export default function Calendar({ events = [], onDatePress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();

    // Create array of days (with empty slots for days before month starts)
    const days: number[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }

    setDaysInMonth(days);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const getEventForDate = (date: number) => {
    return events.find((e) => e.date === date);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.borderSoft,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <TouchableOpacity onPress={handlePrevMonth}>
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </TouchableOpacity>

        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.text,
          }}
        >
          {monthName}
        </ThemedText>

        <TouchableOpacity onPress={handleNextMonth}>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View
        style={{
          flexDirection: "row",
          marginBottom: 8,
          gap: 2,
        }}
      >
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <View
            key={day}
            style={{
              flex: 1,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ThemedText
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: colors.textMuted,
              }}
            >
              {day}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={{ gap: 4 }}>
        {Array.from({ length: 6 }).map((_, week) => {
          const weekDays = [...daysInMonth.slice(week * 7, (week + 1) * 7)];
          while (weekDays.length < 7) {
            weekDays.push(0);
          }
          return (
            <View
              key={week}
              style={{
                flexDirection: "row",
                gap: 2,
              }}
            >
              {weekDays.map((day, index) => {
                const event = getEventForDate(day);
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => day > 0 && onDatePress?.(day)}
                    style={{
                      flex: 1,
                      height: 32,
                      borderRadius: 6,
                      backgroundColor: isToday
                        ? colors.primary
                        : event
                          ? colors.primary + "20"
                          : colors.surfaceSoft,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: isToday ? 0 : 1,
                      borderColor: event ? colors.primary : "transparent",
                    }}
                  >
                    {day > 0 && (
                      <ThemedText
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: isToday ? "white" : colors.text,
                        }}
                      >
                        {day}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* Events legend */}
      {events.length > 0 && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: colors.borderSoft,
          }}
        >
          {events.slice(0, 2).map((event, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: event.color || colors.primary,
                  marginRight: 8,
                }}
              />
              <ThemedText
                style={{
                  fontSize: 10,
                  color: colors.textMuted,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {event.date} • {event.title}
              </ThemedText>
            </View>
          ))}
          {events.length > 2 && (
            <ThemedText
              style={{
                fontSize: 9,
                color: colors.primary,
                fontWeight: "600",
              }}
            >
              +{events.length - 2} more events
            </ThemedText>
          )}
        </View>
      )}
    </View>
  );
}
