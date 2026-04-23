import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import {
  Baby,
  Smile,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
} from "lucide-react-native";
import { useTodo } from "../../hooks/useTodo";
import { TodoItem } from "../../hooks/database/models/TodoModel";
import { LinearGradient } from "expo-linear-gradient";
import "../../global.css";
import { useLanguage } from "../../context/LanguageContext";
import TopHeader from "@/components/layout/TopHeader";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { doSync } from "../../api/services/sync/sync";
import { getMotherCount } from "../../hooks/database/models/MotherModel";
import { getPregnancyCount } from "../../hooks/database/models/PregnantWomenModal";
import { getAllVisits, VisitListItem } from "../../hooks/database/models/VisitModel";

export default function DashboardScreen() {
  const { t } = useLanguage();
  const { isConnected } = useOnlineStatus();
  const [motherCount, setMotherCount] = useState(0);
  const [pregnancyCount, setPregnancyCount] = useState(0);
  const [recentVisits, setRecentVisits] = useState<VisitListItem[]>([]);
  const scrollRef = React.useRef<ScrollView>(null);
  const todoInputRef = React.useRef<TextInput>(null);
  const { todos, fetchTodos, addTodo, editTodo, removeTodo, toggleTodo } = useTodo();
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    if (isConnected) {
      doSync();
    }
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      const fetchCounts = async () => {
        try {
          const mCount = await getMotherCount();
          const pCount = await getPregnancyCount();
          const visits = await getAllVisits();
          setMotherCount(mCount);
          setPregnancyCount(pCount);
          setRecentVisits(visits);
          await fetchTodos();
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      };

      fetchCounts();
    }, [])
  );

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TopHeader />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Greeting Card */}
        <View className="px-5 mt-4">
          <LinearGradient
            colors={["#3B82F6", "#266fe3ff"]}
            style={{ borderRadius: 7, borderColor: "#3B82F6", borderWidth: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 shadow-lg shadow-emerald-200"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white text-[18px] font-black leading-tight">
                  Namaste,{"\n"}Laxmi Shrestha
                </Text>
                <Text className="text-white/80 text-sm mt-3 font-medium leading-5">
                  You have {todos.filter(t => !t.is_completed).length} personal tasks to complete today. Keep up the great work!
                </Text>
                <View className="flex-row items-center mt-4">
                  <TouchableOpacity
                    onPress={() => {
                      scrollRef.current?.scrollTo({ y: 550, animated: true });
                      setTimeout(() => todoInputRef.current?.focus(), 500);
                    }}
                    className="bg-white/20 px-4 py-2 rounded-xl flex-row items-center border border-white/30"
                  >
                    <Plus size={14} color="white" strokeWidth={3} />
                    <Text className="text-white font-black text-xs ml-2">Quick Add Task</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Abstract Graphic Placeholder */}
              <View className="opacity-20 absolute -right-4 -bottom-4">
                <Baby size={120} color="white" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View className="flex-row px-5 mt-6 gap-4">
          {/* Pregnant Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
          >
            <View className="bg-blue-500 h-1.5 w-full" />
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-blue-50 w-11 h-11 rounded-2xl items-center justify-center">
                  <Baby size={22} color="#3B82F6" strokeWidth={2.5} />
                </View>
                <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp size={10} color="#22C55E" />
                  <Text className="text-primary font-black text-[9px] ml-1">+2</Text>
                </View>
              </View>
              <Text className="text-[#1E293B] text-[36px] font-black leading-none">{pregnancyCount}</Text>
              <Text className="text-gray-500 font-black text-[11px] uppercase tracking-wider mt-2">Pregnant</Text>
              <Text className="text-gray-400 font-bold text-[10px]">गर्भवती महिला</Text>
            </View>
          </TouchableOpacity>

          {/* Deliveries Card */}
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"
          >
            <View className="bg-rose-500 h-1.5 w-full" />
            <View className="p-5">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-rose-50 w-11 h-11 rounded-2xl items-center justify-center">
                  <Smile size={22} color="#E11D48" strokeWidth={2.5} />
                </View>
                <View className="flex-row items-center bg-rose-50 px-2 py-1 rounded-full">
                  <TrendingUp size={10} color="#E11D48" />
                  <Text className="text-[#E11D48] font-black text-[9px] ml-1">+1</Text>
                </View>
              </View>
              <Text className="text-[#1E293B] text-[36px] font-black leading-none">{motherCount}</Text>
              <Text className="text-gray-500 font-black text-[11px] uppercase tracking-wider mt-2">MOTHERS</Text>
              <Text className="text-gray-400 font-bold text-[10px]">आमाहरू</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Incentives Card */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-gray-400 font-black text-[10px] uppercase tracking-wider">My Incentives</Text>
              <Text className="text-gray-400 font-bold text-[10px] mb-2">मेरो प्रोत्साहन भत्ता</Text>
              <View className="flex-row items-end">
                <Text className="text-primary font-bold text-lg mb-1 mr-1">Rs.</Text>
                <Text className="text-[#1E293B] text-[36px] font-black tracking-tighter">1,450</Text>
              </View>
              <TouchableOpacity className="mt-4 flex-row items-center">
                <Text className="text-primary font-black text-xs uppercase tracking-widest">View History</Text>
                <ChevronRight size={14} color="#22C55E" strokeWidth={3} />
              </TouchableOpacity>
            </View>
            <View className="bg-orange-50 p-6 rounded-[40px] items-center justify-center">
              <TrendingUp size={48} color="#F97316" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions - Clearly shows "How to Add" */}
        <View className="px-5 mt-10">
          <Text className="text-[#1E293B] text-xl font-black mb-4">Quick Actions</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/dashboard/mother-list/add-mother" as any)}
              className="flex-1 bg-white p-4 rounded-3xl border border-blue-100 items-center shadow-sm"
            >
              <View className="bg-blue-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <Plus size={24} color="white" strokeWidth={3} />
              </View>
              <Text className="text-[#1E293B] font-black text-xs">Add Mother</Text>
              <Text className="text-gray-400 font-bold text-[10px] mt-0.5">आमा थप्नुहोस्</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/dashboard/follow-up")}
              className="flex-1 bg-white p-4 rounded-3xl border border-green-100 items-center shadow-sm"
            >
              <View className="bg-green-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <Calendar size={24} color="white" strokeWidth={3} />
              </View>
              <Text className="text-[#1E293B] font-black text-xs">Add Visit</Text>
              <Text className="text-gray-400 font-bold text-[10px] mt-0.5">भ्रमण थप्नुहोस्</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                scrollRef.current?.scrollTo({ y: 800, animated: true }); // Increased Y to reach Todo
                setTimeout(() => todoInputRef.current?.focus(), 500);
              }}
              className="flex-1 bg-white p-4 rounded-3xl border border-orange-100 items-center shadow-sm"
            >
              <View className="bg-orange-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <CheckCircle size={24} color="white" strokeWidth={3} />
              </View>
              <Text className="text-[#1E293B] font-black text-xs">Add Todo</Text>
              <Text className="text-gray-400 font-bold text-[10px] mt-0.5">कार्य थप्नुहोस्</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* To-Do List Section */}
        <View className="px-5 mt-10">
          <View className="flex-row justify-between items-center mb-6 px-1">
            <View>
              <Text className="text-[#1E293B] text-xl font-black">My To-Dos</Text>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">मेरो कार्य सूची</Text>
            </View>
            <View className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <Text className="text-primary font-black text-[10px] tracking-widest uppercase">
                {todos.filter(t => !t.is_completed).length} Pending
              </Text>
            </View>
          </View>

          {/* Add Todo Input */}
          <View className="flex-row items-center mb-6 gap-3">
            <View className="flex-1 bg-white border border-gray-200 rounded-2xl h-14 px-4 flex-row items-center shadow-sm">
              <TextInput
                ref={todoInputRef}
                className="flex-1 text-[#1E293B] font-bold"
                placeholder="Type your new task here..."
                placeholderTextColor="#94A3B8"
                value={newTodo}
                onChangeText={setNewTodo}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                if (newTodo.trim()) {
                  addTodo(newTodo.trim());
                  setNewTodo("");
                }
              }}
              className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-900/20"
            >
              <Plus size={24} color="white" strokeWidth={3} />
            </TouchableOpacity>
          </View>

          {/* Todo List */}
          {todos.map((todo) => (
            <TodoItemRow
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id, todo.is_completed)}
              onDelete={() => removeTodo(todo.id)}
              onEdit={(text: string) => editTodo(todo.id, text)}
              isEditing={editingTodoId === todo.id}
              setEditingId={setEditingTodoId}
            />
          ))}

          {todos.length === 0 && (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-gray-50 border-dashed">
              <Text className="text-gray-400 font-bold italic">Stay organized with tasks!</Text>
            </View>
          )}
        </View>

        {/* Upcoming Schedule */}
        {/* <View className="px-5 mt-10">
          <View className="flex-row justify-between items-center mb-2 px-1">
            <View>
              <Text className="text-[#1E293B] text-xl font-black">Recent Activity</Text>
              <Text className="text-gray-400 font-bold text-xs uppercase tracking-wider mt-1">हालैका गतिविधिहरू</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/dashboard/visit-list")}>
              <Text className="text-primary font-black text-[13px]">View History</Text>
            </TouchableOpacity>
          </View>

          <ScheduleList data={recentVisits} />
        </View> */}

        {/* Community Coverage Section */}
        {/* <View className="px-5 mt-10">
          <View className="bg-[#EFF6FF] p-7 rounded-[40px] border border-blue-100">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1">
                <Text className="text-[#1E293B] text-xl font-black">Community Coverage</Text>
                <Text className="text-gray-400 font-bold text-xs mt-1">तपाईंको कार्य क्षेत्रको प्रगति</Text>
              </View>
              <Text className="text-primary text-[28px] font-black">84%</Text>
            </View>

            <View className="h-4 w-full bg-blue-100 rounded-full overflow-hidden mb-6">
              <View className="h-full bg-primary w-[84%] rounded-full" />
            </View>

            <View className="flex-row justify-between pt-2">
              <View className="flex-row items-center">why 
                <View className="w-2.5 h-2.5 bg-primary rounded-full mr-2" />
                <Text className="text-[#475569] font-bold text-[13px]">42 Active Cases</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2.5 h-2.5 bg-blue-200 rounded-full mr-2" />
                <Text className="text-[#475569] font-bold text-[13px]">8 Pending Tests</Text>
              </View>
            </View>
          </View>
        </View> */}
      </ScrollView>

      {/* Removed the static FAB to focus on the Quick Actions grid */}
    </View>
  );
}

const TodoItemRow = ({ todo, onToggle, onDelete, onEdit, isEditing, setEditingId }: any) => {
  const [text, setText] = useState(todo.task);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && (now - lastTap) < 300) {
      setEditingId(todo.id);
    } else {
      setLastTap(now);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleDoubleTap}
      className={`bg-white p-4 rounded-[28px] mb-3 flex-row items-center border border-gray-100 ${todo.is_completed ? 'opacity-60' : 'shadow-sm'}`}
    >
      <TouchableOpacity
        onPress={onToggle}
        className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${todo.is_completed ? 'bg-green-500' : 'bg-gray-50'}`}
      >
        <CheckCircle size={20} color={todo.is_completed ? "white" : "#CBD5E1"} strokeWidth={3} />
      </TouchableOpacity>

      <View className="flex-1">
        {isEditing ? (
          <TextInput
            autoFocus
            className="text-[#1E293B] text-base font-black p-0"
            value={text}
            onChangeText={setText}
            onBlur={() => {
              onEdit(text);
              setEditingId(null);
            }}
            onSubmitEditing={() => {
              onEdit(text);
              setEditingId(null);
            }}
          />
        ) : (
          <Text
            className={`text-[#1E293B] text-base font-black ${todo.is_completed ? 'line-through text-gray-400' : ''}`}
            numberOfLines={1}
          >
            {todo.task}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onDelete} className="p-2 ml-2">
        <Trash2 size={18} color="#EF4444" strokeWidth={2.5} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const ScheduleList = ({ data }: { data: VisitListItem[] }) => {
  const [showAll, setShowAll] = useState(false);

  if (data.length === 0) {
    return (
      <View className="bg-white rounded-3xl p-8 items-center justify-center mt-4 border border-gray-50 border-dashed">
        <Text className="text-gray-400 font-bold">No recent activities found</Text>
      </View>
    );
  }

  const visible = showAll ? data : data.slice(0, 3);

  return (
    <View className="mt-4">
      {visible.map((item) => {
        const dateObj = new Date(item.visit_date);
        const day = dateObj.getDate().toString();
        const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.75}
            onPress={() => { }}
            className="bg-white rounded-3xl p-4 flex-row items-center mb-4 shadow-sm border border-gray-50"
          >
            {/* Date Badge */}
            <View className="bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center w-14 h-14 mr-4">
              <Text className="text-primary font-black text-[11px] uppercase tracking-wider">{month}</Text>
              <Text className="text-[#1E293B] text-[22px] font-black leading-tight">{day}</Text>
            </View>

            {/* Details */}
            <View className="flex-1">
              <Text className="text-[#1E293B] text-base font-black">{item.name}</Text>
              <Text className="text-[#64748B] font-medium text-[13px] mt-0.5">
                {item.visit_type} Follow-up{" "}
                <Text className="text-gray-400">({item.visit_type === 'ANC' ? 'गर्भावस्था जाँच' : 'प्रसवपश्चात् जाँच'})</Text>
              </Text>
            </View>

            {/* Icons */}
            <View className="flex-row items-center gap-2">
              <View className="p-2 rounded-xl bg-blue-50">
                <ChevronRight size={18} color="#3B82F6" strokeWidth={2.5} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Show More / Show Less */}
      {data.length > 3 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="items-center py-3"
        >
          <Text className="text-primary font-black text-[13px] uppercase tracking-widest">
            {showAll ? "Show Less ↑" : `Show ${data.length - 3} More ↓`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
