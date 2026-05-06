import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender?: {
    name: string;
    profile_pic_url?: string;
  };
};

export type Conversation = {
  id: string;
  household_id?: string;
  type: "household" | "1on1";
  name?: string;
  created_at: string;
};

export type ConversationMember = {
  id: string;
  conversation_id: string;
  user_id: string;
  created_at: string;
};

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
          *,
          conversation_members(user_id)
        `,
        )
        .eq("conversation_members.user_id", userId);

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          profiles!sender_id(name, profile_pic_url)
        `,
        )
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const messagesWithSender = data?.map((msg: any) => ({
        ...msg,
        sender: msg.profiles,
      }));

      setMessages(messagesWithSender || []);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (conversationId: string, senderId: string, content: string) => {
      try {
        const { error } = await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    },
    [],
  );

  // Create or get 1-on-1 conversation
  const getOrCreate1on1 = useCallback(
    async (userId: string, otherUserId: string) => {
      try {
        // Check if conversation already exists
        const { data: existing } = await supabase
          .from("conversations")
          .select("id, type")
          .eq("type", "1on1")
          .eq("household_id", null);

        if (existing) {
          for (const conv of existing) {
            const { data: members } = await supabase
              .from("conversation_members")
              .select("user_id")
              .eq("conversation_id", conv.id);

            if (
              members &&
              members.length === 2 &&
              members.some((m: any) => m.user_id === userId) &&
              members.some((m: any) => m.user_id === otherUserId)
            ) {
              return conv.id;
            }
          }
        }

        // Create new conversation
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .insert({
            type: "1on1",
          })
          .select()
          .single();

        if (convError) throw convError;

        // Add members
        await supabase.from("conversation_members").insert([
          { conversation_id: conversation.id, user_id: userId },
          { conversation_id: conversation.id, user_id: otherUserId },
        ]);

        return conversation.id;
      } catch (error) {
        console.error("Error creating 1-on-1 conversation:", error);
        throw error;
      }
    },
    [],
  );

  // Get or create household conversation
  const getOrCreateHouseholdChat = useCallback(async (userId: string) => {
    try {
      // Check if household conversation exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .eq("type", "household")
        .single();

      if (existing) {
        return existing.id;
      }

      // Create household conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          type: "household",
          name: "Household Chat",
        })
        .select()
        .single();

      if (convError) throw convError;

      // Add current user
      await supabase.from("conversation_members").insert({
        conversation_id: conversation.id,
        user_id: userId,
      });

      return conversation.id;
    } catch (error) {
      console.error("Error creating household chat:", error);
      throw error;
    }
  }, []);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!currentConversationId) return;

    const subscription = supabase
      .channel(`messages:${currentConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${currentConversationId}`,
        },
        (payload) => {
          // Fetch the sender info for the new message
          supabase
            .from("messages")
            .select("*, profiles!sender_id(name, profile_pic_url)")
            .eq("id", payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages((prev) => [
                  ...prev,
                  {
                    ...data,
                    sender: data.profiles,
                  },
                ]);
              }
            });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentConversationId]);

  return {
    conversations,
    messages,
    isLoading,
    currentConversationId,
    fetchConversations,
    fetchMessages,
    sendMessage,
    getOrCreate1on1,
    getOrCreateHouseholdChat,
  };
};
