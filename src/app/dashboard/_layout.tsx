import { Drawer } from "expo-router/drawer";
import React from "react";
import "../../global.css";
import CustomDrawer from "@/components/navigation/CustomDrawer";

export default function DashboardLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: "75%",
        },
        drawerPosition: "left",
        swipeEdgeWidth: 0,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: "none" },
          title: "Dashboard",
        }}
      />
      <Drawer.Screen name="household" />
      <Drawer.Screen
        name="pregnant-women"
        options={{
          title: "Pregnant Women",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="children"
        options={{
          title: "Children (0-5)",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="family-planning"
        options={{
          title: "Family Planning",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="follow-up"
        options={{
          title: "Follow Up",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="change-language"
        options={{
          title: "Change Language",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "My Profile",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
