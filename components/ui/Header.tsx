import { Bell } from 'lucide-react-native';
import { Image, Pressable, Text, View } from 'react-native';

interface HeaderProps {
  userAvatar: string;
}

export default function Header({ userAvatar }: HeaderProps) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingHorizontal: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
      }}
    >
  
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#E8D8C4', 
          }}
        >
          <Image
            source={{ uri: userAvatar }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: '800',
            letterSpacing: -0.5,
            color: '#6B4F3B', 
          }}
        >
          Roomie
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => ({
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: pressed ? '#F5F5F4' : 'transparent', // surface-low
          transform: [{ scale: pressed ? 0.9 : 1 }],
        })}
      >
        <Bell size={24} color="#6B4F3B" />
      </Pressable>
    </View>
  );
}