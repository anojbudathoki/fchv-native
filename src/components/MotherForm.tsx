import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, X, Save } from "lucide-react-native";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { createMother, getMotherProfile } from "../hooks/database/models/MotherModel";
import { useToast } from "../context/ToastContext";
import CameraCapture from "../components/CameraCapture";
import { FieldLabel, BoxInput, SelectInput } from "./FormElements";
import { Button } from "./button";
import { EDUCATION_LEVELS, JATI_CODES } from "@/utils/data";

const generateCustomId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const getRandom = (len: number) => Array.from({ length: len }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  return `${getRandom(2)}-${getRandom(4)}-${getRandom(2)}`;
};

export default function MotherForm({ id }: { id?: string }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [husbandName, setHusbandName] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [education, setEducation] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [codeState, setCodeState] = useState<string | null>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchEditData = async () => {
        try {
          setIsLoading(true);
          const data = await getMotherProfile(id);
          console.log({data})
          if (data) {
            setName(data.name);
            setAge(String(data.age || ""));
            setPhone(data.phone || "");
            setAddress(data.ward || "");
            setHusbandName(data.husbandName || "");
            setEthnicity(data.ethnicity || "");
            setEducation(data.education || "");
            if (data.image && !data.image.includes("vectorified")) {
              setPhotoUrl(data.image);
            }
            setCodeState(data.code || null);
          }
        } catch (e) {
          console.error("error fetching mother profile", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEditData();
    }
  }, [id]);

  const handlePhotoUpload = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: () => setShowCamera(true) },
        { text: "Choose from Gallery", onPress: chooseFromGallery },
        ...(photoUrl
          ? [{ text: "Remove Photo", onPress: () => { setPhotoUrl(null); showToast("Photo removed"); }, style: "destructive" as const }]
          : []),
        { text: "Cancel", style: "cancel" as const },
      ],
      { cancelable: true }
    );
  };

  const onCameraCapture = (uri: string) => {
    setPhotoUrl(uri);
    setShowCamera(false);
  };

  const chooseFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast("Gallery permission is required");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Gallery picker error:", err);
      showToast("Failed to pick image from gallery");
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!age.trim()) e.age = "Age is required";
    if (phone && phone.length !== 10) e.phone = "Must be 10 digits";
    if (!ethnicity) e.ethnicity = "Ethnicity is required";
    if (!education) e.education = "Education is required";
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      const dbId = (id && typeof id === 'string' && id.trim().length > 0) ? id : Crypto.randomUUID();
      const mCode = codeState || generateCustomId();

      await createMother({
        id: dbId,
        code: mCode,
        name: name,
        age: parseInt(age) || 0,
        phone: phone,
        address: address,
        husband_name: husbandName,
        ethnicity: ethnicity,
        education: education,
        photo: photoUrl ?? undefined,
        is_synced: false,
      });

      showToast("Mother details saved successfully");
      router.back();
    } catch (err) {
      console.error("Error saving form:", err);
      showToast("Failed to save mother data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CameraCapture
        visible={showCamera}
        onCapture={onCameraCapture}
        onClose={() => setShowCamera(false)}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePhotoUpload}
        className="bg-gray-100 rounded-3xl items-center justify-center py-9 mb-8 border border-gray-200 relative"
      >
        {photoUrl ? (
          <View className="bg-white w-24 h-24 rounded-full items-center justify-center mb-3 shadow-sm relative border border-blue-100">
            <Image source={{ uri: photoUrl }} className="w-full h-full rounded-full" resizeMode="cover" />
            <TouchableOpacity
              onPress={(e) => { e.stopPropagation(); setPhotoUrl(null); }}
              activeOpacity={0.7}
              className="absolute -top-1.5 -right-1.5 bg-red-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white z-10"
            >
              <X size={14} color="#fff" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white w-16 h-16 rounded-full items-center justify-center mb-3 shadow-sm relative border border-blue-100">
            <Camera size={30} color="#60A5FA" strokeWidth={2} />
            <View className="absolute -top-1.5 -right-1.5 bg-primary w-6 h-6 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white font-black text-xs">+</Text>
            </View>
          </View>
        )}
        <Text className="text-[#1E293B] font-black text-base">Pregnant Mother Photo</Text>
        <Text className="text-gray-400 font-medium text-xs mt-1">Click here to take a photo</Text>
      </TouchableOpacity>

      <FieldLabel label="Full Name" />
      <BoxInput
        placeholder="Enter Full Name"
        value={name}
        onChangeText={(t) => { setName(t); setErrors({ ...errors, name: "" }); }}
        error={errors.name}
      />

      <View className="flex-row gap-4">
        <View className="flex-1">
          <FieldLabel label="Age" />
          <BoxInput
            placeholder="वर्ष"
            value={age}
            onChangeText={(t) => { setAge(t.replace(/\D/g, "")); setErrors({ ...errors, age: "" }); }}
            keyboardType="numeric"
            error={errors.age}
          />
        </View>
        <View className="flex-1">
          <FieldLabel label="Phone Number" />
          <BoxInput
            placeholder="98*******"
            value={phone}
            onChangeText={(t) => { setPhone(t.replace(/\D/g, "")); setErrors({ ...errors, phone: "" }); }}
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.phone}
          />
        </View>
      </View>

      <FieldLabel label="Address" />
      <BoxInput placeholder="Enter Address" value={address} onChangeText={setAddress} />

      <FieldLabel label="Husband's Name" />
      <BoxInput placeholder="Enter Husband's Name" value={husbandName} onChangeText={setHusbandName} />

      <FieldLabel label="Ethnicity" />
      <SelectInput
        label="Select Ethnicity"
        placeholder="Select Ethnicity"
        value={ethnicity}
        options={JATI_CODES.map(j => ({ value: j.code, label: j.name }))}
        onSelect={(val: string) => { setEthnicity(val); setErrors({...errors, ethnicity: ""}) }}
        error={errors.ethnicity}
      />

      <FieldLabel label="Education" />
      <SelectInput
        label="Select Education"
        placeholder="Select Education"
        value={education}
        options={EDUCATION_LEVELS}
        onSelect={(val: string) => { setEducation(val); setErrors({...errors, education: ""}) }}
        error={errors.education}
      />

      <Button
        onPress={save}
        isLoading={isLoading}
        title="Save Mother Info"
      />
    </>
  );
}
