import { getHouseholdWithProfiles } from "@/api/households";
import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useChat } from "@/hooks/use-chat";
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
  const [householdMembers, setHouseholdMembers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMemberList, setShowMemberList] = useState(false);

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

  // Fetch household members (not all users)
  useEffect(() => {
    if (!user?.id || !householdId) return;

    const fetchHouseholdMembers = async () => {
      try {
        const members = await getHouseholdWithProfiles(householdId);
        // Filter out current user
        const otherMembers = members.filter(
          (profile: any) => profile.id !== user.id,
        );
        setHouseholdMembers(otherMembers);
      } catch (error) {
        console.error("Error fetching household members:", error);
      }
    };

    fetchHouseholdMembers();
  }, [user?.id, householdId]);

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
        <Topbar householdId={householdId} />

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
                <View style={{ flex: 1, flexDirection: "column" }}>
                  {/* Search Bar */}
                  <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: colors.surfaceSoft,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        gap: 8,
                      }}
                    >
                      <Ionicons
                        name="search"
                        size={18}
                        color={colors.textMuted}
                      />
                      <TextInput
                        style={{
                          flex: 1,
                          paddingVertical: 8,
                          color: colors.text,
                          fontSize: 14,
                        }}
                        placeholder="Search members..."
                        placeholderTextColor={colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                      />
                    </View>
                  </View>

                  {/* Members List */}
                  <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                    {householdMembers
                      .filter((profile) =>
                        profile.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((profile) => (
                        <TouchableOpacity
                          key={profile.id}
                          onPress={() => {
                            handle1on1Chat(profile.id);
                            setSearchQuery("");
                          }}
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
                          {profile.profilePicUrl ? (
                            <Image
                              source={{ uri: profile.profilePicUrl }}
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
                                style={{
                                  fontSize: 14,
                                  fontWeight: "bold",
                                  color: "white",
                                }}
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
                    {householdMembers.filter((profile) =>
                      profile.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    ).length === 0 && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingVertical: 24,
                        }}
                      >
                        <ThemedText
                          style={{
                            fontSize: 14,
                            color: colors.textMuted,
                          }}
                        >
                          {searchQuery
                            ? "No members found"
                            : "No other members in household"}
                        </ThemedText>
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}
            </View>
          )}

          {/* Chat Area */}
          <View style={{ flex: 1, flexDirection: "column" }}>
            {/* Mobile Tab Selector */}
            {isMobile && (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  gap: 8,
                  backgroundColor: colors.surface,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.borderSoft,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setActiveTab("household");
                    setShowMemberList(false);
                  }}
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
            )}

            {/* Mobile Member List View */}
            {isMobile && activeTab === "direct" && showMemberList ? (
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.surface,
                  flexDirection: "column",
                }}
              >
                {/* Back Button */}
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderSoft,
                  }}
                >
                  <TouchableOpacity onPress={() => setShowMemberList(false)}>
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: colors.surfaceSoft,
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name="search"
                      size={18}
                      color={colors.textMuted}
                    />
                    <TextInput
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        color: colors.text,
                        fontSize: 14,
                      }}
                      placeholder="Search members..."
                      placeholderTextColor={colors.textMuted}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </View>
                </View>

                {/* Members List */}
                <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                  {householdMembers
                    .filter((profile) =>
                      profile.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                    )
                    .map((profile) => (
                      <TouchableOpacity
                        key={profile.id}
                        onPress={() => {
                          handle1on1Chat(profile.id);
                          setSearchQuery("");
                          setShowMemberList(false);
                        }}
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
                        {profile.profilePicUrl ? (
                          <Image
                            source={{ uri: profile.profilePicUrl }}
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
                              style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "white",
                              }}
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
              </View>
            ) : (
              <>
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
                    alignItems: "flex-end",
                    gap: 8,
                    padding: 16,
                    borderTopWidth: 1,
                    borderTopColor: colors.borderSoft,
                    backgroundColor: colors.surface,
                  }}
                >
                  {isMobile && activeTab === "direct" && (
                    <TouchableOpacity
                      onPress={() => setShowMemberList(true)}
                      style={{
                        padding: 8,
                      }}
                    >
                      <Ionicons
                        name="person-add"
                        size={24}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  )}
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
              </>
            )}
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
