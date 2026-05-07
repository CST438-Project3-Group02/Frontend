import { updateProfile } from "@/api/profiles";
import RightPanel from "@/components/dashboard/RightPanel";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SignOutButton from "@/components/social-auth-buttons/SignOutButton";
import { ThemedText } from "@/components/themed-text";
import { colors } from "@/constants/colors";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function SettingsPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { user, profile, isProfileLoading, refetchProfile } = useAuthContext();
  const { householdId } = useLocalSearchParams<{ householdId: string }>();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.name || "");
      setAvatarUrl(profile.profilePicUrl || "");
    }
  }, [profile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsLoadingImage(true);
      try {
        await uploadProfilePicture(result.assets[0].uri);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image. Please try again.");
      } finally {
        setIsLoadingImage(false);
      }
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      if (!user?.id || !profile?.profileId) {
        throw new Error(
          `Missing user ID or profile ID: user=${user?.id}, profileId=${profile?.profileId}`,
        );
      }

      console.log(
        "Uploading profile picture for profile ID:",
        profile.profileId,
      );
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `profile-${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(filePath, blob, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-pictures").getPublicUrl(filePath);

      console.log("Image uploaded to:", publicUrl);
      console.log("Updating profile with picture URL and name:", {
        profileId: profile.profileId,
        name: profile.name || displayName,
        profilePicUrl: publicUrl,
      });

      // Update profile in Spring Boot backend
      const updateResult = await updateProfile(profile.profileId, {
        name: profile.name || displayName,
        profilePicUrl: publicUrl,
      });
      console.log("Profile update result:", updateResult);

      // Update UI immediately with new avatar
      console.log("Updating avatar URL to:", publicUrl);
      setAvatarUrl(publicUrl);

      // Refetch profile immediately to update everywhere
      if (refetchProfile) {
        console.log("Refetching profile...");
        await refetchProfile();
        console.log("Profile refetched");
      }

      Alert.alert("Success", "Profile picture updated!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Error", "Failed to upload image: " + JSON.stringify(error));
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile?.profileId || !displayName.trim()) {
      Alert.alert("Error", "Please enter a display name");
      return;
    }

    setIsSaving(true);
    try {
      console.log("Saving profile with:", {
        profileId: profile.profileId,
        name: displayName,
        profilePicUrl: avatarUrl,
      });

      // Update profile in Spring Boot backend
      const updateResult = await updateProfile(profile.profileId, {
        name: displayName,
        profilePicUrl: avatarUrl,
      });
      console.log("Profile update result:", updateResult);

      // Refetch profile immediately to update everywhere
      if (refetchProfile) {
        console.log("Refetching profile...");
        await refetchProfile();
        console.log("Profile refetched");
      }

      Alert.alert("Success", "Profile updated!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        "Failed to update profile: " + JSON.stringify(error),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          try {
            await supabase.auth.signOut();
            router.replace("/login");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out");
          }
        },
        style: "destructive",
      },
    ]);
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
            { id: "chat", label: "Chat", icon: "chatbubble" },
            { id: "household", label: "My Household", icon: "home" },
            {
              id: "settings",
              label: "Settings",
              icon: "settings",
              active: true,
            },
          ]}
          householdId={householdId}
          onRoomiePress={() => router.push("/")}
        />
      )}

      <View style={{ flex: 1, flexDirection: "column" }}>
        <Topbar householdId={householdId} />
        <ScrollView
          style={{
            flex: 1,
            padding: 24,
            backgroundColor: colors.background,
          }}
        >
          <ThemedText
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 24,
            }}
          >
            Account Settings
          </ThemedText>

          {isProfileLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <View>
              {/* Profile Picture Section */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                  alignItems: "center",
                }}
              >
                {isLoadingImage ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : avatarUrl ? (
                  <Image
                    key={avatarUrl} // Force re-render when avatarUrl changes
                    source={{ uri: avatarUrl + "?t=" + Date.now() }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      marginBottom: 16,
                    }}
                  />
                ) : (
                  <View
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      backgroundColor: colors.primary,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <ThemedText style={{ fontSize: 32, fontWeight: "bold" }}>
                      {displayName.charAt(0).toUpperCase() || "U"}
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={isLoadingImage}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: colors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                  }}
                >
                  <Ionicons name="camera" size={18} color="white" />
                  <ThemedText
                    style={{
                      color: "white",
                      fontWeight: "600",
                    }}
                  >
                    Upload Picture
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Profile Information Section */}
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 16,
                  }}
                >
                  Profile Information
                </ThemedText>

                <View style={{ marginBottom: 16 }}>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginBottom: 8,
                      fontWeight: "500",
                    }}
                  >
                    Display Name
                  </ThemedText>
                  {isEditing ? (
                    <TextInput
                      value={displayName}
                      onChangeText={setDisplayName}
                      style={{
                        borderWidth: 1,
                        borderColor: colors.borderSoft,
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        color: colors.text,
                        backgroundColor: colors.surfaceSoft,
                      }}
                      placeholderTextColor={colors.textMuted}
                    />
                  ) : (
                    <ThemedText
                      style={{
                        fontSize: 14,
                        color: colors.text,
                      }}
                    >
                      {displayName || "Not set"}
                    </ThemedText>
                  )}
                </View>

                <View style={{ marginBottom: 16 }}>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginBottom: 8,
                      fontWeight: "500",
                    }}
                  >
                    Email
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      color: colors.text,
                    }}
                  >
                    {user?.email || "Not set"}
                  </ThemedText>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: colors.textMuted,
                      marginBottom: 8,
                      fontWeight: "500",
                    }}
                  >
                    Account Type
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      color: colors.text,
                      textTransform: "capitalize",
                    }}
                  >
                    {user?.app_metadata?.provider || "Email"}
                  </ThemedText>
                </View>

                {/* Action Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    marginTop: 20,
                  }}
                >
                  {isEditing ? (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditing(false);
                          setDisplayName(profile?.name || "");
                        }}
                        style={{
                          flex: 1,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: colors.borderSoft,
                        }}
                      >
                        <ThemedText
                          style={{
                            textAlign: "center",
                            fontWeight: "600",
                            color: colors.text,
                          }}
                        >
                          Cancel
                        </ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveProfile}
                        disabled={isSaving}
                        style={{
                          flex: 1,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          backgroundColor: colors.primary,
                        }}
                      >
                        {isSaving ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <ThemedText
                            style={{
                              textAlign: "center",
                              fontWeight: "600",
                              color: "white",
                            }}
                          >
                            Save
                          </ThemedText>
                        )}
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setIsEditing(true)}
                      style={{
                        flex: 1,
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 8,
                        backgroundColor: colors.primary,
                      }}
                    >
                      <ThemedText
                        style={{
                          textAlign: "center",
                          fontWeight: "600",
                          color: "white",
                        }}
                      >
                        Edit Profile
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <SignOutButton />
            </View>
          )}
        </ScrollView>
        {isMobile && (
          <BottomNavigation
            items={[
              { id: "activity", label: "Activity", icon: "list" },
              { id: "chores", label: "Chores", icon: "checkbox" },
              { id: "expenses", label: "Expenses", icon: "receipt" },
              { id: "groceries", label: "Groceries", icon: "cart" },
              { id: "chat", label: "Chat", icon: "chatbubble" },
            ]}
            householdId={householdId}
          />
        )}
      </View>

      {!isMobile && <RightPanel />}
    </View>
  );
}
