import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useChat } from "@/hooks/use-chat";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export type Tab = "household" | "direct";

export default function ChatPage() {
  const router = useRouter();
  const isMobile = useWindowDimensions().width < 768;
  const { user } = useAuthContext();

  const { householdId } = useLocalSearchParams<{ householdId: string }>();
  if (!householdId) return null;

  const {
    messages,
    isLoading,
    currentConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getOrCreateHouseholdChat,
    getOrCreate1on1,
  } = useChat();

  const [activeTab, setActiveTab] = useState<Tab>("household");
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [otherProfiles, setOtherProfiles] = useState<any[]>([]);

  // Initialize household chat on mount
  useEffect(() => {
    if (!user?.id) return;

    const initHouseholdChat = async () => {
      try {
        const convId = await getOrCreateHouseholdChat(user.id);
        await fetchMessages(convId);
      } catch (error) {
        console.error("Error initializing household chat:", error);
      }
    };

    initHouseholdChat();
    fetchConversations(user.id);
  }, [user?.id]);

  // Fetch other household members for 1-on-1 chats
  useEffect(() => {
    if (!user?.id) return;

    const fetchOtherMembers = async () => {
      try {
        const { data } = await supabase
          .from("profile")
          .select("*")
          .neq("id", user.id);

        setOtherProfiles(data || []);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchOtherMembers();
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id || !currentConversationId) {
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(currentConversationId, user.id, messageText);
      setMessageText("");
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handle1on1Chat = async (otherUserId: string) => {
    if (!user?.id) return;

    try {
      const convId = await getOrCreate1on1(user.id, otherUserId);
      await fetchMessages(convId);
      setActiveTab("direct");
    } catch (error) {
      Alert.alert("Error", "Failed to open conversation");
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isOwn = item.sender_id === user?.id;

    return (
      <View
        style={{
          flexDirection: "row",
          marginBottom: 12,
          justifyContent: isOwn ? "flex-end" : "flex-start",
          paddingHorizontal: 16,
        }}
      >
        {!isOwn && (
          <>
            {item.sender?.profile_pic_url ? (
              <Image
                source={{ uri: item.sender.profile_pic_url }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  marginRight: 8,
                }}
              />
            ) : (
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <ThemedText style={{ fontSize: 12, fontWeight: "bold" }}>
                  {item.sender?.name?.charAt(0).toUpperCase() || "?"}
                </ThemedText>
              </View>
            )}
          </>
        )}

        <View
          style={{
            maxWidth: "70%",
            backgroundColor: isOwn ? colors.primary : colors.surfaceSoft,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {!isOwn && (
            <ThemedText
              style={{ fontSize: 12, fontWeight: "600", marginBottom: 4 }}
            >
              {item.sender?.name || "Unknown"}
            </ThemedText>
          )}
          <ThemedText
            style={{
              color: isOwn ? "white" : colors.text,
              fontSize: 14,
            }}
          >
            {item.content}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 10,
              color: isOwn ? "rgba(255,255,255,0.7)" : colors.textMuted,
              marginTop: 4,
            }}
          >
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </ThemedText>
        </View>
      </View>
    );
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
            { id: "activity", label: "Activity", icon: "list" },
            { id: "chores", label: "Chores", icon: "checkbox" },
            { id: "expenses", label: "Expenses", icon: "receipt" },
            { id: "groceries", label: "Groceries", icon: "cart" },
            { id: "chat", label: "Chat", icon: "chatbubble", active: true },
            { id: "household", label: "My Household", icon: "home" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/households")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar />

        <View style={{ flex: 1, flexDirection: "row" }}>
          {/* Conversations List */}
          {!isMobile && (
            <View
              style={{
                width: 280,
                borderRightWidth: 1,
                borderRightColor: colors.borderSoft,
                backgroundColor: colors.surface,
                flexDirection: "column",
              }}
            >
              {/* Tab selector */}
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setActiveTab("household")}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      activeTab === "household"
                        ? colors.primary
                        : colors.surfaceSoft,
                  }}
                >
                  <ThemedText
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "600",
                      color: activeTab === "household" ? "white" : colors.text,
                    }}
                  >
                    Household
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveTab("direct")}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor:
                      activeTab === "direct"
                        ? colors.primary
                        : colors.surfaceSoft,
                  }}
                >
                  <ThemedText
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: "600",
                      color: activeTab === "direct" ? "white" : colors.text,
                    }}
                  >
                    Direct
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Members list for Direct messages */}
              {activeTab === "direct" && (
                <ScrollView
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                  }}
                >
                  {otherProfiles.map((profile) => (
                    <TouchableOpacity
                      key={profile.id}
                      onPress={() => handle1on1Chat(profile.id)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor: colors.surfaceSoft,
                        marginBottom: 8,
                      }}
                    >
                      {profile.profile_pic_url ? (
                        <Image
                          source={{ uri: profile.profile_pic_url }}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            marginRight: 12,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: colors.primary,
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 12,
                          }}
                        >
                          <ThemedText
                            style={{ fontSize: 14, fontWeight: "bold" }}
                          >
                            {profile.name?.charAt(0).toUpperCase() || "?"}
                          </ThemedText>
                        </View>
                      )}
                      <ThemedText
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: colors.text,
                        }}
                      >
                        {profile.name || "Unknown"}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Chat Area */}
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* Messages */}
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingVertical: 16,
              }}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={48}
                    color={colors.textMuted}
                  />
                  <ThemedText
                    style={{
                      fontSize: 16,
                      color: colors.textMuted,
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    No messages yet. Start a conversation!
                  </ThemedText>
                </View>
              }
              ListFooterComponent={
                isLoading ? <ActivityIndicator size="large" /> : null
              }
            />

            {/* Message Input */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: colors.borderSoft,
                backgroundColor: colors.surface,
              }}
            >
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor={colors.textMuted}
                value={messageText}
                onChangeText={setMessageText}
                style={{
                  flex: 1,
                  borderRadius: 8,
                  backgroundColor: colors.surfaceSoft,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  maxHeight: 100,
                }}
                multiline
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={isSending || !messageText.trim()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  backgroundColor: messageText.trim()
                    ? colors.primary
                    : colors.surfaceSoft,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
              { id: "chat", label: "Chat", icon: "chatbubble", active: true },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}
