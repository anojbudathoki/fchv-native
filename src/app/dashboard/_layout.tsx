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
        drawerPosition: "right",
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
      <Drawer.Screen
        name="household"
        options={{
          title: "Add Household",
          headerShown: true,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="pregnant-women"
        options={{
          title: "Pregnant Women",
          headerShown: true,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="children"
        options={{
          title: "Children (0-5)",
          headerShown: true,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="family-planning"
        options={{
          title: "Family Planning",
          headerShown: true,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="follow-up"
        options={{
          title: "Follow Up",
          headerShown: true,
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
