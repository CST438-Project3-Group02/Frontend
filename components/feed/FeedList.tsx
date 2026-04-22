import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
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
}

interface FeedListProps {
  posts?: FeedPost[];
  onPostPress?: (id: string) => void;
  onLike?: (id: string) => void;
  isLoading?: boolean;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    author: "Sarah Jenkins",
    content:
      "Just finished the deep clean of the living room 🎉 It's so much lighter in here now! Who's up for pizza tonight to celebrate?",
    image: "https://via.placeholder.com/400x300?text=Living+Room",
    timestamp: "1h ago",
    likes: 12,
    comments: 3,
    shares: 1,
    tags: ["Chores", "Clean"],
  },
  {
    id: "2",
    author: "Marcus Thorne",
    content: "Added Household Bill",
    timestamp: "3h ago",
    likes: 5,
    comments: 1,
    tags: ["Expenses"],
  },
  {
    id: "3",
    author: "Elena Rodriguez",
    content:
      "Just added these to the groceries list. We were out of the good coffee! ☕",
    timestamp: "5h ago",
    likes: 8,
    comments: 2,
    tags: ["Groceries", "Needed"],
  },
];

function FeedPostCard({
  post,
  onLike,
}: {
  post: FeedPost;
  onLike?: (id: string) => void;
}) {
  return (
    <View
      style={{
        marginBottom: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#D8C0B7",
        backgroundColor: "#EEDBD5",
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
              backgroundColor: "#A86651",
            }}
          />
          <View style={{ flex: 1 }}>
            <ThemedText
              style={{
                fontWeight: "600",
                color: "#4A342E",
              }}
            >
              {post.author}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                color: "#8D746B",
              }}
            >
              {post.timestamp}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#A86651" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ThemedText
        style={{
          marginBottom: 12,
          color: "#4A342E",
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
            backgroundColor: "#F6E7E2",
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
                backgroundColor: "#F6E7E2",
                paddingHorizontal: 12,
                paddingVertical: 4,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: "#4A342E",
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
          borderTopColor: "#D8C0B7",
          paddingTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => onLike?.(post.id)}
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons name="heart-outline" size={18} color="#A86651" />
          {post.likes !== undefined && (
            <ThemedText
              style={{
                fontSize: 14,
                color: "#8D746B",
              }}
            >
              {post.likes}
            </ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#A86651" />
          {post.comments !== undefined && (
            <ThemedText
              style={{
                fontSize: 14,
                color: "#8D746B",
              }}
            >
              {post.comments}
            </ThemedText>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Ionicons name="share-social-outline" size={18} color="#A86651" />
          {post.shares !== undefined && (
            <ThemedText
              style={{
                fontSize: 14,
                color: "#8D746B",
              }}
            >
              {post.shares}
            </ThemedText>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FeedList({
  posts = MOCK_POSTS,
  onPostPress,
  onLike,
  isLoading,
}: FeedListProps) {
  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      {posts.map((post) => (
        <TouchableOpacity key={post.id} onPress={() => onPostPress?.(post.id)}>
          <FeedPostCard post={post} onLike={onLike} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
