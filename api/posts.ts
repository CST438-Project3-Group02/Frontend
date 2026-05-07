import { request } from "./client";

// Get all activities (posts) for a household
export function getHouseholdPosts(householdId: number | string) {
  const id = Number(householdId);
  console.log(`[API] Fetching posts for household ${id}`);
  return request(`/api/activities/household/${id}`);
}

// Create a new activity (placeholder)
export function createActivity(profileId: number | string) {
  const pid = Number(profileId);
  const activityPayload = {
    activityType: 0,
    createdAt: new Date().toISOString(),
    isCompleted: false,
    profileId: pid,
  };
  console.log("[API] Creating activity with payload:", activityPayload);
  return request(`/api/activities`, {
    method: "POST",
    body: JSON.stringify(activityPayload),
  });
}

// Create a new activity comment (the actual post content)
export function createPost(
  activityId: number | string,
  profileId: number | string,
  content: string,
) {
  const aid = Number(activityId);
  const pid = Number(profileId);
  const commentPayload = {
    profileId: pid,
    activityId: aid,
    comment: content,
    createdAt: new Date().toISOString(),
  };
  console.log("[API] Creating post comment with payload:", commentPayload);
  return request(`/api/activity-comments`, {
    method: "POST",
    body: JSON.stringify(commentPayload),
  });
}

// Like an activity (post)
export function likePost(
  activityId: number | string,
  profileId: number | string,
) {
  return request(`/api/activity-reactions`, {
    method: "POST",
    body: JSON.stringify({
      profileId: Number(profileId),
      activityId: Number(activityId),
      reactionType: "LIKE",
    }),
  });
}

// Unlike an activity (post)
export function unlikePost(reactionId: number | string) {
  return request(`/api/activity-reactions/${reactionId}`, {
    method: "DELETE",
  });
}

// Add a comment to an activity (post)
export function commentOnPost(
  activityId: number | string,
  profileId: number | string,
  content: string,
) {
  return request(`/api/activity-comments`, {
    method: "POST",
    body: JSON.stringify({
      profileId: Number(profileId),
      activityId: Number(activityId),
      comment: content,
      createdAt: new Date().toISOString(),
    }),
  });
}

// Get comments for an activity (post)
export function getActivityComments(activityId: number | string) {
  return request(`/api/activity-comments/activity/${activityId}`);
}

// Get all reactions (likes) for an activity (post)
export function getActivityReactions(activityId: number | string) {
  return request(`/api/activity-reactions/activity/${activityId}`);
}
