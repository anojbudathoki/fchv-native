import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  ChevronLeft,
  Search,
  Plus,
  Baby,
  Calendar,
  ChevronRight,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react-native";
import "../../../global.css";
import { getAllMothersList, MotherListDbItem } from "../../../hooks/database/models/MotherModel";
import CustomHeader from "../../../components/CustomHeader";

const FILTERS = ["All", "Active", "High Risk", "Delivered"];

export default function MotherListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchMothers = async () => {
        try {
          const list = await getAllMothersList();
          if (isActive) {
            setMothers(list);
          }
        } catch (error) {
          console.error("Failed to fetch mothers:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      setLoading(true);
      fetchMothers();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const filtered = mothers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.nameNp || "").includes(search);
    const matchFilter =
      activeFilter === "All" ||
      (activeFilter === "Active" && m.status === "active") ||
      (activeFilter === "High Risk" && m.risk === "high") ||
      (activeFilter === "Delivered" && m.status === "delivered");
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white border-b border-gray-100 pb-5">
        <CustomHeader
          title="Mother List"
          className="pt-4 px-5 pb-3 mt-10"
          rightNode={
            <TouchableOpacity
              onPress={() => router.push("/dashboard/mother-list/add-mother" as any)}
              className="bg-primary p-2.5 rounded-2xl"
            >
              <Plus size={22} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          }
        />

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mx-5">
          <Search size={18} color="#94a3b8" strokeWidth={2.5} />
          <TextInput
            className="flex-1 ml-3 text-[#1E293B] font-bold text-base"
            placeholder="Search by name..."
            placeholderTextColor="#CBD5E1"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter Chips */}
        {/* <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              className={`mr-2 px-4 py-2 rounded-full border ${activeFilter === f
                ? "bg-primary border-primary"
                : "bg-white border-gray-200"
                }`}
            >
              <Text
                className={`font-black text-[12px] ${activeFilter === f ? "text-white" : "text-gray-500"
                  }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}
      </View>

      {/* Summary Strip */}
      <View className="flex-row px-5 py-4 gap-3">
        <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
          <View className="bg-blue-50 p-2 rounded-xl mr-3">
            <Baby size={16} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-gray-400 font-bold text-[10px]">Active</Text>
            <Text className="text-[#1E293B] font-black text-xl leading-none">
              {mothers.filter((m) => m.status === "active").length}
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
          <View className="bg-rose-50 p-2 rounded-xl mr-3">
            <AlertCircle size={16} color="#E11D48" strokeWidth={2.5} />
          </View>

          <View>
            <Text className="text-gray-400 font-bold text-[10px]">High Risk</Text>
            <Text className="text-[#1E293B] font-black text-xl leading-none">
              {mothers.filter((m) => m.risk === "high").length}
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white rounded-2xl px-4 py-3 border border-gray-100 flex-row items-center">
          <View className="bg-green-50 p-2 rounded-xl mr-3">
            <CheckCircle2 size={16} color="#22C55E" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-gray-400 font-bold text-[10px]">Delivered</Text>
            <Text className="text-[#1E293B] font-black text-xl leading-none">
              {mothers.filter((m) => m.status === "delivered").length}
            </Text>
          </View>
        </View>
      </View>

      {/* Mother List */}
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {loading ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="text-gray-400 font-bold text-base mt-4">Loading mothers...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-20">
            <Baby size={48} color="#CBD5E1" />
            <Text className="text-gray-400 font-bold text-base mt-4">No records found</Text>
          </View>
        ) : (
          filtered.map((mother) => (
            <TouchableOpacity
              key={mother.id}
              activeOpacity={0.75}
              onPress={() => router.push({ pathname: "/dashboard/mother-profile", params: { id: mother.id } } as any)}
              className="bg-white rounded-[28px] p-4 mb-4 shadow-sm border border-gray-50"
            >
              <View className="flex-row items-center">
                {/* Avatar */}
                <View className="relative mr-4">
                  <Image
                    source={{ uri: mother.image }}
                    className="w-14 h-14 rounded-2xl"
                  />
                  {mother.risk === "high" && (
                    <View className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-white items-center justify-center">
                      <Text className="text-white text-[7px] font-black">!</Text>
                    </View>
                  )}
                </View>

                {/* Details */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-[#1E293B] text-base font-black">{mother.name}</Text>
                      {/* <Text className="text-gray-400 text-[10px] font-bold">Code: {mother.code || 'N/A'} | ID: {mother.id ? mother.id.split('-')[0] : 'N/A'}</Text> */}
                    </View>
                    <View
                      className={`px-2.5 py-1 rounded-full ${mother.status === "delivered"
                        ? "bg-green-50"
                        : mother.risk === "high"
                          ? "bg-rose-50"
                          : "bg-blue-50"
                        }`}
                    >
                      <Text
                        className={`text-[10px] font-black ${mother.status === "delivered"
                          ? "text-primary"
                          : mother.risk === "high"
                            ? "text-[#E11D48]"
                            : "text-[#3B82F6]"
                          }`}
                      >
                        {mother.status === "delivered"
                          ? "Delivered"
                          : mother.risk === "high"
                            ? "High Risk"
                            : "Active"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mt-2 gap-4">
                    <View className="flex-row items-center">
                      <Calendar size={12} color="#94a3b8" strokeWidth={2.5} />
                      <Text className="text-gray-400 font-bold text-[11px] ml-1">LMP: {mother.lmp}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Calendar size={12} color="#94a3b8" strokeWidth={2.5} />
                      <Text className="text-gray-400 font-bold text-[11px] ml-1">EDD: {mother.edd}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Baby size={12} color="#94a3b8" strokeWidth={2.5} />
                    <Text className="text-gray-400 font-bold text-[11px] ml-1">Age: {mother.age}</Text>
                  </View>
                </View>

                {/* Arrow */}
                <View className="bg-gray-50 p-2.5 rounded-2xl ml-3">
                  <ChevronRight size={16} color="#64748B" strokeWidth={2.5} />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
