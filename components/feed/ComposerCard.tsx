import { createActivity, createPost } from "@/api/posts";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useState } from "react";
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

interface ComposerCardProps {
  householdId: string;
  onPostCreated?: () => void;
}

export default function ComposerCard({
  householdId,
  onPostCreated,
}: ComposerCardProps) {
  const { profile } = useAuthContext();
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  const availableTags = [
    "Chores",
    "Expenses",
    "Groceries",
    "General",
    "Announcement",
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert("Error", "Please enter some content");
      return;
    }

    if (!profile?.profileId) {
      Alert.alert("Error", "User profile not found");
      return;
    }

    console.log("[ComposerCard] Post data:", {
      householdId,
      profileId: profile.profileId,
      content: content.trim(),
    });

    setIsPosting(true);
    try {
      // Step 1: Create the Activity placeholder
      console.log("[ComposerCard] Creating activity first...");
      const activityResult = await createActivity(profile.profileId);
      console.log("[ComposerCard] Activity created:", activityResult);

      if (!activityResult?.activityId) {
        throw new Error("Failed to create activity - no activityId returned");
      }

      // Step 2: Create the comment with the post content
      console.log("[ComposerCard] Creating post comment...");
      const commentResult = await createPost(
        activityResult.activityId,
        profile.profileId,
        content.trim(),
      );
      console.log("[ComposerCard] Post comment created:", commentResult);

      setContent("");
      setSelectedTags([]);
      Alert.alert("Success", "Post created!");
      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post: " + JSON.stringify(error));
    } finally {
      setIsPosting(false);
    }
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
      {/* User Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            overflow: "hidden",
          }}
        >
          {profile?.profilePicUrl ? (
            <Image
              source={{ uri: profile.profilePicUrl }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : null}
        </View>
        <ThemedText
          style={{ fontWeight: "600", fontSize: 14, color: colors.text }}
        >
          {profile?.name || "Your Name"}
        </ThemedText>
      </View>

      {/* Text Input */}
      <TextInput
        style={{
          backgroundColor: colors.surfaceSoft,
          borderRadius: 8,
          padding: 12,
          color: colors.text,
          fontSize: 14,
          minHeight: 80,
          textAlignVertical: "top",
          marginBottom: 12,
        }}
        placeholder="What's happening in the household?"
        placeholderTextColor={colors.textMuted}
        multiline
        value={content}
        onChangeText={setContent}
        editable={!isPosting}
      />

      {/* Tags */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {availableTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={{
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: selectedTags.includes(tag)
                ? colors.primary
                : colors.surfaceSoft,
              borderWidth: selectedTags.includes(tag) ? 0 : 1,
              borderColor: colors.borderSoft,
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: selectedTags.includes(tag) ? "white" : colors.text,
              }}
            >
              {tag}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={handlePost}
          disabled={isPosting}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingHorizontal: 20,
            paddingVertical: 10,
            opacity: isPosting ? 0.6 : 1,
          }}
        >
          <ThemedText
            style={{
              fontWeight: "600",
              color: "white",
              fontSize: 14,
            }}
          >
            {isPosting ? "Posting..." : "Post"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
