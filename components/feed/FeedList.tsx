import {
  getActivityReactions,
  getHouseholdPosts,
  likePost,
  unlikePost,
} from "@/api/posts";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../themed-text";

export interface FeedPost {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  image?: string;
  timestamp: string;
  likes?: number;
  comments?: number;
  shares?: number;
  tags?: string[];
  liked?: boolean;
  userReactionId?: string; // ID of user's like reaction (if liked)
}

interface FeedListProps {
  householdId: string;
  posts?: FeedPost[];
  onPostPress?: (id: string) => void;
  onLike?: (id: string) => void;
  isLoading?: boolean;
  refreshTrigger?: number;
  useMockData?: boolean;
}

function FeedPostCard({
  post,
  onLike,
  profileId,
}: {
  post: FeedPost;
  onLike?: (id: string, liked: boolean) => void;
  profileId?: string;
}) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [userReactionId, setUserReactionId] = useState(post.userReactionId);

  const handleLike = async () => {
    try {
      if (liked && userReactionId) {
        await unlikePost(userReactionId);
        setLikes((prev) => Math.max(0, prev - 1));
        setUserReactionId(undefined);
      } else {
        const response = await likePost(post.id, profileId || "");
        setLikes((prev) => prev + 1);
        // Store the reaction ID returned from the API
        if (response?.id) {
          setUserReactionId(response.id);
        }
      }
      setLiked(!liked);
      onLike?.(post.id, !liked);
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like");
    }
  };
  return (
    <View
      style={{
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.borderSoft,
        backgroundColor: colors.surface,
        padding: 16,
      }}
    >
      {/* Header */}
      <View
        style={{
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            flex: 1,
          }}
        >
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 20,
              backgroundColor: colors.primary,
            }}
          />
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontWeight: "600",
                color: colors.text,
              }}
            >
              {post.author}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: colors.textMuted,
              }}
            >
              {post.timestamp}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ThemedText
        style={{
          marginBottom: 12,
          color: colors.text,
        }}
      >
        {post.content}
      </ThemedText>

      {/* Image */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          style={{
            marginBottom: 12,
            height: 192,
            width: "100%",
            borderRadius: 8,
            backgroundColor: colors.surfaceSoft,
          }}
        />
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View
          style={{
            marginBottom: 12,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {post.tags.map((tag) => (
            <View
              key={tag}
              style={{
                borderRadius: 16,
                backgroundColor: colors.surfaceSoft,
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: colors.text,
                }}
              >
                {tag}
              </ThemedText>
            </View>
          ))}
        </View>
      )}

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderTopColor: colors.borderSoft,
          paddingTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleLike}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? "#e74c3c" : colors.primary}
          />
          <ThemedText
            style={{
              fontSize: 14,
              color: colors.textMuted,
            }}
          >
            {likes}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={colors.primary}
          />
          {post.comments !== undefined && (
            <ThemedText
              style={{
                fontSize: 14,
                color: colors.textMuted,
              }}
            >
              {post.comments}
            </ThemedText>
          )}
        </TouchableOpacity>
        {/* Share button commented out for now - not needed in first version */}
        {/* <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons
            name="share-social-outline"
            size={18}
            color={colors.primary}
          />
          {post.shares !== undefined && (
            <ThemedText
              style={{
                fontSize: 14,
                color: colors.textMuted,
              }}
            >
              {post.shares}
            </ThemedText>
          )}
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

export default function FeedList({
  householdId,
  posts: initialPosts,
  onPostPress,
  isLoading: externalIsLoading,
  refreshTrigger,
  useMockData = false,
}: FeedListProps) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      if (!householdId) return;

      setIsLoading(true);
      try {
        console.log("Fetching posts for household:", householdId);
        const fetchedPosts = await getHouseholdPosts(householdId);
        console.log("Fetched posts:", fetchedPosts);

        if (Array.isArray(fetchedPosts) && fetchedPosts.length > 0) {
          // Fetch reactions for each post to check if user has liked it
          const postsWithReactions = await Promise.all(
            fetchedPosts.map(async (post) => {
              try {
                const reactions = await getActivityReactions(post.id);
                // Find if current user has a like reaction
                const userLike = Array.isArray(reactions)
                  ? reactions.find(
                      (r) =>
                        r.profileId === profile?.id ||
                        r.profileId === profile?.profileId,
                    )
                  : null;

                return {
                  ...post,
                  liked: !!userLike,
                  userReactionId: userLike?.id,
                };
              } catch (error) {
                console.error(
                  `Error fetching reactions for post ${post.id}:`,
                  error,
                );
                return post;
              }
            }),
          );
          setPosts(postsWithReactions);
        } else {
          console.log("No posts returned from API, using empty array");
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to empty array on error
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [
    householdId,
    refreshTrigger,
    useMockData,
    profile?.id,
    profile?.profileId,
  ]);

  const handleLike = async (postId: string, liked: boolean) => {
    // Update local state
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, liked } : post)),
    );
  };

  if (externalIsLoading || isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <ScrollView
        style={{
          flex: 1,
          padding: 16,
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 40,
          }}
        >
          <Ionicons
            name="chatbubbles-outline"
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
            No posts yet. Be the first to share something!
          </ThemedText>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      {posts.map((post) => (
        <TouchableOpacity key={post.id} onPress={() => onPostPress?.(post.id)}>
          <FeedPostCard
            post={post}
            onLike={handleLike}
            profileId={profile?.profileId?.toString()}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
