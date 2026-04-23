import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}


// import { Tabs } from 'expo-router'
// import BottomNavigation from '@/components/layout/BottomNavigation'
// import Topbar from '@/components/layout/Topbar'
// import Sidebar from '@/components/layout/Sidebar'
// import { Slot, usePathname, useRouter } from 'expo-router';
// import { View } from 'react-native';

// export default function TabLayout() {
//   const router = useRouter();
//   const pathname = usePathname();

// //   const activeItem: NavItem =
// //     pathname === '/groceries'
// //           ? 'Groceries'
// //           : 'Activity';

// //   const handleSelect = (item: NavItem) => {
// //     if (item === 'Activity') router.push('/');
// //     if (item === 'Chores') router.push('/chores');
// //     if (item === 'Expenses') router.push('/expenses');
// //     if (item === 'Groceries') router.push('/groceries');
// //   };

//   return (
//     <>
//       {/* <Topbar /> */}

//       <View style={{ flex: 1 }}>
//         <Slot />
//       </View>

//       {/* <BottomNavigation items={['Activity', 'Chores', 'Expenses', 'Groceries']}/> */}
//     </>
//   );
// }
