import DiscordSignInButton from '@/components/social-auth-buttons/discord/DiscordSignInButton';
import GoogleSignInButton from '@/components/social-auth-buttons/google/GoogleSignInButton';
import { colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.card}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            }}
            resizeMode="cover"
            imageStyle={styles.heroImage}
            style={styles.hero}
          >
            <View style={styles.heroOverlay} />

            <View style={styles.brandRow}>
              <Ionicons name="home" size={22} color="#FFF7F2" />
              <Text style={styles.brandText}>Roomie</Text>
            </View>

            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Welcome to{`\n`}Roomie!</Text>
              <Text style={styles.heroDescription}>
                Your one stop shop for all roommate needs and essentials.
                Track chores, groceries, expenses, and bills all in one
                place! 
              </Text>
            </View>

          </ImageBackground>

          <View style={styles.formPanel}>
            <View style={styles.formInner}>
              <Text style={styles.heading}>Welcome in</Text>
              <Text style={styles.subheading}>
                Manage your households
              </Text>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.authContainer}>
                <GoogleSignInButton />
                <DiscordSignInButton />
              </View>

            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F0EC',
  },
  page: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
  },
  card: {
    width: '100%',
    maxWidth: 1100,
    minHeight: 700,
    backgroundColor: '#FBF8F6',
    borderRadius: 36,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  hero: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 34,
    justifyContent: 'space-between',
    backgroundColor: '#8D553E',
  },
  heroImage: {
    borderTopLeftRadius: 36,
    borderBottomLeftRadius: 36,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(93, 49, 28, 0.28)',
  },
  brandRow: {
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandText: {
    color: '#FFF7F2',
    fontSize: 21,
    fontWeight: '700',
  },
  heroContent: {
    zIndex: 1,
    maxWidth: 420,
    marginTop: 'auto',
  },
  heroTitle: {
    color: '#FFF7F2',
    fontSize: 56,
    lineHeight: 62,
    fontWeight: '800',
    marginBottom: 22,
  },
  heroDescription: {
    color: 'rgba(255,247,242,0.92)',
    fontSize: 18,
    lineHeight: 30,
    maxWidth: 430,
  },
  formPanel: {
    width: 500,
    backgroundColor: '#FFFDFC',
    justifyContent: 'center',
    paddingHorizontal: 54,
    paddingVertical: 40,
  },
  formInner: {
    width: '100%',
    maxWidth: 390,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '800',
    color: '#4A342E',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 20,
    lineHeight: 28,
    color: '#8F7D76',
    marginBottom: 34,
  },
  dividerRow: {
    marginTop: 26,
    marginBottom: 26,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6D8D1',
  },
  dividerText: {
    color: '#8F7D76',
    fontSize: 14,
  },
  authContainer: {
    flex: 1,
    gap: 10,
  }
});
