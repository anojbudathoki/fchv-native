import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import PrimaryButton from "../../components/PrimaryButton";
import SelectionGroup from "../../components/SelectionGroup";
import {
  User,
  Calendar,
  MapPin,
  Hash,
  Activity,
  Heart,
  Shield,
  ClipboardList,
  ChevronLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function PregnantWomenForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [wardNo, setWardNo] = useState("");
  const [village, setVillage] = useState("");
  const [gravida, setGravida] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [ancVisitCount, setAncVisitCount] = useState("");
  const [ifaTabletReceived, setIfaTabletReceived] = useState("");
  const [ttVaccinationStatus, setTtVaccinationStatus] = useState("");
  const [riskSigns, setRiskSigns] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Auto-calculate EDD when LMP changes
  useEffect(() => {
    if (lmp && lmp.length === 10) {
      const lmpDate = new Date(lmp);
      if (!isNaN(lmpDate.getTime())) {
        const eddDate = new Date(lmpDate);
        eddDate.setDate(lmpDate.getDate() + 280);
        setEdd(eddDate.toISOString().split("T")[0]);
      }
    }
  }, [lmp]);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Pregnant woman registered successfully!");
    }, 1500);
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    subTitle,
    color = "bg-blue-500",
  }: {
    icon: any;
    title: string;
    subTitle: string;
    color?: string;
  }) => (
    <View className="flex-row items-center mb-5">
      <View
        className={`w-10 h-10 ${color} rounded-2xl items-center justify-center mr-3 shadow-sm`}
      >
        <Icon size={20} color="white" />
      </View>
      <View>
        <Text className="text-gray-800 font-bold text-lg">{title}</Text>
        <Text className="text-gray-500 text-sm font-medium">{subTitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-3">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Top Header */}
        <View className="bg-white px-6 pt-6 pb-8 flex flex-row justify-between items-center rounded-b-[40px] mb-6">
          <View>
            <Text className="text-2xl font-extrabold text-slate-900 leading-tight">
              गर्भवती महिला दर्ता
            </Text>
            <Text className="text-slate-500 text-md font-medium mt-1">
              Pregnant Woman Registration
            </Text>
          </View>
          <View className="flex-row items-center justify-between mb-6">
            <View className="w-10 h-10 bg-pink-100 rounded-full items-center justify-center">
              <Heart size={20} color="#EC4899" />
            </View>
          </View>
        </View>

        <View className="">
          {/* Card 1: Basic Information */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={User}
              title="व्यक्तिगत विवरण"
              subTitle="Basic Information"
              color="bg-blue-500"
            />

            <InputField
              label="पूरा नाम"
              subLabel="Full Name"
              placeholder="e.g. Maya Devi"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={18} color="#64748B" />}
            />

            <InputField
              label="उमेर"
              subLabel="Age"
              placeholder="e.g. 24"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
              leftIcon={<Hash size={18} color="#64748B" />}
            />
          </View>

          {/* Card 2: Address */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={MapPin}
              title="ठेगाना"
              subTitle="Address Details"
              color="bg-emerald-500"
            />

            <InputField
              label="नगरपालिका/गाउँपालिका"
              subLabel="Municipality"
              placeholder="Enter local level"
              value={municipality}
              onChangeText={setMunicipality}
              leftIcon={<MapPin size={18} color="#64748B" />}
            />

            <View className="flex-row justify-between">
              <View className="w-[45%]">
                <InputField
                  label="वडा नं."
                  subLabel="Ward"
                  placeholder="e.g. 5"
                  keyboardType="numeric"
                  value={wardNo}
                  onChangeText={setWardNo}
                />
              </View>
              <View className="w-[50%]">
                <InputField
                  label="गाउँ"
                  subLabel="Village"
                  placeholder="Village name"
                  value={village}
                  onChangeText={setVillage}
                />
              </View>
            </View>
          </View>

          {/* Card 3: Pregnancy Details */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={Heart}
              title="गर्भावस्था विवरण"
              subTitle="Pregnancy Details"
              color="bg-pink-500"
            />

            <InputField
              label="गर्भावस्था संख्या"
              subLabel="Gravida"
              placeholder="e.g. 1"
              keyboardType="numeric"
              value={gravida}
              onChangeText={setGravida}
            />

            <InputField
              label="अन्तिम महिनावारी मिति"
              subLabel="LMP"
              placeholder="YYYY-MM-DD"
              value={lmp}
              onChangeText={setLmp}
              leftIcon={<Calendar size={18} color="#64748B" />}
            />

            <InputField
              label="अपेक्षित सुत्केरी मिति"
              subLabel="EDD"
              placeholder="YYYY-MM-DD"
              value={edd}
              onChangeText={setEdd}
              leftIcon={<Calendar size={18} color="#64748B" />}
              editable={false}
              containerClassName="opacity-80"
            />
          </View>

          {/* Card 4: Healthcare */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-6 border border-slate-100">
            <SectionHeader
              icon={Shield}
              title="स्वास्थ्य जाँच"
              subTitle="Healthcare Metrics"
              color="bg-purple-500"
            />

            <InputField
              label="ए.एन.सी जाँच संख्या"
              subLabel="ANC visit count"
              placeholder="e.g. 1"
              keyboardType="numeric"
              value={ancVisitCount}
              onChangeText={setAncVisitCount}
            />

            <SelectionGroup
              label="आई.एफ.ए. चक्की प्राप्त"
              subLabel="IFA tablet received"
              options={[
                { label: "हो (Yes)", value: "Yes" },
                { label: "होइन (No)", value: "No" },
              ]}
              selectedValue={ifaTabletReceived}
              onSelect={setIfaTabletReceived}
            />

            <SelectionGroup
              label="टी.टी. खोप स्थिति"
              subLabel="TT vaccination status"
              options={[
                { label: "पूर्णा (Done)", value: "Completed" },
                { label: "बाँकी (Pending)", value: "Incomplete" },
              ]}
              selectedValue={ttVaccinationStatus}
              onSelect={setTtVaccinationStatus}
            />
          </View>

          {/* Card 5: Risk Signs */}
          <View className="bg-white rounded-[32px] py-6 px-4 mb-8 border border-slate-100">
            <SectionHeader
              icon={Activity}
              title="जोखिमका लक्षण"
              subTitle="Risk Signs"
              color="bg-orange-500"
            />

            <InputField
              label="जोखिमका लक्षणहरू"
              subLabel="Risk signs (if any)"
              placeholder="Type any concerns or symptoms..."
              multiline
              numberOfLines={4}
              value={riskSigns}
              onChangeText={setRiskSigns}
              leftIcon={<Activity size={18} color="#64748B" />}
              containerClassName="mb-0"
            />
          </View>

          <PrimaryButton
            title="दर्ता सुरक्षित गर्नुहोस्"
            subTitle="Save Registration"
            onPress={handleSubmit}
            isLoading={isLoading}
            className="mb-10 shadow-lg shadow-blue-200"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
