import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, router } from "expo-router";
import {
  Search,
  Menu,
  MoreVertical,
  Edit2,
  Trash2,
  Stethoscope,
  Baby,
  Plus,
  ArrowRight,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useVisit } from "@/hooks/useVisit";
import { VisitListItem } from "@/hooks/database/models/VisitModel";

export default function VisitManagementScreen() {
  const { fetchAllVisits, removeVisit } = useVisit();
  const [visits, setVisits] = useState<VisitListItem[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<VisitListItem[]>([]);
  const [search, setSearch] = useState("");

  const loadVisits = async () => {
    const data = await fetchAllVisits();
    setVisits(data);
    filterData(data, search);
  };

  useFocusEffect(
    useCallback(() => {
      loadVisits();
    }, [])
  );

  const filterData = (data: VisitListItem[], query: string) => {
    let result = data;
    if (query) {
      result = result.filter(v =>
        v.name.toLowerCase().includes(query.toLowerCase()) ||
        v.address.toLowerCase().includes(query.toLowerCase()) ||
        v.visit_type.toLowerCase().includes(query.toLowerCase())
      );
    }
    setFilteredVisits(result);
  };

  useEffect(() => {
    filterData(visits, search);
  }, [search, visits]);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Remove Record",
      "Are you sure you want to delete this visit entry?",
      [
        { text: "Keep", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await removeVisit(id);
            if (result.success) loadVisits();
          }
        }
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: "/dashboard/follow-up", params: { id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">


      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search & Add Header Side-by-Side */}
        <View className="flex-row items-center px-5 mt-10 gap-3">
          <View className="flex-1 flex-row items-center bg-white px-4 h-14 rounded-2xl border border-gray-200">
            <Search size={20} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-3 text-base text-[#1E293B] font-medium"
              placeholder="Quick Search..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/dashboard/follow-up")}
            className="bg-primary w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-blue-900/20"
          >
            <Plus size={28} color="white" strokeWidth={3} />
          </TouchableOpacity>
        </View>

        {/* List Header */}
        <View className="flex-row justify-between items-center px-6 mt-10 mb-4">
          <Text className="text-[#1E293B] text-xl">Recent Visit Logs</Text>
        </View>

        {/* Visit Items matching the design list style */}
        <View className="px-5">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((item) => (
              <View
                key={item.id}
                className="bg-white p-4 rounded-[28px] mb-4 flex-row items-center border border-gray-100 shadow-sm"
              >
                {/* Left Mini-Image/Icon */}
                <View className={`w-8 h-8 rounded-[20px] items-center justify-center ${item.visit_type === 'ANC' ? 'bg-blue-50' : 'bg-rose-50'}`}>
                  {item.visit_type === 'ANC' ? (
                    <Stethoscope size={28} color="#3B82F6" strokeWidth={2.5} />
                  ) : (
                    <Baby size={28} color="#E11D48" strokeWidth={2.5} />
                  )}
                </View>

                {/* Content */}
                <View className="flex-1 ml-4 justify-center">
                  <Text className="text-[#1E293B] text-lg font-black leading-tight" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-gray-400 font-bold text-[13px] mt-0.5" numberOfLines={1}>
                    {item.visit_type} • {item.visit_date}
                  </Text>
                  <Text className="text-gray-300 text-[11px] mt-1" numberOfLines={1}>
                    {item.address || 'Health Post Area'}
                  </Text>
                </View>

                {/* Right Actions */}
                <View className="flex-row items-center pr-1 gap-1">
                  <TouchableOpacity
                    onPress={() => handleEdit(item.id)}
                    className="p-2.5 rounded-full bg-blue-50"
                  >
                    <Edit2 size={18} color="#3B82F6" strokeWidth={2.5} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    className="p-2.5 rounded-full bg-rose-50"
                  >
                    <Trash2 size={18} color="#E11D48" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View className="py-10 items-center justify-center opacity-50">
              <Text className="text-gray-400 font-black text-base italic">Logs are currently empty</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
