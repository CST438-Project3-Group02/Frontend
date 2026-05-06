import { getHousehold, getInviteDetails, joinHousehold } from "@/api/households";
import { colors } from "@/constants/colors";
import { useAuthContext } from '@/hooks/use-auth-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Join() {
  const { invite_token } = useLocalSearchParams()
  const { isLoggedIn, profile } = useAuthContext()
  
  const [ householdId, setHouseholdId ] = useState(null);
  const [ householdName, setHouseholdName ] = useState('');

  useEffect(() => {
    if (!invite_token) {
      router.replace('/households') // redirect away if no token
      return;
    }

    // If not logged in, redirect to login 
    if (!isLoggedIn) {
      // store redirect link and invite_token in async / local storage
      AsyncStorage.setItem('post_login_redirect', JSON.stringify({ 
        redirect: '/join', 
        invite_token 
      }))
      router.replace('/login')
      return;
    }

    const getHouseholdInvite = async () => {
      try {
        const inviteDetails = await getInviteDetails(invite_token as any);
        const household = await getHousehold(inviteDetails.householdId);
        
        
        setHouseholdId(inviteDetails.householdId);
        setHouseholdName(household.householdName);
      } catch (error: any) {
        if (error.status === 404) {
          console.log('Resource not found: Invite Token')
        } else if (error.status === 410) {
          console.log('Invite token expired')
        }
        router.replace('/households')
      }
    }

    getHouseholdInvite()
  }, [invite_token, isLoggedIn])

  const onJoin = async () => {
    if (!householdId) return

    try {
        await joinHousehold(profile.profileId, householdId);
        router.replace(`/households/${householdId}`)
    } catch (error: any) {
        console.error('Failed to join household', error)
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.page}>
        <View style={styles.card}>

          <FontAwesome6 name="house-chimney" size={32} color={colors.primary} />

          <Text style={styles.title}>
            You have been invited to{" "}
            <Text style={styles.highlight}>{householdName}</Text>!
          </Text>

          <Text style={styles.subtitle}>
            Click join below to continue and enter this household as a new roomie.
          </Text>

          <Pressable 
            style={[styles.primaryButton, !householdId && { opacity: 0.5 }]} 
            onPress={onJoin}
            disabled={!householdId}
          >
            <Text style={styles.primaryButtonText}>Join Household</Text>
          </Pressable>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerIcon}>♡</Text>
          <Text style={styles.footerText}>
            Secured invitation from Roomie
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  page: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.whiteSoft,
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 36,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  heroImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 42,
    borderWidth: 3,
    borderColor: colors.whiteSoft,
  },
  title: {
    fontSize: 30,
    marginTop: 30,
    lineHeight: 36,
    fontWeight: "800",
    color: colors.dark,
    textAlign: "center",
    letterSpacing: -1,
  },
  highlight: {
    color: colors.primary,
    fontStyle: "italic",
  },
  subtitle: {
    marginTop: 22,
    maxWidth: 320,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
  },
  primaryButton: {
    marginTop: 42,
    width: "100%",
    maxWidth: 290,
    height: 58,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButtonText: {
    color: colors.whiteSoft,
    fontSize: 17,
    fontWeight: "800",
  },
  secondaryButton: {
    marginTop: 28,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
  divider: {
    width: "100%",
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderSoft,
    opacity: 0.45,
    marginTop: 56,
    marginBottom: 34,
  },
  membersLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    color: colors.textMuted,
  },
  membersRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: colors.whiteSoft,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  extraAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 2,
    borderColor: colors.whiteSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  extraAvatarText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },
  footer: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerIcon: {
    color: colors.borderSoft,
    fontSize: 15,
    fontWeight: "700",
  },
  footerText: {
    color: colors.borderSoft,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});