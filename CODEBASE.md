# Codebase Overview


## File: .\app.json


``json

{
  "expo": {
    "name": "fchv-native",
    "slug": "fchv-native",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/fchv-logo.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./src/assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.fchvnative",
      "softwareKeyboardLayoutMode": "resize"
    },
    "web": {
      "favicon": "./src/assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "aa565ac2-2a29-45e8-9eb4-0c387425e7db"
      }
    },
    "plugins": [
      "@react-native-community/datetimepicker",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends.",
          "cameraPermission": "The app accesses your camera to let you take photos."
        }
      ],
      [
        "expo-camera",
        {
          "cameraPermission": "Allow this app to access the camera to take mother photos."
        }
      ]
    ],
    "owner": "anojbudathoki"
  }
}


``


## File: .\babel.config.js


``javascript

module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
         plugins: ["react-native-reanimated/plugin"]
    };
};


``


## File: .\package.json


``json

{
  "name": "fchv-native",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "@react-native-community/datetimepicker": "8.4.4",
    "@react-native-community/netinfo": "11.4.1",
    "@react-native-segmented-control/segmented-control": "^2.5.7",
    "@react-navigation/drawer": "^7.5.0",
    "axios": "^1.15.0",
    "clsx": "^2.1.1",
    "expo": "~54.0.33",
    "expo-blur": "~15.0.8",
    "expo-camera": "~17.0.10",
    "expo-constants": "~18.0.13",
    "expo-crypto": "~15.0.8",
    "expo-image-picker": "~17.0.10",
    "expo-linear-gradient": "~15.0.8",
    "expo-linking": "~8.0.11",
    "expo-router": "~6.0.23",
    "expo-sqlite": "~16.0.10",
    "expo-status-bar": "~3.0.9",
    "expo-updates": "~29.0.16",
    "i18next": "^25.8.5",
    "lucide-react-native": "^0.563.0",
    "moti": "^0.30.0",
    "nativewind": "^4.2.1",
    "nepali-date-converter": "^3.4.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-i18next": "^16.5.4",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-input-select": "^2.1.13",
    "react-native-keyboard-aware-scroll-view": "^0.9.5",
    "react-native-nepali-picker": "^1.1.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-worklets": "0.5.1",
    "tailwind-merge": "^3.4.0",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.2",
    "yup": "^1.7.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "babel-preset-expo": "^54.0.10",
    "typescript": "~5.9.2"
  },
  "private": true
}


``


## File: .\tsconfig.json


``json

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "nativewind-env.d.ts"
  ]
}


``


## File: .\src\api\API_LIST.tsx


``tsx

export const API_LIST = {
    pregnant_mother: {
        post: "/api/pregnancies/sync/"
    },
    mother: {
    request_otp: "/api/mothers/request-otp",
    register: "/api/mothers/register",
    create: "/api/mothers/",
    fetch: "/api/mothers/",
    refresh: "/api/token/refresh/",
    update: "/api/mothers/{id}/",
    delete: "/api/mothers/{id}/",
    details: "/api/mothers/{id}",
    phone_verify: "/api/mothers/phone-verify"
  },
   sync: {
    unsynced_table_list: "/api/mothers/sync-tables-list"
  },
}

``


## File: .\src\api\client\httpClient.ts


``typescript

// import { TokenService } from "@/src/utils/TokenService";
import axios, { type AxiosInstance, AxiosError, isAxiosError } from "axios";
// import { refreshToken } from "../services/auth/refreshToken";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/token";
import storage from "@/utils/storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const THREE_MINUTES = 3 * 60 * 1000;

export const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: THREE_MINUTES
});

httpClient.interceptors.request.use(async (config) => {
  const token = await storage.get(ACCESS_TOKEN_KEY);

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// // refresh access token after expire
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });

//   failedQueue = [];
// };

// const logAxiosError = (error: unknown) => {
//   if (!isAxiosError(error)) {
//     console.log("ERROR_MESSAGE:", "Unknown error");
//     return;
//   }

//   const statusCode = error.response?.status;
//   const errorCode = error.code;
//   const apiUrl = error.config?.url;
//   const method = error.config?.method?.toUpperCase();
//   const errorMessage = error.message;

//   console.log("ERROR_CODE:", errorCode);
//   console.log(
//     "ERROR_API:",
//     `${method ?? "UNKNOWN"} ${apiUrl ?? "UNKNOWN_URL"}`
//   );
//   console.log("ERROR_STATUS:", statusCode);
//   console.log("ERROR_MESSAGE:", errorMessage);
//   console.log("ERROR_RESPONSE_DATA:", error.response?.data);
// };

// httpClient.interceptors.response.use(
//   (response) => response,

//   async (error: AxiosError & { config: any }) => {
//     logAxiosError(error);
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return httpClient(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const { access, refresh } = await refreshToken();

//         await storage.set(ACCESS_TOKEN_KEY, access);
//         await storage.set(REFRESH_TOKEN_KEY, refresh);

//         httpClient.defaults.headers.common.Authorization = `Bearer ${access}`;
//         processQueue(null, access);

//         return httpClient(originalRequest);
//       } catch (err) {
//         const error = err as unknown as AxiosError;
//         processQueue(error, null);

//         // If refresh token fails with 401, logout and navigate to login
//         if (error?.response?.status === 401) {
//           await TokenService.logout();
//         }

//         return Promise.reject(error);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );


``


## File: .\src\api\services\pregnantWomen\mutation.ts


``typescript

import { API_LIST } from "@/api/API_LIST";
import { httpClient } from "@/api/client/httpClient";
import { CreatePregnancyPayload } from "@/hooks/database/types/pregnancyModal";


const postPregnancy = async (data: CreatePregnancyPayload) => {
  const response = await httpClient.post<CreatePregnancyPayload>(
    `${API_LIST.pregnant_mother.post}`,
    data
  );
  return response.data;
};

export { postPregnancy };


``


## File: .\src\api\services\pregnantWomen\queries.ts


``typescript


import { insertToTempPregnancyTable, moveTempToRealPregnancyTable } from "@/hooks/database/models/PregnantWomenModal";
import { API_LIST } from "../../API_LIST";
import { httpClient } from "../../client/httpClient";
import { PaginationType } from "../types/global_api";
import { PregnancyAPIParams, PregnancyAPIResponse } from "../types/pregnancy";
import { clearTable } from "@/hooks/database/models/CommonModal";

const fetchPregnancyFromServer = async (params: PregnancyAPIParams) => {
  let URL = `${API_LIST.pregnant_mother.post}?page=1&page_size=200`;
  let isEOR = false; // end of response

  await clearTable("pregnancy_staging");
  while (!isEOR) {
    const res = await httpClient.get<PaginationType<PregnancyAPIResponse>>(URL, {
      params: { ...params, include_deleted: true, page_size: 200 }
    });
    const response = res.data;
    if (response.next === null) {
      isEOR = true;
    } else {
      URL = response.next;
    }

    // INSERTION
    await insertToTempPregnancyTable(response.results);
  }

  await moveTempToRealPregnancyTable();
  await clearTable("pregnancy_staging");
};

export { fetchPregnancyFromServer };


``


## File: .\src\api\services\sync\helper.ts


``typescript

import { getDb } from "@/hooks/database/db";
import { TableType } from "@/hooks/database/types/table";

export async function markAsSynced(
  tableName: TableType,
  id: string,
  synced: boolean
) {
  const db = await getDb();
  await db.runAsync(`UPDATE ${tableName} SET is_synced = ? WHERE id = ?;`, [
    synced ? 1 : 0,
    id
  ]);
}

export async function sendUnsyncedToServer<T extends { id: string }>(
  fetchFn: () => Promise<T[]>,
  postFn: (payload: T[]) => Promise<T[]>,
  tableName: TableType
) {
  // Fetch local data that are unsynced i.e is_synced being 0 :)
  const unsynced = await fetchFn();
  if (!unsynced.length) return; // assume it's synced

  // Then sending those data to server
  const response: T[] = await postFn(unsynced);

  // Creating local map so we can compare the response from server and the payload we sent. Basically double checking if server has sent us back the data we sent for syncing
  const localMap = new Map<string, { id: string }>();

  unsynced.forEach((local) => {
    localMap.set(local.id, local);
  });

  for (const serverItem of response) {
    const localMatch = localMap.get(serverItem.id);

    if (localMatch) {
      await markAsSynced(tableName, localMatch.id, true);
    }
  }
}


``


## File: .\src\api\services\sync\sync.tsx


``tsx


import { DeviceEventEmitter } from "react-native";
import { API_LIST } from "../../API_LIST";
import { httpClient } from "../../client/httpClient";
import { SyncTableType, TableType } from "@/hooks/database/types/table";
import { getTablesWithTimestamp } from "@/hooks/database/models/SyncModel";
import { getUnsyncedPregnancyFromServer, sendUnsyncedPregnancyToServer } from "./syncPregnancy";
import { getSelectedPregnancy } from "@/hooks/database/models/PregnantWomenModal";

const SYNCERS: Partial<
  Record<SyncTableType, (last_synced_at: string | null) => Promise<void>>
> = {
  pregnancy: (last_synced_at: string | null) =>
    getUnsyncedPregnancyFromServer(last_synced_at),
};

export let isGlobalSyncRunning = false;

const doSync = async (sendOnly?: boolean) => {
//   const isLoggedIn = await TokenService.checkAuth();
//   if (!isLoggedIn) return;

  isGlobalSyncRunning = true;
  DeviceEventEmitter.emit("sync.started");

  await sendUnsyncedPregnancyToServer();

  if (sendOnly) return;

  const timestamps = await getTablesWithTimestamp();
  const rawTables = (await fetchUnsyncedTablesFromServer(timestamps)) || [];

  for (const table of rawTables) {
    const fn = SYNCERS[table];
    if (!fn) continue;

    try {
      const last_synced_at = timestamps[table as TableType] ?? null;
      console.log(`[SYNC] start ${table}`);
      await fn(last_synced_at);
      console.log(`[SYNC] done  ${table}`);
    } catch (e) {
      console.error(`[SYNC] fail  ${table}`, e);
    }
  }

  isGlobalSyncRunning = false;
  DeviceEventEmitter.emit("sync.completed");
};

const fetchUnsyncedTablesFromServer = async (
  timestamps: Record<TableType, string | null>
) => {
  try {
    const pregnancy = await getSelectedPregnancy();
    if (!pregnancy) throw new Error("No selected pregnancy found");
    const pregnancy_id = pregnancy.id;

    const response = await httpClient.post<SyncTableType[]>(
      `${API_LIST.sync.unsynced_table_list}/${pregnancy_id}`,
      timestamps
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch unsynced tables from server", err);
  }
};

export { doSync, fetchUnsyncedTablesFromServer };



``


## File: .\src\api\services\sync\syncMother.ts


``typescript


``


## File: .\src\api\services\sync\syncPregnancy.ts


``typescript


import { markAsSynced } from "./helper";
import { fetchPregnancyFromServer } from "../pregnantWomen/queries";
import { unSyncedPregnancies } from "@/hooks/database/models/PregnantWomenModal";
import { postPregnancy } from "../pregnantWomen/mutation";

export async function sendUnsyncedPregnancyToServer() {
  const unsynced = await unSyncedPregnancies();
  if (!unsynced.length) return;

  for (const item of unsynced) {
    try {
      const response = await postPregnancy(item);
      if (response && response.id) {
        await markAsSynced("pregnancy", response.id, true);
      }
    } catch (error) {
      console.error(`Failed to sync pregnancy with ID ${item.id}:`, error);
    }
  }
}

export async function getUnsyncedPregnancyFromServer(
  last_synced_at: string | null
) {
  await fetchPregnancyFromServer({
    sync_timestamp: last_synced_at
  });
}

export async function syncKickCounter() {
  // const isLoggedIn = await TokenService.checkAuth();
  // if (!isLoggedIn) return;
  await sendUnsyncedPregnancyToServer();
}


``


## File: .\src\api\services\types\common.ts


``typescript

type CommonBulkType = {
  deleted: boolean;
  created_at: string;
  updated_at: string;
};

type PaginationParams = {
  page: number;
  page_size: number;
};

type CommonSyncTimestampParam = {
  sync_timestamp: string | null;
};

export { CommonBulkType, CommonSyncTimestampParam, PaginationParams };


``


## File: .\src\api\services\types\global_api.ts


``typescript

export type PaginationType<T> = {
  count: number;
  results: T[];
  next: string | null;
};

export type AppVersion = {
  latest: string;
  min_supported: string;
  android_store_url: string;
  ios_store_url: string;
};


``


## File: .\src\api\services\types\pregnancy.ts


``typescript

import {
  CommonBulkType,
  CommonSyncTimestampParam,
  PaginationParams
} from "./common";

export type pregnancyBulkType = {
  id: string;
  name: string;
  lmp_date: string;
  session_start: string;
  caretakers_name: string;
  caretakers_phone: string;
  expected_delivery_date: string;
  parity: number;
  session_end: string;
} & CommonBulkType;

export type PregnancyAPIResponse = {
  id: string;
  session_start: string;
  session_end: string;
  count: number;
} & CommonBulkType;

export type PregnancyAPIParams = Partial<
  PaginationParams & CommonSyncTimestampParam
>;


``


## File: .\src\app\index.tsx


``tsx

import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Loader2Icon } from "lucide-react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-3xl font-extrabold text-primary">
        Welcome to FCHV
      </Text>
      <Loader2Icon className="animate-spin" />
    </View>
  );
}


``


## File: .\src\app\login.tsx


``tsx

import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Lock, Mail } from "lucide-react-native";
import Svg, { Path } from "react-native-svg";
import InputField from "../components/InputField";
import { useRouter } from "expo-router";
import { useLanguage } from "../context/LanguageContext";
import "../global.css";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    if (!phone.trim() || !pin) {
      setErrorMessage("Phone number and PIN are required.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Hardcoded login for demonstration
      if (phone === "1" && pin === "1") {
        setErrorMessage("");
        router.replace("/dashboard");
      } else {
        setErrorMessage("Invalid Email or Password");
      }
    }, 1500);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      {/* Top Section with Wave - Using App Colors (Green) */}
      <View style={{ height: 280 }}>
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-primary" />
        <View className="absolute bottom-0 w-full">
          <Svg
            height="120"
            width={width}
            viewBox={`0 0 ${width} 120`}
            fill="none"
          >
            <Path
              d={`M0 40 C ${width / 3} 0, ${width / 1.5} 80, ${width} 40 V 120 H 0 Z`}
              fill="white"
            />
          </Svg>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        style={{ zIndex: 10 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-8"
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Text */}
          <View className="mt-6">
            <View className="flex-row items-center">
              <Text className="text-[30px] font-bold text-text-secondary">Welcome Back </Text>
            </View>
            <Text className="text-gray-400 font-medium text-base mt-2">
               Please login to your account to continue.
            </Text>
          </View>

          {/* Form Content */}
          <View className="flex-1 mt-8">
            <InputField
              label={t("login.health_id_label")}
              placeholder={t("login.health_id_placeholder")}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                setErrorMessage("");
              }}
              leftIcon={<Mail size={22} color="#94a3b8" />}
            />

            <InputField
              label={t("login.password_label")}
              placeholder={t("login.password_placeholder")}
              secureTextEntry
              value={pin}
              onChangeText={(text) => {
                setPin(text);
                setErrorMessage("");
              }}
              leftIcon={<Lock size={22} color="#94a3b8" />}
            />

            <View className="flex-row items-center justify-between mb-6 ">
              <View className="flex-row items-center">
                <Text className="text-gray-400 font-bold text-[11px] uppercase tracking-wider">Secure Access</Text>
              </View>
              <TouchableOpacity>
                <View className="flex-row">
                  <Text className="text-primary font-bold text-[13px]">{t("login.forgot_password")} </Text>
                </View>
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text className="text-red-500 font-bold text-sm mb-6 text-center">
                {errorMessage}
              </Text>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={isLoading}
              className="w-full bg-primary rounded-2xl h-16 items-center justify-center shadow-xl shadow-emerald-100 flex-row"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-black text-xl">{t("login.login_button")} </Text>
              )}
            </TouchableOpacity>

            <Text className="text-[10px] text-center mt-6 text-gray-400">
              Department of Health Services Government of Nepal
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}


``


## File: .\src\app\_layout.tsx


``tsx

import "react-native-gesture-handler";
import React from "react";
import "../global.css";
import "../i18n/config"; // Import i18n config
import { Slot } from "expo-router";
import { useEffect } from "react";
import { LanguageProvider } from "../context/LanguageContext";
import { ToastProvider } from "../context/ToastContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { doSync } from "@/api/services/sync/sync";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function RootLayout() {
   // Mounts the network listener for data synchronization
   const { isConnected } = useOnlineStatus();

  // useEffect(() => {
  //   if(isConnected){
  //     doSync();
  //   }
  // }, [isConnected, doSync]);

  useEffect(() => {
    import("@/hooks/database/db").then(({ initDatabase }) => {
      initDatabase().catch(err => console.error("DB Init Error:", err));
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="white" translucent={true} />
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <ToastProvider>
            <LanguageProvider>
              <Slot />
            </LanguageProvider>
          </ToastProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}


``


## File: .\src\app\dashboard\change-language.tsx


``tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Check } from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "expo-router";
import NavigationLayout from "@/components/NavigationLayout";
import Animated from "react-native-reanimated";

type LanguageOption = {
  code: "en" | "np";
  name: string;
  nativeName: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    code: "np",
    name: "Nepali",
    nativeName: "नेपाली",
    flag: "🇳🇵",
  },
];

export default function ChangeLanguageScreen() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [selected, setSelected] = useState<"en" | "np">(language);

  const handleSelect = (code: "en" | "np") => {
    setSelected(code);
    if (code !== language) {
      setLanguage(code);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <NavigationLayout 
        onBackPress={() => router.push("/dashboard/profile")} 
        title="Language Selector" 
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Language Cards */}
        <View className="gap-4 mt-8">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;

            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.85}
                onPress={() => handleSelect(lang.code)}
              >
                <Animated.View
                  className={`bg-white rounded-3xl p-6 border-2 ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-100"
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-14 h-14 rounded-2xl items-center justify-center ${
                          isSelected ? "bg-emerald-100" : "bg-gray-50"
                        }`}
                      >
                        <Text style={{ fontSize: 28 }}>{lang.flag}</Text>
                      </View>

                      <View className="ml-4">
                        <Text
                          className={`text-lg font-bold ${
                            isSelected ? "text-emerald-700" : "text-gray-800"
                          }`}
                        >
                          {lang.name}
                        </Text>
                        <Text className="text-gray-400 text-sm font-medium mt-0.5">
                          {lang.nativeName}
                        </Text>
                      </View>
                    </View>

                    <View
                      className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check size={16} color="#fff" />}
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}


``


## File: .\src\app\dashboard\child-death-report.tsx


``tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Share
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Download, Filter, Search, Trash2 } from "lucide-react-native";
import "../../global.css";
import { getAllChildDeaths, deleteChildDeath } from "../../hooks/database/models/ChildDeathModel";
import { ChildDeathStoreType } from "../../hooks/database/types/childDeathModal";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function ChildDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<ChildDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no child death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Child Name", "Gender", "Parent Name", 
        "Birth Day", "Birth Month", "Birth Year", 
        "Death Age (Months)", "Cause of Death", "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        return [
          index + 1,
          `"${item.child_name}"`,
          `"${item.gender ?? ''}"`,
          `"${item.mother_name}"`,
          item.birth_day,
          item.birth_month,
          item.birth_year,
          item.death_age_months,
          `"${item.cause_of_death}"`,
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Child Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, childName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${childName || 'Child'}" को मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChildDeath(id);
              setData((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              Alert.alert("Error", "Record could not be deleted.");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const records = await getAllChildDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching child deaths", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const Cell = ({ children, width, borderRight = true }: any) => (
    <View 
      style={{ width }} 
      className={`h-full justify-center px-2 py-4 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-bold text-[11px] text-center" numberOfLines={3}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 40, borderRight = true, borderBottom = true, bgColor = "bg-slate-100" }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-1 ${bgColor} ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-black text-[10px] text-center uppercase">
        {children}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="बाल मृत्यु विवरण दर्ता" 
        onBackPress={() => router.push("/dashboard/profile")}
        rightNode={
          <TouchableOpacity 
            onPress={handleDownload}
            className="bg-emerald-50 p-2 rounded-xl"
          >
            <Download size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1">
        {/* Table Controls */}
        <View className="flex-row px-4 py-4 gap-3 bg-white border-b border-gray-100">
           <View className="flex-1 flex-row items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} color="#64748B" />
              <Text className="ml-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Search Register...</Text>
           </View>
           <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <Filter size={20} color="#64748B" />
           </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
          <View>
            {/* Hierarchical Header - Matches Image Design */}
            <View className="flex-row border-b border-gray-300 bg-slate-200">
              <HeaderCell width={50} height={100} bgColor="bg-slate-200">क्र.सं.</HeaderCell>
              <HeaderCell width={180} height={100} bgColor="bg-slate-200">मृतक बच्चाको नाम</HeaderCell>
              <HeaderCell width={100} height={100} bgColor="bg-slate-200">लिङ्ग (Gender)</HeaderCell>
              <HeaderCell width={220} height={100} bgColor="bg-slate-200">मृतक बच्चाको आमा वा बाबुको नाम, थर</HeaderCell>
              
              {/* Birth Date Section */}
              <View>
                <HeaderCell width={180} height={50} bgColor="bg-slate-200">बच्चा जन्मेको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">गते</HeaderCell>
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">महिना</HeaderCell>
                  <HeaderCell width={60} height={50} bgColor="bg-slate-200">साल</HeaderCell>
                </View>
              </View>

              <HeaderCell width={120} height={100} bgColor="bg-slate-200">मृत्यु हुँदा बच्चाको उमेर (महिनामा)</HeaderCell>
              <HeaderCell width={250} height={100} bgColor="bg-slate-200">मृत्युको सम्भाव्य कारण*</HeaderCell>
              <HeaderCell width={200} height={100} bgColor="bg-slate-200">कैफियत</HeaderCell>
              <HeaderCell width={70} height={100} borderRight={false} bgColor="bg-slate-200">Action</HeaderCell>
            </View>

            {/* Column Numbers Row (१, २, ३...) - Matches Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
               {[
                 {n: 1, w: 50}, 
                 {n: 2, w: 180}, 
                 {n: 3, w: 100},
                 {n: 4, w: 220}, 
                 {n: 5, w: 60}, 
                 {n: 6, w: 60}, 
                 {n: 7, w: 60}, 
                 {n: 8, w: 120}, 
                 {n: 9, w: 250}, 
                 {n: 10, w: 200},
                 {n: 0, w: 70}
               ].map((col, i) => (
                  <View key={i} style={{ width: col.w, height: 30 }} className={`border-r border-gray-300 justify-center items-center ${i === 10 ? 'border-r-0' : ''}`}>
                    <Text className="text-slate-400 font-bold text-[11px]">{col.n || 'Action'}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => (
                <View key={item.id} className="flex-row border-b border-gray-200">
                  <Cell width={50}>{index + 1}</Cell>
                  <Cell width={180}>{item.child_name}</Cell>
                  <Cell width={100}>{item.gender === 'Male' ? 'छोरा' : item.gender === 'Female' ? 'छोरी' : '-'}</Cell>
                  <Cell width={220}>{item.mother_name}</Cell>
                  
                  {/* Birth Date */}
                  <Cell width={60}>{item.birth_day}</Cell>
                  <Cell width={60}>{item.birth_month}</Cell>
                  <Cell width={60}>{item.birth_year}</Cell>

                  <Cell width={120}>{item.death_age_months}</Cell>
                  <Cell width={250}>{item.cause_of_death}</Cell>
                  <Cell width={200}>{item.remarks}</Cell>

                  <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id!, item.child_name!)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 1430 }}>
                  <Text className="text-slate-400 font-black italic">No child mortality records found in this register.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\follow-up.tsx


``tsx

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useLocalSearchParams, useRouter } from "expo-router";
import InputField from "../../components/InputField";
import { SelectInput, FieldLabel } from "../../components/FormElements";
import { getAllMothersList, MotherListDbItem } from "../../hooks/database/models/MotherModel";
import {
  User,
  Calendar,
  FileText,
  MapPin,
  ChevronDown,
  Stethoscope,
  Baby,
  ClipboardList,
} from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import NavigationLayout from "@/components/NavigationLayout";
import { useVisit } from "../../hooks/useVisit";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/button";

type VisitType = "ANC" | "PNC";

const VISIT_TYPES: { label: string; labelNp: string; value: VisitType; icon: any; color: string; bg: string }[] = [
  { label: "ANC", labelNp: "प्रसवपूर्व जाँच", value: "ANC", icon: Stethoscope, color: "#3B82F6", bg: "bg-blue-50" },
  { label: "PNC", labelNp: "प्रसवपश्चात् जाँच", value: "PNC", icon: Baby, color: "#E11D48", bg: "bg-rose-50" },
];

export default function FollowUpForm() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addVisit, editVisit, getVisit, isLoading } = useVisit();
  const { showToast } = useToast();
  const router = useRouter();

  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [selectedMotherId, setSelectedMotherId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [visitType, setVisitType] = useState<VisitType | "">("");
  const [remarks, setRemarks] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<{ motherId?: string; name?: string; date?: string; visitType?: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getAllMothersList();
        setMothers(list);

        if (id) {
          const visit = await getVisit(id);
          if (visit) {
            setSelectedMotherId(visit.mother_id);
            setName(visit.name || "");
            setAddress(visit.address || "");
            setDate(visit.visit_date);
            setVisitType(visit.visit_type as VisitType);
            setRemarks(visit.visit_notes || "");
          }
        } else {
          // Reset form for fresh entry
          setSelectedMotherId("");
          setName("");
          setAddress("");
          setDate("");
          setVisitType("");
          setRemarks("");
          setErrors({});
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleMotherSelect = (motherId: string) => {
    setSelectedMotherId(motherId);
    const mother = mothers.find(m => m.id === motherId);
    if (mother) {
      setName(mother.name);
      setAddress(mother.ward);
    }
    if (errors.motherId) setErrors({ ...errors, motherId: undefined });
  };

  const formatDate = (d: Date) => {
    try {
      return d.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(formatDate(selectedDate));
      if (errors.date) setErrors({ ...errors, date: undefined });
    }
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!selectedMotherId) newErrors.motherId = "Please select a mother";
    if (!name.trim()) newErrors.name = "Name is required";
    if (!date) newErrors.date = "Visit date is required";
    if (!visitType) newErrors.visitType = "Select visit type (ANC/PNC)";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      mother_id: selectedMotherId,
      name: name.trim(),
      address: address.trim(),
      visit_date: date,
      visit_type: visitType as VisitType,
      visit_notes: remarks.trim(),
    };

    const result = id
      ? await editVisit(id, payload)
      : await addVisit(payload);

    if (result.success) {
      showToast(id ? "Visit updated successfully." : "Visit recorded successfully.");
      if (id) {
        router.back();
      } else {
        setSelectedMotherId("");
        setName("");
        setAddress("");
        setDate("");
        setVisitType("");
        setRemarks("");
        setErrors({});
      }
    } else {
      showToast(id ? "Failed to update visit." : "Failed to save visit.");
    }
  };

  const selectedType = VISIT_TYPES.find((t) => t.value === visitType);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <NavigationLayout title={id ? "Edit Visit" : "Visit"} />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={20}
      >
        {/* Mother Selection */}
        <View className="mb-2">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">Select Mother</Text>
            <Text className="text-gray-400 font-bold text-[11px] uppercase">आमा छनोट गर्नुहोस्</Text>
          </View>
          <SelectInput
            placeholder="Choose a mother..."
            value={selectedMotherId}
            options={mothers.map(m => ({ value: m.id, label: `${m.name} (${m.ward})` }))}
            onSelect={handleMotherSelect}
            error={errors.motherId}
          />
        </View>
        {/* Visit Type Dropdown */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-1.5 px-0.5">
            <Text className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">Visit Type</Text>
            <Text className="text-gray-400 font-bold text-[11px] uppercase">भ्रमण प्रकार</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDropdown(!showDropdown)}
            className={`flex-row items-center border-b ${errors.visitType ? "border-red-500" : "border-gray-200"} h-14 pb-1`}
          >
            <View className="mr-2">
              <ClipboardList size={18} color="#64748B" />
            </View>
            <Text className={`flex-1 text-lg font-bold ${selectedType ? 'text-[#1E293B]' : 'text-[#cbd5e1]'}`}>
              {selectedType ? selectedType.label : "Select Visit Type"}
            </Text>
            <ChevronDown size={18} color="#94a3b8" />
          </TouchableOpacity>

          {showDropdown && (
            <View className="bg-white border border-gray-200 rounded-xl mt-2 shadow-sm overflow-hidden">
              {VISIT_TYPES.map((type, index) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    setVisitType(type.value);
                    setShowDropdown(false);
                    if (errors.visitType) setErrors({ ...errors, visitType: undefined });
                  }}
                  className={`px-4 py-3.5 flex-row justify-between items-center ${index < VISIT_TYPES.length - 1 ? 'border-b border-gray-100' : ''
                    } ${visitType === type.value ? 'bg-blue-50' : ''}`}
                >
                  <Text className={`text-[15px] ${visitType === type.value ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                    {type.label}
                  </Text>
                  {visitType === type.value && (
                    <Text className="text-blue-600 font-bold">✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          {errors.visitType && (
            <Text className="text-red-500 text-xs mt-1.5 font-medium">{errors.visitType}</Text>
          )}
        </View>

        {/* Name */}
        <InputField
          label="Name"
          subLabel="नाम"
          placeholder="Full Name"
          value={name}
          onChangeText={(txt) => {
            setName(txt);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          leftIcon={<User size={18} color="#64748B" />}
          error={errors.name}
        />

        {/* Address */}
        <InputField
          label="Address"
          subLabel="ठेगाना"
          placeholder="Ward, Municipality"
          value={address}
          onChangeText={setAddress}
          leftIcon={<MapPin size={18} color="#64748B" />}
        />

        {/* Visit Date */}
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <InputField
              label="Visit Date"
              subLabel="भ्रमण मिति"
              placeholder="YYYY-MM-DD"
              value={date}
              leftIcon={<Calendar size={18} color="#64748B" />}
              editable={false}
              error={errors.date}
            />
          </View>
        </Pressable>
        {showDatePicker && (() => {
          const maxDate = new Date();
          if (visitType === "ANC") {
            maxDate.setMonth(maxDate.getMonth() + 9);
          } else if (visitType === "PNC") {
            maxDate.setFullYear(maxDate.getFullYear() + 1);
          }

          return (
            <DateTimePicker
              value={date ? new Date(date) : new Date()}
              mode="date"
              display="spinner"
              maximumDate={maxDate}
              onChange={onDateChange}
            />
          );
        })()}

        {/* Remarks */}
        <InputField
          label="Remarks"
          subLabel="कैफियत"
          placeholder="Notes about the visit..."
          value={remarks}
          onChangeText={setRemarks}
          leftIcon={<FileText size={18} color="#64748B" />}
        />

        <View className="mt-4">
          <Button
            title={id ? "Update Visit" : "Save Visit"}
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\index.tsx


``tsx

import React, { useEffect, useState, useCallback } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import { Svg, Path, Circle, Defs, LinearGradient as SvgGradient, Stop, Text as SvgText, Line, G, Rect } from 'react-native-svg';
import {
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  Smile,
  Baby,
  ChevronLeft,
  Activity
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { useTodo } from "../../hooks/useTodo";
import { TodoItem } from "../../hooks/database/models/TodoModel";
import { useLanguage } from "../../context/LanguageContext";
import Colors from "../../constants/Colors";
import TopHeader from "@/components/layout/TopHeader";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { doSync } from "../../api/services/sync/sync";
import { getMotherCount } from "../../hooks/database/models/MotherModel";
import { getPregnancyCount } from "../../hooks/database/models/PregnantWomenModal";
import { getAllVisits, VisitListItem } from "../../hooks/database/models/VisitModel";
import { getAllHmisRecords } from "../../hooks/database/models/HmisRecordModel";
import { getTotalMaternalDeaths } from "../../hooks/database/models/MaternalDeathModel";
import { getTotalNewbornDeaths, getAllNewbornDeaths } from "../../hooks/database/models/NewbornDeathModel";
import { getTotalChildDeaths, getAllChildDeaths } from "../../hooks/database/models/ChildDeathModel";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";

import "../../global.css";


const LineChart = ({ data, color, labels }: { data: number[], color: string, labels: string[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const height = 120;
  const [width, setWidth] = useState(300);

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  const maxVal = Math.max(...data, 1);
  const stepX = (width - 40) / (data.length - 1);

  const points = data.map((val, i) => {
    const x = 20 + i * stepX;
    const y = height - (val / (maxVal * 1.5)) * height;
    return { x, y, value: val };
  });

  const d = points.reduce((acc, p, i) =>
    i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`, ""
  );

  const fillD = `${d} L ${width - 20},${height} L 20,${height} Z`;

  return (
    <View className="w-full" onLayout={onLayout}>
      <Svg width={width} height={height + 30} viewBox={`0 -20 ${width} ${height + 25}`}>
        <Defs>
          <SvgGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.15" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Path d={fillD} fill={`url(#grad-${color})`} />
        <Path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <React.Fragment key={i}>
            <Circle 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              fill="white" 
              stroke={color} 
              strokeWidth="2"
              onPressIn={() => setActiveIndex(i)}
            />
            {(activeIndex === i || i === 0 || i === data.length - 1 || data[i] > 0) && (
              <View 
                style={{ 
                  position: 'absolute', 
                  left: p.x - 15, 
                  top: p.y - 45, 
                  backgroundColor: activeIndex === i ? color : '#F8FAFC',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: activeIndex === i ? color : '#E2E8F0'
                }}
              >
                <Text style={{ fontSize: 9, color: activeIndex === i ? 'white' : '#64748B', fontWeight: '600' }}>
                  {p.value}
                </Text>
              </View>
            )}
          </React.Fragment>
        ))}
      </Svg>
      <View className="flex-row justify-between w-full mt-2 px-5">
        {labels.map((l, i) => (
          <Text key={i} className="text-[10px] font-medium text-slate-400">{l}</Text>
        ))}
      </View>
    </View>
  );
};

const PieChart = ({ data }: { data: { label: string, value: number, color: string }[] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  if (total === 0) return null;

  let currentAngle = 0;
  const radius = 45;
  const cx = 50;
  const cy = 50;

  return (
    <View className="flex-row items-center justify-between w-full px-4">
      <Svg width="100" height="100" viewBox="0 0 100 100">
        {data.map((slice, i) => {
          if (slice.value === 0) return null;
          const sliceAngle = (slice.value / total) * 360;
          const radCurrent = (currentAngle * Math.PI) / 180;
          const radSlice = ((currentAngle + sliceAngle) * Math.PI) / 180;

          const x1 = cx + radius * Math.cos(radCurrent);
          const y1 = cy + radius * Math.sin(radCurrent);
          const x2 = cx + radius * Math.cos(radSlice);
          const y2 = cy + radius * Math.sin(radSlice);

          currentAngle += sliceAngle;

          if (sliceAngle === 360) {
            return <Circle key={i} cx={cx} cy={cy} r={radius} fill={slice.color} stroke="#fff" strokeWidth={2} />;
          }

          const largeArcFlag = sliceAngle > 180 ? 1 : 0;
          const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          return <Path key={i} d={pathData} fill={slice.color} stroke="#fff" strokeWidth={2} />;
        })}
        <Circle cx={cx} cy={cy} r={28} fill="#fff" />
      </Svg>
      <View className="flex-1 ml-8 gap-y-3">
        {data.map((item, i) => (
          <View key={i} className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
              <Text className="text-[11px] text-slate-500 font-medium uppercase tracking-tight">{item.label}</Text>
            </View>
            <View className="bg-slate-50 px-2 py-0.5 rounded-md">
              <Text className="text-[11px] text-slate-900 font-semibold">{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const BarChart = ({ data, color }: { data: { label: string, value: number }[], color: string }) => {
  const height = 120;
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View className="w-full flex-row items-end justify-between h-[120px] px-1">
      {data.map((item, i) => {
        const barHeight = (item.value / maxVal) * (height - 30);
        return (
          <View key={i} className="items-center flex-1">
            {item.value > 0 && <Text className="text-[9px] text-slate-900 font-semibold mb-1">{item.value}</Text>}
            <View
              style={{ height: Math.max(barHeight, 4), backgroundColor: color }}
              className="w-1.5 rounded-full opacity-90"
            />
            <Text className="text-[8px] text-slate-400 mt-2 font-medium uppercase">{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

const MultiLineChart = ({ data, colors, labels }: { data: { label: string, male: number, female: number }[], colors: { male: string, female: string }, labels: string[] }) => {
  const [width, setWidth] = useState(300);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartHeight = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;
  const totalHeight = chartHeight + paddingTop + paddingBottom;

  const onLayout = (event: any) => {
    setWidth(event.nativeEvent.layout.width);
  };

  if (!data || data.length < 2) {
    return (
      <View className="h-32 items-center justify-center">
        <Text className="text-slate-400 text-xs font-medium italic">Loading chart data...</Text>
      </View>
    );
  }

  const maxDataVal = Math.max(...data.flatMap(d => [d.male, d.female]), 1);
  const roundedMax = Math.ceil(maxDataVal / 5) * 5;
  const yTicks = [0, roundedMax * 0.2, roundedMax * 0.4, roundedMax * 0.6, roundedMax * 0.8, roundedMax];
  
  const availableWidth = width - paddingLeft - paddingRight;
  const stepX = availableWidth / (data.length - 1);

  const getPoints = (key: 'male' | 'female') => {
    return data.map((val, i) => ({
      x: paddingLeft + i * stepX,
      y: paddingTop + chartHeight - (val[key] / roundedMax) * chartHeight,
      value: val[key]
    }));
  };

  const malePoints = getPoints('male');
  const femalePoints = getPoints('female');

  const getBezierPath = (points: { x: number, y: number }[]) => {
    if (points.length < 2) return "";
    let d = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const malePath = getBezierPath(malePoints);
  const femalePath = getBezierPath(femalePoints);

  const maleFill = `${malePath} L ${malePoints[malePoints.length - 1].x},${paddingTop + chartHeight} L ${malePoints[0].x},${paddingTop + chartHeight} Z`;
  const femaleFill = `${femalePath} L ${femalePoints[femalePoints.length - 1].x},${paddingTop + chartHeight} L ${femalePoints[0].x},${paddingTop + chartHeight} Z`;

  return (
    <View className="w-full" onLayout={onLayout}>
      <View className="flex-row items-center justify-center mb-8 gap-x-8">
         <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.male }} />
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Male</Text>
         </View>
         <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors.female }} />
            <Text className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Female</Text>
         </View>
      </View>
      
      <Svg width={width} height={totalHeight} viewBox={`0 0 ${width} ${totalHeight}`}>
        <Defs>
          <SvgGradient id="grad-male" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.male} stopOpacity="0.15" />
            <Stop offset="1" stopColor={colors.male} stopOpacity="0" />
          </SvgGradient>
          <SvgGradient id="grad-female" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.female} stopOpacity="0.15" />
            <Stop offset="1" stopColor={colors.female} stopOpacity="0" />
          </SvgGradient>
        </Defs>

        {/* Y-Axis Ticks and Horizontal Grid */}
        {yTicks.map((tick, i) => {
          const y = paddingTop + chartHeight - (tick / roundedMax) * chartHeight;
          return (
            <React.Fragment key={i}>
              <Line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#F1F5F9" strokeWidth="1" />
              {/* @ts-ignore */}
              <SvgText x={paddingLeft - 8} y={y + 4} textAnchor="end" fontSize="9" fill="#94A3B8" fontWeight="600">
                {Math.round(tick)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {/* X-Axis Vertical Grid */}
        {data.map((_, i) => {
           const x = paddingLeft + i * stepX;
           return (
             <Line key={i} x1={x} y1={paddingTop} x2={x} y2={paddingTop + chartHeight} stroke="#F8FAFC" strokeWidth="1" />
           );
        })}

        <Path d={maleFill} fill="url(#grad-male)" />
        <Path d={femaleFill} fill="url(#grad-female)" />
        <Path d={malePath} fill="none" stroke={colors.male} strokeWidth="3" strokeLinecap="round" />
        <Path d={femalePath} fill="none" stroke={colors.female} strokeWidth="3" strokeLinecap="round" />

        {/* Touch Hotspots and month labels */}
        {data.map((item, i) => {
          const x = paddingLeft + i * stepX;
          return (
            <React.Fragment key={i}>
              {/* @ts-ignore */}
              <SvgText 
                x={x} y={paddingTop + chartHeight + 20} 
                textAnchor="middle" fontSize="9" fill={activeIndex === i ? "#1E293B" : "#94A3B8"} fontWeight="700"
              >
                {item.label}
              </SvgText>
              
              <Circle 
                cx={malePoints[i].x} cy={malePoints[i].y} r="4" 
                fill="white" stroke={colors.male} strokeWidth="2.5" 
                onPressIn={() => setActiveIndex(i)}
              />
              <Circle 
                cx={femalePoints[i].x} cy={femalePoints[i].y} r="4" 
                fill="white" stroke={colors.female} strokeWidth="2.5" 
                onPressIn={() => setActiveIndex(i)}
              />
              
              {/* Transparent hit area for whole vertical slice */}
              <Rect 
                x={x - 15} y={paddingTop} width="30" height={chartHeight} 
                fill="transparent" 
                onPressIn={() => setActiveIndex(i)} 
              />
            </React.Fragment>
          );
        })}

        {activeIndex !== null && (
          <G x={Math.max(paddingLeft, Math.min(width - 100, malePoints[activeIndex].x - 45))} y={Math.max(5, Math.min(malePoints[activeIndex].y, femalePoints[activeIndex].y) - 50)}>
            <Rect width="90" height="40" rx="12" fill="#1E293B" />
            {/* @ts-ignore */}
            <SvgText x="45" y="24" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
              M: {data[activeIndex].male}  F: {data[activeIndex].female}
            </SvgText>
          </G>
        )}
      </Svg>
    </View>
  );
};

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { isConnected } = useOnlineStatus();
  const [motherCount, setMotherCount] = useState(0);
  const [pregnancyCount, setPregnancyCount] = useState(0);
  const [maternalDeathCount, setMaternalDeathCount] = useState(0);
  const [newbornDeathCount, setNewbornDeathCount] = useState(0);
  const [childDeathCount, setChildDeathCount] = useState(0);

  const [newbornStats, setNewbornStats] = useState<{ label: string, value: number, color: string }[]>([]);
  const [newbornTrend, setNewbornTrend] = useState<{ label: string, male: number, female: number }[]>([]);

  const [childStats, setChildStats] = useState<{ label: string, value: number, color: string }[]>([]);
  const [childTrend, setChildTrend] = useState<{ label: string, male: number, female: number }[]>([]);

  const [recentVisits, setRecentVisits] = useState<VisitListItem[]>([]);
  const [hmisRecords, setHmisRecords] = useState<HmisRecordStoreType[]>([]);
  const [ancTrend, setAncTrend] = useState({
    w12: 0, w16: 0, w20: 0, w28: 0, w32: 0, w34: 0, w36: 0, w40: 0
  });
  const [pncTrend, setPncTrend] = useState({
    hr24: 0, day3: 0, day7_14: 0, day42: 0
  });

  const scrollRef = React.useRef<ScrollView>(null);
  const todoInputRef = React.useRef<TextInput>(null);
  const { todos, fetchTodos, addTodo, editTodo, removeTodo, toggleTodo } = useTodo();
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      doSync();
    }
  }, [isConnected]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [mCount, pCount, visits, hRecords, mdCount, ndCount, cdCount, nDeathsList, cDeathsList] = await Promise.all([
            getMotherCount(),
            getPregnancyCount(),
            getAllVisits(),
            getAllHmisRecords(),
            getTotalMaternalDeaths(),
            getTotalNewbornDeaths(),
            getTotalChildDeaths(),
            getAllNewbornDeaths(),
            getAllChildDeaths()
          ]);

          setMotherCount(mCount);
          setPregnancyCount(pCount);
          setRecentVisits(visits);
          setHmisRecords(hRecords);
          setMaternalDeathCount(mdCount);
          setNewbornDeathCount(ndCount);
          setChildDeathCount(cdCount);

          // Newborn Analysis
          const nCauses = { Asphyxia: 0, Infection: 0, Hypothermia: 0, Other: 0 };
          const nTrendData = Array.from({ length: 12 }, (_, i) => ({
            label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            male: 0,
            female: 0
          }));

          nDeathsList.forEach(d => {
            if (d.cause_of_death === 'Asphyxia') nCauses.Asphyxia++;
            else if (d.cause_of_death === 'Infection') nCauses.Infection++;
            else if (d.cause_of_death === 'Hypothermia') nCauses.Hypothermia++;
            else nCauses.Other++;

            if (d.birth_month && d.birth_month >= 1 && d.birth_month <= 12) {
              if (d.gender === 'Male') nTrendData[d.birth_month - 1].male++;
              else if (d.gender === 'Female') nTrendData[d.birth_month - 1].female++;
              else {
                // If gender is missing, we could split or default, but let's just count for now
                // if (Math.random() > 0.5) nTrendData[d.birth_month-1].male++; else nTrendData[d.birth_month-1].female++;
              }
            }
          });

          setNewbornStats([
            { label: 'Asphyxia', value: nCauses.Asphyxia, color: '#3B82F6' },
            { label: 'Infection', value: nCauses.Infection, color: '#F97316' },
            { label: 'Hypothermia', value: nCauses.Hypothermia, color: '#9333EA' },
            { label: 'Other', value: nCauses.Other, color: '#F43F5E' },
          ]);
          setNewbornTrend(nTrendData);

          // Child Analysis (28d - 59m)
          const cCauses = { Pneumonia: 0, Diarrhea: 0, Malnutrition: 0, Other: 0 };
          const cTrendData = Array.from({ length: 12 }, (_, i) => ({
            label: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
            male: 0,
            female: 0
          }));

          cDeathsList.forEach(d => {
            if (d.cause_of_death === 'Pneumonia') cCauses.Pneumonia++;
            else if (d.cause_of_death === 'Diarrhea') cCauses.Diarrhea++;
            else if (d.cause_of_death === 'Malnutrition') cCauses.Malnutrition++;
            else cCauses.Other++;

            if (d.birth_month && d.birth_month >= 1 && d.birth_month <= 12) {
              if (d.gender === 'Male') cTrendData[d.birth_month - 1].male++;
              else if (d.gender === 'Female') cTrendData[d.birth_month - 1].female++;
            }
          });

          setChildStats([
            { label: 'Pneumonia', value: cCauses.Pneumonia, color: '#6366F1' },
            { label: 'Diarrhea', value: cCauses.Diarrhea, color: '#EC4899' },
            { label: 'Malnutrition', value: cCauses.Malnutrition, color: '#F59E0B' },
            { label: 'Other', value: cCauses.Other, color: '#94A3B8' },
          ]);
          setChildTrend(cTrendData);

          // Calculate ANC Trend
          const aTrend = { w12: 0, w16: 0, w20: 0, w28: 0, w32: 0, w34: 0, w36: 0, w40: 0 };
          const pTrend = { hr24: 0, day3: 0, day7_14: 0, day42: 0 };

          hRecords.forEach(r => {
            // ANC
            if (r.checkup_12) aTrend.w12++;
            if (r.checkup_16) aTrend.w16++;
            if (r.checkup_20_24) aTrend.w20++;
            if (r.checkup_28) aTrend.w28++;
            if (r.checkup_32) aTrend.w32++;
            if (r.checkup_34) aTrend.w34++;
            if (r.checkup_36) aTrend.w36++;
            if (r.checkup_38_40) aTrend.w40++;

            // PNC
            if (r.pnc_check_24hr) pTrend.hr24++;
            if (r.pnc_check_3day) pTrend.day3++;
            if (r.pnc_check_7_14day) pTrend.day7_14++;
            if (r.pnc_check_42day) pTrend.day42++;
          });

          setAncTrend(aTrend);
          setPncTrend(pTrend);

          await fetchTodos();
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      };

      fetchData();
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
            colors={["#3B82F6", "#2563EB"]}
            style={{ borderRadius: 24 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-6 shadow-sm shadow-blue-200"
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white text-xl font-semibold leading-tight">
                  Namaste,{"\n"}Laxmi Shrestha
                </Text>
                <Text className="text-white/80 text-sm mt-2 font-medium leading-5">
                  You have {todos.filter(t => !t.is_completed).length} tasks for today.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    scrollRef.current?.scrollTo({ y: 550, animated: true });
                    setTimeout(() => todoInputRef.current?.focus(), 500);
                  }}
                  className="bg-white/10 px-4 py-2 rounded-xl border border-white/20 mt-4 self-start"
                >
                  <Text className="text-white font-semibold text-xs">+ Quick Add Task</Text>
                </TouchableOpacity>
              </View>
              <View className="bg-white/10 p-3 rounded-2xl border border-white/20">
                <Smile size={32} color="white" strokeWidth={2} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Grid */}
        <View className="flex-row px-5 mt-6 gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-50"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="bg-blue-50 w-10 h-10 rounded-2xl items-center justify-center">
                <Baby size={20} color="#3B82F6" strokeWidth={2} />
              </View>
              <View className="bg-green-50 px-2 py-0.5 rounded-full">
                <Text className="text-emerald-600 font-semibold text-[10px]">+2</Text>
              </View>
            </View>
            <Text className="text-[#1E293B] text-3xl font-semibold leading-none">{pregnancyCount}</Text>
            <View className="mt-2">
              <Text className="text-gray-500 font-medium text-[11px] uppercase tracking-wider">Pregnant</Text>
              <Text className="text-gray-400 font-medium text-[10px]">गर्भवती महिला</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-gray-50"
          >
            <View className="flex-row justify-between items-center mb-4">
              <View className="bg-rose-50 w-10 h-10 rounded-2xl items-center justify-center">
                <Smile size={20} color="#E11D48" strokeWidth={2} />
              </View>
              <View className="bg-rose-50 px-2 py-0.5 rounded-full">
                <Text className="text-rose-600 font-semibold text-[10px]">+1</Text>
              </View>
            </View>
            <Text className="text-[#1E293B] text-3xl font-semibold leading-none">{motherCount}</Text>
            <View className="mt-2">
              <Text className="text-gray-500 font-medium text-[11px] uppercase tracking-wider">Mothers</Text>
              <Text className="text-gray-400 font-medium text-[10px]">आमाहरू</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex-row items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-gray-400 font-medium text-[11px] uppercase tracking-wider">My Incentives</Text>
              <Text className="text-gray-400 font-medium text-[10px] mb-2 uppercase">मेरो प्रोत्साहन भत्ता</Text>
              <View className="flex-row items-end">
                <Text className="text-[#1E293B] text-3xl font-semibold tracking-tighter">Rs. 1,450</Text>
              </View>
              <TouchableOpacity className="mt-4 flex-row items-center">
                <Text className="text-primary font-semibold text-xs uppercase tracking-widest">View History</Text>
                <ChevronRight size={14} color="#22C55E" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <View className="bg-orange-50 w-16 h-16 rounded-3xl items-center justify-center">
              <TrendingUp size={28} color="#F97316" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-slate-800 text-lg font-semibold">ANC Visit Trends</Text>
                <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Prenatal Coverage over weeks</Text>
              </View>
              <View className="bg-blue-50 w-8 h-8 rounded-xl items-center justify-center">
                <Activity size={16} color="#3B82F6" strokeWidth={2} />
              </View>
            </View>

            <View className="h-32 mb-4">
              <LineChart
                data={[ancTrend.w12, ancTrend.w16, ancTrend.w20, ancTrend.w28, ancTrend.w32, ancTrend.w34, ancTrend.w36, ancTrend.w40]}
                color="#3B82F6"
                labels={["W12", "W16", "W20", "W28", "W32", "W34", "W36", "W40"]}
              />
            </View>
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-slate-800 text-lg font-semibold">PNC Visit Trends</Text>
                <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Postnatal follow-up stats</Text>
              </View>
              <View className="bg-purple-50 w-8 h-8 rounded-xl items-center justify-center">
                <TrendingUp size={16} color="#9333EA" strokeWidth={2} />
              </View>
            </View>

            <View className="h-32 mb-4">
              <LineChart
                data={[pncTrend.hr24, pncTrend.day3, pncTrend.day7_14, pncTrend.day42]}
                color="#9333EA"
                labels={["24h", "3d", "14d", "42d"]}
              />
            </View>
          </View>
        </View>

        <View className="flex-row px-5 mt-6 gap-4">
          <TouchableOpacity
            activeOpacity={0.9}
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-50"
          >
            <View className="bg-red-50 w-10 h-10 rounded-2xl items-center justify-center mb-4">
              <Activity size={20} color="#EF4444" strokeWidth={2} />
            </View>
            <Text className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Maternal Deaths</Text>
            <Text className="text-[#1E293B] text-2xl font-semibold mt-1">{maternalDeathCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-50"
          >
            <View className="bg-indigo-50 w-10 h-10 rounded-2xl items-center justify-center mb-4">
              <Baby size={20} color="#4F46E5" strokeWidth={2} />
            </View>
            <Text className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Newborn Deaths</Text>
            <Text className="text-[#1E293B] text-2xl font-semibold mt-1">{newbornDeathCount}</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-4">
          <TouchableOpacity
            activeOpacity={0.9}
            className="w-full bg-white p-5 rounded-3xl shadow-sm border border-gray-50 flex-row items-center"
          >
            <View className="bg-pink-50 w-12 h-12 rounded-2xl items-center justify-center mr-5">
              <Baby size={24} color="#EC4899" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 font-medium text-[10px] uppercase tracking-wider">Child Deaths (28d - 59m)</Text>
              <Text className="text-[#1E293B] text-2xl font-semibold mt-1">{childDeathCount}</Text>
            </View>
            <ChevronRight size={18} color="#94A3B8" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="mb-8">
              <Text className="text-slate-800 text-lg font-semibold">Newborn Mortality Analysis</Text>
              <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Causes of death (within 28 days)</Text>
            </View>

            {newbornDeathCount > 0 ? (
              <View className="py-2">
                <PieChart data={newbornStats} />
              </View>
            ) : (
              <View className="py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 items-center">
                <Text className="text-slate-400 font-medium text-xs">No Data Recorded</Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="mb-8">
              <Text className="text-slate-800 text-lg font-semibold">Child Mortality Analysis</Text>
              <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Child death analysis (28d - 59m)</Text>
            </View>

            {childDeathCount > 0 ? (
              <View className="py-2">
                <PieChart data={childStats} />
              </View>
            ) : (
              <View className="py-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 items-center">
                <Text className="text-slate-400 font-medium text-xs">No Data Recorded</Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-slate-800 text-lg font-semibold">Newborn Mortality Trends</Text>
                <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Monthly gender-based trends</Text>
              </View>
              <View className="bg-indigo-50 w-8 h-8 rounded-xl items-center justify-center">
                <TrendingUp size={16} color="#4F46E5" strokeWidth={2} />
              </View>
            </View>

            <MultiLineChart 
              data={newbornTrend} 
              colors={{ male: '#0D9488', female: '#7C3AED' }} 
              labels={newbornTrend.map(t => t.label)} 
            />
          </View>
        </View>

        <View className="px-5 mt-6">
          <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-8">
              <View>
                <Text className="text-slate-800 text-lg font-semibold">Child Mortality Trends</Text>
                <Text className="text-slate-400 font-medium text-[10px] uppercase tracking-widest mt-1">Monthly gender-based trends</Text>
              </View>
              <View className="bg-pink-50 w-8 h-8 rounded-xl items-center justify-center">
                <TrendingUp size={16} color="#EC4899" strokeWidth={2} />
              </View>
            </View>

            <MultiLineChart 
              data={childTrend} 
              colors={{ male: '#0D9488', female: '#7C3AED' }} 
              labels={childTrend.map(t => t.label)} 
            />
          </View>
        </View>

        <View className="px-5 mt-10">
          <Text className="text-[#1E293B] text-lg font-semibold mb-6">Quick Actions</Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/dashboard/mother-list/add-mother" as any)}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-50 items-center shadow-sm"
            >
              <View className="bg-blue-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <Plus size={24} color="white" strokeWidth={2} />
              </View>
              <Text className="text-[#1E293B] font-medium text-xs">Add Mother</Text>
              <Text className="text-gray-400 font-medium text-[9px] mt-0.5">आमा थप्नुहोस्</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/dashboard/follow-up")}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-50 items-center shadow-sm"
            >
              <View className="bg-green-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <Calendar size={24} color="white" strokeWidth={2} />
              </View>
              <Text className="text-[#1E293B] font-medium text-xs">Add Visit</Text>
              <Text className="text-gray-400 font-medium text-[9px] mt-0.5">भ्रमण थप्नुहोस्</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                scrollRef.current?.scrollTo({ y: 800, animated: true });
                setTimeout(() => todoInputRef.current?.focus(), 500);
              }}
              className="flex-1 bg-white p-5 rounded-3xl border border-gray-50 items-center shadow-sm"
            >
              <View className="bg-orange-500 w-12 h-12 rounded-2xl items-center justify-center mb-3">
                <CheckCircle size={24} color="white" strokeWidth={2} />
              </View>
              <Text className="text-[#1E293B] font-medium text-xs">Add Todo</Text>
              <Text className="text-gray-400 font-medium text-[9px] mt-0.5">कार्य थप्नुहोस्</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* To-Do List Section */}
        <View className="px-5 mt-10">
          <View className="flex-row justify-between items-center mb-6 px-1">
            <View>
              <Text className="text-[#1E293B] text-lg font-semibold">My Tasks</Text>
              <Text className="text-gray-400 font-medium text-[10px] uppercase tracking-wider mt-1">मेरो कार्य सूची</Text>
            </View>
            <View className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
              <Text className="text-emerald-600 font-semibold text-[10px] uppercase tracking-widest">
                {todos.filter(t => !t.is_completed).length} Pending
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6 gap-3">
            <View className="flex-1 bg-white border border-gray-100 rounded-2xl h-14 px-4 flex-row items-center shadow-sm">
              <TextInput
                ref={todoInputRef}
                className="flex-1 text-[#1E293B] font-medium"
                placeholder="Add a new task..."
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
              className="bg-primary w-14 h-14 rounded-2xl items-center justify-center shadow-sm"
            >
              <Plus size={24} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>

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
            <View className="bg-white rounded-3xl p-10 items-center justify-center border border-gray-100 border-dashed">
              <Text className="text-gray-400 font-medium text-sm">No tasks added yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
      className={`bg-white p-4 rounded-3xl mb-3 flex-row items-center border border-gray-100 ${todo.is_completed ? 'opacity-60' : 'shadow-sm'}`}
    >
      <TouchableOpacity
        onPress={onToggle}
        className={`w-9 h-9 rounded-xl items-center justify-center mr-4 ${todo.is_completed ? 'bg-emerald-500' : 'bg-gray-50 border border-gray-100'}`}
      >
        <CheckCircle size={18} color={todo.is_completed ? "white" : "#CBD5E1"} strokeWidth={2} />
      </TouchableOpacity>

      <View className="flex-1">
        {isEditing ? (
          <TextInput
            autoFocus
            className="text-[#1E293B] text-base font-semibold p-0"
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
            className={`text-[#1E293B] text-base font-semibold ${todo.is_completed ? 'line-through text-gray-400' : ''}`}
            numberOfLines={1}
          >
            {todo.task}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onDelete} className="p-2 ml-2">
        <Trash2 size={16} color="#F43F5E" strokeWidth={2} />
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
      <View className="mb-4">
        <Text className="text-[#1E293B] text-lg font-semibold px-1">Recent Activities</Text>
        <Text className="text-gray-400 font-medium text-[10px] uppercase tracking-wider px-1 mt-1">हालका गतिविधिहरू</Text>
      </View>
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
            <View className="bg-gray-50 border border-gray-100 rounded-2xl items-center justify-center w-14 h-14 mr-4">
              <Text className="text-primary font-bold text-[10px] uppercase tracking-wider">{month}</Text>
              <Text className="text-[#1E293B] text-xl font-semibold leading-tight">{day}</Text>
            </View>

            <View className="flex-1">
              <Text className="text-[#1E293B] text-base font-semibold">{item.name}</Text>
              <Text className="text-gray-500 font-medium text-xs mt-0.5">
                {item.visit_type} Follow-up
              </Text>
            </View>

            <View className="p-2 rounded-xl bg-blue-50">
              <ChevronRight size={18} color="#3B82F6" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        );
      })}

      {data.length > 3 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="items-center py-3 bg-white rounded-2xl mt-2 border border-gray-100"
        >
          <Text className="text-primary font-semibold text-xs uppercase tracking-widest">
            {showAll ? "Show Less" : `View ${data.length - 3} More`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};


``


## File: .\src\app\dashboard\learn-details.tsx


``tsx

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import learnContent from "../../assets/data/learnContent.json";
import { FileText, Activity, Heart, Baby, HeartPulse, Stethoscope, Users } from "lucide-react-native";

const SWIPE_THRESHOLD = 60;

const CONFIG: Record<string, any> = {
  maternal_health: { icon: HeartPulse, color: "#10B981", bg: "bg-emerald-100", image: require("../../assets/images/maternal_care.png") },
  first_trimester_detailed: { icon: Heart, color: "#F43F5E", bg: "bg-rose-100" },
  second_trimester_detailed: { icon: Heart, color: "#8B5CF6", bg: "bg-violet-100" },
  third_trimester_detailed: { icon: Activity, color: "#EC4899", bg: "bg-pink-100" },
  child_nutrition: { icon: FileText, color: "#3B82F6", bg: "bg-blue-100", image: require("../../assets/images/child_nutrition.png") },
  anc: { icon: Activity, color: "#EC4899", bg: "bg-pink-100", image: require("../../assets/images/anc.png") },
  pnc: { icon: Heart, color: "#8B5CF6", bg: "bg-violet-100", image: require("../../assets/images/pnc.png") },
  baby_care: { icon: Baby, color: "#06B6D4", bg: "bg-cyan-100", image: require("../../assets/images/newborn_care.png") },
  birth_prep: { icon: Stethoscope, color: "#3B82F6", bg: "bg-blue-100" },
  family_planning: { icon: Users, color: "#8B5CF6", bg: "bg-purple-100" },
};

const TRIMESTER_COLORS = [
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
  { accent: "#10B981", border: "#10B981", dot: "#10B981", activeText: "#10B981", activeBg: "#10B981" },
];

export default function LearnDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Use a ref to track activeTab for PanResponder (avoids stale closure)
  const activeTabRef = useRef(0);

  const switchTab = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex > 2) return;
    const direction = newIndex > activeTabRef.current ? -1 : 1;

    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: direction * 30, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      activeTabRef.current = newIndex;
      setActiveTab(newIndex);
      slideAnim.setValue(-direction * 30);

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, slideAnim]);

  // PanResponder for swipe gestures — operates at JS level, no conflict with React Navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture horizontal swipes (not vertical scrolling)
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5) && Math.abs(gestureState.dx) > 15;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD && activeTabRef.current < 2) {
          switchTab(activeTabRef.current + 1);
        } else if (gestureState.dx > SWIPE_THRESHOLD && activeTabRef.current > 0) {
          switchTab(activeTabRef.current - 1);
        }
      },
    })
  ).current;

  const dataPrefix = learnContent[id as keyof typeof learnContent];
  const langKey = language === "np" ? "np" : "en";
  const content: any = dataPrefix ? dataPrefix[langKey as keyof typeof dataPrefix] : null;
  const config = CONFIG[id as keyof typeof CONFIG] || CONFIG.maternal_health;

  if (!content) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">{t("learn_details.content_not_found")}</Text>
        <TouchableOpacity onPress={() => router.push("/dashboard/learn")} className="mt-4 px-6 py-2 bg-blue-500 rounded-full">
          <Text className="text-white font-bold">{t("learn_details.go_back")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const Icon = config.icon;

  const renderMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} className="font-bold text-gray-800">
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const isMaternalHealth = id === "maternal_health";
  const trimesterData: any[] = isMaternalHealth
    ? [
        (learnContent as any)["first_trimester_detailed"]?.[langKey],
        (learnContent as any)["second_trimester_detailed"]?.[langKey],
        (learnContent as any)["third_trimester_detailed"]?.[langKey],
      ]
    : [];

  const tabTitles = [
    t("learn_details.trimesters.first"),
    t("learn_details.trimesters.second"),
    t("learn_details.trimesters.third"),
  ];

  const activeTrimester = trimesterData[activeTab];
  const activeColor = TRIMESTER_COLORS[activeTab];

  return (
    <View className="flex-1 bg-white pb-10">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-12 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.push("/dashboard/learn")} className="p-2 rounded-full z-10 active:opacity-50">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-800 ml-3">
          {t("learn_details.details")}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {/* Banner area */}
        <View className="items-center">
          {config.image ? (
            <Image source={config.image} className="w-full h-56 rounded-2xl mb-5" resizeMode="cover" />
          ) : (
            <View className={`w-20 h-20 ${config.bg} rounded-[24px] items-center justify-center mb-4`}>
              <Icon size={40} color={config.color} />
            </View>
          )}
        </View>
        
        {/* Title and Description */}
        {(!isMaternalHealth && content.title) && (
          <Text className="text-2xl font-black text-gray-800 mb-2 ml-1 mt-2">
            {content.title}
          </Text>
        )}
        {(!isMaternalHealth && content.description) && (
          <Text className="text-[14px] text-gray-600 mb-6 ml-1 leading-6">
            {content.description}
          </Text>
        )}

        {/* Key Points */}
        {content.key_points && content.key_points.length > 0 && (
          <>
            <Text className="text-md font-bold text-gray-800 mb-4 ml-1">
              {t("learn_details.key_points")}
            </Text>

            <View className="gap-3 mb-8">
              {content.key_points.map((point: string, index: number) => (
                <View key={index} className="flex-row bg-white border border-gray-100 p-4 rounded-xl">
                  <CheckCircle2 size={22} color="#10B981" className="mt-[2px]" />
                  <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">{renderMarkdown(point)}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {isMaternalHealth && trimesterData.length > 0 ? (
          <View>
            <Text className="text-md font-bold text-gray-800 mb-4 ml-1">
              {t("learn_details.detailed_trimester_guide")}
            </Text>

            {/* Tab Bar */}
            <View className="flex-row p-1 rounded-xl mb-6">
              {tabTitles.map((title, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => switchTab(index)}
                  activeOpacity={0.7}
                  className={`flex-1 py-3 items-center border-b-2`}
                  style={{
                    borderBottomColor: activeTab === index ? TRIMESTER_COLORS[index].accent : 'transparent'
                  }}
                >
                  <Text
                    className={`font-bold text-[12px]`}
                    style={{
                      color: activeTab === index ? TRIMESTER_COLORS[index].accent : '#6B7280'
                    }}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Swipeable Tab Content */}
            <View {...panResponder.panHandlers}>
              {activeTrimester ? (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  }}
                >
                  <Text className="text-md font-bold text-gray-800 mb-2 ml-1">
                    {activeTrimester.title}
                  </Text>
                  <Text className="text-[13px] text-gray-600 mb-6 ml-1 leading-6">
                    {activeTrimester.description}
                  </Text>

                  {activeTrimester.sections?.map((section: any, idx: number) => (
                    <View key={`section-${activeTab}-${idx}`} className="mb-6">
                      <Text className="text-[15px] font-bold text-gray-800 mb-3 ml-1">
                        {(section.title || section.category || "").replace(/###\s*/g, "")}
                      </Text>
                      <View className="gap-2.5">
                        {section.points?.map((point: string, pIdx: number) => (
                          <View
                            key={`point-${activeTab}-${idx}-${pIdx}`}
                            className={`flex-row bg-white border border-gray-200 p-2 rounded-xl`}
                          >
                            <View className={`w-2 h-2 rounded-lg bg-green-500 mt-2`} />
                            <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">
                              {renderMarkdown(point)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </Animated.View>
              ) : (
                <View className="py-8 items-center">
                  <Text className="text-gray-400">{t("learn_details.no_content")}</Text>
                </View>
              )}
            </View>
          </View>
        ) : !isMaternalHealth ? (
          <View>
            {content.sections?.map((section: any, idx: number) => (
              <View key={`section-${idx}`} className="mt-2 mb-6">
                <Text className="text-[15px] font-bold text-gray-800 mb-3 ml-1">
                  {(section.title || section.category || "").replace(/###\s*/g, "")}
                </Text>
                <View className="gap-2.5">
                  {section.points?.map((point: string, pIdx: number) => (
                    <View key={`point-${idx}-${pIdx}`} className="flex-row bg-white border border-gray-100 p-3.5 rounded-xl">
                      <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      <Text className="text-[14px] text-gray-700 ml-3 flex-1 leading-6">
                        {renderMarkdown(point)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}


``


## File: .\src\app\dashboard\learn.tsx


``tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ImageBackground,
  Image,
} from "react-native";
import {
  Search,
  Mic,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Salad,
  Users,
  Baby,
  Play,
  ChevronRight,
} from "lucide-react-native";
import { router } from "expo-router";
import { useLanguage } from "@/context/LanguageContext";
import "../../global.css";


const CATEGORY_CARDS = [
  {
    id: "birth_prep",
    icon: Stethoscope,
    iconColor: "#3B82F6",
    iconBg: "#EFF6FF",
    titleKey: "learn_page.categories.birth_prep",
  },
  {
    id: "nutrition",
    icon: Salad,
    iconColor: "#F97316",
    iconBg: "#FFF7ED",
    titleKey: "learn_page.categories.nutrition",
  },
  {
    id: "family_planning",
    icon: Users,
    iconColor: "#8B5CF6",
    iconBg: "#F5F3FF",
    titleKey: "learn_page.categories.family_planning",
  },
  {
    id: "baby_care",
    icon: Baby,
    iconColor: "#E11D48",
    iconBg: "#FFF1F2",
    titleKey: "learn_page.categories.newborn",
  },
];

const VIDEOS = [
  {
    id: "v1",
    thumb: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=400&q=80",
    titleKey: "learn_page.videos.v1_title",
    metaKey: "learn_page.videos.v1_meta",
  },
  {
    id: "v2",
    thumb: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
    titleKey: "learn_page.videos.v2_title",
    metaKey: "learn_page.videos.v2_meta",
  },
  {
    id: "v3",
    thumb: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80",
    titleKey: "learn_page.videos.v3_title",
    metaKey: "learn_page.videos.v3_meta",
  },
];

const GUIDELINES = [
  { emoji: "🤱", titleKey: "learn_page.guidelines.breastfeeding", color: "#22C55E", bg: "#F0FFF4" },
  { emoji: "💉", titleKey: "learn_page.guidelines.vaccination", color: "#3B82F6", bg: "#EFF6FF" },
  { emoji: "🩺", titleKey: "learn_page.guidelines.anc_checkup", color: "#E11D48", bg: "#FFF1F2" },
  { emoji: "🧘", titleKey: "learn_page.guidelines.mental_health", color: "#8B5CF6", bg: "#F5F3FF" },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function LearnScreen() {
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        <View className="flex-1 mt-10 px-5">
          <Text className="text-[#1E293B] text-xl font-black">{t("learn_page.header")}</Text>
        </View>

        <View className="px-5 mt-5">
          <View className="flex-row items-center bg-white rounded-2xl px-4 py-1 border border-gray-100 shadow-sm">
            <Search size={18} color="#94a3b8" strokeWidth={2.5} />
            <TextInput
              className="flex-1 mx-3 text-[#1E293B] font-medium text-base"
              placeholder={t("learn_page.search_placeholder")}
              placeholderTextColor="#CBD5E1"
              value={search}
              onChangeText={setSearch}
            />
            {/* <TouchableOpacity className="bg-[#E11D48] w-10 h-10 rounded-xl items-center justify-center">
              <Mic size={18} color="white" strokeWidth={2.5} />
            </TouchableOpacity> */}
          </View>
        </View>

        <View className="px-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push("/dashboard/learn-details?id=maternal_health" as any)}
          >
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=800&q=80" }}
              className="rounded-[32px] overflow-hidden h-44"
              imageStyle={{ borderRadius: 32 }}
            >
              {/* Dark overlay */}
              <View className="absolute inset-0 bg-black/40 rounded-[32px]" />

              {/* Content */}
              <View className="flex-1 p-5 justify-between">
                <View className="self-start bg-[#E11D48] w-10 h-10 rounded-2xl items-center justify-center">
                  <ShieldCheck size={20} color="white" strokeWidth={2.5} />
                </View>
                <View className="flex-row justify-between items-end">
                  <View>
                    <Text className="text-white font-black text-xl">{t("learn_page.hero_title_np")}</Text>
                    <Text className="text-white/80 font-bold text-sm">{t("learn_page.hero_subtitle")}</Text>
                  </View>
                  <View className="bg-white/20 p-2.5 rounded-2xl border border-white/30">
                    <ArrowRight size={18} color="white" strokeWidth={2.5} />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-8">
          <View className="flex-row flex-wrap gap-4">
            {CATEGORY_CARDS.map((cat) => {
              const Icon = cat.icon;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (cat.id === "nutrition") {
                      router.push("/dashboard/nutritions" as any);
                    } else {
                      router.push(`/dashboard/learn-details?id=${cat.id}` as any);
                    }
                  }}
                  className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-50"
                  style={{ width: "47%" }}
                >
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                    style={{ backgroundColor: cat.iconBg }}
                  >
                    <Icon size={24} color={cat.iconColor} strokeWidth={2.5} />
                  </View>
                  <Text className="text-[#1E293B] font-black text-base leading-tight">{t(cat.titleKey)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mt-10">
          <View className="flex-row justify-between items-center px-5 mb-5">
            <Text className="text-[#1E293B] text-xl font-black">{t("learn_page.recently_viewed")}</Text>
            <TouchableOpacity>
              <Text className="text-[#E11D48] font-black text-sm">{t("learn_page.view_all")}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
          >
            {VIDEOS.map((v) => (
              <TouchableOpacity
                key={v.id}
                activeOpacity={0.85}
                className="mr-4"
                style={{ width: 180 }}
              >
                {/* Thumbnail */}
                <View className="relative rounded-2xl overflow-hidden mb-3" style={{ height: 110 }}>
                  <Image
                    source={{ uri: v.thumb }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/30" />
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="bg-white/90 w-10 h-10 rounded-full items-center justify-center shadow-md">
                      <Play size={16} color="#E11D48" strokeWidth={2.5} fill="#E11D48" />
                    </View>
                  </View>
                </View>
                <Text className="text-[#1E293B] font-black text-[14px]" numberOfLines={1}>{t(v.titleKey)}</Text>
                <Text className="text-gray-400 font-bold text-[11px] mt-1">{t(v.metaKey)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-5 mt-10">
          <Text className="text-[#1E293B] text-xl font-black mb-5">{t("learn_page.all_guidelines")}</Text>

          {GUIDELINES.map((item, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.75}
              className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-gray-50 shadow-sm"
            >
              <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: item.bg }}>
                <Text className="text-2xl">{item.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[#1E293B] font-black text-base">{t(item.titleKey)}</Text>
              </View>
              <View className="bg-gray-50 p-2 rounded-xl">
                <ChevronRight size={16} color="#94a3b8" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\maternal-death-report.tsx


``tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Share
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Download, Filter, Search, Trash2 } from "lucide-react-native";
import "../../global.css";
import { getAllMaternalDeaths, deleteMaternalDeath } from "../../hooks/database/models/MaternalDeathModel";
import { MaternalDeathStoreType } from "../../hooks/database/types/maternalDeathModal";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";

export default function MaternalDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<MaternalDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no maternal death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Deceased Name", "Age", 
        "Pregnant", "Labor", "Postpartum", 
        "Day", "Month", "Year", 
        "Birth:Home", "Birth:Inst", "Birth:Other", 
        "Death:Home", "Death:Inst", "Death:Other", 
        "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        const cond = item.death_condition?.toLowerCase();
        const bPlace = item.delivery_place?.toLowerCase();
        const dPlace = item.death_place?.toLowerCase();

        return [
          index + 1,
          `"${item.mother_name}"`,
          item.mother_age,
          cond === 'pregnant' ? "✔" : "",
          cond === 'labor' ? "✔" : "",
          cond === 'post_delivery' ? "✔" : "",
          item.death_day,
          item.death_month,
          item.death_year,
          bPlace === 'home' ? "✔" : "",
          bPlace === 'institution' ? "✔" : "",
          bPlace === 'other' ? "✔" : "",
          dPlace === 'home' ? "✔" : "",
          dPlace === 'institution' ? "✔" : "",
          dPlace === 'other' ? "✔" : "",
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Maternal Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, motherName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${motherName}" को मातृ मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMaternalDeath(id);
              setData((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              Alert.alert("Error", "Record could not be deleted.");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const records = await getAllMaternalDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching maternal deaths", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const Cell = ({ children, width, borderRight = true }: any) => (
    <View 
      style={{ width }} 
      className={`h-full justify-center px-2 py-3 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-bold text-[11px] text-center" numberOfLines={2}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 40, borderRight = true, borderBottom = true }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-1 bg-slate-100 ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-black text-[10px] text-center uppercase">
        {children}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="मातृ मृत्यु विवरण दर्ता" 
        onBackPress={() => router.push("/dashboard/profile")}
        rightNode={
          <TouchableOpacity 
            onPress={handleDownload}
            className="bg-emerald-50 p-2 rounded-xl"
          >
            <Download size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1">
        {/* Table Controls */}
        <View className="flex-row px-4 py-4 gap-3 bg-white border-b border-gray-100">
           <View className="flex-1 flex-row items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} color="#64748B" />
              <Text className="ml-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Search Register...</Text>
           </View>
           <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <Filter size={20} color="#64748B" />
           </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
          <View>
            {/* Hierarchical Header */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
              <HeaderCell width={50} height={80}>क्र.सं.</HeaderCell>
              <HeaderCell width={180} height={80}>मृतक महिलाको नाम</HeaderCell>
              <HeaderCell width={70} height={80}>उमेर (वर्षमा)</HeaderCell>
              
              {/* Status Section */}
              <View>
                <HeaderCell width={240} height={40}>मृत्यु हुँदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={40}>गर्भवती</HeaderCell>
                  <HeaderCell width={80} height={40}>प्रसव</HeaderCell>
                  <HeaderCell width={80} height={40}>सुत्केरी</HeaderCell>
                </View>
              </View>

              {/* Date Section */}
              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>गते</HeaderCell>
                  <HeaderCell width={60} height={40}>महिना</HeaderCell>
                  <HeaderCell width={60} height={40}>साल</HeaderCell>
                </View>
              </View>

              {/* Birth Place */}
              <View>
                <HeaderCell width={180} height={40}>प्रसूति भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>घर</HeaderCell>
                  <HeaderCell width={60} height={40}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={40}>अन्य</HeaderCell>
                </View>
              </View>

              {/* Death Place */}
              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={40}>घर</HeaderCell>
                  <HeaderCell width={60} height={40}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={40}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={200} height={80}>कैफियत</HeaderCell>
              <HeaderCell width={70} height={80} borderRight={false}>Action</HeaderCell>
            </View>

            {/* Static Numbers Row as in Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-50">
               {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map((n, i) => (
                  <View key={i} style={{ width: n === 1 ? 50 : n === 2 ? 180 : n === 3 ? 70 : (n >= 4 && n <= 6) ? 80 : (n >= 200) ? 200 : 60, height: 30 }} className="border-r border-gray-300 justify-center items-center">
                    <Text className="text-slate-400 font-bold text-[10px]">{n}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => (
                <View key={item.id} className="flex-row border-b border-gray-200">
                  <Cell width={50}>{index + 1}</Cell>
                  <Cell width={180}>{item.mother_name}</Cell>
                  <Cell width={70}>{item.mother_age}</Cell>
                  
                  {/* Status Indicator */}
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'pregnant' ? "✔" : ""}</Cell>
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'labor' ? "✔" : ""}</Cell>
                  <Cell width={80}>{item.death_condition?.toLowerCase() === 'post_delivery' ? "✔" : ""}</Cell>

                  {/* Date */}
                  <Cell width={60}>{item.death_day}</Cell>
                  <Cell width={60}>{item.death_month}</Cell>
                  <Cell width={60}>{item.death_year}</Cell>

                  {/* Birth Place */}
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.delivery_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  {/* Death Place */}
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'home' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'institution' ? "✔" : ""}</Cell>
                  <Cell width={60}>{item.death_place?.toLowerCase() === 'other' ? "✔" : ""}</Cell>

                  <Cell width={200}>{item.remarks}</Cell>
                  <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id!, item.mother_name!)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center" style={{ width: 1270 }}>
                  <Text className="text-slate-400 font-black italic">No records found in this register.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\mother-profile.tsx


``tsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  ChevronLeft,
  Search,
  MoreVertical,
  User,
  Activity,
  ClipboardList,
  Calendar,
  Phone,
  CheckCircle2,
  Circle,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react-native";
import "../../global.css";
import { getMotherProfile, MotherProfileDbItem, deleteMother } from "../../hooks/database/models/MotherModel";
import Colors from "../../constants/Colors";
import CustomHeader from "../../components/CustomHeader";
import { EDUCATION_LEVELS, JATI_CODES } from "@/utils/data";

export default function MotherProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [mother, setMother] = useState<MotherProfileDbItem | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchMother = async () => {
        if (!id) {
          setLoading(false);
          return;
        }
        try {
          const data = await getMotherProfile(id);
          if (isActive) {
            setMother(data);
          }
        } catch (error) {
          console.error("Failed to fetch mother profile:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      setLoading(true);
      fetchMother();
      return () => {
        isActive = false;
      };
    }, [id])
  );

  const getGA = (lmp?: string) => {
    if (!lmp || lmp === "N/A") return { weeks: 0, days: 0, months: 0 };
    const lmpDate = new Date(lmp);
    const now = new Date();
    const diffTime = now.getTime() - lmpDate.getTime();
    if (diffTime < 0) return { weeks: 0, days: 0, months: 0 };
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return {
      weeks: Math.floor(diffDays / 7),
      days: diffDays % 7,
      months: Math.floor(diffDays / 30.44),
    };
  };
  const ga = mother ? getGA(mother.lmp) : { weeks: 0, days: 0, months: 0 };

  const formatShortDate = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()];
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Mother",
      "Are you sure you want to delete this mother record?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (mother?.id) {
              try {
                await deleteMother(mother.id);
                router.back();
              } catch (error) {
                Alert.alert("Error", "Could not delete mother.");
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="mt-4 font-bold" style={{ color: Colors.textSecondary }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!mother) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor: Colors.background }}>
        <User size={48} color={Colors.textSecondary} />
        <Text className="mt-4 font-bold text-lg" style={{ color: Colors.textSecondary }}>Mother not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 px-6 py-3 rounded-full" style={{ backgroundColor: Colors.nepali }}>
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const displayEthnicity = mother?.ethnicity ? (JATI_CODES.find(j => j.code === mother.ethnicity)?.name || mother.ethnicity) : "N/A";
  const displayEducation = mother?.education ? (EDUCATION_LEVELS.find(e => e.value === mother.education)?.label || mother.education) : "N/A";

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase(); // mock logic, ideally should be NP if nameNp exists
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* ── App Header ── */}
      <CustomHeader
        title="Mother Profile"
        rightNode={
          <TouchableOpacity 
            onPress={() => router.push({ pathname: "/dashboard/mother-list/add-mother", params: { id: mother.id } } as any)}
            className="bg-white shadow-sm border border-slate-100 p-2 rounded-xl"
          >
            <Edit size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        }
      />

      {/* ── Profile Top Container ── */}
      <View style={{ backgroundColor: Colors.primary }} className="rounded-b-[24px] rounded-t-[24px] mx-4 mt-2 mb-4 p-1 shadow-sm">
        <View className="flex-row items-center bg-black/10 rounded-[20px] p-4">
          {mother.image && !mother.image.includes("vectorified") ? (
            <Image
              source={{ uri: mother.image }}
              className="w-16 h-16 rounded-full border-2 border-white/30"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center border-2 border-white/30">
              <Text className="text-white text-xl font-bold">{getInitials(mother.name)}</Text>
            </View>
          )}

          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold capitalize" numberOfLines={1}>{mother.name}</Text>
            <Text className="text-white/80 text-xs mt-0.5 font-medium">FCHV ID: {mother.code}</Text>

            <View className="flex-row items-center mt-2.5 gap-2">
              <View className="bg-white/20 px-2.5 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold">{mother.ward}</Text>
              </View>
              <View className="bg-white/90 px-2.5 py-1 rounded-full">
                <Text className="text-[10px] font-bold" style={{ color: Colors.primary }}>{mother.status === 'active' ? 'Active' : 'Delivered'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 16 }}
      >
        {/* ── Personal Information ── */}
        <View className="bg-white mx-4 rounded-[24px] p-5 shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-center mb-4 border-b border-slate-50 pb-3">
            <User size={18} color={Colors.textSecondary} />
            <Text className="ml-2 font-bold text-base" style={{ color: Colors.textPrimary }}>Personal information</Text>
          </View>

          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-4 pr-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>Age</Text>
              <Text className="text-[14px] font-bold" style={{ color: Colors.textPrimary }}>{mother.age} years</Text>
            </View>
            <View className="w-1/2 mb-4 pl-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>Ethnicity</Text>
              <Text className="text-[13px] font-bold" style={{ color: Colors.textPrimary }} numberOfLines={2}>{displayEthnicity}</Text>
            </View>

            <View className="w-1/2 mb-4 pr-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>Education</Text>
              <Text className="text-[13px] font-bold" style={{ color: Colors.textPrimary }} numberOfLines={2}>{displayEducation}</Text>
            </View>
            <View className="w-1/2 mb-4 pl-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>Phone</Text>
              <Text className="text-[14px] font-bold" style={{ color: Colors.textPrimary }}>{mother.phone || "N/A"}</Text>
            </View>

            <View className="w-1/2 mb-2 pr-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>Husband's name</Text>
              <Text className="text-[14px] font-bold" style={{ color: Colors.textPrimary }} numberOfLines={1}>{mother.husbandName || "N/A"}</Text>
            </View>
            <View className="w-1/2 mb-2 pl-2">
              <Text className="text-[11px] font-bold mb-1" style={{ color: Colors.textSecondary }}>No. of children</Text>
              <Text className="text-[14px] font-bold" style={{ color: Colors.textPrimary }}>{mother.parity || "0"}</Text>
            </View>
          </View>
        </View>

        {/* ── Pregnancy Status ── */}
        <View className="bg-white mx-4 rounded-[24px] p-5 shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <View className="flex-row items-center">
              <Activity size={18} color={Colors.textSecondary} />
              <Text className="ml-2 font-bold text-base" style={{ color: Colors.textPrimary }}>Pregnancy status</Text>
            </View>
            <View className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Text className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">Pregnant</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-5 gap-2">
            <View className="bg-slate-50 rounded-2xl flex-1 items-center justify-center py-4 border border-slate-100">
              <Text className="text-2xl font-black" style={{ color: Colors.primary }}>{ga.months}</Text>
              <Text className="text-[10px] font-bold mt-1" style={{ color: Colors.textSecondary }}>months</Text>
            </View>
            <View className="bg-slate-50 rounded-2xl flex-1 items-center justify-center py-4 border border-slate-100">
              <Text className="text-2xl font-black" style={{ color: Colors.primary }}>3</Text>
              <Text className="text-[10px] font-bold mt-1" style={{ color: Colors.textSecondary }}>ANC visits</Text>
            </View>
            <View className="bg-slate-50 rounded-2xl flex-1 items-center justify-center py-4 border border-slate-100">
              <Text className="text-2xl font-black" style={{ color: Colors.primary }}>{formatShortDate(mother.edd)}</Text>
              <Text className="text-[10px] font-bold mt-1 uppercase" style={{ color: Colors.textSecondary }}>EDD</Text>
            </View>
          </View>

          <View className="flex-row justify-between items-end mb-2">
            <Text className="text-[10px] font-bold" style={{ color: Colors.textSecondary }}>Gestational age</Text>
            <Text className="text-[10px] font-bold" style={{ color: Colors.textPrimary }}>{ga.weeks}/40 weeks</Text>
          </View>
          <View className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
            <View className="h-full rounded-full" style={{ width: `${Math.min((ga.weeks / 40) * 100, 100)}%`, backgroundColor: Colors.primary }} />
          </View>

          <View className="flex-row justify-between items-center mt-5 pt-4 border-t border-slate-50">
            <View>
              <Text className="text-[10px] font-bold mb-1" style={{ color: Colors.textSecondary }}>LMP Date</Text>
              <Text className="text-[13px] font-bold" style={{ color: Colors.textPrimary }}>{mother.lmp || "N/A"}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] font-bold mb-1" style={{ color: Colors.textSecondary }}>EDD Date</Text>
              <Text className="text-[13px] font-bold" style={{ color: Colors.textPrimary }}>{mother.edd || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* ── Health Indicators ── */}
        <View className="bg-white mx-4 rounded-[24px] p-5 shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-center mb-4 border-b border-slate-50 pb-3">
            <Activity size={18} color={Colors.textSecondary} />
            <Text className="ml-2 font-bold text-base" style={{ color: Colors.textPrimary }}>Health indicators</Text>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[13px] font-bold" style={{ color: Colors.textSecondary }}>Blood pressure</Text>
            <View className="flex-row items-center">
              <Text className="text-[13px] font-bold mr-3" style={{ color: Colors.textPrimary }}>118/76 mmHg</Text>
              <View className="bg-green-50 px-2.5 py-1 rounded-md border border-green-100"><Text className="text-[10px] font-bold text-green-700">Normal</Text></View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[13px] font-bold" style={{ color: Colors.textSecondary }}>Hemoglobin</Text>
            <View className="flex-row items-center">
              <Text className="text-[13px] font-bold mr-3" style={{ color: Colors.textPrimary }}>10.2 g/dL</Text>
              <View className="bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100"><Text className="text-[10px] font-bold text-orange-600">Mild anemia</Text></View>
            </View>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[13px] font-bold" style={{ color: Colors.textSecondary }}>Weight</Text>
            <View className="flex-row items-center">
              <Text className="text-[13px] font-bold mr-3" style={{ color: Colors.textPrimary }}>56 kg</Text>
              <View className="bg-green-50 px-2.5 py-1 rounded-md border border-green-100"><Text className="text-[10px] font-bold text-green-700">Normal</Text></View>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold" style={{ color: Colors.textSecondary }}>IFA tablets</Text>
            <View className="flex-row items-center">
              <Text className="text-[13px] font-bold mr-3" style={{ color: Colors.textPrimary }}>90 days</Text>
              <View className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200"><Text className="text-[10px] font-bold text-slate-600">Dispensed</Text></View>
            </View>
          </View>
        </View>

        {/* ── Services Received ── */}
        <View className="bg-white mx-4 rounded-[24px] p-5 shadow-sm border border-slate-100 mb-4">
          <View className="flex-row items-center mb-4 border-b border-slate-50 pb-3">
            <ClipboardList size={18} color={Colors.textSecondary} />
            <Text className="ml-2 font-bold text-base" style={{ color: Colors.textPrimary }}>Services received</Text>
          </View>

          <View className="gap-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <CheckCircle2 size={18} color={Colors.primary} fill={Colors.primary + "1A"} />
                <Text className="ml-3 font-bold text-[13px]" style={{ color: Colors.textPrimary }}>TT vaccination (2nd dose)</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <CheckCircle2 size={18} color={Colors.primary} fill={Colors.primary + "1A"} />
                <Text className="ml-3 font-bold text-[13px]" style={{ color: Colors.textPrimary }}>Nutrition counselling</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <CheckCircle2 size={18} color={Colors.primary} fill={Colors.primary + "1A"} />
                <Text className="ml-3 font-bold text-[13px]" style={{ color: Colors.textPrimary }}>Safe delivery planning</Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center opacity-60">
                <PlusCircle size={18} color={Colors.secondary} />
                <Text className="ml-3 font-bold text-[13px]" style={{ color: Colors.textPrimary }}>Deworming tablet</Text>
              </View>
              <Text className="text-[10px] font-bold" style={{ color: Colors.secondary }}>Pending</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center opacity-60">
                <PlusCircle size={18} color={Colors.secondary} />
                <Text className="ml-3 font-bold text-[13px]" style={{ color: Colors.textPrimary }}>4th ANC check-up</Text>
              </View>
              <Text className="text-[10px] font-bold" style={{ color: Colors.secondary }}>Pending</Text>
            </View>
          </View>
        </View>

        {/* ── Last Home Visit ── */}
        <View className="bg-white mx-4 rounded-[24px] p-5 shadow-sm border border-slate-100 flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View style={{ backgroundColor: Colors.primary + "15" }} className="p-3 rounded-2xl border border-green-100">
              <Calendar size={22} color={Colors.primary} strokeWidth={2.5} />
            </View>
            <View className="ml-3">
              <Text className="text-[10px] font-bold" style={{ color: Colors.textSecondary }}>Last home visit</Text>
              <Text className="text-[14px] font-black mt-0.5" style={{ color: Colors.textPrimary }}>April 10, 2026</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-[10px] font-bold" style={{ color: Colors.textSecondary }}>Next visit</Text>
            <Text className="text-[12px] font-bold mt-1" style={{ color: Colors.primary }}>May 5, 2026</Text>
          </View>
        </View>

        {/* ── Delete Button ─────────────── */}
        <View className="items-end mx-4 mb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleDelete}
            className="flex-row items-center border border-red-200 bg-red-50 px-4 py-3 rounded-2xl"
          >
            <Trash2 size={18} color={Colors.nepali} strokeWidth={2.5} />
            <Text className="ml-2 font-black text-sm" style={{ color: Colors.nepali }}>Delete Mother</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ── Bottom Fixed Actions ── */}
      {/* <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 px-5 py-4 flex-row gap-4 pb-8">
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push({ pathname: "/dashboard/mother-list/add-mother", params: { id: mother.id } } as any)}
          className="flex-1 h-14 rounded-2xl flex-row items-center justify-center shadow-sm shadow-green-100"
          style={{ backgroundColor: Colors.primary }}
        >
          <Edit size={18} color="#FFF" />
          <Text className="text-white font-bold text-base ml-2">Update record</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.8}
          className="flex-1 h-14 rounded-2xl flex-row items-center justify-center border-2"
          style={{ borderColor: Colors.textSecondary + "30", backgroundColor: "#F8FAFC" }}
        >
          <Phone size={18} color={Colors.primary} />
          <Text className="font-bold text-base ml-2" style={{ color: Colors.primary }}>Refer / Call</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\nutritions.tsx


``tsx

import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Pill,
  Lightbulb,
  Milk,
  Salad,
  Droplets,
  Beef,
  Baby,
  Soup,
  Carrot,
  Wheat,
  Dna,
} from "lucide-react-native";
import * as LucideIcons from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "@/context/LanguageContext";
import nutritionData from "@/assets/data/nutritionData.json";
import AppSegmentedControl from "@/components/common/AppSegmentedControl";
import "../../global.css";

type TabType = "pregnant" | "child";

interface Content {
  title: string;
  desc: string;
  dosage: string;
  tips: string[];
}

interface NutritionItem {
  id: string;
  icon: string;
  color: string;
  bg: string;
  en: Content;
  np: Content;
}

function NutritionCard({
  item,
  t,
  language,
}: {
  item: NutritionItem;
  t: (key: string) => string;
  language: "en" | "np";
}) {
  const [expanded, setExpanded] = useState(false);
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.HelpCircle;
  const content = item[language];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded((prev) => !prev)}
      className="bg-white rounded-3xl mb-4 border border-gray-100 overflow-hidden"
    >
      {/* Header Row */}
      <View className="flex-row items-center p-4">
        <View
          className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
          style={{ backgroundColor: item.bg }}
        >
          <IconComponent size={28} color={item.color} strokeWidth={2.5} />
        </View>

        <View className="flex-1">
          <Text className="text-[#1E293B] font-black text-base">
            {content.title}
          </Text>
          <Text
            className="text-gray-500 font-medium text-[13px] mt-1 leading-[18px]"
            numberOfLines={expanded ? undefined : 2}
          >
            {content.desc}
          </Text>
        </View>

        <View className="bg-gray-50 w-8 h-8 rounded-xl items-center justify-center ml-2">
          {expanded ? (
            <ChevronUp size={16} color="#94a3b8" strokeWidth={2.5} />
          ) : (
            <ChevronDown size={16} color="#94a3b8" strokeWidth={2.5} />
          )}
        </View>
      </View>

      {/* Expanded Content */}
      {expanded && (
        <View className="px-4 pb-4">
          {/* Divider */}
          <View className="h-[1px] bg-gray-100 mb-3" />

          {/* Dosage */}
          <View
            className="rounded-2xl p-3 mb-3"
            style={{ backgroundColor: item.bg }}
          >
            <View className="flex-row items-center mb-1.5">
              <Pill size={14} color={item.color} strokeWidth={2.5} />
              <Text
                className="font-black text-xs ml-1.5"
                style={{ color: item.color }}
              >
                {t("nutrition_page.dosage_label")}
              </Text>
            </View>
            <Text className="text-[#1E293B] font-bold text-[13px] leading-[18px]">
              {content.dosage}
            </Text>
          </View>

          {/* Tips */}
          <View className="bg-[#FFFBEB] rounded-2xl p-3">
            <View className="flex-row items-center mb-2">
              <Lightbulb size={14} color="#D97706" strokeWidth={2.5} />
              <Text className="text-[#D97706] font-black text-xs ml-1.5">
                {t("nutrition_page.tips_label")}
              </Text>
            </View>
            {content.tips.map((tip, i) => (
              <View key={i} className="flex-row mb-1.5">
                <Text className="text-[#92400E] font-bold text-xs mr-2">
                  •
                </Text>
                <Text className="text-[#92400E] font-medium text-[13px] leading-[18px] flex-1">
                  {tip}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function NutritionsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("pregnant");
  const { t, language } = useLanguage();
  const router = useRouter();

  const items: NutritionItem[] =
    activeTab === "pregnant" ? (nutritionData.pregnant as any) : (nutritionData.child as any);

  const handleBack = useCallback(() => {
    router.push('/dashboard/learn');
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      <View className="pt-10 pb-3 px-5">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={handleBack}
            className="bg-white w-10 h-10 rounded-2xl items-center justify-center border border-gray-100"
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <Text className="text-[#1E293B] text-xl font-black">
            {t("nutrition_page.title")}
          </Text>
        </View>
      </View>

      <View className="px-5 mt-2 mb-4">
        <AppSegmentedControl
          segmentIndex={activeTab === "pregnant" ? 0 : 1}
          setSegmentIndex={(index) => setActiveTab(index === 0 ? "pregnant" : "child")}
          values={["pregnant", "child"]}
          label={[t("nutrition_page.tabs.pregnant"), t("nutrition_page.tabs.child")]}
          size="large"
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
      >
        {items.map((item) => (
          <NutritionCard
            key={`${activeTab}-${item.id}`}
            item={item}
            t={t}
            language={language as "en" | "np"}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\profile.tsx


``tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Switch,
  Pressable,
} from "react-native";
import {
  ChevronLeft,
  User,
  Shield,
  MapPin,
  Phone,
  Mail,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  Star,
  TrendingUp,
  Users,
  Award,
  Lock,
  HelpCircle,
  MessageSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import "../../global.css";
import ModalWithSafeArea from "@/components/common/ModalWithSafeArea";
import DatabaseViewer from "@/components/DatabaseViewer";
import CustomHeader from "../../components/CustomHeader";
import { useLanguage } from "../../context/LanguageContext";

interface SettingItem {
  icon: any;
  label: string;
  color: string;
  bg: string;
  toggle?: boolean;
  value?: string;
  onPress?: (router: any) => void;
}

interface SettingSection {
  section: string;
  items: SettingItem[];
}

const STATS = [
  { label: "Mothers\nRegistered", value: "42", icon: Users, color: "#3B82F6", bg: "#EFF6FF" },
  { label: "Visits\nCompleted", value: "128", icon: TrendingUp, color: "#22C55E", bg: "#F0FFF4" },
  { label: "Years\nActive", value: "3", icon: Star, color: "#F97316", bg: "#FFF7ED" },
];

const SETTINGS: SettingSection[] = [
  {
    section: "Account",
    items: [
      { icon: User, label: "Edit Profile", color: "#3B82F6", bg: "#EFF6FF" },
      { icon: Lock, label: "Change Password", color: "#8B5CF6", bg: "#F5F3FF" },
      { icon: Phone, label: "Update Phone", color: "#22C55E", bg: "#F0FFF4" },
    ],
  },
  {
    section: "Preferences",
    items: [
      { 
        icon: Bell, 
        label: "Notifications", 
        color: "#F97316", 
        bg: "#FFF7ED", 
        toggle: true 
      },
      { 
        icon: Globe, 
        label: "Language", 
        color: "#06B6D4", 
        bg: "#ECFEFF", 
        value: "नेपाली",
        onPress: (router: any) => router.push("/dashboard/change-language")
      },
    ],
  },
  {
    section: "Support",
    items: [
      { icon: HelpCircle, label: "Help & FAQ", color: "#64748B", bg: "#F8FAFC" },
      { icon: MessageSquare, label: "Send Feedback", color: "#22C55E", bg: "#F0FFF4" },
    ],
  },
];

export default function UserProfileScreen() {
  const router = useRouter();
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const registryItems = [
    { label: "मातृ मृत्यु विवरण", sub: "Maternal Death Details", color: "#EF4444", bg: "#FEF2F2", onPress: (router: any) => router.push("/dashboard/maternal-death-report") },
    { label: "नवजात शिशु मृत्यु विवरण", sub: "Newborn Death Details", color: "#8B5CF6", bg: "#F5F3FF", onPress: (router: any) => router.push("/dashboard/newborn-death-report") },
    { label: "२८ दिन देखि ५९ महिना सम्मका बच्चाहरूको मृत्यु विवरण", sub: "Child Death (28d-59m)", color: "#F59E0B", bg: "#FFFBEB", onPress: (router: any) => router.push("/dashboard/child-death-report") },
  ];


  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <StatusBar barStyle="dark-content" />

      <CustomHeader title="My Profile" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >

        <View className="px-5 mt-6">
          <View className="items-center">
            <View className="relative">
              <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  source={{ uri: "https://i.pravatar.cc/200?u=anita_sharma" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-white w-7 h-7 rounded-full items-center justify-center shadow-sm border border-gray-100">
                <Camera size={14} color="#64748B" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <Text className="text-[#1E293B] text-xl font-semibold mt-4">Laxmi Shrestha</Text>
            <Text className="text-gray-500 text-sm font-medium mt-1">
              Female Community Health Volunteer
            </Text>
            
            <TouchableOpacity 
              onPress={() => setIsDbOpen(true)}
              className="mt-2"
            >
              <Text className="text-xs text-gray-400 font-medium py-1 px-3 bg-gray-100 rounded-full">Dev Tools</Text>
            </TouchableOpacity>

            <ModalWithSafeArea
              visible={isDbOpen}
              animationType="slide"
              presentationStyle="fullScreen"
              onRequestClose={() => setIsDbOpen(false)}
            >
              <DatabaseViewer onClose={() => setIsDbOpen(false)} />
            </ModalWithSafeArea>
          </View>

          {/* Minimal Stats Row */}
          <View className="flex-row justify-between mt-8 bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
            {STATS.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <Text className="text-[#1E293B] text-lg font-semibold">{stat.value}</Text>
                <Text className="text-gray-400 text-[10px] uppercase font-medium text-center mt-1">
                  {stat.label.replace('\n', ' ')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Registry & Reporting Section */}
        <View className="px-5 mt-8">
          <Text className="text-gray-500 font-medium text-xs mb-3 px-1">
            Registry & Reporting (दर्ता तथा रिपोर्टिङ)
          </Text>
          <View className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsRegisterOpen(!isRegisterOpen)}
              className={`flex-row items-center px-5 py-5 ${isRegisterOpen ? "bg-slate-50/50" : ""}`}
            >
              <View className="w-10 h-10 rounded-2xl items-center justify-center mr-4 bg-emerald-50">
                <Users size={18} color="#10B981" strokeWidth={2} />
              </View>
              <Text className="text-[#1E293B] font-medium text-base flex-1">Register (दर्ता)</Text>
              <View style={{ transform: [{ rotate: isRegisterOpen ? '90deg' : '0deg' }] }}>
                <ChevronRight size={18} color="#94A3B8" strokeWidth={2} />
              </View>
            </TouchableOpacity>

            {isRegisterOpen && (
              <View className="bg-white border-t border-gray-50">
                {registryItems.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => item.onPress && item.onPress(router)}
                    className={`flex-row items-center px-6 py-4 ${idx !== registryItems.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <View 
                      className="w-1.5 h-1.5 rounded-full mr-4"
                      style={{ backgroundColor: item.color }}
                    />
                    <View className="flex-1">
                      <Text className="text-[#1E293B] font-medium text-sm">{item.label}</Text>
                      <Text className="text-gray-400 font-medium text-[10px] uppercase tracking-wider mt-0.5">{item.sub}</Text>
                    </View>
                    <ChevronRight size={14} color="#CBD5E1" strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {SETTINGS.map((section, si) => (
          <View key={si} className="px-5 mt-8">
            <Text className="text-gray-500 font-medium text-xs mb-3 px-1">
              {section.section}
            </Text>
            <View className="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden">
              {section.items.map((item, ii) => {
                const Icon = item.icon;
                const isLast = ii === section.items.length - 1;
                return (
                  <TouchableOpacity
                    key={ii}
                    activeOpacity={0.7}
                    onPress={() => item.onPress && item.onPress(router)}
                    className={`flex-row items-center px-5 py-4 ${!isLast ? "border-b border-gray-50" : ""}`}
                  >
                    <View
                      className="w-10 h-10 rounded-2xl items-center justify-center mr-4"
                      style={{ backgroundColor: item.bg }}
                    >
                      <Icon size={18} color={item.color} strokeWidth={2} />
                    </View>
                    <Text className="text-[#1E293B] font-medium text-base flex-1">{item.label}</Text>

                    {(item as any).toggle !== undefined ? (
                      <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: "#F1F5F9", true: "#DCFCE7" }}
                        thumbColor={notifications ? "#10B981" : "#94A3B8"}
                      />
                    ) : item.label === "Language" ? (
                      <View className="flex-row items-center">
                        <Text className="text-gray-400 font-medium text-sm mr-2">{language === 'np' ? 'नेपाली' : 'English'}</Text>
                        <ChevronRight size={16} color="#CBD5E1" strokeWidth={2} />
                      </View>
                    ) : (item as any).value ? (
                      <View className="flex-row items-center">
                        <Text className="text-gray-400 font-medium text-sm mr-2">{(item as any).value}</Text>
                        <ChevronRight size={16} color="#CBD5E1" strokeWidth={2} />
                      </View>
                    ) : (
                      <ChevronRight size={16} color="#CBD5E1" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View className="px-5 mt-10">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.replace("/" as any)}
            className="bg-white rounded-3xl p-5 flex-row items-center border border-gray-50 shadow-sm"
          >
            <View className="bg-rose-50 w-10 h-10 rounded-2xl items-center justify-center mr-4">
              <LogOut size={18} color="#E11D48" strokeWidth={2} />
            </View>
            <Text className="text-rose-600 font-medium text-base flex-1">Log Out</Text>
            <ChevronRight size={16} color="#FDA4AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-400 font-medium text-[10px] text-center mt-10 uppercase tracking-widest">
          FCHV Saathi v1.0.0 • Ministry of Health, Nepal
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\report.tsx


``tsx

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import React from "react";
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText,
  User,
  Baby,
  Users,
  Send,
  CheckCircle2,
  Bell,
  CheckCircle
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import "../../global.css";
import Colors from "../../constants/Colors";
import TopHeader from "@/components/layout/TopHeader";

const ReportCard = ({ title, subtitle, count, expected, status, icon: Icon, color, hasAction }: any) => (
  <View className="bg-white rounded-[32px] p-6 mb-4 shadow-sm border border-gray-100 relative overflow-hidden">
    {hasAction && <View className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />}

    <View className="flex-row justify-between items-start mb-4">
      <View className={`${color === 'red' ? 'bg-red-50' : 'bg-blue-50'} p-3 rounded-2xl`}>
        <Icon size={24} color={color === 'red' ? Colors.nepali : Colors.primary} strokeWidth={2.5} />
      </View>
      <View className={`${status === 'READY' ? 'bg-green-50' : 'bg-red-50'} px-3 py-1 rounded-full`}>
        <Text className={`${status === 'READY' ? 'text-green-600' : 'text-red-500'} font-black text-[10px] uppercase tracking-widest`}>
          {status}
        </Text>
      </View>
    </View>

    <View>
      <Text style={{ color: Colors.textPrimary }} className="text-xl font-black">{title}</Text>
      <Text className="text-gray-400 font-bold text-xs mt-0.5">{subtitle}</Text>
    </View>

    <View className="h-[1px] bg-gray-50 my-4" />

    <View className="flex-row justify-between items-end">
      <View className="flex-row items-baseline">
        <Text style={{ color: Colors.textPrimary }} className="text-3xl font-black">{count}</Text>
        {expected && (
          <Text className="text-gray-400 font-bold text-xs ml-2">Expected: {expected}</Text>
        )}
        {status === 'ACTION REQ' && (
          <Text className="text-gray-400 font-bold text-xs ml-2">Pending</Text>
        )}
      </View>

      {status === 'ACTION REQ' && (
        <TouchableOpacity>
          <Text className="text-blue-500 font-black text-[13px]">History</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function ReportScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] mt-10">
      <StatusBar barStyle="dark-content" />

      {/* Custom Header with Profile & Notification */}
      {/* <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-[#F8FAFC]">
        <View className="flex-row items-center">
            <View className="bg-primary w-10 h-10 rounded-full items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <Image source={{uri: "https://i.pravatar.cc/150?u=laxmi"}} className="w-full h-full" />
            </View>
            <View className="ml-3">
                <Text style={{ color: Colors.textPrimary }} className="font-black text-sm uppercase tracking-tighter">FCHV Saathi <Text className="text-green-600 font-bold text-[11px] normal-case">(स्वयंसेविका साथी)</Text></Text>
            </View>
        </View>
        <TouchableOpacity className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-50">
          <Bell size={20} color="#64748B" strokeWidth={2} />
        </TouchableOpacity>
      </View> */}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View className="px-6 mt-4">
          <Text style={{ color: Colors.textPrimary }} className="text-[32px] font-black leading-tight tracking-tight">
            Monthly Reporting
          </Text>
          <View className="flex-row items-center mt-1">
            <Calendar size={14} color="#64748B" strokeWidth={2.5} />
            <Text className="text-gray-500 font-bold text-[14px] ml-2">
              July 2025
            </Text>
          </View>
        </View>

        {/* Progress Circular Card */}
        <View className="px-6 mt-8">
          <View className="bg-blue-50 rounded-[40px] p-8 items-center border border-blue-100 relative overflow-hidden">
            {/* Progress Circle Placeholder (Visual Mockup) */}
            <View className="relative w-32 h-32 items-center justify-center mb-6">
              <View className="w-28 h-28 rounded-full border-[10px] border-white items-center justify-center">
                <View className="w-28 h-28 rounded-full border-[10px] border-green-700 absolute rotate-45 border-t-transparent border-l-transparent" />
                <View>
                  <Text style={{ color: Colors.textPrimary }} className="text-[28px] font-black leading-none">75%</Text>
                  <Text className="text-gray-400 font-black text-[8px] uppercase tracking-widest text-center mt-1">Complete</Text>
                </View>
              </View>
            </View>

            <Text style={{ color: Colors.textPrimary }} className="text-xl font-black text-center px-4">
              Almost there, Laxmi!
            </Text>
            <Text className="text-gray-500 font-bold text-center text-sm mt-2 leading-5 px-4">
              You have completed <Text className="text-primary font-black">4 out of 5</Text> required report sections for this month. One more to go!
            </Text>
          </View>
        </View>

        {/* Categories List */}
        <View className="px-6 mt-10">
          <ReportCard
            title="ANC Visits"
            subtitle="प्रसूति पूर्व जाँच"
            count="12"
            expected="14"
            status="READY"
            icon={User}
          />
          <ReportCard
            title="Delivery"
            subtitle="प्रसूति"
            count="10"
            expected="12"
            status="READY"
            icon={Baby}
          />
          <ReportCard
            title="PNC Visits"
            subtitle="सुत्केरी जाँच"
            count="08"
            expected="08"
            status="READY"
            icon={Baby}
          />
          <ReportCard
            title="Family Planning Counseling"
            subtitle="परिवार नियोजन परामर्श"
            count="24"
            expected="Consultations"
            status="READY"
            icon={Users}
          />
          <ReportCard
            title="Referrals"
            subtitle="प्रेषण रिपोर्ट"
            count="03"
            status="ACTION"
            icon={CheckCircle2}
            color="red"
            hasAction={true}
          />
        </View>

        {/* Final Submission Card */}
        <View className="px-6 mt-10 flex-1 justify-end">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-lg shadow-emerald-200"
            style={{ backgroundColor: Colors.trust }}
          >
            <Send size={20} color="white" strokeWidth={2.5} />
            <Text className="text-white font-black text-lg ml-3">Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\visit-list.tsx


``tsx

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


``


## File: .\src\app\dashboard\_layout.tsx


``tsx

import { View } from "react-native";
import { Drawer } from "expo-router/drawer";
import React from "react";
import "../../global.css";
import CustomDrawer from "@/components/navigation/CustomDrawer";
import BottomNavigation from "@/components/navigation/BottomNavigation";

export default function DashboardLayout() {
  return (
    <View className="flex-1">
      <Drawer
        drawerContent={(props: any) => <CustomDrawer {...props} />}
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
          name="learn"
          options={{
            title: "Learn & Resources",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="learn-details"
          options={{
            title: "Learn Details",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="nutritions"
          options={{
            title: "Nutrition Guide",
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
        <Drawer.Screen
          name="mother-list"
          options={{
            title: "Mother List",
            drawerItemStyle: { display: "none" },
          }}
        />

        <Drawer.Screen
          name="mother-profile"
          options={{
            title: "Mother Profile",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="report"
          options={{
            title: "Reports",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="maternal-death-report"
          options={{
            title: "Maternal Death Report",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="newborn-death-report/index"
          options={{
            title: "Newborn Death Report",
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="child-death-report"
          options={{
            title: "Child Death Report",
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
      <BottomNavigation />
    </View>
  );
}


``


## File: .\src\app\dashboard\mother-list\add-mother.tsx


``tsx

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { User, Baby } from "lucide-react-native";
import "../../../global.css";
import CustomHeader from "../../../components/CustomHeader";
import MotherForm from "../../../components/MotherForm";
import PregnancyForm from "../../../components/PregnancyForm";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TabIndicator = ({
  step,
  setStep,
}: {
  step: number;
  setStep: (s: number) => void;
}) => {
  const tabs = [
    { icon: User, label: "Mother Info" },
    { icon: Baby, label: "Pregnancy" },
  ];

  return (
    <View className="flex-row items-center justify-center bg-white px-4 py-2 border-b border-gray-100 mb-2 gap-3">
      {tabs.map((t, i) => {
        const isActive = i === step;
        const Icon = t.icon;
        
        return (
          <TouchableOpacity 
            key={i}
            activeOpacity={0.8}
            onPress={() => setStep(i)}
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${isActive ? 'bg-blue-50 border border-blue-200' : 'bg-transparent border border-transparent'}`}
          >
            <Icon size={20} color={isActive ? "#3B82F6" : "#94A3B8"} strokeWidth={isActive ? 2.5 : 2} />
            <Text className={`ml-2 font-bold ${isActive ? 'text-[#3B82F6]' : 'text-gray-400'}`}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function AddMotherScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [step, setStep] = useState(0);

  // Smooth sliding animation
  const slideAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: step === 0 ? 0 : -SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }, [step]);

  const goBack = () => {
    router.replace("/dashboard/mother-list" as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <CustomHeader
        title={id ? "Edit Details" : "Registration"}
        subtitle=""
        onBackPress={goBack}
      />

      {/* Tab Indicator */}
      <TabIndicator step={step} setStep={setStep} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            width: SCREEN_WIDTH * 2,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <ScrollView
              className="flex-1 bg-white"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 130,
                paddingTop: 8,
                paddingHorizontal: 20,
              }}
              keyboardShouldPersistTaps="handled" 
            >
              <MotherForm id={id} />
            </ScrollView>
          </View>

          <View style={{ width: SCREEN_WIDTH, flex: 1 }}>
            <ScrollView
              className="flex-1 bg-white"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 130,
                paddingTop: 8,
                paddingHorizontal: 20,
              }}
              keyboardShouldPersistTaps="handled" 
            >
              <PregnancyForm id={id} onSwitchToMother={() => setStep(0)} />
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\mother-list\index.tsx


``tsx

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
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import {
  Search,
  Plus,
  Baby,
  Calendar,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  Bell,
  Check,
} from "lucide-react-native";
import { getAllMothersList, MotherListDbItem } from "../../../hooks/database/models/MotherModel";

export default function MotherListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMothers = async () => {
    try {
      const list = await getAllMothersList();
      setMothers(list);
    } catch (error) {
      console.error("Failed to fetch mothers:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMothers();
    }, [])
  );

  const filtered = mothers.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.nameNp || "").includes(search) ||
      (m.ward || "").toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const getAncStatus = (lmp: string | null) => {
    if (!lmp) return { status: 'New Case', color: 'blue' };
    const lmpDate = new Date(lmp);
    const now = new Date();
    const dif = now.getTime() - lmpDate.getTime();
    const wks = Math.floor(dif / (1000 * 60 * 60 * 24 * 7));

    const milestones = [12, 16, 20, 24, 28, 32, 36, 40];
    let currentVisit = 0;
    milestones.forEach((m, i) => {
      if (wks >= m) currentVisit = i + 1;
    });

    if (wks > 42) return { status: 'Post-Term', color: 'red' };
    if (currentVisit === 0) return { status: 'New Case', color: 'blue' };
    return { status: `Visit ${currentVisit} Complete`, color: 'blue' };
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* Custom FCHV Header */}
      <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-white">
        <View className="flex-row items-center">
          <View className="bg-blue-50 p-1.5 rounded-xl mr-3">
            <Image
              source={require("../../../assets/fchv-logo.png")}
              className="w-10 h-10"
              resizeMode="contain"
            />
          </View>
          <Text className="text-primary text-xl font-black">FCHV Assistant</Text>
        </View>
        <TouchableOpacity className="bg-gray-50 p-2.5 rounded-2xl">
          <Bell size={24} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-[#F8FAFC]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search Bar */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center bg-white px-4 h-14 rounded-2xl border border-gray-100 shadow-sm">
            <Search size={20} color="#94A3B8" />
            <TextInput
              className="flex-1 ml-3 text-base text-[#1E293B] font-medium"
              placeholder="Search pregnant women by name..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row px-5 mt-6 gap-4">
          <TouchableOpacity
            onPress={() => router.push("/dashboard/mother-list/add-mother" as any)}
            className="flex-1 bg-[#0262C4] p-5 rounded-[28px] items-center justify-center shadow-lg shadow-blue-900/20"
          >
            <View className="bg-white/20 p-2 rounded-xl mb-3">
              <Plus size={24} color="white" strokeWidth={3} />
            </View>
            <Text className="text-white font-black text-center text-[13px] leading-tight">New{"\n"}Registration</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 bg-[#006F62] p-5 rounded-[28px] items-center justify-center shadow-lg shadow-teal-900/20"
          >
            <View className="bg-white/20 p-2 rounded-xl mb-3">
              <Baby size={24} color="white" strokeWidth={3} />
            </View>
            <Text className="text-white font-black text-center text-[13px] leading-tight">Record Birth</Text>
          </TouchableOpacity>
        </View>

        <View className="px-5">
          {loading ? (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="text-gray-400 font-black text-sm mt-4 italic">Loading trackers...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View className="py-20 items-center justify-center opacity-50">
              <User size={48} color="#CBD5E1" strokeWidth={1.5} />
              <Text className="text-gray-400 font-black text-base italic mt-4">No trackers found</Text>
            </View>
          ) : (
            filtered?.map((mother) => {
              const status = getAncStatus(mother.lmp);
              const lmpTime = mother.lmp ? new Date(mother.lmp).getTime() : 0;
              const wks = mother.lmp ? Math.floor((new Date().getTime() - lmpTime) / (1000 * 60 * 60 * 24 * 7)) : 0;

              return (
                <TouchableOpacity
                  key={mother.id}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: "/dashboard/mother-profile", params: { id: mother.id } } as any)}
                  className="bg-white p-5 rounded-[32px] mb-6 border border-gray-100 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1 pr-4">
                      <Text className="text-[#1E293B] text-2xl font-black leading-tight">{mother.name}</Text>
                      <Text className="text-gray-400 font-bold text-xs mt-1">
                        Age: {mother.age || '26'} • {mother.pregnancy_count || '1'}st Pregnancy
                      </Text>
                    </View>
                    <View className={`px-3 py-1.5 rounded-xl ${status.color === 'red' ? 'bg-rose-50' : 'bg-blue-50'}`}>
                      <Text className={`text-[11px] font-black ${status.color === 'red' ? 'text-rose-600' : 'text-blue-600'}`}>
                        {status.status}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <Text className="text-gray-400 font-black text-[10px] uppercase">LMP</Text>
                      <Text className="text-[#1E293B] font-black text-base mt-0.5">{mother.lmp || 'Jan 12, 2024'}</Text>
                    </View>
                    <View className="flex-1 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <Text className="text-gray-400 font-black text-[10px] uppercase">EDD</Text>
                      <Text className="text-[#1E293B] font-black text-base mt-0.5">{mother.edd || 'Oct 18, 2024'}</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-[#1E293B] font-bold text-[13px]">ANC Schedule (8 Visits)</Text>
                    <Text className="text-blue-600 font-black text-[13px]">
                      {wks < 40 ? `Next Visit: Week ${[12, 16, 20, 24, 28, 32, 36, 40].find(m => m > wks)}` : 'Completed'}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-between px-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((v, i) => {
                      const completed = wks >= [12, 16, 20, 24, 28, 32, 36, 40][i];
                      const current = !completed && (i === 0 || wks >= [12, 16, 20, 24, 28, 32, 36, 40][i - 1]);

                      return (
                        <View key={v} className="flex-row items-center flex-1">
                          <View className={`w-8 h-8 rounded-full items-center justify-center border-2 ${completed ? 'bg-[#006F62] border-[#006F62]' :
                              current ? 'border-primary' : 'bg-gray-100 border-gray-100'
                            }`}>
                            {completed ? (
                              <Check size={14} color="white" strokeWidth={4} />
                            ) : (
                              <Text className={`text-[11px] font-black ${current ? 'text-primary' : 'text-gray-400'}`}>{v}</Text>
                            )}
                          </View>
                          {i < 7 && (
                            <View className={`h-[2px] flex-1 mx-1 ${completed ? 'bg-[#006F62]' : 'bg-gray-100'}`} />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\mother-list\_layout.tsx


``tsx

import { Stack } from "expo-router";
import React from "react";

export default function MotherListLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}


``


## File: .\src\app\dashboard\newborn-death-report\index.tsx


``tsx

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Share
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Download, Filter, Search, Trash2 } from "lucide-react-native";
import "../../../global.css";
import { getAllNewbornDeaths, deleteNewbornDeath } from "../../../hooks/database/models/NewbornDeathModel";
import { NewbornDeathStoreType } from "../../../hooks/database/types/newbornDeathModal";
import Colors from "../../../constants/Colors";
import CustomHeader from "../../../components/CustomHeader";

export default function NewbornDeathReportScreen() {
  const router = useRouter();
  const [data, setData] = useState<NewbornDeathStoreType[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDownload = async () => {
    if (data.length === 0) {
      Alert.alert("No Data", "There are no newborn death records to export.");
      return;
    }

    try {
      const headers = [
        "S.N.", "Dead Newborn Name", "Gender", "Mother Name", "Mother Age", 
        "Birth Day", "Birth Month", "Birth Year", 
        "Birth:Home", "Birth:Inst", "Birth:Other", 
        "Cond:Preterm", "Cond:LowWeight", "Cond:Normal", "Cond:Other",
        "Death Age (Days)",
        "Cause:Asphyxia", "Cause:Hypothermia", "Cause:Infection", "Cause:Other",
        "DeathPlace:Home", "DeathPlace:Inst", "DeathPlace:Other", 
        "Remarks"
      ].join(",");

      const rows = data.map((item, index) => {
        const bPlace = item.delivery_place?.toLowerCase();
        const bCond = item.birth_condition?.toLowerCase();
        const dCond = item.cause_of_death?.toLowerCase();
        const dPlace = item.death_place?.toLowerCase();

        return [
          index + 1,
          `"${item.baby_name || '-'}"`,
          `"${item.gender || '-'}"`,
          `"${item.mother_name}"`,
          `"-"`, // No mother age field directly attached in this model
          item.birth_day,
          item.birth_month,
          item.birth_year,
          bPlace === 'home' ? "✔" : "",
          bPlace === 'institution' ? "✔" : "",
          bPlace === 'other' ? `"${item.delivery_place_other || '✔'}"` : "",
          bCond === 'preterm' ? "✔" : "",
          bCond === 'lowweight' ? "✔" : "",
          bCond === 'normal' ? "✔" : "",
          bCond === 'other' ? `"${item.birth_condition_other || '✔'}"` : "",
          item.death_age_days,
          dCond === 'asphyxia' ? "✔" : "",
          dCond === 'hypothermia' ? "✔" : "",
          dCond === 'infection' ? "✔" : "",
          dCond === 'other' ? `"${item.cause_of_death_other || '✔'}"` : "",
          dPlace === 'home' ? "✔" : "",
          dPlace === 'institution' ? "✔" : "",
          dPlace === 'other' ? `"${item.death_place_other || '✔'}"` : "",
          `"${item.remarks ?? ''}"`
        ].join(",");
      }).join("\n");

      const csvContent = `${headers}\n${rows}`;

      await Share.share({
        message: csvContent,
        title: 'Newborn Death Register Report',
      });
    } catch (error) {
      Alert.alert("Export Error", "An error occurred while generating the report.");
    }
  };

  const handleDelete = (id: string, motherName: string) => {
    Alert.alert(
      "रेकर्ड मेटाउनुहोस्",
      `"${motherName}" को नवजात शिशु मृत्यु रेकर्ड मेटाउन चाहनुहुन्छ?`,
      [
        { text: "रद्द गर्नुहोस्", style: "cancel" },
        {
          text: "मेटाउनुहोस्",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteNewbornDeath(id);
              setData((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
              Alert.alert("Error", "Record could not be deleted.");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const records = await getAllNewbornDeaths();
          setData(records);
        } catch (error) {
          console.error("error fetching newborn deaths", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, [])
  );

  const Cell = ({ children, width, borderRight = true }: any) => (
    <View 
      style={{ width }} 
      className={`h-full justify-center px-2 py-3 ${borderRight ? "border-r border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-bold text-[11px] text-center" numberOfLines={2}>
        {children}
      </Text>
    </View>
  );

  const HeaderCell = ({ children, width, height = 40, borderRight = true, borderBottom = true }: any) => (
    <View 
      style={{ width, height }} 
      className={`justify-center items-center px-1 bg-slate-100 ${borderRight ? "border-r border-gray-300" : ""} ${borderBottom ? "border-b border-gray-300" : ""}`}
    >
      <Text className="text-slate-900 font-black text-[10px] text-center uppercase">
        {children}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Row Indices from 1 to 23
  const tableIndices = Array.from({length: 24}, (_, i) => i + 1);

  const getWidthForIndex = (n: number) => {
    switch (n) {
      case 1: return 50;
      case 2: return 150;
      case 3: return 80; // Gender
      case 4: return 180;
      case 5: return 70;
      default:
        // Adjust indices after Gender (3)
        const adjustedN = n > 3 ? n - 1 : n;
        switch (adjustedN) {
          case 5:
          case 6:
          case 7:
          case 8:
          case 9:
          case 10: return 60;
          case 11:
          case 12:
          case 13:
          case 14:
          case 15:
          case 16:
          case 17:
          case 18:
          case 19: return 80;
          case 20:
          case 21:
          case 22: return 60;
          case 23: return 200;
          default: return 60;
        }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <CustomHeader 
        title="नवजात शिशु मृत्यु विवरण" 
        onBackPress={() => router.push("/dashboard/profile")}
        rightNode={
          <TouchableOpacity 
            onPress={handleDownload}
            className="bg-emerald-50 p-2 rounded-xl"
          >
            <Download size={20} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <View className="flex-1">
        {/* Table Controls */}
        <View className="flex-row px-4 py-4 gap-3 bg-white border-b border-gray-100">
           <View className="flex-1 flex-row items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
              <Search size={16} color="#64748B" />
              <Text className="ml-2 text-slate-400 font-bold text-xs uppercase tracking-widest">Search Register...</Text>
           </View>
           <TouchableOpacity className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
              <Filter size={20} color="#64748B" />
           </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
          <View>
            {/* Hierarchical Header */}
            <View className="flex-row border-b border-gray-300 bg-slate-100">
              <HeaderCell width={50} height={100}>क्र.सं.</HeaderCell>
              <HeaderCell width={150} height={100}>मृतक नवजात शिशुको नाम</HeaderCell>
              <HeaderCell width={80} height={100}>लिङ्ग (Gender)</HeaderCell>

              <View>
                <HeaderCell width={250} height={40}>आमाको</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={180} height={60}>नाम, थर</HeaderCell>
                  <HeaderCell width={70} height={60}>पूरा गरेको उमेर</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>नवजात शिशु जन्मेको मिति</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>गते</HeaderCell>
                  <HeaderCell width={60} height={60}>महिना</HeaderCell>
                  <HeaderCell width={60} height={60}>साल</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>बच्चा जन्मिएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>घर</HeaderCell>
                  <HeaderCell width={60} height={60}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={320} height={40}>बच्चा जन्मदाको अवस्था*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={60}>समय नपुगेको</HeaderCell>
                  <HeaderCell width={80} height={60}>कम तौल</HeaderCell>
                  <HeaderCell width={80} height={60}>सामान्य</HeaderCell>
                  <HeaderCell width={80} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={80} height={100}>मृत्यु हुँदा शिशुको उमेर (दिनमा)</HeaderCell>

              <View>
                <HeaderCell width={320} height={40}>मृत्युको सम्भाव्य कारण*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={80} height={60}>निसासिएको</HeaderCell>
                  <HeaderCell width={80} height={60}>शिताङ्ग</HeaderCell>
                  <HeaderCell width={80} height={60}>संक्रमण</HeaderCell>
                  <HeaderCell width={80} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <View>
                <HeaderCell width={180} height={40}>मृत्यु भएको स्थान*</HeaderCell>
                <View className="flex-row">
                  <HeaderCell width={60} height={60}>घर</HeaderCell>
                  <HeaderCell width={60} height={60}>संस्था</HeaderCell>
                  <HeaderCell width={60} height={60}>अन्य</HeaderCell>
                </View>
              </View>

              <HeaderCell width={200} height={100}>कैफियत</HeaderCell>
              <HeaderCell width={70} height={100} borderRight={false}>Action</HeaderCell>
            </View>

            {/* Static Numbers Row as in Image */}
            <View className="flex-row border-b border-gray-300 bg-slate-50">
               {tableIndices.map((n, i) => (
                  <View key={i} style={{ width: getWidthForIndex(n), height: 30 }} className="border-r border-gray-300 justify-center items-center">
                    <Text className="text-slate-400 font-bold text-[10px]">{n}</Text>
                  </View>
               ))}
            </View>

            {/* Data Rows */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={true}>
              {data.map((item, index) => {
                const bPlace = item.delivery_place?.toLowerCase();
                const bCond = item.birth_condition?.toLowerCase();
                const dCond = item.cause_of_death?.toLowerCase();
                const dPlace = item.death_place?.toLowerCase();

                return (
                  <View key={item.id} className="flex-row border-b border-gray-200">
                    <Cell width={50}>{index + 1}</Cell>
                    <Cell width={150}>{item.baby_name || '-'}</Cell>
                    <Cell width={80}>{item.gender === 'Male' ? 'छोरा' : item.gender === 'Female' ? 'छोरी' : '-'}</Cell>
                    <Cell width={180}>{item.mother_name}</Cell>
                    <Cell width={70}>-</Cell>

                    <Cell width={60}>{item.birth_day}</Cell>
                    <Cell width={60}>{item.birth_month}</Cell>
                    <Cell width={60}>{item.birth_year}</Cell>

                    {/* Birth Place */}
                    <Cell width={60}>{bPlace === 'home' ? "✔" : ""}</Cell>
                    <Cell width={60}>{bPlace === 'institution' ? "✔" : ""}</Cell>
                    <Cell width={60}>{bPlace === 'other' ? (item.delivery_place_other || "✔") : ""}</Cell>

                    {/* Birth Condition */}
                    <Cell width={80}>{bCond === 'preterm' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'lowweight' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'normal' ? "✔" : ""}</Cell>
                    <Cell width={80}>{bCond === 'other' ? (item.birth_condition_other || "✔") : ""}</Cell>

                    {/* Death Age */}
                    <Cell width={80}>{item.death_age_days}</Cell>

                    {/* Death Cause */}
                    <Cell width={80}>{dCond === 'asphyxia' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'hypothermia' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'infection' ? "✔" : ""}</Cell>
                    <Cell width={80}>{dCond === 'other' ? (item.cause_of_death_other || "✔") : ""}</Cell>

                    {/* Death Place */}
                    <Cell width={60}>{dPlace === 'home' ? "✔" : ""}</Cell>
                    <Cell width={60}>{dPlace === 'institution' ? "✔" : ""}</Cell>
                    <Cell width={60}>{dPlace === 'other' ? (item.death_place_other || "✔") : ""}</Cell>

                    <Cell width={200}>{item.remarks}</Cell>
                    <View style={{ width: 70 }} className="h-full justify-center items-center py-3">
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id, item.mother_name)}
                        className="bg-red-50 p-2 rounded-lg"
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
              {data.length === 0 && (
                <View className="py-20 items-center justify-center min-w-full">
                  <Text className="text-slate-400 font-black italic">No records found in this register.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\record\add-record.tsx


``tsx

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Crypto from "expo-crypto";
import { User, Calendar, Baby, Activity, CheckCircle2, ChevronLeft, ChevronRight, Save, Pill, Plus } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FieldLabel, BoxInput, SelectInput } from "../../../components/FormElements";
import { createHmisRecord, getNextSerialNo, getHmisRecord } from "../../../hooks/database/models/HmisRecordModel";
import { useToast } from "../../../context/ToastContext";
import "../../../global.css";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: User, label: "Basic" },
    { icon: Calendar, label: "Dates" },
    { icon: Activity, label: "ANC" },
    { icon: Pill, label: "Meds" },
    { icon: Baby, label: "PNC" },
  ];

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      {steps.map((s, i) => {
        const Icon = s.icon;
        const isActive = i <= currentStep;
        const isCurrent = i === currentStep;
        return (
          <View key={i} className="items-center flex-1">
            <View className={`w-8 h-8 rounded-xl items-center justify-center ${isActive ? 'bg-primary' : 'bg-gray-100'}`}>
              <Icon size={16} color={isActive ? "white" : "#94A3B8"} strokeWidth={isCurrent ? 3 : 2} />
            </View>
            <Text className={`text-[8px] mt-1 font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>{s.label}</Text>
          </View>
        );
      })}
    </View>
  );
};

export default function AddRecordScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Date states
  const [lmpDate, setLmpDate] = useState<Date | null>(null);
  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [eddDate, setEddDate] = useState<Date | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    serial_no: 0,
    date_day: new Date().getDate(),
    date_month: new Date().getMonth() + 1,
    date_year: new Date().getFullYear(),
    mother_name: "",
    mother_age: "",
    lmp_day: null as number | null,
    lmp_month: null as number | null,
    lmp_year: null as number | null,
    edd_day: null as number | null,
    edd_month: null as number | null,
    edd_year: null as number | null,
    counseling_given: 0,
    checkup_12: 0, checkup_16: 0, checkup_20_24: 0, checkup_28: 0,
    checkup_32: 0, checkup_34: 0, checkup_36: 0, checkup_38_40: 0,
    checkup_other: "",
    iron_preg_received: 0,
    iron_pnc_received: 0,
    vit_a_received: 0,
    delivery_place: "",
    newborn_condition: "Alive",
    pnc_check_24hr: 0, pnc_check_3day: 0, pnc_check_7_14day: 0, pnc_check_42day: 0,
    pnc_check_other: "",
    family_planning_used: 0,
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
        try {
            if (id) {
                const record = await getHmisRecord(id);
                if (record) {
                    setFormData({
                        ...record,
                        mother_age: String(record.mother_age || ""),
                        serial_no: record.serial_no || 0,
                    } as any);
                    if (record.lmp_year && record.lmp_month && record.lmp_day) {
                        setLmpDate(new Date(record.lmp_year, record.lmp_month - 1, record.lmp_day));
                    }
                }
            } else {
                const sn = await getNextSerialNo();
                setFormData(prev => ({ ...prev, serial_no: sn }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsInitialLoading(false);
        }
    };
    init();
  }, [id]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: -step * SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [step]);

  // Calculate EDD and suggest ANC weeks automatically
  useEffect(() => {
    if (lmpDate) {
      // 1. Calculate EDD
      const edd = new Date(lmpDate);
      edd.setDate(edd.getDate() + 7);
      edd.setMonth(edd.getMonth() + 9);
      setEddDate(edd);

      // 2. Calculate Gestational Weeks for the record date
      const recordDate = new Date(formData.date_year, formData.date_month - 1, formData.date_day);
      const diffTime = recordDate.getTime() - lmpDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);

      // 3. Update Form Data
      setFormData(prev => {
        const newData = {
          ...prev,
          lmp_day: lmpDate.getDate(),
          lmp_month: lmpDate.getMonth() + 1,
          lmp_year: lmpDate.getFullYear(),
          edd_day: edd.getDate(),
          edd_month: edd.getMonth() + 1,
          edd_year: edd.getFullYear(),
        };

        // If we are editing, we ONLY want to auto-select if the user is 
        // explicitly changing the LMP to something new, OR if it's a new record.
        // To handle this, we check if AND weeks are all currently 0 or if we're in create mode.
        const anyAncSelected = prev.checkup_12 || prev.checkup_16 || prev.checkup_20_24 || prev.checkup_28 || 
                               prev.checkup_32 || prev.checkup_34 || prev.checkup_36 || prev.checkup_38_40;

        // Force update if LMP changed or it's new. 
        // But for safety, we'll reset only the standard week columns if we're auto-matching.
        if (weeks > 0) {
            // Reset all first
            newData.checkup_12 = 0; newData.checkup_16 = 0; newData.checkup_20_24 = 0; newData.checkup_28 = 0;
            newData.checkup_32 = 0; newData.checkup_34 = 0; newData.checkup_36 = 0; newData.checkup_38_40 = 0;

            // Set new one
            if (weeks <= 12) newData.checkup_12 = 1;
            else if (weeks <= 16) newData.checkup_16 = 1;
            else if (weeks <= 24) newData.checkup_20_24 = 1;
            else if (weeks <= 28) newData.checkup_28 = 1;
            else if (weeks <= 32) newData.checkup_32 = 1;
            else if (weeks <= 34) newData.checkup_34 = 1;
            else if (weeks <= 36) newData.checkup_36 = 1;
            else if (weeks <= 42) newData.checkup_38_40 = 1;
        }

        return newData;
      });
    }
  }, [lmpDate, formData.date_day, formData.date_month, formData.date_year]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!formData.mother_name.trim()) e.mother_name = "Name is required";
      if (!String(formData.mother_age).trim()) e.mother_age = "Age is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
      else handleSave();
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const skipStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await createHmisRecord({
        id: id || Crypto.randomUUID(),
        serial_no: formData.serial_no,
        date_day: formData.date_day,
        date_month: formData.date_month,
        date_year: formData.date_year,
        mother_name: formData.mother_name,
        mother_age: parseInt(formData.mother_age as any) || null,
        lmp_day: formData.lmp_day,
        lmp_month: formData.lmp_month,
        lmp_year: formData.lmp_year,
        edd_day: formData.edd_day,
        edd_month: formData.edd_month,
        edd_year: formData.edd_year,
        counseling_given: formData.counseling_given,
        checkup_12: formData.checkup_12,
        checkup_16: formData.checkup_16,
        checkup_20_24: formData.checkup_20_24,
        checkup_28: formData.checkup_28,
        checkup_32: formData.checkup_32,
        checkup_34: formData.checkup_34,
        checkup_36: formData.checkup_36,
        checkup_38_40: formData.checkup_38_40,
        checkup_other: formData.checkup_other,
        iron_preg_received: formData.iron_preg_received,
        iron_pnc_received: formData.iron_pnc_received,
        vit_a_received: formData.vit_a_received,
        delivery_place: formData.delivery_place,
        newborn_condition: formData.newborn_condition,
        pnc_check_24hr: formData.pnc_check_24hr,
        pnc_check_3day: formData.pnc_check_3day,
        pnc_check_7_14day: formData.pnc_check_7_14day,
        pnc_check_42day: formData.pnc_check_42day,
        pnc_check_other: formData.pnc_check_other,
        family_planning_used: formData.family_planning_used,
        remarks: formData.remarks,
      });
      showToast(id ? "Record updated successfully" : "Record saved successfully");
      router.back();
    } catch (error) {
      console.error(error);
      showToast("Failed to save record");
    } finally {
      setIsLoading(false);
    }
  };

  const ToggleBox = ({ label, value, onToggle }: { label: string, value: number, onToggle: (val: number) => void }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(value === 1 ? 0 : 1)}
      className={`flex-1 flex-row items-center p-3 rounded-xl border mb-2 ${value === 1 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100'}`}
    >
      <View className={`w-4 h-4 rounded mr-2 items-center justify-center border ${value === 1 ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}>
        {value === 1 && <CheckCircle2 size={12} color="white" strokeWidth={3} />}
      </View>
      <Text className={`text-[12px] font-bold ${value === 1 ? 'text-primary' : 'text-gray-500'}`}>{label}</Text>
    </TouchableOpacity>
  );

  const showSkip = id ? (step < 4) : (step >= 2 && step < 4);

  if (isInitialLoading) {
      return (
          <View className="flex-1 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#3B82F6" />
          </View>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <View>
            <Text className="text-lg font-black text-[#1E293B]">{id ? "Edit HMIS Entry" : "New HMIS Entry"}</Text>
            <Text className="text-[10px] text-gray-400 font-bold">Auto-Serial: #{formData.serial_no}</Text>
        </View>
      </View>

      <StepIndicator currentStep={step} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            flex: 1,
            flexDirection: "row",
            width: SCREEN_WIDTH * 5,
            transform: [{ translateX: slideAnim }],
          }}
        >
          {/* Step 1: Basic Info */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <View className="bg-blue-50 p-4 rounded-2xl mb-6 border border-blue-100">
                  <Text className="text-primary font-black text-xs uppercase mb-1">Registration Context</Text>
                  <Text className="text-gray-600 text-[13px]">Registering for: <Text className="font-bold">{formData.date_day}/{formData.date_month}/{formData.date_year}</Text></Text>
              </View>

              <FieldLabel label="Mother's Full Name (आमाको नाम)" />
              <BoxInput
                placeholder="Full Name"
                value={formData.mother_name}
                onChangeText={(v) => updateField("mother_name", v)}
                error={errors.mother_name}
              />

              <FieldLabel label="Age (उमेर)" />
              <BoxInput
                placeholder="Age"
                value={String(formData.mother_age)}
                onChangeText={(v) => updateField("mother_age", v)}
                keyboardType="numeric"
                error={errors.mother_age}
              />
            </ScrollView>
          </View>

          {/* Step 2: Dates */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="LMP Date (अन्तिम रजस्वला मिति)" />
              <TouchableOpacity
                onPress={() => setShowLmpPicker(true)}
                className="bg-gray-100 rounded-2xl h-14 border border-gray-200 px-4 flex-row items-center justify-between mb-6"
              >
                <Text className={`text-base ${lmpDate ? 'text-[#1E293B]' : 'text-gray-400'}`}>
                  {lmpDate ? lmpDate.toLocaleDateString() : "Select LMP Date"}
                </Text>
                <Calendar size={20} color="#94A3B8" />
              </TouchableOpacity>

              {showLmpPicker && (
                <DateTimePicker
                  value={lmpDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowLmpPicker(false);
                    if (date) setLmpDate(date);
                  }}
                />
              )}

              <FieldLabel label="Auto-calculated EDD (प्रसूतिको अनुमानित मिति)" />
              <View className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 flex-row items-center">
                  <Calendar size={20} color="#10B981" className="mr-3" />
                  <Text className="text-[#065F46] font-bold text-base">
                    {eddDate ? eddDate.toLocaleDateString() : "Waiting for LMP..."}
                  </Text>
              </View>

              <FieldLabel label="Counseling Given? (जीवन सुरक्षा परामर्श)" />
              <View className="flex-row gap-4 mb-4">
                 <ToggleBox label="Yes (छ)" value={formData.counseling_given} onToggle={(v) => updateField("counseling_given", v)} />
              </View>
            </ScrollView>
          </View>

          {/* Step 3: ANC Visits */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <Text className="text-gray-400 font-bold mb-4 text-xs">Select the weeks when check-up was done:</Text>
              <View className="flex-row gap-2">
                 <ToggleBox label="12 Week" value={formData.checkup_12} onToggle={(v) => updateField("checkup_12", v)} />
                 <ToggleBox label="16 Week" value={formData.checkup_16} onToggle={(v) => updateField("checkup_16", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="20-24 Wk" value={formData.checkup_20_24} onToggle={(v) => updateField("checkup_20_24", v)} />
                 <ToggleBox label="28 Week" value={formData.checkup_28} onToggle={(v) => updateField("checkup_28", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="32 Week" value={formData.checkup_32} onToggle={(v) => updateField("checkup_32", v)} />
                 <ToggleBox label="34 Week" value={formData.checkup_34} onToggle={(v) => updateField("checkup_34", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="36 Week" value={formData.checkup_36} onToggle={(v) => updateField("checkup_36", v)} />
                 <ToggleBox label="38-40 Wk" value={formData.checkup_38_40} onToggle={(v) => updateField("checkup_38_40", v)} />
              </View>
              <FieldLabel label="Other Week (अन्य)" />
              <BoxInput placeholder="Enter other weeks" value={formData.checkup_other} onChangeText={(v) => updateField("checkup_other", v)} />
            </ScrollView>
          </View>

          {/* Step 4: Meds */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="Iron 180 (Pregnancy)" />
              <ToggleBox label="Received (पाएको)" value={formData.iron_preg_received} onToggle={(v) => updateField("iron_preg_received", v)} />

              <FieldLabel label="Iron 45 (Post-delivery)" />
              <ToggleBox label="Received (पाएको)" value={formData.iron_pnc_received} onToggle={(v) => updateField("iron_pnc_received", v)} />

              <FieldLabel label="Vitamin 'A' (Post-delivery)" />
              <ToggleBox label="Received (पाएको)" value={formData.vit_a_received} onToggle={(v) => updateField("vit_a_received", v)} />
            </ScrollView>
          </View>

          {/* Step 5: PNC & Delivery */}
          <View style={{ width: SCREEN_WIDTH }}>
            <ScrollView className="p-6">
              <FieldLabel label="Delivery Place" />
              <SelectInput
                label="Place"
                value={formData.delivery_place}
                options={[
                  { label: "Home (घर)", value: "Home" },
                  { label: "Health Facility (संस्था)", value: "Facility" },
                  { label: "Other (अन्य)", value: "Other" },
                ]}
                onSelect={(v: string) => updateField("delivery_place", v)}
              />

              <FieldLabel label="Condition of Newborn" />
              <SelectInput
                label="Condition"
                value={formData.newborn_condition}
                options={[
                  { label: "Alive (जीवित)", value: "Alive" },
                  { label: "Dead (मृत)", value: "Dead" },
                ]}
                onSelect={(v: string) => updateField("newborn_condition", v)}
              />

              <Text className="text-gray-800 font-bold mb-2 text-xs">PNC Check-ups:</Text>
              <View className="flex-row gap-2">
                 <ToggleBox label="<24 hr" value={formData.pnc_check_24hr} onToggle={(v) => updateField("pnc_check_24hr", v)} />
                 <ToggleBox label="3rd Day" value={formData.pnc_check_3day} onToggle={(v) => updateField("pnc_check_3day", v)} />
              </View>
              <View className="flex-row gap-2">
                 <ToggleBox label="7-14 Day" value={formData.pnc_check_7_14day} onToggle={(v) => updateField("pnc_check_7_14day", v)} />
                 <ToggleBox label="42nd Day" value={formData.pnc_check_42day} onToggle={(v) => updateField("pnc_check_42day", v)} />
              </View>

              <FieldLabel label="Family Planning Method User?" />
              <ToggleBox label="Used (गरेको)" value={formData.family_planning_used} onToggle={(v) => updateField("family_planning_used", v)} />

              <FieldLabel label="Remarks" />
              <BoxInput placeholder="Notes..." value={formData.remarks} onChangeText={(v) => updateField("remarks", v)} />
            </ScrollView>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Navigation Buttons */}
      <View className="px-6 pb-8 pt-4 border-t border-gray-100 bg-white">
        <View className="flex-row gap-3">
            {step > 0 && (
            <TouchableOpacity
                onPress={prevStep}
                className="w-12 h-12 rounded-xl bg-gray-100 items-center justify-center border border-gray-200"
            >
                <ChevronLeft size={20} color="#64748B" />
            </TouchableOpacity>
            )}
            
            <TouchableOpacity
                onPress={nextStep}
                disabled={isLoading}
                className={`flex-1 h-12 rounded-xl bg-primary items-center justify-center shadow-md shadow-blue-100`}
            >
            <View className="flex-row items-center">
                <Text className="text-white font-black text-sm mr-2">
                {step === 4 ? (isLoading ? "Saving..." : "Finish Record") : "Next Step"}
                </Text>
                {step === 4 ? <Save size={18} color="white" /> : <ChevronRight size={18} color="white" />}
            </View>
            </TouchableOpacity>

            {showSkip && (
                <TouchableOpacity
                    onPress={skipStep}
                    className="px-4 h-12 rounded-xl bg-orange-50 items-center justify-center border border-orange-100"
                >
                    <Text className="text-orange-600 font-bold text-xs">Skip</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
}


``


## File: .\src\app\dashboard\record\index.tsx


``tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, ChevronLeft, Search, Check, X } from 'lucide-react-native';
import { getAllHmisRecords } from '../../../hooks/database/models/HmisRecordModel';
import { HmisRecordStoreType } from '../../../hooks/database/types/hmisRecordModal';
import Colors from '../../../constants/Colors';

const colWidths = {
  sn: 40,
  date: 40,
  mother: 150,
  age: 40,
  lmpEdd: 40,
  anc: 50,
  counsel: 35,
  meds: 48,
  delivery: 52,
  condition: 52,
  pnc: 52,
  fp: 48,
  remarks: 140
};

// Unified Cell Component
const GridCell = ({
  children,
  width,
  height,
  isFirstCol = false,
  isFirstRow = false,
  isHeader = false,
  textStyle = {},
  center = true,
}: any) => (
  <View style={[
    styles.gridCell,
    { width, height: height || '100%' },
    isFirstCol && { borderLeftWidth: 1.5 },
    isFirstRow && { borderTopWidth: 1.5 },
    isHeader && { backgroundColor: '#F3F4F6' },
    center ? { alignItems: 'center' } : { paddingHorizontal: 6 }
  ]}>
    <Text style={[styles.cellText, isHeader && styles.headerText, textStyle]}>
      {children}
    </Text>
  </View>
);

const Tick = ({ val, color = "#3B82F6" }: { val: number | null, color?: string }) => (
  val === 1 ? <Check size={14} color={color} strokeWidth={3} /> : null
);

const Cross = ({ val }: { val: number | null }) => (
  val === 0 ? <X size={14} color="#CBD5E1" strokeWidth={2} /> : null
);

export default function RecordScreen() {
  const router = useRouter();
  const [records, setRecords] = useState<HmisRecordStoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchRecords = async () => {
        try {
          const data = await getAllHmisRecords();
          setRecords(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecords();
    }, [])
  );

  const filteredRecords = records.filter(r =>
    r.mother_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      {/* App Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center justify-between border-b border-gray-50 bg-white">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-black text-[#1E293B]">HMIS Register</Text>
            <Text className="text-xs text-gray-400 font-bold">FCHV Maternal Health (4.2)</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/dashboard/record/add-record")}
          className="bg-primary px-4 h-10 rounded-xl items-center justify-center flex-row shadow-sm shadow-blue-200"
        >
          <Plus size={16} color="white" strokeWidth={3} />
          <Text className="text-white font-black text-xs ml-2">New Entry</Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      <View className="px-6 bg-white border-b border-gray-50 my-3">
        <View className="bg-gray-50 h-18 rounded-xl flex-row items-center px-4 border border-gray-100">
          <Search size={18} color="#64748B" />
          <TextInput
            placeholder="Search mother's name..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-slate-800 font-bold text-sm"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <View className="flex-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View>
              {/* Header Hierarchy - 4 Rows Matching Official Document Precisely */}
              <View style={styles.headerStack}>
                {/* Tier 1: Main Categories */}
                <View className="flex-row h-[36px]">
                  <GridCell width={colWidths.sn} height={144} isFirstCol isFirstRow isHeader>क्र.सं.</GridCell>
                  <GridCell width={colWidths.date * 3} height={36} isFirstRow isHeader>मिति</GridCell>
                  <GridCell width={colWidths.mother + colWidths.age} height={36} isFirstRow isHeader>गर्भवती महिलाको</GridCell>
                  <GridCell width={colWidths.lmpEdd * 3} height={36} isFirstRow isHeader>अन्तिम रजस्वला भएको (LMP) (ग.म.सा.)</GridCell>
                  <GridCell width={colWidths.lmpEdd * 3} height={36} isFirstRow isHeader>प्रसूतिको अनुमानित मिति (EDD) (ग.म.सा.)</GridCell>
                  <GridCell width={colWidths.counsel * 2} height={36} isFirstRow isHeader>जीवन सुरक्षा परामर्श दिएको</GridCell>
                  <GridCell width={colWidths.anc * 9} height={36} isFirstRow isHeader>स्वास्थ्य संस्थामा गर्भ जाँच गरेको पटक (औं हप्तामा)</GridCell>
                  <GridCell width={colWidths.meds * 4} height={36} isFirstRow isHeader>आईरन चक्की*</GridCell>
                  <GridCell width={colWidths.meds * 2} height={36} isFirstRow isHeader>सुत्केरी पश्चात भिटामिन ए*</GridCell>
                  <GridCell width={colWidths.delivery * 3} height={36} isFirstRow isHeader>प्रसूति भएको स्थान*</GridCell>
                  <GridCell width={colWidths.condition * 2} height={36} isFirstRow isHeader>शशुको जन्म अवस्था*</GridCell>
                  <GridCell width={colWidths.pnc * 5} height={36} isFirstRow isHeader>सुत्केरी र शिशु जाँच*</GridCell>
                  <GridCell width={colWidths.fp * 2} height={36} isFirstRow isHeader>प.नि साधन प्रयोग*</GridCell>
                  <GridCell width={colWidths.remarks} height={144} isFirstRow isHeader>कैफियत</GridCell>
                </View>

                {/* Tier 2: Sub-Groups / Descriptions */}
                <View className="flex-row h-[36px]">
                  <View style={{ width: colWidths.sn }} />
                  <GridCell width={colWidths.date} height={72} isHeader>गते</GridCell>
                  <GridCell width={colWidths.date} height={72} isHeader>महिना</GridCell>
                  <GridCell width={colWidths.date} height={72} isHeader>साल</GridCell>
                  <GridCell width={colWidths.mother} height={72} isHeader>नाम थर</GridCell>
                  <GridCell width={colWidths.age} height={72} isHeader>उमेर</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>गते</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>महिना</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>साल</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>गते</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>महिना</GridCell>
                  <GridCell width={colWidths.lmpEdd} height={72} isHeader>साल</GridCell>
                  <GridCell width={colWidths.counsel} height={72} isHeader>छ</GridCell>
                  <GridCell width={colWidths.counsel} height={72} isHeader>छैन</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>१२ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>१६ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>२०-२४</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>२८ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>३२ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>३४ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>३६ हप्ता</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>३८-४०</GridCell>
                  <GridCell width={colWidths.anc} height={72} isHeader>अन्य</GridCell>
                  <GridCell width={colWidths.meds * 2} height={36} isHeader textStyle={{ fontSize: 7 }}>गर्भावस्थामा १८० चक्की</GridCell>
                  <GridCell width={colWidths.meds * 2} height={36} isHeader textStyle={{ fontSize: 7 }}>सुत्केरी पश्चात ४५ चक्की</GridCell>
                  <GridCell width={colWidths.meds} height={72} isHeader>पाएको</GridCell>
                  <GridCell width={colWidths.meds} height={72} isHeader>नपाएको</GridCell>
                  <GridCell width={colWidths.delivery} height={72} isHeader>घर</GridCell>
                  <GridCell width={colWidths.delivery} height={72} isHeader>संस्था</GridCell>
                  <GridCell width={colWidths.delivery} height={72} isHeader>अन्य</GridCell>
                  <GridCell width={colWidths.condition} height={72} isHeader>जीवित</GridCell>
                  <GridCell width={colWidths.condition} height={72} isHeader>मृत</GridCell>
                  <GridCell width={colWidths.pnc} height={72} isHeader textStyle={{ fontSize: 7 }}>२४ घण्टा भित्र</GridCell>
                  <GridCell width={colWidths.pnc} height={72} isHeader textStyle={{ fontSize: 7 }}>३ दिनमा</GridCell>
                  <GridCell width={colWidths.pnc} height={72} isHeader textStyle={{ fontSize: 7 }}>७-१४ दिनमा</GridCell>
                  <GridCell width={colWidths.pnc} height={72} isHeader textStyle={{ fontSize: 7 }}>४२ दिनमा</GridCell>
                  <GridCell width={colWidths.pnc} height={72} isHeader>अन्य</GridCell>
                  <GridCell width={colWidths.fp} height={72} isHeader>गरेको</GridCell>
                  <GridCell width={colWidths.fp} height={72} isHeader>नगरेको</GridCell>
                </View>

                {/* Tier 3: Specific Status Labels (Specifically for Iron) */}
                <View className="flex-row h-[36px]">
                  <View style={{ width: colWidths.sn + (colWidths.date * 3) + colWidths.mother + colWidths.age + (colWidths.lmpEdd * 6) + (colWidths.counsel * 2) + (colWidths.anc * 9) }} />
                  <GridCell width={colWidths.meds} height={36} isHeader>पाएको</GridCell>
                  <GridCell width={colWidths.meds} height={36} isHeader>नपाएको</GridCell>
                  <GridCell width={colWidths.meds} height={36} isHeader>पाएको</GridCell>
                  <GridCell width={colWidths.meds} height={36} isHeader>नपाएको</GridCell>
                </View>

                {/* Tier 4: Column Numbers */}
                <View className="flex-row h-[36px] bg-[#E5E7EB]">
                  <View style={{ width: colWidths.sn }} />
                  {/* Column numbers 2-36 */}
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, "-", 33, 34, 35, 36].map((num, i) => {
                    let width = colWidths.date;
                    if (i === 3) width = colWidths.mother;
                    if (i === 4) width = colWidths.age;
                    if (i >= 5 && i <= 10) width = colWidths.lmpEdd;
                    if (i >= 11 && i <= 12) width = colWidths.counsel;
                    if (i >= 13 && i <= 21) width = colWidths.anc;
                    if (i >= 22 && i <= 27) width = colWidths.meds;
                    if (i >= 28 && i <= 30) width = colWidths.delivery;
                    if (i >= 31 && i <= 32) width = colWidths.condition;
                    if (i >= 33 && i <= 37) width = colWidths.pnc;
                    if (i >= 38 && i <= 39) width = colWidths.fp;
                    return <GridCell key={i} width={width} height={36} textStyle={styles.colNumText}>{num}</GridCell>
                  })}
                </View>
              </View>

              {/* Data Body */}
              <ScrollView>
                {filteredRecords.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push({ pathname: "/dashboard/record/profile", params: { id: item.id } } as any)}
                    activeOpacity={0.7}
                    className={`flex-row ${index % 2 === 1 ? 'bg-blue-50/10' : 'bg-white'}`}
                    style={{ height: 48 }}
                  >
                    <GridCell width={colWidths.sn} height={48} isFirstCol>{item.serial_no}</GridCell>
                    <GridCell width={colWidths.date} height={48}>{item.date_day}</GridCell>
                    <GridCell width={colWidths.date} height={48}>{item.date_month}</GridCell>
                    <GridCell width={colWidths.date} height={48}>{item.date_year}</GridCell>
                    <GridCell width={colWidths.mother} height={48} center={false} textStyle={{ fontWeight: '900', fontSize: 10 }}>{item.mother_name}</GridCell>
                    <GridCell width={colWidths.age} height={48}>{item.mother_age}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.lmp_day}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.lmp_month}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.lmp_year}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.edd_day}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.edd_month}</GridCell>
                    <GridCell width={colWidths.lmpEdd} height={48}>{item.edd_year}</GridCell>

                    <GridCell width={colWidths.counsel} height={48}><Tick val={item.counseling_given} color="#10B981" /></GridCell>
                    <GridCell width={colWidths.counsel} height={48}><Cross val={item.counseling_given} /></GridCell>

                    <GridCell width={colWidths.anc} height={48}>{item.checkup_12 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_16 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_20_24 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_28 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_32 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_34 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_36 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}>{item.checkup_38_40 === 1 ? <Check size={12} color="#3B82F6" /> : ""}</GridCell>
                    <GridCell width={colWidths.anc} height={48}><Text style={{ fontSize: 7 }}>{item.checkup_other}</Text></GridCell>

                    <GridCell width={colWidths.meds} height={48}><Tick val={item.iron_preg_received === 1 ? 1 : 0} /></GridCell>
                    <GridCell width={colWidths.meds} height={48}><Cross val={item.iron_preg_received === 1 ? 1 : 0} /></GridCell>
                    <GridCell width={colWidths.meds} height={48}><Tick val={item.iron_pnc_received === 1 ? 1 : 0} /></GridCell>
                    <GridCell width={colWidths.meds} height={48}><Cross val={item.iron_pnc_received === 1 ? 1 : 0} /></GridCell>
                    <GridCell width={colWidths.meds} height={48}><Tick val={item.vit_a_received === 1 ? 1 : 0} /></GridCell>
                    <GridCell width={colWidths.meds} height={48}><Cross val={item.vit_a_received === 1 ? 1 : 0} /></GridCell>

                    <GridCell width={colWidths.delivery} height={48}>{item.delivery_place === "Home" ? <Check size={12} color="#555" /> : ""}</GridCell>
                    <GridCell width={colWidths.delivery} height={48}>{item.delivery_place === "Facility" ? <Check size={12} color="#555" /> : ""}</GridCell>
                    <GridCell width={colWidths.delivery} height={48}>{item.delivery_place === "Other" ? <Check size={12} color="#555" /> : ""}</GridCell>

                    <GridCell width={colWidths.condition} height={48}>{item.newborn_condition === "Alive" ? <Check size={12} color="#10B981" /> : ""}</GridCell>
                    <GridCell width={colWidths.condition} height={48}>{item.newborn_condition === "Dead" ? <Check size={12} color="#EF4444" /> : ""}</GridCell>

                    <GridCell width={colWidths.pnc} height={48}><Tick val={item.pnc_check_24hr} /></GridCell>
                    <GridCell width={colWidths.pnc} height={48}><Tick val={item.pnc_check_3day} /></GridCell>
                    <GridCell width={colWidths.pnc} height={48}><Tick val={item.pnc_check_7_14day} /></GridCell>
                    <GridCell width={colWidths.pnc} height={48}><Tick val={item.pnc_check_42day} /></GridCell>
                    <GridCell width={colWidths.pnc} height={48}><Text style={{ fontSize: 7 }}>{item.pnc_check_other}</Text></GridCell>

                    <GridCell width={colWidths.fp} height={48}><Tick val={item.family_planning_used} /></GridCell>
                    <GridCell width={colWidths.fp} height={48}><Cross val={item.family_planning_used} /></GridCell>

                    <GridCell width={colWidths.remarks} height={48} center={false}>{item.remarks}</GridCell>
                  </TouchableOpacity>
                ))}
                <View className="h-40" />
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}

      {/* Primary Action */}
      {/* <TouchableOpacity
        onPress={() => router.push("/dashboard/record/add-record")}
        className="absolute bottom-10 right-8 w-14 h-14 rounded-2xl bg-primary items-center justify-center shadow-xl shadow-blue-400 border-4 border-white"
        activeOpacity={0.9}
      >
        <Plus size={28} color="white" strokeWidth={3} />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerStack: {
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
  },
  gridCell: {
    justifyContent: 'center',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  cellText: {
    fontSize: 9,
    color: '#334155',
    textAlign: 'center',
  },
  headerText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#1F2937',
  },
  colNumText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#4B5563',
  }
});


``


## File: .\src\app\dashboard\record\profile.tsx


``tsx

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  User,
  Activity,
  Calendar,
  CheckCircle2,
  Edit,
  Trash2,
  Baby,
  Pill,
  Heart,
  FileText,
  Clock,
  MapPin,
  Info
} from "lucide-react-native";
import "../../../global.css";
import { getHmisRecord, deleteHmisRecord } from "../../../hooks/database/models/HmisRecordModel";
import { getMaternalDeathByMother } from "../../../hooks/database/models/MaternalDeathModel";
import { getNewbornDeathByMother } from "../../../hooks/database/models/NewbornDeathModel";
import { getChildDeathByMother } from "../../../hooks/database/models/ChildDeathModel";
import MaternalDeathModal from "../../../components/forms/MaternalDeathModal";
import NewbornDeathModal from "../../../components/forms/NewbornDeathModal";
import ChildDeathModal from "../../../components/forms/ChildDeathModal";
import { HmisRecordStoreType } from "../../../hooks/database/types/hmisRecordModal";
import { MaternalDeathStoreType } from "../../../hooks/database/types/maternalDeathModal";
import { NewbornDeathStoreType } from "../../../hooks/database/types/newbornDeathModal";
import { ChildDeathStoreType } from "../../../hooks/database/types/childDeathModal";
import Colors from "../../../constants/Colors";
import CustomHeader from "../../../components/CustomHeader";
import { useToast } from "../../../context/ToastContext";

export default function HmisRecordProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [record, setRecord] = useState<HmisRecordStoreType | null>(null);
  const [existingDeathRecord, setExistingDeathRecord] = useState<MaternalDeathStoreType | null>(null);
  const [existingNewbornDeathRecord, setExistingNewbornDeathRecord] = useState<NewbornDeathStoreType | null>(null);
  const [existingChildDeathRecord, setExistingChildDeathRecord] = useState<ChildDeathStoreType | null>(null);
  const [loading, setLoading] = useState(true);

  const [maternalDeathModalVisible, setMaternalDeathModalVisible] = useState(false);
  const [newbornDeathModalVisible, setNewbornDeathModalVisible] = useState(false);
  const [childDeathModalVisible, setChildDeathModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchRecord = async () => {
        if (!id) {
          setLoading(false);
          return;
        }
        try {
          const data = await getHmisRecord(id);
          if (isActive) {
            setRecord(data);
            if (data?.id) {
              const deathData = await getMaternalDeathByMother(data.id);
              setExistingDeathRecord(deathData);
              const newbornDeathData = await getNewbornDeathByMother(data.id);
              setExistingNewbornDeathRecord(newbornDeathData);
              const childDeathData = await getChildDeathByMother(data.id);
              setExistingChildDeathRecord(childDeathData);
            }
          }
        } catch (error) {
          console.error("Failed to fetch record:", error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      setLoading(true);
      fetchRecord();
      return () => {
        isActive = false;
      };
    }, [id])
  );

  const handleDelete = () => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this register entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (record?.id) {
              try {
                await deleteHmisRecord(record.id);
                showToast("Record deleted successfully");
                router.back();
              } catch (error) {
                Alert.alert("Error", "Could not delete record.");
              }
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text className="mt-4 text-slate-400 font-medium">Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <User size={48} color="#CBD5E1" />
        <Text className="mt-4 text-lg text-slate-500 font-medium">Record not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 px-8 py-3 rounded-2xl bg-primary">
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const SectionTitle = ({ title, icon: Icon, color }: any) => (
    <View className="flex-row items-center mb-4 mt-2 px-1">
      <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${color}`}>
        <Icon size={16} color="white" />
      </View>
      <Text className="text-slate-800 font-semibold text-base">{title}</Text>
    </View>
  );

  const VisitBadge = ({ label, val }: any) => (
    <View className={`px-3 py-2 rounded-xl flex-row items-center mr-2 mb-2 border ${val ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
      <View className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <Text className={`ml-2 text-[12px] ${val ? 'text-emerald-700 font-semibold' : 'text-slate-400 font-medium'}`}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />

      <CustomHeader
        title="Patient Details"
        rightNode={
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/dashboard/record/add-record", params: { id: record.id } } as any)}
              className="p-2"
            >
              <Edit size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2"
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Simplified Profile Header */}
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row items-center">
            <View className="w-16 h-16 rounded-2xl bg-blue-50 items-center justify-center border border-blue-100">
              <User size={32} color={Colors.primary} />
            </View>
            <View className="ml-4 flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="text-slate-500 font-medium text-xs uppercase tracking-wider">Serial No. {record.serial_no}</Text>
              </View>
              <Text className="text-slate-900 text-2xl font-semibold leading-tight">
                {record.mother_name}
              </Text>
              <Text className="text-slate-500 font-medium text-sm mt-1">{record.mother_age} Years • Maternal Health</Text>
            </View>
          </View>

          {/* Clean Info Grid */}
          <View className="flex-row mt-8 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
            <View className="flex-1 p-4 items-center border-r border-slate-100">
              <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">LMP Date</Text>
              <Text className="text-slate-700 font-semibold text-base">{record.lmp_day}/{record.lmp_month}/{record.lmp_year}</Text>
            </View>
            <View className="flex-1 p-4 items-center">
              <Text className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1.5">EDD Date</Text>
              <Text className="text-slate-700 font-semibold text-base">{record.edd_day}/{record.edd_month}/{record.edd_year}</Text>
            </View>
          </View>
        </View>

        <View className="px-5 py-2 gap-y-6">
          
          {/* Quick Stats Row */}
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <View className="flex-row items-center mb-2">
                <Info size={14} color={Colors.primary} />
                <Text className="ml-2 text-slate-400 text-[11px] font-bold uppercase">Counseling</Text>
              </View>
              <Text className="text-slate-800 font-semibold text-base">{record.counseling_given ? "Provided" : "Not Provided"}</Text>
            </View>
            <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50">
              <View className="flex-row items-center mb-2">
                <Calendar size={14} color="#D97706" />
                <Text className="ml-2 text-slate-400 text-[11px] font-bold uppercase">Reg. Date</Text>
              </View>
              <Text className="text-slate-800 font-semibold text-base">{record.date_day}/{record.date_month}/{record.date_year}</Text>
            </View>
          </View>

          {/* ANC Checkups */}
          <View>
            <SectionTitle title="ANC Visits" icon={Activity} color="bg-blue-500" />
            <View className="flex-row flex-wrap">
              <VisitBadge label="12 Wk" val={record.checkup_12} />
              <VisitBadge label="16 Wk" val={record.checkup_16} />
              <VisitBadge label="20-24 Wk" val={record.checkup_20_24} />
              <VisitBadge label="28 Wk" val={record.checkup_28} />
              <VisitBadge label="32 Wk" val={record.checkup_32} />
              <VisitBadge label="34 Wk" val={record.checkup_34} />
              <VisitBadge label="36 Wk" val={record.checkup_36} />
              <VisitBadge label="38-40 Wk" val={record.checkup_38_40} />
            </View>
            {record.checkup_other && (
              <View className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Text className="text-slate-500 text-xs font-medium">{record.checkup_other}</Text>
              </View>
            )}
          </View>

          {/* Supplements */}
          <View>
            <SectionTitle title="Supplements" icon={Pill} color="bg-rose-500" />
            <View className="gap-y-2">
              {[
                { label: "Iron (Pregnancy)", val: record.iron_preg_received },
                { label: "Iron (Post-delivery)", val: record.iron_pnc_received },
                { label: "Vitamin 'A' (Post-delivery)", val: record.vit_a_received }
              ].map((item, idx) => (
                <View key={idx} className="flex-row items-center justify-between p-4 bg-white rounded-2xl border border-slate-100">
                  <Text className="text-slate-700 font-medium text-sm">{item.label}</Text>
                  <View className={`px-3 py-1 rounded-full ${item.val ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <Text className="text-white text-[10px] font-bold uppercase">{item.val ? "Done" : "Pending"}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Birth & PNC Details */}
          <View>
            <SectionTitle title="Birth & PNC" icon={Baby} color="bg-indigo-500" />
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Place</Text>
                <Text className="text-slate-800 font-semibold">{record.delivery_place || "Unrecorded"}</Text>
              </View>
              <View className="flex-1 p-4 bg-white rounded-2xl border border-slate-100">
                <Text className="text-slate-400 text-[10px] font-bold uppercase mb-1">Condition</Text>
                <Text className="text-slate-800 font-semibold">{record.newborn_condition || "Unrecorded"}</Text>
              </View>
            </View>
            
            <View className="flex-row flex-wrap">
              <VisitBadge label="<24 hr" val={record.pnc_check_24hr} />
              <VisitBadge label="Day 3" val={record.pnc_check_3day} />
              <VisitBadge label="Day 7-14" val={record.pnc_check_7_14day} />
              <VisitBadge label="Day 42" val={record.pnc_check_42day} />
            </View>

            <View className="mt-4 p-4 rounded-2xl bg-slate-900 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Heart size={16} color="white" />
                <Text className="text-white ml-3 font-medium text-sm">Family Planning Used</Text>
              </View>
              <Text className={`font-semibold text-sm ${record.family_planning_used ? 'text-primary' : 'text-slate-400'}`}>
                {record.family_planning_used ? "YES" : "NO"}
              </Text>
            </View>
          </View>

          {/* Death Reporting Section */}
          <View>
            <SectionTitle title="Mortality Reports" icon={Activity} color="bg-red-500" />
            <View className="gap-y-3">
              {[
                { 
                  title: "मातृ मृत्यु विवरण", 
                  subtitle: "(गर्भवती अवस्था, प्रसव अवस्था तथा सुत्केरी भएको ४२ दिन भित्र मृत्यु भएका महिलाको लागि मात्र)",
                  key: 'maternal', 
                  exists: !!existingDeathRecord 
                },
                { 
                  title: "नवजात शिशु मृत्यु विवरण", 
                  subtitle: "(जन्मेको २८ दिन भित्र मृत्यु भएका नवजात शिशुको लागि मात्र)",
                  key: 'newborn', 
                  exists: !!existingNewbornDeathRecord 
                },
                { 
                  title: "२८ दिन देखि ५९ महिना सम्मका बच्चाहरूको मृत्यु विवरण", 
                  subtitle: "(बालबालिका मृत्यु विवरण)",
                  key: 'child', 
                  exists: !!existingChildDeathRecord 
                },
              ].map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.key === 'maternal') {
                      if (existingDeathRecord) {
                        Alert.alert("Already Reported", "Maternal death report exists.");
                      } else {
                        setMaternalDeathModalVisible(true);
                      }
                    } else if (item.key === 'newborn') {
                      setNewbornDeathModalVisible(true);
                    } else if (item.key === 'child') {
                      setChildDeathModalVisible(true);
                    }
                  }}
                  className={`p-4 rounded-2xl border ${
                    item.exists ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                      <Text className="text-slate-800 font-semibold text-sm">{item.title}</Text>
                      <Text className="text-slate-400 text-[10px] font-medium leading-relaxed mt-1">
                        {item.subtitle}
                      </Text>
                    </View>
                    <View className={`px-3 py-1 rounded-lg ${item.exists ? 'bg-emerald-100' : 'bg-white border border-slate-200'}`}>
                      <Text className={`text-[10px] font-bold uppercase ${item.exists ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {['newborn', 'child'].includes(item.key) 
                          ? (item.exists ? 'Add More +' : 'Report') 
                          : (item.exists ? 'Submitted' : 'Report')}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Remarks */}
          {record.remarks && (
            <View className="mb-6">
              <SectionTitle title="Remarks" icon={FileText} color="bg-slate-400" />
              <View className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Text className="text-slate-600 font-medium leading-relaxed">{record.remarks}</Text>
              </View>
            </View>
          )}

        </View>

        {record && (
          <>
            <MaternalDeathModal
              visible={maternalDeathModalVisible}
              onClose={() => setMaternalDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingDeathRecord(data)}
              showToast={showToast}
            />
            <NewbornDeathModal
              visible={newbornDeathModalVisible}
              onClose={() => setNewbornDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingNewbornDeathRecord(data)}
              showToast={showToast}
            />
            <ChildDeathModal
              visible={childDeathModalVisible}
              onClose={() => setChildDeathModalVisible(false)}
              record={record}
              onSuccess={(data) => setExistingChildDeathRecord(data)}
              showToast={showToast}
            />
          </>
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}



``


## File: .\src\app\dashboard\record\_layout.tsx


``tsx

import React from 'react';
import { Stack } from 'expo-router';

export default function RecordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="add-record" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}


``


## File: .\src\assets\data\learnContent.json


``json

{
  "maternal_health": {
    "en": {
      "title": "",
      "description": "",
      "key_points": [
        "Visit the health center for at least 8 checkups during your pregnancy.",
        "Go to a health facility immediately if you experience severe headaches, heavy bleeding, or your baby moves less.",
        "Plan where and how you will deliver your baby with a skilled nurse or doctor."
      ],
      "sections": [
        {
          "title": "First Trimester (1-3 Months)",
          "points": [
            "Go for your first pregnancy checkup right away.",
            "Start taking your daily iron and folic acid tablets to help your baby grow strongly.",
            "Eat healthy, balanced meals and rest when you feel tired."
          ]
        },
        {
          "title": "Second Trimester (4-6 Months)",
          "points": [
            "Continue taking your daily iron tablets and get your scheduled checkups.",
            "Get your Tetanus (TT) vaccine at the clinic to protect you and your baby.",
            "Go for an ultrasound so we can see how your baby is developing."
          ]
        },
        {
          "title": "Third Trimester (7-9 Months)",
          "points": [
            "Keep taking iron tablets and visit the clinic more often as your due date approaches.",
            "Pack your hospital bag early and arrange for transport and money for your delivery.",
            "Plan for someone to help at home and assist you while you are at the hospital."
          ]
        },
        {
          "title": "After Your Baby is Born",
          "points": [
            "Breastfeed your baby immediately after birth and give only breastmilk for the first 6 months.",
            "Get checked by a health worker 24 hours after birth, then again on day 3, day 7, and at 6 weeks.",
            "Keep your baby warm and the cord clean and dry. Make sure to get plenty of rest for yourself."
          ]
        }
      ]
    },
    "np": {
      "title": "",
      "description": "",
      "key_points": [
        "गर्भावस्थामा कम्तिमा ८ पटक स्वास्थ्य संस्थामा गएर नियमित जाँच गराउनुहोस्।",
        "कडा टाउको दुखेमा, धेरै रगत बगेमा वा गर्भको बच्चा कम चलेमा तुरुन्त स्वास्थ्य संस्था जानुहोस्।",
        "दक्ष स्वास्थ्यकर्मीको मद्दतमा कुन स्वास्थ्य संस्थामा सुत्केरी हुने भनेर पहिल्यै योजना बनाउनुहोस्।"
      ],
      "sections": [
        {
          "title": "पहिलो त्रैमासिक (१-३ महिना)",
          "points": [
            "गएको महिनाबारी रोकिएको याद हुनासाथ आफ्नो पहिलो गर्भावस्था जाँच गराउनुहोस्।",
            "बच्चाको राम्रो विकासको लागि दिनहुँ आइरन र फोलिक एसिड चक्की खान सुरु गर्नुहोस्।",
            "स्वस्थ र पोषणयुक्त खानेकुरा खानुहोस् र थकाई लागेको बेला आराम गर्नुहोस्।"
          ]
        },
        {
          "title": "दोस्रो त्रैमासिक (४-६ महिना)",
          "points": [
            "दिनहुँ आइरन चक्की खान नछोड्नुहोस् र स्वास्थ्य संस्थाले बोलाएको समयमा जाँच गराउनुहोस्।",
            "आफू र बच्चालाई सुरक्षित राख्न टिटानस (TT) खोप लिनुहोस्।",
            "बच्चाको अवस्था हेर्न भिडियो एक्सरे (Ultrasound) गराउनुहोस्।"
          ]
        },
        {
          "title": "तेस्रो त्रैमासिक (७-९ महिना)",
          "points": [
            "आइरन चक्की निरन्तर खानुहोस् र सुत्केरी हुने दिन नजिकिदै गर्दा तोकिएकै समयमा जाँचमा जानुहोस्।",
            "सुत्केरी हुन अस्पताल जानका लागि झोला, खर्च र यातायातको व्यवस्था पहिल्यै गर्नुहोस्।",
            "तपाईं अस्पतालमा घरमा सहयोग गर्ने व्यक्तिको व्यवस्था गर्नुहोस्।"
          ]
        },
        {
          "title": "बच्चा जन्मेपछि (सुत्केरी स्याहार)",
          "points": [
            "बच्चा जन्मेको एक घण्टाभित्र स्तनपान गराउनुहोस् र ६ महिनासम्म आमाको दूध मात्र खुवाउनुहोस्।",
            "सुत्केरी भएको २४ घण्टा, ३ दिन, ७ दिन र ६ हप्तामा स्वास्थ्यकर्मीबाट जाँच गराउनुहोस्।",
            "बच्चालाई न्यानो राख्नुहोस्, नाइटो सफा र सुख्खा राख्नुहोस्। आफूले पनि प्रशस्त आराम गर्नुहोस्।"
          ]
        }
      ]
    }
  },
  "child_nutrition": {
    "en": {
      "title": "Child Nutrition",
      "description": "Proper nutrition in the first 1,000 days of life is critical for physical and mental development. WHO recommends exclusive breastfeeding for the first 6 months, followed by safe and nutritious complementary feeding while continuing breastfeeding for up to 2 years and beyond.",
      "key_points": [
        "Exclusive breastfeeding for the first 6 months.",
        "Introduce nutritionally adequate and safe complementary solid foods at 6 months.",
        "Ensure the child receives essential vitamins (like Vitamin A) and minerals.",
        "Monitor child's growth regularly to prevent stunting and wasting."
      ]
    },
    "np": {
      "title": "बाल पोषण",
      "description": "जीवनको पहिलो १००० दिनमा उचित पोषण शारीरिक र मानसिक विकासको लागि महत्त्वपूर्ण हुन्छ। WHO ले पहिलो ६ महिनासम्म पूर्ण स्तनपान गराउन र त्यसपछि २ वर्ष वा सोभन्दा बढी समयसम्म स्तनपानको साथसाथै सुरक्षित र पौष्टिक पूरक आहार सुरु गर्न सिफारिस गर्दछ।",
      "key_points": [
        "पहिलो ६ महिनासम्म पूर्ण स्तनपान गराउनुहोस्।",
        "६ महिना पुगेपछि पौष्टिक र सुरक्षित पूरक ठोस आहार सुरु गर्नुहोस्।",
        "बच्चालाई आवश्यक भिटामिन (जस्तै भिटामिन ए) र खनिज प्राप्त भएको सुनिश्चित गर्नुहोस्।",
        "पुड्कोपन वा ख्याउटेपन रोक्न बच्चाको वृद्धिको नियमित अनुगमन गर्नुहोस्।"
      ]
    }
  },
  "family_planning": {
    "en": {
      "title": "Family Planning",
      "description": "Family planning helps you and your partner decide the number of children you want and the right spacing between births for a healthy family.",
      "key_points": [
        "Wait at least 2 years after birth before planning the next baby.",
        "Family planning helps keep both mother and child healthy.",
        "Many safe, effective, and free methods are available at the health post.",
        "Discuss together and choose the best method as a couple."
      ],
      "sections": [
        {
          "title": "1. Short-Term Methods",
          "points": [
            "**Pills:** Take the pill every day at the same time.",
            "**Condoms:** Use condoms to prevent pregnancy and protect from sexually transmitted infections (STIs).",
            "**Injectables (Depo-Provera):** Visit the health facility every 3 months for the injection."
          ]
        },
        {
          "title": "2. Long-Acting Methods",
          "points": [
            "**Implants:** A small rod placed under the skin of the arm that works for up to 5 years.",
            "**IUCD (Copper T):** A small device placed inside the womb that can prevent pregnancy for up to 12 years."
          ]
        },
        {
          "title": "3. Permanent Methods",
          "points": [
            "**Minilap (Female Sterilization):** Choose this permanent method if you do not want more children.",
            "**Vasectomy (Male Sterilization):** A simple, safe, and permanent method for men."
          ]
        },
        {
          "title": "4. Myths vs Facts",
          "points": [
            "**Myth:** Contraceptives make you infertile. **Fact:** Most methods are reversible, and fertility usually returns after stopping.",
            "**Myth:** Family planning is only for women. **Fact:** Men also have an equal role and can use condoms or vasectomy."
          ]
        }
      ]
    },
    "np": {
      "title": "परिवार नियोजन",
      "description": "परिवार नियोजनले तपाईं र तपाईंको जीवनसाथीलाई स्वस्थ परिवारको लागि कति सन्तान जन्माउने र दुई बच्चाबीच कति अन्तर राख्ने भनेर निर्णय गर्न मद्दत गर्छ।",
      "key_points": [
        "अर्को बच्चाको योजना बनाउनु अघि कम्तीमा २ वर्ष पर्खनुहोस्।",
        "परिवार नियोजनले आमा र बच्चा दुवैलाई स्वस्थ राख्न मद्दत गर्छ।",
        "स्वास्थ्य संस्थामा धेरै सुरक्षित, प्रभावकारी र नि:शुल्क साधनहरू उपलब्ध छन्।",
        "दम्पतीले सँगै छलफल गरी आफ्नो लागि सबैभन्दा उपयुक्त साधन छान्नुहोस्।"
      ],
      "sections": [
        {
          "title": "१. छोटो अवधिका साधनहरू",
          "points": [
            "**पिल्स (खाने चक्की):** हरेक दिन एउटै समयमा चक्की खानुहोस्।",
            "**कन्डम:** अनिच्छित गर्भ र यौनजन्य सङ्क्रमण (STIs) बाट बच्न कन्डमको प्रयोग गर्नुहोस्।",
            "**सुई (डिपो-प्रोभेरा):** सुई लगाउन हरेक ३ महिनामा स्वास्थ्य संस्था जानुहोस्।"
          ]
        },
        {
          "title": "२. लामो अवधिका साधनहरू",
          "points": [
            "**इम्प्लान्ट:** पाखुराको छालामुनि राखिने सानो रड हो, जसले ५ वर्षसम्म काम गर्छ।",
            "**कपर टी (IUCD):** पाठेघरभित्र राखिने सानो साधन हो, जसले १२ वर्षसम्म गर्भ रहन दिँदैन।"
          ]
        },
        {
          "title": "३. स्थायी साधनहरू",
          "points": [
            "**मिनिल्याप (महिला बन्ध्याकरण):** थप सन्तान नचाहेमा यो स्थायी साधन रोज्नुहोस्।",
            "**भ्यासेक्टोमी (पुरुष बन्ध्याकरण):** पुरुषका लागि सरल, सुरक्षित र स्थायी साधन हो।"
          ]
        },
        {
          "title": "४. भ्रम र यथार्थ",
          "points": [
            "**भ्रम:** परिवार नियोजनका साधनले बाँझोपन गराउँछ। **यथार्थ:** धेरैजसो साधनहरू अस्थायी हुन्छन् र प्रयोग गर्न छोडेपछि पुनः गर्भधारण गर्ने क्षमता फर्किन्छ।",
            "**भ्रम:** परिवार नियोजन महिलाहरूका लागि मात्र हो। **यथार्थ:** यसमा पुरुषको पनि समान भूमिका हुन्छ। उनीहरूले कन्डम प्रयोग गर्न वा भ्यासेक्टोमी (स्थायी बन्ध्याकरण) गराउन सक्छन्।"
          ]
        }
      ]
    }
  },
  "birth_prep": {
    "en": {
      "title": "Birth Preparedness Card",
      "description": "Birth preparedness helps keep you and your baby safe during delivery. Make a plan early so you can reach the hospital on time and get quick care in emergencies.",
      "key_points": [
        "Choose a good health facility for delivery.",
        "Save money for transport, hospital fees, and emergencies.",
        "Arrange a trusted vehicle or ambulance early.",
        "Identify people who can donate blood if needed."
      ],
      "sections": [
        {
          "title": "1. Essential Items to Pack (Hospital Bag)",
          "points": [
            "**For Mother:** Keep your ANC card, clean clothes, sanitary pads, soap, and warm clothes ready.",
            "**For Baby:** Keep a clean baby wrapper, cap, socks, and warm clothes ready."
          ]
        },
        {
          "title": "2. Financial & Transport Planning",
          "points": [
            "**Savings:** Start saving money early for delivery costs and emergencies.",
            "**Transport:** Keep phone numbers of drivers and ambulance services. Make sure you can go to the hospital even at night."
          ]
        },
        {
          "title": "3. Identifying Support People",
          "points": [
            "**Companion:** Decide who will go with you to the hospital and stay with you during labor.",
            "**Home Support:** Arrange someone to care for your home and children while you are away."
          ]
        },
        {
          "title": "4. Danger Signs (Go to Hospital Immediately)",
          "points": [
            "If you have heavy bleeding or severe abdominal pain, go to the hospital immediately.",
            "If you have severe headache, blurred vision, or swelling of face and hands, seek help quickly.",
            "If water breaks before labor starts or baby movement decreases, visit the hospital immediately."
          ]
        }
      ]
    },
    "np": {
      "title": "जन्म तयारी कार्ड",
      "description": "जन्म तयारीले सुत्केरीको समयमा तपाईं र तपाईंको बच्चालाई सुरक्षित राख्न मद्दत गर्छ। समयमै अस्पताल पुग्न र आपतकालीन अवस्थामा छिटो उपचार पाउन पहिल्यै योजना बनाउनुहोस्।",
      "key_points": [
        "सुत्केरी गराउन राम्रो स्वास्थ्य संस्था छान्नुहोस्।",
        "यातायात, अस्पताल खर्च र आपतकालीन अवस्थाका लागि पैसा बचत गर्नुहोस्।",
        "पहिल्यै भरपर्दो गाडी वा एम्बुलेन्सको व्यवस्था गर्नुहोस्।",
        "आवश्यक परे रगत दिन सक्ने व्यक्तिहरू पहिचान गर्नुहोस्।"
      ],
      "sections": [
        {
          "title": "१. अस्पताल जाँदा झोलामा राख्नुपर्ने आवश्यक सामग्रीहरू",
          "points": [
            "**आमाका लागि:** ANC कार्ड, सफा लुगा, स्यानिटरी प्याड, साबुन र न्यानो लुगा तयार राख्नुहोस्।",
            "**बच्चाका लागि:** बच्चालाई बेर्ने सफा कपडा, टोपी, मोजा र न्यानो लुगा तयार राख्नुहोस्।"
          ]
        },
        {
          "title": "२. आर्थिक र यातायातको योजना",
          "points": [
            "**बचत:** सुत्केरी खर्च र आपतकालीन अवस्थाका लागि सुरुदेखि नै पैसा बचत गर्नुहोस्।",
            "**यातायात:** ड्राइभर र एम्बुलेन्स सेवाका फोन नम्बरहरू साथमा राख्नुहोस्। राति पनि अस्पताल जान सक्ने गरी व्यवस्था मिलाउनुहोस्।"
          ]
        },
        {
          "title": "३. सहयोग गर्ने व्यक्तिहरूको पहिचान",
          "points": [
            "**सहयोगी:** अस्पतालमा तपाईंसँग को जाने र सुत्केरी व्यथाको बेला को साथमा बस्ने भनेर निर्णय गर्नुहोस्।",
            "**घरको हेरचाह:** तपाईं अस्पताल जाँदा घर र बच्चाहरू हेर्ने व्यक्तिको व्यवस्था गर्नुहोस्।"
          ]
        },
        {
          "title": "४. खतराका लक्षणहरू (तुरुन्त अस्पताल जानुहोस्)",
          "points": [
            "धेरै रगत बगेमा वा पेट अत्यधिक दुखेमा तुरुन्त अस्पताल जानुहोस्।",
            "कडा टाउको दुखेमा, आँखा धमिलो भएमा वा अनुहार र हात सुन्निएमा तुरुन्त स्वास्थ्य सहायता लिनुहोस्।",
            "व्यथा सुरु हुनु अघि पानी बगेमा वा बच्चा कम चलेमा तुरुन्त अस्पताल जानुहोस्।"
          ]
        }
      ]
    }
  },
  "first_aid": {
    "en": {
      "title": "First Aid Basics",
      "description": "First aid involves immediate care given to a person who has been injured or suddenly taken ill. Effective first aid can save lives and prevent the condition from worsening until formal medical help arrives, according to WHO guidelines on emergency care.",
      "key_points": [
        "For burns, cool the affected area with running water for at least 20 minutes.",
        "Apply direct pressure to bleeding wounds using a clean cloth.",
        "For choking, perform abdominal thrusts/back blows if the person cannot breathe.",
        "Always ensure the scene is safe before providing help and call emergency services."
      ]
    },
    "np": {
      "title": "प्राथमिक उपचार आधारभूत कुराहरू",
      "description": "प्राथमिक उपचार भनेको चोटपटक लागेको वा अचानक बिरामी परेको व्यक्तिलाई दिइने तत्काल हेरचाह हो। WHO का अनुसार, प्रभावकारी रूपमा गरिने प्राथमिक उपचारले ज्यान बचाउन र अस्पताल पुर्याउनु अघि अवस्था बिग्रनबाट रोक्न सक्छ।",
      "key_points": [
        "पोलेको ठाउँमा कम्तिमा २० मिनेटसम्म बगिरहेको चिसो पानी हाल्नुहोस्।",
        "रगत बगिरहेको घाउमा सफा कपडाले सीधा दबाब दिनुहोस्।",
        "कोही अड्किएमा वा श्वास फेर्न नसकेमा पछाडिबाट धक्का वा पेटमा दबाब (abdominal thrusts) दिनुहोस्।",
        "मद्दत गर्नुअघि वातावरण सुरक्षित छ भनी सुनिश्चित गर्नुहोस् र आपतकालीन सेवालाई कल गर्नुहोस्।"
      ]
    }
  },
  "anc": {
    "en": {
      "title": "Antenatal Care (ANC)",
      "description": "Antenatal care (ANC) allows health-care providers to identify and mitigate risk factors during pregnancy. WHO's comprehensive ANC model recommends a minimum of eight contacts to reduce perinatal mortality and improve women's experience of care.",
      "key_points": [
        "First contact should generally occur within the first 12 weeks of gestation.",
        "Receive tetanus toxoid (TT) vaccination to prevent neonatal tetanus.",
        "Get screened for infections and conditions like gestational diabetes and pre-eclampsia.",
        "Regularly check blood pressure and fetal growth."
      ]
    },
    "np": {
      "title": "गर्भावस्था जाँच (ANC)",
      "description": "एन्टिनेटल केयर (ANC) ले स्वास्थ्य सेवा प्रदायकहरूलाई गर्भावस्थामा हुन सक्ने जोखिम पहिचान गर्न र कम गर्न मद्दत गर्दछ। WHO को नयाँ मोडेलले आमा र बच्चाको मृत्युदर घटाउन कम्तिमा ८ पटक जाँच गर्न सिफारिस गर्दछ।",
      "key_points": [
        "पहिलो जाँच सामान्यतया गर्भावस्थाको पहिलो १२ हप्ता भित्र हुनुपर्छ।",
        "नवजात शिशुमा हुने टिटानस रोक्न टिटानस टक्साइड (TT) खोप लिनुहोस्।",
        "संक्रमण, डायविटिज र उच्च रक्तचाप (pre-eclampsia) को जाँच गराउनुहोस्।",
        "रक्तचाप र गर्भको शिशुको वृद्धिको नियमित परीक्षण गर्नुहोस्।"
      ]
    }
  },
  "pnc": {
    "en": {
      "title": "Postnatal Care (PNC)",
      "description": "The postnatal period is a critical phase in the lives of mothers and newborn babies. Most maternal and infant deaths occur in the first month after birth. WHO emphasizes delivering quality postnatal care to identify and treat complications promptly.",
      "key_points": [
        "Receive PNC checks at 24 hours, days 3, 7-14, and six weeks post-delivery.",
        "Monitor for severe bleeding, fever, and signs of infection.",
        "Support and encourage exclusive breastfeeding techniques.",
        "Screen and provide support for postpartum depression or mood disorders."
      ]
    },
    "np": {
      "title": "सुत्केरी स्याहार (PNC)",
      "description": "सुत्केरीपछिको समय आमा र नवजात शिशुको जीवनमा अत्यन्तै महत्त्वपूर्ण हुन्छ। अधिकांश मातृ र शिशु मृत्यु जन्मपछिको पहिलो महिनामा हुन्छ। WHO ले जटिलताहरू चाँडै पहिचान गरी उपचार गर्न गुणस्तरीय सुत्केरी स्याहारमा जोड दिन्छ।",
      "key_points": [
        "सुत्केरी भएको २४ घण्टा, तेस्रो दिन, ७ देखि १४ दिन, र छैटौं हप्तामा PNC जाँच गराउनुहोस्।",
        "अत्यधिक रगत बग्ने, ज्वरो आउने र संक्रमणका लक्षणहरूको निगरानी राख्नुहोस्।",
        "पूर्ण स्तनपान गराउन सहयोग र प्रोत्साहन गर्नुहोस्।",
        "सुत्केरीपछिको डिप्रेसन (Postpartum depression) को जाँच गरी आवश्यक सहयोग प्रदान गर्नुहोस्।"
      ]
    }
  },
  "baby_care": {
    "en": {
      "title": "Newborn & Baby Care",
      "description": "Newborns require specialized attention to thrive. WHO guidelines for neonatal care cover thermal protection, hygienic umbilical cord care, and initiation of breathing and feeding. Ensuring a clean and safe environment prevents neonatal mortality.",
      "key_points": [
        "Dry the baby immediately after birth and keep them warm (skin-to-skin contact).",
        "Keep the umbilical cord clean and dry; do not apply unverified substances.",
        "Ensure standard vaccinations are provided on schedule starting from birth.",
        "Observe for danger signs like poor feeding, fast breathing, or severe jaundice."
      ],
      "sections": [
        {
          "title": "1. Keeping the Baby Warm",
          "points": [
            "**Skin-to-Skin:** Immediately after birth, place the baby on the mother's bare chest. This provides the best natural warmth.",
            "**Wrap Well:** Wrap the baby in warm, dry, and clean clothes. Always cover the baby's head with a soft cap."
          ]
        },
        {
          "title": "2. Breastfeeding",
          "points": [
            "**First Milk (Colostrum):** Breastfeed within the first hour. The thick, yellowish first milk is like the baby's first vaccine.",
            "**Exclusive Breastfeeding:** Give ONLY breastmilk for the first 6 months. No water, no honey, no formula."
          ]
        },
        {
          "title": "3. Cord & Eye Care",
          "points": [
            "**Umbilical Cord:** Keep the cord stump clean and completely dry. **Do NOT** apply ash, cow dung, oil, or any unprescribed ointment.",
            "**Eye Care:** Wipe the eyes gently with a clean, moist cloth. If you see pus or redness, visit the health post."
          ]
        },
        {
          "title": "4. Danger Signs (Seek Immediate Help)",
          "points": [
            "Baby stops feeding or feeds poorly.",
            "Baby feels excessively hot (fever) or unusually cold.",
            "Fast breathing (more than 60 breaths per minute) or difficulty breathing.",
            "Yellow skin, especially on the palms and soles (Severe Jaundice)."
          ]
        }
      ]
    },
    "np": {
      "title": "नवजात शिशु र बच्चाको हेरचाह",
      "description": "नवजात शिशुलाई हुर्कन विशेष ध्यान दिन आवश्यक छ। WHO का नियम अनुसार, नवजात शिशुको स्याहारमा न्यानो राख्ने, नाइटोको सरसफाइ, र राम्रोसँग सास फेर्ने तथा दूध खुवाउने कुराहरू समावेश छन्। सफा र सुरक्षित वातावरणले नवजात शिशुको मृत्युदर कम गर्न मद्दत गर्छ।",
      "key_points": [
        "जन्मिएपछि तुरुन्तै बच्चालाई पुछेर सुख्खा र न्यानो राख्नुहोस् (आमाको छातीमा टाँसेर राख्ने)।",
        "नाइटोलाई सफा र सुख्खा राख्नुहोस्; जथाभावी मलम वा अन्य कुरा नलाउनुहोस्।",
        "जन्मनेबित्तिकै सुरु गरी तोकिएको समयमै लगाउनुपर्ने खोपहरू लगाउनुहोस्।",
        "दूध नचुस्ने, छिटोछिटो सास फेर्ने, वा कडा जन्डिस जस्ता खतराका लक्षणहरूमा ध्यान दिनुहोस्।"
      ],
      "sections": [
        {
          "title": "१. बच्चालाई न्यानो राख्ने",
          "points": [
            "**छातीमा टाँसेर राख्ने:** जन्मेको तुरुन्तै बच्चालाई आमाको नाङ्गो छातीमा टाँसेर (Skin-to-Skin) राख्नुहोस्। यसले बच्चालाई सबैभन्दा राम्रो प्राकृतिक न्यानो दिन्छ।",
            "**राम्रोसँग बेर्ने:** बच्चालाई न्यानो, सुख्खा र सफा कपडाले बेर्नुहोस्। सधैं नरम टोपी लगाइदिनुहोस्।"
          ]
        },
        {
          "title": "२. स्तनपान",
          "points": [
            "**पहिलो दूध (बिगौती दूध):** जन्मेको एक घण्टाभित्र स्तनपान गराउनुहोस्। पहिलो बाक्लो र पहेँलो दूध बच्चाको पहिलो खोप जस्तै हो।",
            "**पूर्ण स्तनपान:** पहिलो ६ महिनासम्म आमाको दूध मात्र खुवाउनुहोस्। पानी, मह वा बाहिरको दूध नखुवाउनुहोस्।"
          ]
        },
        {
          "title": "३. नाइटो र आँखाको स्याहार",
          "points": [
            "**नाइटोको स्याहार:** नाइटोलाई सफा र पूर्ण रूपमा सुख्खा राख्नुहोस्। नाइटोमा खरानी, गोबर, तेल वा कुनै पनि मलम **नलगाउनुहोस्**।",
            "**आँखाको स्याहार:** सफा र ओसिलो कपडाले आँखा बिस्तारै पुछ्नुहोस्। यदि पिप वा धेरै रातो देखिएमा स्वास्थ्य संस्था लैजानुहोस्।"
          ]
        },
        {
          "title": "४. खतराका लक्षणहरू (तुरुन्तै अस्पताल लैजानुहोस्)",
          "points": [
            "बच्चाले दूध चुस्न छाडेमा वा कम चुसेमा।",
            "बच्चा धेरै तातो (ज्वरो) वा असाधारण रूपमा चिसो भएमा।",
            "छिटो-छिटो सास फेरेमा (प्रति मिनेट ६० पटक भन्दा बढी) वा सास फेर्न गाह्रो भएमा।",
            "हत्केला र पैताला सहित शरीर धेरै पहेँलो भएमा (कडा जन्डिस)।"
          ]
        }
      ]
    }
  },
  "first_trimester_detailed": {
    "en": {
      "title": "1st Trimester Detailed Guide (Months 1–3)",
      "description": "The first three months are the foundation of a healthy pregnancy. Use these sections to guide the mother through her first steps.",
      "sections": [
        {
          "title": "1. Registration & Health Visits",
          "points": [
            "**Confirm Pregnancy:** Advise her to take a pregnancy test as soon as she misses her period.",
            "**Early Registration:** Encourage her to visit the health post immediately to register her pregnancy and get her **ANC Card**.",
            "**First Checkup:** Explain that the first visit is the most important to check her weight, blood pressure, and general health."
          ]
        },
        {
          "title": "2. Nutrition & Supplements",
          "points": [
            "**Folic Acid/Iron:** Advise her to start her tablets daily. Explain that these help the baby's brain and body develop properly.",
            "**Small Meals:** If she feels nauseous, advise her to eat small amounts of food frequently throughout the day rather than three large meals.",
            "**Hydration:** Remind her to drink plenty of clean water and soups to stay hydrated."
          ]
        },
        {
          "title": "3. Lifestyle & Rest",
          "points": [
            "**Avoid Heavy Work:** Advise her to avoid lifting heavy loads or doing very strenuous labor during these early months.",
            "**Rest:** Encourage her to sleep at least 8 hours at night and take a 2-hour nap during the day whenever possible.",
            "**Tobacco & Alcohol:** Firmly advise the family that the mother must stay away from cigarettes, alcohol, and second-hand smoke."
          ]
        },
        {
          "title": "4. Managing Morning Sickness",
          "points": [
            "**Dry Foods:** Suggest eating a piece of dry bread or a biscuit immediately after waking up to help with morning nausea.",
            "**Ginger Tea:** Advise her that ginger tea or chewing a small piece of ginger can help settle her stomach."
          ]
        },
        {
          "title": "5. Immediate Danger Signs",
          "points": [
            "**Bleeding:** Tell her that any amount of spotting or bleeding is a reason to go to the hospital **right away**.",
            "**Severe Cramping:** If she has sharp pain in her lower stomach, advise her not to wait and seek medical help immediately.",
            "**Excessive Vomiting:** If she cannot keep any food or water down, she must see a health worker to prevent weakness."
          ]
        }
      ]
    },
    "np": {
      "title": "पहिलो तीन महिनाको विस्तृत जानकारी (१–३ महिना)",
      "description": "गर्भावस्थाको पहिलो तीन महिना बच्चाको जग बस्ने समय हो। आमालाई यी कुराहरू बुझाएर सहयोग गर्नुहोस्:",
      "sections": [
        {
          "title": "१. नाम दर्ता र अस्पताल जाँच",
          "points": [
            "**गर्भावस्था पक्का गर्ने:** महिनावारी रोकिएपछि ढिलो नगरी गर्भ जाँच (Pregnancy Test) गर्न सल्लाह दिनुहोस्।",
            "**कार्ड बनाउने:** स्वास्थ्य चौकीमा गएर नाम दर्ता गराउन र **गर्भवती जाँच कार्ड (ANC Card)** बनाउन प्रोत्साहित गर्नुहोस्।",
            "**पहिलो जाँच:** पहिलो पटकको जाँचमा तौल लिने र रक्तचाप नाप्ने काम धेरै जरुरी हुन्छ भनेर बुझाउनुहोस्।"
          ]
        },
        {
          "title": "२. खानपान र चक्की",
          "points": [
            "**आइरन र फोलिक एसिड:** यी चक्कीहरू नियमित खान भन्नुहोस्। यसले बच्चाको दिमाग र शरीरको विकासमा मद्दत गर्छ भनेर बुझाउनुहोस्।",
            "**थोरै-थोरै खाने:** वाकवाकी लाग्छ भने एकैपटक धेरै खानुको सट्टा थोरै-थोरै तर धेरै पटक खान सल्लाह दिनुहोस्।",
            "**झोलिलो कुरा:** प्रशस्त सफा पानी, दालको रस वा गेडागुडीको झोल खान सम्झाउनुहोस्।"
          ]
        },
        {
          "title": "३. काम र आराम",
          "points": [
            "**गाह्रो काम नगर्ने:** सुरुका महिनाहरूमा भारी सामान उचाल्ने वा धेरै बल पर्ने काम नगर्न सल्लाह दिनुहोस्।",
            "**आराम:** राति कम्तिमा ८ घण्टा सुत्न सल्लाह दिनुहोस्।",
            "**धुम्रपान र रक्सी:** गर्भवती आमाले चुरोट, खैनी, जाँड-रक्सी र धुवाँबाट टाढै बस्नुपर्छ भनेर परिवारलाई समेत बुझाउनुहोस्।"
          ]
        },
        {
          "title": "४. वाकवाकी र वान्ताको समाधान",
          "points": [
            "**सुक्खा खानेकुरा:** बिहान उठ्ने बित्तिकै ओछ्यानमै सुक्खा रोटी वा बिस्कुट खानाले वाकवाकी कम हुन सक्छ भनेर सिकाउनुहोस्।",
            "**अदुवाको प्रयोग:** अदुवा हालेको चिया पिउनाले वा अदुवाको सानो टुक्रा मुखमा राख्नाले पनि मन थामिन सक्छ।"
          ]
        },
        {
          "title": "५. तुरुन्तै अस्पताल जानुपर्ने लक्षणहरू",
          "points": [
            "**रगत बगेमा:** थोरै मात्र रगत देखिए पनि वा रगतका थोपाहरू देखिए पनि **तुरुन्तै** अस्पताल जान सल्लाह दिनुहोस्।",
            "**पेट दुखेमा:** तल्लो पेट धेरै बटारिएर दुखेमा वा कडा भएमा स्वास्थ्यकर्मीको सल्लाह लिनुहोस्।",
            "**धेरै वान्ता भएमा:** यदि खाएको कुरा केही पनि नपच्ने गरी वान्ता भइरह्यो भने आमा निकै कमजोर हुने हुँदा अस्पताल लैजानै पर्छ।"
          ]
        }
      ]
    }
  },
  "second_trimester_detailed": {
    "en": {
      "title": "2nd Trimester Detailed Guide (Months 4–6)",
      "description": "This is a period of rapid growth. The mother usually feels better, but her nutritional needs increase significantly.",
      "sections": [
        {
          "category": "### 1. Medical Protection & Vaccines",
          "points": [
            "**TT Vaccine:** Advise her to get her Tetanus (TT/Td) doses at the clinic to protect her and the baby from infections.",
            "**Deworming:** Remind her to take the deworming tablet (Albendazole) after the 4th month, as advised by the health worker.",
            "**Ultrasound:** Encourage her to get a mid-pregnancy ultrasound to check the baby’s growth and position."
          ]
        },
        {
          "category": "### 2. Enhanced Nutrition",
          "points": [
            "**The 'Extra Meal' Rule:** Advise her to eat **one additional nutritious meal** every day compared to what she ate before pregnancy.",
            "**Diverse Diet:** Encourage her to include 'Four Food Groups' (grains, proteins/beans, fruits/vegetables, and dairy) in her daily meals.",
            "**Continue Iron:** Check that she is taking her Iron and Folic Acid tablets daily without fail. Explain that her blood needs to increase for the baby."
          ]
        },
        {
          "category": "### 3. Monitoring the Baby",
          "points": [
            "**Baby Movement:** Tell her that she will likely start feeling the baby move (quickening) during the 5th month. Advise her to notice these movements.",
            "**Belly Growth:** Explain that as her belly grows, she should wear loose, comfortable cotton clothes."
          ]
        },
        {
          "category": "### 4. Body Changes & Comfort",
          "points": [
            "**Sleep Position:** Advise her to try sleeping on her **left side**. Explain that this helps blood flow better to the baby.",
            "**Leg Cramps:** If she has leg cramps, advise her to stretch gently and ensure she is eating enough calcium-rich foods like milk or curd."
          ]
        },
        {
          "category": "### 5. Warning Signs (Seek Help Immediately)",
          "points": [
            "**Severe Swelling:** If her hands or face look very puffy/swollen in the morning, advise her to check her blood pressure immediately.",
            "**Blurry Vision:** Tell her that severe headaches or seeing 'spots' or blurry vision can be a sign of high blood pressure.",
            "**Fever:** Any high fever during this time must be treated by a health worker to keep the baby safe."
          ]
        }
      ]
    },
    "np": {
      "title": "दोस्रो तीन महिनाको विस्तृत जानकारी (४–६ महिना)",
      "description": "यो समयमा बच्चाको तौल र आकार छिटो बढ्छ। आमाले आफ्नो खानपान र सुईहरूमा विशेष ध्यान दिनुपर्छ:",
      "sections": [
        {
          "category": "### १. सुई र स्वास्थ्य जाँच",
          "points": [
            "**टीटी (TT) सुई:** आमा र बच्चालाई धनुष्टंकारबाट जोगाउन स्वास्थ्य संस्थामा गएर टीटी वा टीडी सुई लगाउन सम्झाउनुहोस्।",
            "**जुकाको औषधि:** चौथो महिना लागेपछि स्वास्थ्यकर्मीको सल्लाह अनुसार जुकाको औषधि (Albendazole) खान भन्नुहोस्।",
            "**भिडियो एक्सरे:** बच्चाको अवस्था र विकास हेर्न बीचको महिनातिर भिडियो एक्सरे गराउन प्रोत्साहित गर्नुहोस्।"
          ]
        },
        {
          "category": "### २. थप पोषण र खाना",
          "points": [
            "**एक पटक थप खाना:** आमालाई पहिले खाइरहेको खानामा दिनको **एक पटक थप पोषिलो खाना** खान सल्लाह दिनुहोस्।",
            "**चार समूहको खाना:** खानामा गेडागुडी, हरियो सागपात, फलफूल, र दूधजन्य पदार्थ मिलाएर खान प्रोत्साहन गर्नुहोस्।",
            "**आइरन चक्की नछोड्ने:** उनले दिनहुँ आइरन खाइरहेकी छन् कि छैनन् सोध्नुहोस्। रगतको कमी हुन नदिन यो धेरै जरुरी छ।"
          ]
        },
        {
          "category": "### ३. बच्चाको चाल",
          "points": [
            "**बच्चा चलेको:** पाँचौ महिनातिर बच्चा चलेको थाहा पाउन सकिन्छ भनेर बताउनुहोस् र बच्चा चल्दा ध्यान दिन भन्नुहोस्।",
            "**लुगाफाटा:** पेट बढ्दै जाने हुनाले शरीरलाई सजिलो हुने खुकुलो सुतीको लुगा लगाउन सल्लाह दिनुहोस्।"
          ]
        },
        {
          "category": "### ४. सुत्ने तरिका र शरीरको आराम",
          "points": [
            "**देब्रे कोल्टे सुत्ने:** सुत्दा खेरि **देब्रे पट्टि कोल्टे फेरेर** सुत्न भन्नुहोस्। यसले गर्दा बच्चालाई रगत र अक्सिजन राम्रोसँग पुग्छ।",
            "**खुट्टा बाउँडिने:** यदि खुट्टा बाउँडिन्छ भने हल्का तन्काउन र दूध, दही जस्ता क्याल्सियम भएका खानेकुरा बढी खान सल्लाह दिनुहोस्।"
          ]
        },
        {
          "category": "### ५. खतराका लक्षण (तुरुन्तै अस्पताल जाने)",
          "points": [
            "**हात-मुख सुन्निएमा:** बिहान उठ्दा हात वा अनुहार धेरै सुन्निएको देखिएमा तुरुन्तै रक्तचाप (BP) जाँच्न पठाउनुहोस्।",
            "**आँखा धमिलो भएमा:** कडा टाउको दुख्ने वा आँखा धमिलो हुने लक्षण देखिएमा यो उच्च रक्तचापको संकेत हुन सक्छ।",
            "**कडा ज्वरो:** गर्भावस्थामा कडा ज्वरो आउनु खतरा हुन सक्छ, त्यसैले स्वास्थ्य संस्थामा जाँच गराउन भन्नुहोस्।"
          ]
        }
      ]
    }
  },
  "third_trimester_detailed": {
    "en": {
      "title": "3rd Trimester Detailed Guide (Months 7–9)",
      "description": "The final months are about preparing for a safe delivery. Ensure the mother and family are ready for the 'Big Day'.",
      "sections": [
        {
          "category": "### 1. Birth Preparedness Plan (The 5 'W's)",
          "points": [
            "**Where:** Help her decide on the health facility for delivery. Advise against home birth.",
            "**Who:** Help her identify a family member or friend who will stay with her at the hospital.",
            "**Way:** Discuss transportation. Does she have a phone number for an ambulance or a local driver?",
            "**Wealth:** Ask if the family has saved enough money for medicines, transport, and food.",
            "**Witness/Blood:** Advise her to identify at least one person who could donate blood if an emergency arises."
          ]
        },
        {
          "category": "### 2. Packing the 'Emergency Bag'",
          "points": [
            "**For the Mother:** Advise her to pack clean clothes, pads/clean cloths, her ANC card, and some dry food.",
            "**For the Baby:** Remind her to pack warm clothes, a cap, socks, and a soft wrapper/towel to dry the baby immediately."
          ]
        },
        {
          "category": "### 3. Monitoring Baby's Movement",
          "points": [
            "**Kick Counting:** Advise her to notice the baby's kicks. She should feel at least **10 movements in 2 hours** after a meal. If the baby is moving significantly less, tell her to go to the clinic immediately."
          ]
        },
        {
          "category": "### 4. Nutrition & Final Checkups",
          "points": [
            "**Frequent Visits:** Encourage her to visit the health facility more often (at least once in month 8 and every week or two in month 9).",
            "**Iron & Calcium:** Ensure she has enough iron tablets to last through the delivery and the first 45 days after birth."
          ]
        },
        {
          "category": "### 5. Final Danger Signs (Act Fast!)",
          "points": [
            "**Water Breaking:** If water leaks from the vagina even without pain, advise her to go to the hospital immediately.",
            "**Blurry Vision/Headache:** These are signs of high blood pressure (Eclampsia) and are very dangerous.",
            "**Severe Swelling:** Check for swelling in the face and hands, not just the feet."
          ]
        }
      ]
    },
    "np": {
      "title": "तेस्रो तीन महिनाको विस्तृत जानकारी (७–९ महिना)",
      "description": "अन्तिम महिनाहरू डेलिभरी तयारीका लागि हुन्। आमा र परिवारलाई यो 'ठूलो दिन' को लागि तयार पार्नुहोस्:",
      "sections": [
        {
          "category": "### १. डेलिभरी गर्ने योजना (५ कुराको तयारी)",
          "points": [
            "**कहाँ जाने:** डेलिभरी गर्न कुन अस्पताल जाने भनेर पहिल्यै निर्णय गर्न मद्दत गर्नुहोस्। घरमा डेलिभरी गर्नु खतरनाक हुन्छ भनेर बुझाउनुहोस्।",
            "**को जाने:** अस्पताल जाँदा साथमा बस्ने कुरुवा को हुन्छ भनेर सोध्नुहोस्।",
            "**कसरी जाने:** यातायातको साधन (एम्बुलेन्स वा गाडी) को फोन नम्बर पहिल्यै खोजेर राख्न भन्नुहोस्।",
            "**पैसाको जोहो:** यातायात, औषधि र खानेकुराका लागि आवश्यक पैसाको जोहो भयो कि भएन सोध्नुहोस्।",
            "**रगत दिने मान्छे:** आपतकालीन अवस्थामा रगत दिन सक्ने एक जना मान्छेको नाम र फोन नम्बर पहिल्यै तयार राख्न सल्लाह दिनुहोस्।"
          ]
        },
        {
          "category": "### २. सुत्केरी झोलाको तयारी",
          "points": [
            "**आमाको लागि:** झोलामा सफा लुगा, प्याड वा सफा सुतीका कपडाहरू, स्वास्थ्य जाँचको कार्ड (ANC Card) र केही सुक्खा खानेकुरा राख्न भन्नुहोस्।",
            "**बच्चाको लागि:** न्यानो लुगा, टोपी, मोजा र बच्चालाई पुछ्नका लागि नरम टावेल वा कपडा तयार पार्न सम्झाउनुहोस्।"
          ]
        },
        {
          "category": "### ३. बच्चाको चालमा ध्यान",
          "points": [
            "**बच्चा चलेको गन्ने:** खाना खाएपछि २ घण्टामा बच्चा कम्तिमा **१० पटक** चल्नुपर्छ। यदि बच्चा एकदमै कम चलेको छ भने तुरुन्तै जचाउन जान सल्लाह दिनुहोस्।"
          ]
        },
        {
          "category": "### ४. पोषण र नियमित जाँच",
          "points": [
            "**छिटो-छिटो जाँच:** ८ औं महिनामा कम्तिमा एक पटक र ९ औं महिना लागेपछि हरेक हप्ता वा दुई हप्तामा जचाउन जान प्रोत्साहित गर्नुहोस्।",
            "**आइरन चक्की:** डेलिभरी हुँदा र सुत्केरी भएको ४५ दिनसम्म पुग्ने गरी आइरन चक्की साथमा छ कि छैन पक्का गर्नुहोस्।"
          ]
        },
        {
          "category": "### ५. अन्तिम खतराका लक्षण (ढिलो नगर्नुहोस्)",
          "points": [
            "**व्यथा नलागी पानी बगेमा:** डेलिभरी हुने बेला नभए पनि वा व्यथा नलागे पनि योनिबाट पानी बग्न थाल्यो भने तुरुन्तै अस्पताल लैजानुहोस्।",
            "**आँखा धमिलो हुने/टाउको दुख्ने:** यो उच्च रक्तचापको लक्षण हुन सक्छ र ज्यानै जाने खतरा हुन्छ।",
            "**धेरै सुन्निनु:** गोडा मात्र होइन, अनुहार र हातहरू धेरै सुन्निएको छ भने तुरुन्तै जचाउनु पर्छ।"
          ]
        }
      ]
    }
  }
}

``


## File: .\src\assets\data\nutritionData.json


``json

{
  "pregnant": [
    {
      "id": "iron_folic",
      "icon": "Pill",
      "color": "#EF4444",
      "bg": "#FEF2F2",
      "en": {
        "title": "Iron & Folic Acid",
        "desc": "Take iron and folic acid daily to prevent anemia, infections, and birth defects, and to help your baby grow well.",
        "dosage": "Take 1 tablet daily (30–60 mg iron + 400 µg folic acid)",
        "tips": [
          "Take it with orange juice or lemon water for better absorption.",
          "Do not take it with tea, coffee, or milk."
        ]
      },
      "np": {
        "title": "आइरन र फोलिक एसिड",
        "desc": "रगतको कमी (अल्पता) हुन नदिन, संक्रमण कम गर्न र बच्चाको स्वस्थ विकासका लागि हरेक दिन आइरन र फोलिक एसिड सेवन गर्नुहोस्।",
        "dosage": "दैनिक १ चक्की सेवन गर्नुहोस् (३०–६० मि.ग्रा. आइरन + ४०० माइक्रोग्राम फोलिक एसिड)",
        "tips": [
          "राम्रोसँग पचाउनका लागि कागती पानी वा सुन्तलाको जुससँग खानुहोस्।",
          "चिया, कफी वा दूधसँग सेवन नगर्नुहोस्।"
        ]
      }
    },
    {
      "id": "calcium",
      "icon": "Milk",
      "color": "#3B82F6",
      "bg": "#EFF6FF",
      "en": {
        "title": "Calcium",
        "desc": "Calcium helps control blood pressure during pregnancy and builds strong bones and teeth for your baby.",
        "dosage": "Take 1.5–2.0 g daily (usually in divided doses)",
        "tips": [
          "Eat milk, curd, and green leafy vegetables regularly.",
          "Take calcium and iron tablets at least 2 hours apart."
        ]
      },
      "np": {
        "title": "क्याल्सियम",
        "desc": "गर्भावस्थामा रक्तचाप सन्तुलित राख्न र बच्चाको हड्डी तथा दाँत बलियो बनाउन क्याल्सियमको आवश्यकता पर्दछ।",
        "dosage": "दैनिक १.५–२.० ग्राम (छुट्याइएको मात्रामा) सेवन गर्नुहोस्।",
        "tips": [
          "दूध, दही र हरियो सागपात नियमित खानुहोस्।",
          "क्याल्सियम र आइरन चक्की कम्तीमा २ घण्टाको फरकमा खानुहोस्।"
        ]
      }
    },
    {
      "id": "diet",
      "icon": "Salad",
      "color": "#22C55E",
      "bg": "#F0FDF4",
      "en": {
        "title": "Balanced Diet",
        "desc": "Eat healthy and balanced meals every day. Your body needs extra nutrition during pregnancy.",
        "dosage": "Eat one extra meal daily (approx. 300 extra calories)",
        "tips": [
          "Include grains, pulses, vegetables, and dairy products.",
          "Eat eggs, seasonal fruits, and green vegetables often."
        ]
      },
      "np": {
        "title": "सन्तुलित भोजन",
        "desc": "गर्भावस्थामा शरीरलाई थप पोषण चाहिने हुनाले दैनिक स्वस्थ र सन्तुलित खाना खानुहोस्।",
        "dosage": "साविकभन्दा दिनमा एक पटक थप पोषिलो खाना खानुहोस् (थप ३०० क्यालोरी)।",
        "tips": [
          "खानाको थालीमा अन्न, दाल, तरकारी र दुधजन्य पदार्थ समावेश गर्नुहोस्।",
          "अण्डा, मौसमी फलफूल र हरियो सागपात प्रशस्त खानुहोस्।"
        ]
      }
    },
    {
      "id": "hydration",
      "icon": "Droplets",
      "color": "#06B6D4",
      "bg": "#ECFEFF",
      "en": {
        "title": "Hydration",
        "desc": "Drink plenty of water to prevent constipation, urinary infections, and dehydration.",
        "dosage": "Drink at least 8–10 glasses (2–2.5 liters) daily",
        "tips": [
          "Drink clean boiled or filtered water.",
          "Increase intake during hot weather or if you experience vomiting."
        ]
      },
      "np": {
        "title": "पर्याप्त पानी",
        "desc": "कब्जियत, पिसाबको संक्रमण र जलवियोजन हुन नदिन प्रशस्त पानी पिउनुहोस्।",
        "dosage": "दिनमा कम्तीमा ८–१० गिलास (२–२.५ लिटर) सफा पानी पिउनुहोस्।",
        "tips": [
          "सधैं उमालेको वा फिल्टर गरिएको सफा पानी मात्र पिउनुहोस्।",
          "गर्मी धेरै हुँदा वा वान्ता भएमा थप पानी पिउनुहोस्।"
        ]
      }
    },
    {
      "id": "protein",
      "icon": "Beef",
      "color": "#F97316",
      "bg": "#FFF7ED",
      "en": {
        "title": "Protein Intake",
        "desc": "Protein supports your baby’s brain development and helps repair your body tissues.",
        "dosage": "Aim for an extra 25 g of protein daily",
        "tips": [
          "Eat pulses, beans, eggs, meat, or fish regularly.",
          "Combining grains and lentils (like Dal-Bhat) provides complete protein."
        ]
      },
      "np": {
        "title": "प्रोटिनयुक्त खाना",
        "desc": "बच्चाको दिमाग र शरीरको विकासका लागि तथा आमालाई बलियो राख्न प्रोटिनको ठूलो भूमिका हुन्छ।",
        "dosage": "हरेक दिन थप २५ ग्राम प्रोटिन प्राप्त हुने गरी खाना खानुहोस्।",
        "tips": [
          "दाल, गेडागुडी, अण्डा, मासु वा माछा नियमित रूपमा खानुहोस्।",
          "दाल र भात सँगै मिसाएर खाँदा पूर्ण प्रोटिन पाइन्छ।"
        ]
      }
    }
  ],
  "child": [
    {
      "id": "breastfeeding",
      "icon": "Baby",
      "color": "#EC4899",
      "bg": "#FDF2F8",
      "en": {
        "title": "Exclusive Breastfeeding",
        "desc": "Give only breast milk for the first 6 months. It provides perfect nutrition and immunity.",
        "dosage": "On-demand feeding, at least 8–12 times in 24 hours",
        "tips": [
          "Start breastfeeding within 1 hour of birth.",
          "Do not give water, honey, or formula unless medically advised."
        ]
      },
      "np": {
        "title": "पूर्ण स्तनपान",
        "desc": "बच्चा जन्मेको ६ महिनासम्म आमाको दूध मात्र खुवाउनुहोस्। यसले पूर्ण पोषण र रोगसँग लड्ने शक्ति दिन्छ।",
        "dosage": "बच्चाले चाहेको बेला (दिन र रात गरी कम्तीमा ८–१२ पटक) खुवाउनुहोस्।",
        "tips": [
          "बच्चा जन्मेको १ घण्टाभित्रै स्तनपान सुरु गराउनुहोस्।",
          "दूध बाहेक पानी, मह वा अन्य कुनै पनि कुरा नदिनुहोस्।"
        ]
      }
    },
    {
      "id": "complementary",
      "icon": "Soup",
      "color": "#F97316",
      "bg": "#FFF7ED",
      "en": {
        "title": "Complementary Feeding",
        "desc": "After 6 months, introduce soft nutritious foods while continuing breastfeeding for up to 2 years.",
        "dosage": "2–3 times (6–8 months), 3–4 times (9–24 months)",
        "tips": [
          "Start with thick porridge (lito) or well-mashed food.",
          "Add a little ghee or oil to increase energy density."
        ]
      },
      "np": {
        "title": "थप आहार (पोषिलो लिटो)",
        "desc": "६ महिना पूरा भएपछि आमाको दूधको साथमा नरम र पोषिलो थप खाना खुवाउन सुरु गर्नुहोस्।",
        "dosage": "६–८ महिनामा दिनको २–३ पटक र ९–२४ महिनामा ३–४ पटक खुवाउनुहोस्।",
        "tips": [
          "बाक्लो लिटो वा राम्ररी मिचेको अन्नबाट खाना सुरु गर्नुहोस्।",
          "खानाको तागत बढाउन थोरै घिउ वा तेल मिसाउनुहोस्।"
        ]
      }
    },
    {
      "id": "vitamin_a",
      "icon": "Carrot",
      "color": "#EAB308",
      "bg": "#FEFCE8",
      "en": {
        "title": "Vitamin A Supplementation",
        "desc": "Vitamin A is essential for eyesight, growth, and protection against severe infections.",
        "dosage": "One capsule every 6 months (for children 6 months to 5 years)",
        "tips": [
          "Ensure your child receives it during national campaigns or health post visits.",
          "Feed foods like carrots, pumpkin, and leafy greens."
        ]
      },
      "np": {
        "title": "भिटामिन ए",
        "desc": "बच्चाको आँखा, वृद्धि विकास र रोग प्रतिरोध क्षमता बढाउन भिटामिन ए आवश्यक हुन्छ।",
        "dosage": "६ महिनादेखि ५ वर्षसम्मका बालबालिकालाई हरेक ६ महिनामा एक पटक दिनुहोस्।",
        "tips": [
          "राष्ट्रिय अभियान वा स्वास्थ्य संस्थाको जाँचको समयमा नबिर्सिई खुवाउनुहोस्।",
          "गाजर, फर्सी, पाकेको आँप र हरियो सागपात नियमित दिनुहोस्।"
        ]
      }
    },
    {
      "id": "protein_iron",
      "icon": "Wheat",
      "color": "#8B5CF6",
      "bg": "#F5F3FF",
      "en": {
        "title": "Protein & Iron for Growth",
        "desc": "Iron prevents anemia, while protein builds muscles and brain power in growing children.",
        "dosage": "Include iron-rich foods in the daily diet",
        "tips": [
          "Give eggs, meat, lentils, and fortified grains.",
          "Add vitamin C (lemon/orange) to meals for better iron absorption."
        ]
      },
      "np": {
        "title": "प्रोटिन र आइरन",
        "desc": "बच्चालाई रगतको कमी हुन नदिन र शरीर बलियो बनाउन प्रोटिन तथा आइरनयुक्त खाना चाहिन्छ।",
        "dosage": "हरेक दिनको खानामा आइरन पाइने खानेकुरा समावेश गर्नुहोस्।",
        "tips": [
          "अण्डा, मासु, गेडागुडी र अन्नहरू मिसाएर खुवाउनुहोस्।",
          "आइरन राम्रोसँग सोस्नका लागि खानासँग कागती वा सुन्तलाको रस दिनुहोस्।"
        ]
      }
    },
    {
      "id": "zinc",
      "icon": "Dna",
      "color": "#14B8A6",
      "bg": "#F0FDFA",
      "en": {
        "title": "Zinc & ORS (Jeevan Jal)",
        "desc": "Zinc reduces the duration and severity of diarrhea and helps prevent future episodes.",
        "dosage": "Give daily for 10–14 days during and after diarrhea",
        "tips": [
          "Dissolve the tablet in clean water or breast milk.",
          "Continue breastfeeding and give plenty of ORS (Jeevan Jal)."
        ]
      },
      "np": {
        "title": "जिंक चक्की र जीवनजल",
        "desc": "झाडापखाला लाग्दा जिंक चक्की दिनाले बच्चा छिटो निको हुन्छ र भविष्यमा पनि संक्रमण कम गर्छ।",
        "dosage": "झाडापखाला लागेको बेला १० देखि १४ दिनसम्म नियमित दिनुहोस्।",
        "tips": [
          "चक्कीलाई आमाको दूध वा सफा पानीमा घोलेर खुवाउनुहोस्।",
          "निरन्तर स्तनपान गराउनुहोस् र पटक-पटक जीवनजल दिनुहोस्।"
        ]
      }
    }
  ]
}

``


## File: .\src\assets\i18n\en.json


``json

{
  "login": {
    "welcome": "Welcome",
    "subtitle": "Health Data Collection App",
    "health_id_label": "Health Worker ID",
    "health_id_placeholder": "Enter Email ID",
    "password_label": "Password",
    "password_placeholder": "Enter Password",
    "login_button": "Login",
    "login_sub": "Enter your credentials",
    "forgot_password": "Forgot Password?",
    "help_text": "Need help? Contact local health post"
  },
  "common": {
    "english": "English",
    "nepali": "Nepali",
    "version": "v2.5.0",
    "namaste": "Namaste",
    "welcome-back": "Welcome back",
    "welcome": "Welcome"
  },
  "dashboard": {
    "title": "FCHV Dashboard",
    "quick_stats": "Quick Statistics",
    "operational": "Primary Tasks",
    "support": "Support & References",
    "stats": {
      "households": "Households",
      "pregnant": "Pregnant",
      "children": "Children",
      "followups": "Follow-ups"
    },
    "actions": {
      "add_household": "Add Household",
      "pregnant_women": "Pregnant Women",
      "children_05": "Children (0-5)",
      "family_planning": "Family Planning",
      "follow_ups": "Follow-ups"
    },
    "drawer": {
      "profile": "My Profile",
      "language": "Change Language",
      "learn": "Guidelines",
      "logout": "Sign Out",
      "health_id": "Health ID",
      "sync_data": "Sync Data Now"
    },
    "language_page": {
      "title": "Change Language",
      "subtitle": "Select your preferred language",
      "current": "Current",
      "save": "Save & Apply"
    },
    "profile_page": {
      "title": "My Profile",
      "name_label": "Full Name",
      "id_label": "Health Worker ID",
      "role_label": "Role",
      "post_label": "Health Post",
      "phone_label": "Phone Number",
      "email_label": "Email",
      "role_value": "Female Community Health Volunteer (FCHV)",
      "post_value": "Bhairahawa Health Post"
    }
  },
  "pregnant_form": {
    "title": "Add Pregnant Woman",
    "basic_info": {
      "title": "Basic Information",
      "subtitle": "Personal details",
      "name_label": "Full Name",
      "name_placeholder": "e.g. Maya Devi",
      "age_label": "Age",
      "age_placeholder": "e.g. 24"
    },
    "address": {
      "title": "Address Details",
      "subtitle": "Location information",
      "municipality_label": "Municipality",
      "municipality_placeholder": "Enter local level",
      "ward_label": "Ward",
      "ward_placeholder": "e.g. 5",
      "village_label": "Village",
      "village_placeholder": "Village name"
    },
    "pregnancy": {
      "title": "Pregnancy Details",
      "subtitle": "Maternal health info",
      "gravida_label": "Gravida",
      "gravida_placeholder": "e.g. 1",
      "lmp_label": "LMP",
      "lmp_sub": "Last Menstrual Period",
      "edd_label": "EDD",
      "edd_sub": "Expected Due Date"
    },
    "healthcare": {
      "title": "Healthcare Metrics",
      "subtitle": "Checkups & vaccines",
      "anc_label": "ANC Visit Count",
      "anc_placeholder": "e.g. 1",
      "ifa_label": "IFA Tablet Received",
      "ifa_sub": "Nutritional intake",
      "tt_label": "TT Vaccination Status",
      "tt_sub": "Immunization"
    },
    "risk": {
      "title": "Risk Signs",
      "subtitle": "Vulnerability assessment",
      "signs_label": "Risk Signs (if any)",
      "signs_placeholder": "Type any concerns or symptoms..."
    },
    "options": {
      "yes": "Yes",
      "no": "No",
      "done": "Done",
      "pending": "Pending"
    },
    "submit": {
      "title": "Save Registration",
      "subtitle": "Register successfully",
      "success": "Pregnant woman registered successfully!"
    }
  },
  "household_form": {
    "title": "Add New Household",
    "ward_label": "Ward No.",
    "ward_placeholder": "1",
    "tole_label": "Tole",
    "tole_placeholder": "Tole Name",
    "phone_label": "Phone Number",
    "phone_placeholder": "98XXXXXXXX",
    "submit": {
      "title": "Save Details",
      "success": "Household added successfully!"
    }
  },
  "learn_page": {
    "title": "Educational Resources",
    "header": "Health Guidelines",
    "search_placeholder": "Search...",
    "hero_title_np": "Safe Motherhood",
    "hero_subtitle": "Safe Motherhood",
    "categories": {
      "birth_prep": "Birth Preparedness",
      "nutrition": "Nutrition Guide",
      "family_planning": "Family Planning",
      "newborn": "Newborn Care"
    },
    "recently_viewed": "Recently Viewed",
    "view_all": "View All",
    "videos": {
      "v1_title": "Importance of Vitamin A",
      "v1_meta": "3 min • Health Message",
      "v2_title": "Vaccination Schedule",
      "v2_meta": "5 MB • PDF",
      "v3_title": "Breastfeeding Guide",
      "v3_meta": "2 min • Video"
    },
    "all_guidelines": "All Guidelines",
    "guidelines": {
      "breastfeeding": "Breastfeeding Guide",
      "vaccination": "Vaccination Schedule",
      "anc_checkup": "Antenatal Checkup",
      "mental_health": "Mental Health"
    },
    "maternal_health": {
      "title": "Maternal Health Guide",
      "subtitle": "Complete guide for safe pregnancy"
    },
    "child_nutrition": {
      "title": "Child Nutrition",
      "subtitle": "Healthy diet for growing children"
    },
    "first_aid": {
      "title": "First Aid Basics",
      "subtitle": "Emergency care and response"
    },
    "anc": {
      "title": "Antenatal Care (ANC)",
      "subtitle": "Essential pregnancy checkups"
    },
    "pnc": {
      "title": "Postnatal Care (PNC)",
      "subtitle": "Care for mother after childbirth"
    },
    "baby_care": {
      "title": "Newborn & Baby Care",
      "subtitle": "Essential practices for infants"
    }
  },
  "learn_details": {
    "content_not_found": "Content not found",
    "go_back": "Go Back",
    "details": "Details",
    "key_points": "Key Points",
    "detailed_trimester_guide": "Detailed Trimester Guide",
    "trimesters": {
      "first": "1st Trimester",
      "second": "2nd Trimester",
      "third": "3rd Trimester"
    },
    "no_content": "No content available"
  },
  "header": {
    "fchv": "FCHV",
    "community_connect": "Community Connect"
  },
  "nutrition_page": {
    "title": "Nutrition Guide",
    "subtitle": "WHO Verified Recommendations",
    "tabs": {
      "pregnant": "Pregnant Women",
      "child": "Children (0-5)"
    },
    "dosage_label": "Recommended Dosage",
    "tips_label": "Practical Tips",
    "source": "Source: World Health Organization (WHO)",
    "who_badge": "WHO Verified"
  }
}


``


## File: .\src\assets\i18n\np.json


``json

{
  "login": {
    "welcome": "स्वागत छ",
    "subtitle": "स्वास्थ्य डेटा सङ्कलन एप",
    "health_id_label": "स्वास्थ्य कार्यकर्ता आईडी",
    "health_id_placeholder": "आईडी राख्नुहोस्",
    "password_label": "पासवर्ड",
    "password_placeholder": "पासवर्ड राख्नुहोस्",
    "login_button": "लगइन गर्नुहोस्",
    "login_sub": "तपाईंको विवरणहरू प्रविष्ट गर्नुहोस्",
    "forgot_password": "पासवर्ड बिर्सनुभयो?",
    "help_text": "मद्दत चाहिन्छ? स्थानीय स्वास्थ्य चौकीमा सम्पर्क गर्नुहोस्"
  },
  "common": {
    "english": "English",
    "nepali": "नेपाली",
    "version": "v2.5.0",
    "namaste": "नमस्ते",
    "welcome-back": "स्वागत छ",
    "welcome": "स्वागत छ"
  },
  "dashboard": {
    "title": "FCHV डैशबोर्ड",
    "quick_stats": "द्रुत तथ्याङ्क",
    "operational": "मुख्य कार्यहरू",
    "support": "सहयोग र सन्दर्भ",
    "stats": {
      "households": "घरधुरी",
      "pregnant": "गर्भवती",
      "children": "बालबालिका",
      "followups": "फलो-अप"
    },
    "actions": {
      "add_household": "घरधुरी थप्नुहोस्",
      "pregnant_women": "गर्भवती महिला",
      "children_05": "बालबालिका (०-५)",
      "family_planning": "परिवार नियोजन",
      "follow_ups": "फलो-अप"
    },
    "drawer": {
      "profile": "मेरो प्रोफाइल",
      "language": "भाषा परिवर्तन गर्नुहोस्",
      "learn": "मार्गनिर्देशन",
      "logout": "बाहिर निस्कनुहोस्",
      "health_id": "स्वास्थ्य आईडी",
      "sync_data": "डाटा सिङ्क गर्नुहोस्"
    },
    "language_page": {
      "title": "भाषा परिवर्तन गर्नुहोस्",
      "subtitle": "आफ्नो मनपर्ने भाषा छान्नुहोस्",
      "current": "हालको",
      "save": "सुरक्षित गर्नुहोस्"
    },
    "profile_page": {
      "title": "मेरो प्रोफाइल",
      "name_label": "पुरा नाम",
      "id_label": "स्वास्थ्य कार्यकर्ता आईडी",
      "role_label": "भूमिका",
      "post_label": "स्वास्थ्य चौकी",
      "phone_label": "फोन नम्बर",
      "email_label": "इमेल",
      "role_value": "महिला सामुदायिक स्वास्थ्य स्वयंसेविका (FCHV)",
      "post_value": "भैरहवा स्वास्थ्य चौकी"
    }
  },
  "pregnant_form": {
    "title": "गर्भवती महिला दर्ता",
    "basic_info": {
      "title": "व्यक्तिगत विवरण",
      "subtitle": "व्यक्तिगत जानकारी",
      "name_label": "पूरा नाम",
      "name_placeholder": "उदा. माया देवी",
      "age_label": "उमेर",
      "age_placeholder": "उदा. २४"
    },
    "address": {
      "title": "ठेगाना",
      "subtitle": "स्थानको जानकारी",
      "municipality_label": "नगरपालिका/गाउँपालिका",
      "municipality_placeholder": "स्थानीय तह राख्नुहोस्",
      "ward_label": "वडा नं.",
      "ward_placeholder": "उदा. ५",
      "village_label": "गाउँ",
      "village_placeholder": "गाउँको नाम"
    },
    "pregnancy": {
      "title": "गर्भावस्था विवरण",
      "subtitle": "मातृ स्वास्थ्य जानकारी",
      "gravida_label": "गर्भावस्था संख्या",
      "gravida_placeholder": "उदा. १",
      "lmp_label": "अन्तिम महिनावारी मिति",
      "lmp_sub": "LMP",
      "edd_label": "अपेक्षित सुत्केरी मिति",
      "edd_sub": "EDD"
    },
    "healthcare": {
      "title": "स्वास्थ्य जाँच",
      "subtitle": "जाँच र खोपहरू",
      "anc_label": "ए.एन.सी जाँच संख्या",
      "anc_placeholder": "उदा. १",
      "ifa_label": "आई.एफ.ए. चक्की प्राप्त",
      "ifa_sub": "पोषणयुक्त आहार",
      "tt_label": "टी.टी. खोप स्थिति",
      "tt_sub": "रोग प्रतिरोधात्मक क्षमता"
    },
    "risk": {
      "title": "जोखिमका लक्षण",
      "subtitle": "जोखिमको मुल्यांकन",
      "signs_label": "जोखिमका लक्षणहरू",
      "signs_placeholder": "कुनै चिन्ता वा लक्षणहरू लेख्नुहोस्..."
    },
    "options": {
      "yes": "हो",
      "no": "होइन",
      "done": "पूर्ण",
      "pending": "बाँकी"
    },
    "submit": {
      "title": "दर्ता सुरक्षित गर्नुहोस्",
      "subtitle": "सफलतापूर्वक दर्ता गर्नुहोस्",
      "success": "गर्भवती महिला सफलतापूर्वक दर्ता भयो!"
    }
  },
  "household_form": {
    "title": "नयाँ घरधुरी थप्नुहोस्",
    "ward_label": "वडा नं.",
    "ward_placeholder": "१",
    "tole_label": "टोल",
    "tole_placeholder": "टोलको नाम",
    "phone_label": "फोन नम्बर",
    "phone_placeholder": "९८XXXXXXXX",
    "submit": {
      "title": "सुरक्षित गर्नुहोस्",
      "success": "घरधुरी सफलतापूर्वक थपियो!"
    }
  },
  "learn_page": {
    "title": "शैक्षिक स्रोतहरू",
    "header": "स्वास्थ्य निर्देशिका",
    "search_placeholder": "खोज्नुहोस्...",
    "hero_title_np": "सुरक्षित मातृत्व",
    "hero_subtitle": "सुरक्षित मातृत्व",
    "categories": {
      "birth_prep": "जन्म तयारी",
      "nutrition": "पोषण मार्गदर्शन",
      "family_planning": "परिवार नियोजन",
      "newborn": "नवजात शिशु हेरचाह"
    },
    "recently_viewed": "भर्खरै हेरिएका",
    "view_all": "सबै हेर्नुहोस्",
    "videos": {
      "v1_title": "भिटामिन ए को महत्व",
      "v1_meta": "३ मिनेट • स्वास्थ्य सन्देश",
      "v2_title": "खोप तालिका",
      "v2_meta": "५ MB • PDF",
      "v3_title": "स्तनपान गाइड",
      "v3_meta": "२ मिनेट • भिडियो"
    },
    "all_guidelines": "सबै निर्देशिकाहरू",
    "guidelines": {
      "breastfeeding": "स्तनपान मार्गदर्शन",
      "vaccination": "खोप तालिका",
      "anc_checkup": "ANC जाँच",
      "mental_health": "मानसिक स्वास्थ्य"
    },
    "maternal_health": {
      "title": "मातृ स्वास्थ्य मार्गदर्शन",
      "subtitle": "सुरक्षित गर्भावस्थाको पूर्ण गाइड"
    },
    "child_nutrition": {
      "title": "बाल पोषण",
      "subtitle": "बढ्दो बालबालिकाको लागि स्वस्थ आहार"
    },
    "first_aid": {
      "title": "प्राथमिक उपचार आधारभूत कुराहरू",
      "subtitle": "आपतकालीन हेरचाह र प्रतिक्रिया"
    },
    "anc": {
      "title": "गर्भावस्था जाँच (ANC)",
      "subtitle": "गर्भावस्थामा आवश्यक जाँचहरू"
    },
    "pnc": {
      "title": "सुत्केरी स्याहार (PNC)",
      "subtitle": "सुत्केरी पछि आमाको हेरचाह"
    },
    "baby_care": {
      "title": "नवजात शिशु र बच्चाको हेरचाह",
      "subtitle": "शिशुको लागि आवश्यक अभ्यासहरू"
    }
  },
  "learn_details": {
    "content_not_found": "सामग्री फेला परेन",
    "go_back": "फर्कनुहोस्",
    "details": "विवरण",
    "key_points": "मुख्य कुराहरू",
    "detailed_trimester_guide": "विस्तृत त्रैमासिक जानकारी",
    "trimesters": {
      "first": "पहिलो (१-३)",
      "second": "दोस्रो (४-६)",
      "third": "तेस्रो (७-९)"
    },
    "no_content": "कुनै सामग्री उपलब्ध छैन"
  },
  "header": {
    "fchv": "एफ.सी.एच.भी.",
    "community_connect": "सामुदायिक सम्बन्ध"
  },
  "nutrition_page": {
    "title": "पोषण मार्गदर्शन",
    "subtitle": "WHO प्रमाणित सिफारिसहरू",
    "tabs": {
      "pregnant": "गर्भवती महिला",
      "child": "बालबालिका (०-५)"
    },
    "dosage_label": "सिफारिस गरिएको मात्रा",
    "tips_label": "व्यावहारिक सुझावहरू",
    "source": "स्रोत: विश्व स्वास्थ्य संगठन (WHO)",
    "who_badge": "WHO प्रमाणित"
  }
}

``


## File: .\src\components\button.tsx


``tsx

import { Save } from "lucide-react-native";
import { ActivityIndicator, TouchableOpacity, Text, View } from "react-native";
import React from "react";

export const Button = ({
  onPress,
  isLoading,
  title,
  icon: Icon = Save,
}: {
  onPress: () => void;
  isLoading?: boolean;
  title: string;
  icon?: any;
}) => (
  <TouchableOpacity
    activeOpacity={0.88}
    onPress={onPress}
    disabled={isLoading}
    className="bg-primary rounded-2xl h-14 flex-row items-center justify-center mt-4 mb-2"
  >
    {isLoading ? (
      <ActivityIndicator color="white" size="small" />
    ) : (
      <>
        {Icon && <Icon size={18} color="white" strokeWidth={2} />}
        <Text className="text-white font-semibold text-md ml-2">{title}</Text>
      </>
    )}
  </TouchableOpacity>
);


``


## File: .\src\components\CameraCapture.tsx


``tsx

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  X,
  RotateCcw,
  Check,
  Camera as CameraIcon,
} from "lucide-react-native";

type Props = {
  visible: boolean;
  onCapture: (uri: string) => void;
  onClose: () => void;
};

export default function CameraCapture({ visible, onCapture, onClose }: Props) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isTaking, setIsTaking] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (!cameraRef.current || isTaking) return;
    setIsTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });
      if (photo) {
        setCapturedPhoto(photo.uri);
      }
    } catch (err) {
      console.error("Failed to take picture:", err);
    } finally {
      setIsTaking(false);
    }
  };

  const confirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      setCapturedPhoto(null);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handleClose = () => {
    setCapturedPhoto(null);
    onClose();
  };

  // ─── Render permission prompt ───
  const renderPermissionScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.permissionContainer}>
        <View style={styles.permissionIcon}>
          <CameraIcon size={48} color="#10B981" strokeWidth={1.5} />
        </View>
        <Text style={styles.permissionTitle}>Camera Access Needed</Text>
        <Text style={styles.permissionText}>
          We need camera access to take a photo of the mother.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
          activeOpacity={0.85}
        >
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.permissionCancel}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={styles.permissionCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // ─── Render photo preview (after capture) ───
  const renderPreview = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image source={{ uri: capturedPhoto! }} style={styles.preview} />
      <View style={styles.previewOverlay}>
        <View style={styles.previewControls}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={retakePhoto}
            activeOpacity={0.85}
          >
            <RotateCcw size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmPhoto}
            activeOpacity={0.85}
          >
            <Check size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  // ─── Render live camera ───
  const renderCamera = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <X size={24} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Take Photo</Text>
          <TouchableOpacity
            style={styles.topButton}
            onPress={toggleFacing}
            activeOpacity={0.7}
          >
            <RotateCcw size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            activeOpacity={0.8}
            disabled={isTaking}
          >
            {isTaking ? (
              <ActivityIndicator size="small" color="#10B981" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );

  // ─── Determine what content to show inside modal ───
  const renderContent = () => {
    if (!permission || !permission.granted) {
      return renderPermissionScreen();
    }
    if (capturedPhoto) {
      return renderPreview();
    }
    return renderCamera();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {renderContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  // ─── Permission screen ───
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 15,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  permissionCancel: {
    paddingVertical: 12,
  },
  permissionCancelText: {
    color: "#94A3B8",
    fontWeight: "600",
    fontSize: 15,
  },
  // ─── Top bar ───
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 17,
  },
  // ─── Bottom bar ───
  bottomBar: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 20,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
  },
  // ─── Preview ───
  preview: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingBottom: 60,
    paddingTop: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  retakeButton: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    minWidth: 110,
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
    minWidth: 110,
  },
  controlLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
    marginTop: 4,
  },
});


``


## File: .\src\components\CustomHeader.tsx


``tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import Colors from '../constants/Colors';

type CustomHeaderProps = {
  title: string;
  subtitle?: string;
  rightNode?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  className?: string;
  onBackPress?: () => void;
};

export default function CustomHeader({ 
  title, 
  subtitle,
  rightNode, 
  containerStyle,
  className = "pt-4 pb-4 px-5 mt-8",
  onBackPress
}: CustomHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      // Fallback to dashboard if no history exists
      router.replace("/dashboard");
    }
  };

  return (
    <View 
      className={`flex-row items-center justify-between ${className}`}
      style={containerStyle}
    >
      <View className="flex-row items-center flex-1">
        <TouchableOpacity 
          onPress={handleBack} 
          className="mr-3 p-2 rounded-xl border border-slate-100 bg-white shadow-sm"
        >
          <ChevronLeft size={22} color={Colors.textPrimary || "#1E293B"} strokeWidth={2.5} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="font-black text-xl ml-1" style={{ color: Colors.textPrimary || "#1E293B" }}>
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-400 text-xs ml-1 font-medium">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      {rightNode ? (
        <View>
          {rightNode}
        </View>
      ) : (
        <View className="w-10" /> 
      )}
    </View>
  );
}


``


## File: .\src\components\DatabaseViewer.tsx


``tsx

import * as SQLite from "expo-sqlite";
import { Database, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// 1. Define the variable OUTSIDE the component so it persists forever
let globalDb: SQLite.SQLiteDatabase | null = null;

// 2. Helper to get the existing connection or create a new one if it doesn't exist
const getDbConnection = async () => {
  if (globalDb) {
    return globalDb;
  }
  globalDb = await SQLite.openDatabaseAsync("myapp.db");
  return globalDb;
};

export default function DatabaseViewer({ onClose }: { onClose: () => void }) {
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      // 3. Use the singleton helper
      const db = await getDbConnection();
      const result = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'"
      );
      setTables(result);
    } catch (e) {
      console.error("Error loading tables:", e);
    } finally {
      setInitializing(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoading(true);
    try {
      // 4. Reuse the connection again
      const db = await getDbConnection();
      const result = (await db.getAllAsync(
        `SELECT * FROM ${tableName}`
      )) as any[];
      setSelectedTable(tableName);
      setTableData(result);
    } catch (e) {
      console.error("Error loading table data:", e);
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering if DB is struggling to open
  if (initializing && tables.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 pt-14 px-4 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-4">Connecting to Database...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 pt-14 px-4">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center gap-2">
          <Database size={24} color="#2563eb" />
          <Text className="text-2xl font-bold text-gray-900">Database</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="bg-gray-200 p-2 rounded-full"
        >
          <X color="#374151" size={24} />
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 bg-gray-50 pt-14 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap gap-2 mb-6">
          {tables.map((t, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => loadTableData(t.name)}
              className={`px-4 py-2 rounded-lg ${selectedTable === t.name ? "bg-blue-600" : "bg-white border border-gray-300"}`}
            >
              <Text
                className={`font-semibold ${selectedTable === t.name ? "text-white" : "text-gray-700"}`}
              >
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-1 bg-slate-900 rounded-xl overflow-hidden shadow-sm">
          <View className="bg-slate-800 px-4 py-3 border-b border-slate-700">
            <Text className="text-white font-bold text-lg">
              {selectedTable ? `Table: ${selectedTable}` : "Select a table"}
            </Text>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : tableData.length > 0 ? (
            <ScrollView horizontal className="flex-1">
              <View>
                <View className="flex-row bg-slate-800 border-b-2 border-slate-600">
                  {Object.keys(tableData[0]).map((key, index) => (
                    <View
                      key={index}
                      className="w-32 p-3 border-r border-slate-700"
                    >
                      <Text className="text-blue-400 font-bold text-xs">
                        {key}
                      </Text>
                    </View>
                  ))}
                </View>
                <ScrollView>
                  {tableData.map((row, rowIndex) => (
                    <View
                      key={rowIndex}
                      className={`flex-row border-b border-slate-800 ${rowIndex % 2 === 0 ? "bg-slate-900" : "bg-slate-800/50"}`}
                    >
                      {Object.values(row).map((value, colIndex) => (
                        <View
                          key={colIndex}
                          className="w-32 p-3 border-r border-slate-800 justify-center"
                        >
                          <Text
                            className={`text-xs ${value === null ? "text-red-400 italic" : "text-gray-300"}`}
                          >
                            {value === null ? "NULL" : String(value)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                  <View className="h-20" />
                </ScrollView>
              </View>
            </ScrollView>
          ) : (
            <View className="flex-1 justify-center items-center p-6">
              <Text className="text-green-400 font-mono text-xs text-center">
                {selectedTable
                  ? "This table is empty."
                  : "Waiting for selection..."}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}


``


## File: .\src\components\FormElements.tsx


``tsx

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from "react-native";
import { X, ChevronDown, Save } from "lucide-react-native";
import Dropdown from "react-native-input-select";

export const FieldLabel = ({ label }: { label: string }) => (
  <Text className="text-gray-800 text-[15px] mb-2">{label}</Text>
);

export const SelectInput = ({ label, placeholder, value, options, onSelect, error, disabled }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  
  const selectedLabel = options.find((opt: any) => opt.value === value)?.label || placeholder;

  const filteredOptions = options.filter((opt: any) => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="mb-6">
      <TouchableOpacity
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={disabled ? 1 : 0.7}
        className={`rounded-2xl px-4 h-14 flex-row items-center justify-between border ${
          disabled ? "bg-gray-50 border-gray-100 opacity-70" : "bg-gray-100 border-gray-200"
        } ${error ? "border-red-300" : ""}`}
      >
        <Text className={`text-base ${value ? "text-[#1E293B]" : "text-[#9CA3AF]"}`}>
          {selectedLabel}
        </Text>
        {!disabled && <ChevronDown size={18} color="#9CA3AF" />}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/50 justify-center items-center px-6"
        >
          <TouchableOpacity
            activeOpacity={1}
            className="bg-white w-full max-h-[70%] rounded-[32px] overflow-hidden"
          >
            <View className="p-6 border-b border-gray-100 flex-row items-center justify-between">
              <Text className="text-xl font-black text-[#1E293B]">{label || "Select Option"}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="px-6 py-4 border-b border-gray-50">
              <TextInput
                className="bg-gray-50 px-4 h-12 rounded-xl text-base text-[#1E293B]"
                placeholder="Search..."
                placeholderTextColor="#9CA3AF"
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <ScrollView className="px-2 pb-6">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt: any) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => {
                      onSelect(opt.value);
                      setModalVisible(false);
                      setSearch("");
                    }}
                    className={`px-4 py-4 rounded-2xl mb-1 flex-row items-center ${
                      value === opt.value ? "bg-blue-50" : "transparent"
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                      value === opt.value ? "border-primary bg-primary" : "border-gray-300"
                    }`}>
                      {value === opt.value && <View className="w-2 h-2 rounded-full bg-white" />}
                    </View>
                    <Text className={`text-base flex-1 ${
                      value === opt.value ? "text-primary font-bold" : "text-[#1E293B] font-medium"
                    }`}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-10 items-center">
                  <Text className="text-gray-400 font-bold">No options found</Text>
                </View>
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {error ? <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text> : null}
    </View>
  );
};

export const BoxInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  maxLength,
  error,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  maxLength?: number;
  error?: string;
}) => (
  <View className="mb-6">
    <View
      className={`bg-gray-100 rounded-2xl px-4 h-14 justify-center border ${error ? "border-red-300" : "border-gray-200"}`}
    >
      <TextInput
        className="text-[#1E293B] text-base"
        placeholder={placeholder}
        placeholderTextColor="#b8bbbeff"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        returnKeyType="next"
      />
    </View>
    {error ? (
      <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</Text>
    ) : null}
  </View>
);



``


## File: .\src\components\InputField.tsx


``tsx

import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import Colors from "../constants/Colors";
import React from "react";

interface InputFieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  subLabel?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  error?: string;
}

export default function InputField({
  label,
  subLabel,
  leftIcon,
  containerClassName,
  secureTextEntry,
  error,
  ...props
}: InputFieldProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordType = secureTextEntry;

  return (
    <View className={twMerge("w-full mb-8", containerClassName)}>
      <View className="flex-row items-center justify-between mb-1.5 px-0.5">
        <Text className="text-gray-500 font-bold text-[13px] uppercase tracking-wider">{label}</Text>
        {subLabel && (
          <Text className="text-gray-400 font-bold text-[11px] uppercase">{subLabel}</Text>
        )}
      </View>
      
      <View className="flex-row items-center border-b border-gray-200 h-14 pb-1">
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        
        <TextInput
          className="flex-1 text-[#1E293B] text-lg h-full font-bold"
          placeholderTextColor="#cbd5e1"
          secureTextEntry={isPasswordType && !isPasswordVisible}
          {...props}
        />

        {isPasswordType && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2"
          >
            {isPasswordVisible ? (
              <EyeOff size={18} color="#94a3b8" />
            ) : (
              <Eye size={18} color="#94a3b8" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text className="text-red-500 text-xs mt-1.5 font-medium">{error}</Text> : null}
    </View>
  );
}


``


## File: .\src\components\LanguageSwitcher.tsx


``tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Globe, ChevronDown, Check } from "lucide-react-native";
import { useLanguage } from "../context/LanguageContext";
import { twMerge } from "tailwind-merge";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";


export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleLanguage = async (lang: "en" | "np") => {
    await setLanguage(lang);
    setShowLangDropdown(false);
  };

  return (
    <View
      className="absolute right-0 z-[1000]"
      style={{ top: Math.max(insets.top, 10) }}
    >
      <TouchableOpacity
        onPress={() => setShowLangDropdown(!showLangDropdown)}
        activeOpacity={0.8}
        className="flex-row items-center bg-surface px-4 py-2.5 rounded-full border border-gray-100 shadow-sm"
      >
        <Globe size={18} color={Colors.primary} />
        <Text className="text-text-primary font-semibold ml-2 text-sm">
          {language === "en" ? "En" : "Np"}
        </Text>
        <ChevronDown size={16} color={Colors.textSecondary} className="ml-1" />
      </TouchableOpacity>

      {showLangDropdown && (
        <>
          {/* Backdrop to close dropdown */}
          <Pressable
            style={{
              position: "absolute",
              top: -100,
              left: -500,
              right: -100,
              bottom: -1000,
              zIndex: -1,
            }}
            onPress={() => setShowLangDropdown(false)}
          />
          <View className="absolute top-12 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[150px]">
            <TouchableOpacity
              onPress={() => toggleLanguage("en")}
              className={twMerge(
                "flex-row items-center justify-between px-4 py-3 rounded-xl",
                language === "en" ? "bg-primary/10" : "",
              )}
            >
              <Text
                className={twMerge(
                  "text-sm",
                  language === "en"
                    ? "text-primary font-bold"
                    : "text-text-secondary font-medium",
                )}
              >
                English
              </Text>
              {language === "en" && <Check size={16} color={Colors.primary} />}
            </TouchableOpacity>

            <View className="h-[1px] bg-gray-50 mx-2 my-1" />

            <TouchableOpacity
              onPress={() => toggleLanguage("np")}
              className={twMerge(
                "flex-row items-center justify-between px-4 py-3 rounded-xl",
                language === "np" ? "bg-primary/10" : "",
              )}
            >
              <Text
                className={twMerge(
                  "text-sm",
                  language === "np"
                    ? "text-primary font-bold"
                    : "text-text-secondary font-medium",
                )}
              >
                नेपाली
              </Text>
              {language === "np" && <Check size={16} color={Colors.primary} />}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}


``


## File: .\src\components\MotherForm.tsx


``tsx

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


``


## File: .\src\components\NavigationLayout.tsx


``tsx

import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import AppButton from "./common/AppButton";
import AppText from "./common/AppText";

type NavigationLayoutProps = {
  title: string;
  actionComponent?: React.ReactNode;
  className?: string;
  onBackPress?: () => void;
  absoluteCenterTitle?: boolean; // 👈 new prop
};

import { useSafeAreaInsets } from "react-native-safe-area-context";

const NavigationLayout = ({
  title,
  actionComponent,
  className,
  onBackPress,
  absoluteCenterTitle = false, // 👈 default false
}: NavigationLayoutProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: 6,
        paddingHorizontal: 6,
        backgroundColor: "#fff",
      }}
      className={className}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "relative", // 👈 needed for absolute centering
        }}
      >
        {/* Back button */}
        <AppButton
          variant="ghost"
          onPress={() => (onBackPress ? onBackPress() : router.back())}
          className="p-3"
          icon={<ChevronLeft size={28} color="#1a1a1a" strokeWidth={2} />}
        />

        {/* Title */}
        {!absoluteCenterTitle && (
          <AppText className="text-lg" weight="600">
            {title}
          </AppText>
        )}

        {/* Optional action */}
        {actionComponent ? actionComponent : <View style={{ width: 28 }} />}

        {/* Absolute centered title */}
        {absoluteCenterTitle && (
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              alignItems: "center",
            }}
          >
            <AppText className="text-lg" weight="600">
              {title}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

export default NavigationLayout;


``


## File: .\src\components\PregnancyForm.tsx


``tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Pressable } from "react-native";
import { Baby, Calendar, Info, Save } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { getAllMothersList, getMotherProfile, MotherListDbItem } from "../hooks/database/models/MotherModel";
import { createPregnancy } from "../hooks/database/models/PregnantWomenModal";
import { useToast } from "../context/ToastContext";
import { FieldLabel, BoxInput, SelectInput } from "./FormElements";
import { Button } from "./button";
import InputField from "./InputField";

export default function PregnancyForm({ id, onSwitchToMother }: { id?: string, onSwitchToMother?: () => void }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [mothers, setMothers] = useState<MotherListDbItem[]>([]);
  const [selectedMotherId, setSelectedMotherId] = useState<string>(id || "");
  const [gravida, setGravida] = useState("");
  const [parity, setParity] = useState("");
  const [lmp, setLmp] = useState("");
  const [edd, setEdd] = useState("");
  const [pregnancyId, setPregnancyId] = useState<string | null>(null);

  const [showLmpPicker, setShowLmpPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMothers = async () => {
      try {
        const list = await getAllMothersList();
        setMothers(list);
      } catch (err) {
        console.error("Error fetching mothers:", err);
      }
    };
    fetchMothers();
  }, []);

  useEffect(() => {
    if (id) {
      setSelectedMotherId(id);
      const fetchEditData = async () => {
        try {
          setIsLoading(true);
          const data = await getMotherProfile(id);
          if (data) {
            setGravida(data.gravida || "");
            setParity(data.parity || "");
            setLmp(data.lmp || "");
            setEdd(data.edd || "");
            setPregnancyId(data.pregnancyId || null);
          }
        } catch (e) {
          console.error("error fetching pregnancy profile", e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEditData();
    }
  }, [id]);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const calcEDD = (d: Date) => {
    const e = new Date(d);
    e.setDate(e.getDate() + 280);
    return formatDate(e);
  };

  const onLmpChange = (_: any, selected?: Date) => {
    setShowLmpPicker(false);
    if (selected) {
      setLmp(formatDate(selected));
      setEdd(calcEDD(selected));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!selectedMotherId) e.motherId = "Please select a mother";
    if (!gravida.trim()) e.gravida = "Gravida is required";
    if (!parity.trim()) e.parity = "Parity is required";
    if (!lmp) e.lmp = "LMP date is required";
    return e;
  };

  const save = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setIsLoading(true);
    try {
      await createPregnancy({
        id: pregnancyId || Crypto.randomUUID(),
        mother_id: selectedMotherId,
        gravida: parseInt(gravida) || 0,
        parity: parseInt(parity) || 0,
        lmp_date: lmp,
        expected_delivery_date: edd,
        is_current: true,
        selected: true,
      });
      
      showToast("Pregnancy details saved successfully");
      router.back();
    } catch (err) {
      console.error("Error saving form:", err);
      showToast("Failed to save pregnancy data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View className="mb-6 mt-2">
        <Text className="text-[#1E293B] font-black text-2xl mb-1">Pregnancy Details</Text>
        <Text className="text-gray-500 text-[13px] font-medium leading-5">
          Please enter the correct obstetric history and timeline information below for accurate tracking.
        </Text>
      </View>

      <View className="mb-6">
        <FieldLabel label="Select Mother" />
        <SelectInput
          label="Select Mother"
          placeholder={isLoading ? "Loading mothers..." : "Choose a mother"}
          value={selectedMotherId}
          disabled={!!id}
          options={mothers.length > 0 ? mothers.map(m => ({ value: m.id, label: `${m.name} (${m.ward})` })) : (id ? [{value: id, label: "Loading..."}] : [])}
          onSelect={(val: string) => {
            setSelectedMotherId(val);
            setErrors({ ...errors, motherId: "" });
          }}
          error={errors.motherId}
        />
      </View>

      <View className="bg-white rounded-3xl p-5 mb-6 border border-gray-100 shadow-sm shadow-gray-200/40">
        <View className="flex-row items-center mb-6">
          <View className="bg-orange-50 w-11 h-11 rounded-2xl items-center justify-center mr-3 border border-orange-100">
            <Baby size={22} color="#F97316" strokeWidth={2.5} />
          </View>
          <View>
            <Text className="text-[#1E293B] font-bold text-lg">Obstetric History</Text>
            <Text className="text-gray-400 text-xs font-medium mt-0.5">Gravida & Parity counts</Text>
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1">
            <FieldLabel label="Gravida" />
            <BoxInput
              placeholder="e.g. 1"
              value={gravida}
              onChangeText={(t) => { setGravida(t.replace(/\D/g, "")); setErrors({ ...errors, gravida: "" }); }}
              keyboardType="numeric"
              error={errors.gravida}
            />
          </View>
          <View className="flex-1">
            <FieldLabel label="Parity" />
            <BoxInput
              placeholder="e.g. 0"
              value={parity}
              onChangeText={(t) => { setParity(t.replace(/\D/g, "")); setErrors({ ...errors, parity: "" }); }}
              keyboardType="numeric"
              error={errors.parity}
            />
          </View>
        </View>
      </View>
      
       <Pressable onPress={() => setShowLmpPicker(true)}>
                  <View pointerEvents="none">
                    <InputField
                      label="LMP Date"
                      subLabel="अन्तिम महिनावारी मिति"
                      placeholder="YYYY-MM-DD"
                      value={lmp}
                      leftIcon={<Calendar size={18} color="#64748B" />}
                      editable={false}
                      error={errors.lmp}
                    />
                  </View>
                </Pressable>
                {showLmpPicker && (() => {
                  const maxDate = new Date();
                  maxDate.setMonth(maxDate.getMonth() + 9);
      
                  return (
                    <DateTimePicker
                      value={lmp ? new Date(lmp) : new Date()}
                      mode="date"
                      display="spinner"
                      maximumDate={maxDate}
                      onChange={onLmpChange}
                    />
                  );
                })()}

      <Button
        onPress={save}
        isLoading={isLoading}
        title="Save Pregnancy Info"
      />
     
    </>
  );
}


``


## File: .\src\components\SelectionGroup.tsx


``tsx

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface SelectionGroupProps {
  label: string;
  subLabel?: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: string) => void;
  containerClassName?: string;
}

export default function SelectionGroup({
  label,
  subLabel,
  options,
  selectedValue,
  onSelect,
  containerClassName,
}: SelectionGroupProps) {
  if (!options || !Array.isArray(options)) return null;

  return (
    <View className={`w-full mb-4 ${containerClassName || ""}`}>
      <View className="flex-row items-center mb-3">
        <Text className="text-gray-700 font-medium text-base">{label}</Text>
        {subLabel && (
          <Text className="text-gray-500 font-normal text-base ml-1">
            / {subLabel}
          </Text>
        )}
      </View>

      <View className="flex-row flex-wrap -m-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <View 
              key={option.value} 
              className="p-2 flex-1 min-w-[45%]"
            >
              <TouchableOpacity
                onPress={() => onSelect(option.value)}
                activeOpacity={0.7}
                className={`flex-row items-center px-4 py-4 rounded-3xl border ${
                  isSelected
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-100"
                }`}
              >
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-200 bg-white"
                  }`}
                >
                  {isSelected && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </View>
                <Text
                  className={`text-sm ${
                    isSelected ? "text-blue-700 font-semibold" : "text-gray-600 font-medium"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}


``


## File: .\src\components\ToastModal.tsx


``tsx

import { AlertTriangle, X } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, View } from "react-native";
import AppButton from "./common/AppButton";
import AppText from "./common/AppText";
import ModalWithSafeArea from "./common/ModalWithSafeArea";

interface BaseProps {
  visible: boolean;
  message: string;
  setVisible: (visible: boolean) => void;
}

interface ToastProps extends BaseProps {
  variant?: "toast";
  durationMs?: number;
}

interface ConfirmProps extends BaseProps {
  variant: "confirm";
  title?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
  dismissible?: boolean;
  tone?: "default" | "danger";
}

type Props = ToastProps | ConfirmProps;

const ToastMessage: React.FC<ToastProps> = ({
  visible,
  message,
  setVisible,
  durationMs = 1000
}) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        }).start(() => {
          // hide modal AFTER fade-out
          setVisible(false);
        });
      }, durationMs);

      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [durationMs, message, opacity, setVisible, visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toastPill, { opacity }]} pointerEvents="none">
      <AppText weight="600" style={styles.toastText}>
        {message}
      </AppText>
    </Animated.View>
  );
};

const ConfirmModal: React.FC<ConfirmProps> = ({
  visible,
  title = "Confirm",
  message,
  setVisible,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  error,
  dismissible = true,
  tone = "default"
}) => {
  const isDanger = tone === "danger";

  const handleCancel = () => {
    if (loading) return;
    onCancel?.();
    setVisible(false);
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  return (
    <ModalWithSafeArea
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (dismissible && !loading) {
          handleCancel();
        }
      }}
    >
      <View style={styles.confirmOverlay}>
        <View
          style={[
            styles.confirmContainer,
            isDanger && styles.confirmContainerDanger
          ]}
        >
          {dismissible && (
            <Pressable style={styles.closeButton} onPress={handleCancel}>
              <X size={20} color="#9ca3af" />
            </Pressable>
          )}
          <View style={styles.confirmContent}>
            {isDanger && (
              <View style={styles.dangerIcon}>
                <AlertTriangle size={22} color="#dc2626" />
              </View>
            )}
            <AppText
              weight="700"
              style={[
                styles.confirmTitle,
                isDanger && styles.confirmTitleDanger
              ]}
            >
              {title}
            </AppText>
            <AppText style={styles.confirmMessage}>{message}</AppText>
            {!!error && <AppText style={styles.confirmError}>{error}</AppText>}
            <View style={styles.confirmActions}>
              {dismissible && (
                <View style={styles.action}>
                  <AppButton
                    title={cancelLabel}
                    onPress={handleCancel}
                    variant="outline"
                    className="w-full"
                    disabled={loading}
                  />
                </View>
              )}
              <View style={styles.action}>
                <AppButton
                  title={confirmLabel}
                  onPress={handleConfirm}
                  variant={isDanger ? "danger" : "primary"}
                  className="w-full"
                  loading={loading}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ModalWithSafeArea>
  );
};

const ToastModal: React.FC<Props> = (props) => {
  if (props.variant === "confirm") {
    return <ConfirmModal {...props} />;
  }
  return <ToastMessage {...props} />;
};

export default ToastModal;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const styles = StyleSheet.create({
  toastPill: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 - 24,
    alignSelf: "center",
    backgroundColor: "#ff69b4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    elevation: 5,
    zIndex: 999
  },
  toastText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center"
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  confirmContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    width: "100%",
    maxWidth: 360,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
    overflow: "hidden"
  },
  confirmContainerDanger: {
    borderWidth: 1,
    borderColor: "#fecaca"
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
    backgroundColor: "#f3f4f6",
    borderRadius: 20
  },
  confirmContent: {
    padding: 24,
    alignItems: "center"
  },
  dangerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  confirmTitle: {
    fontSize: 20,
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 8
  },
  confirmTitleDanger: {
    color: "#b91c1c"
  },
  confirmMessage: {
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20
  },
  confirmError: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12
  },
  confirmActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8
  },
  action: {
    flex: 1
  }
});


``


## File: .\src\components\common\AppButton.tsx


``tsx

import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  ActivityIndicatorProps,
  Pressable,
  TouchableOpacityProps,
  View,
} from "react-native";
import AppText, { FontWeight } from "./AppText";
import { cn } from "@/utils/utils";

// VARIANTS
type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "outline"
  | "ghost"
  | "floating";

// SIZES
type ButtonSize = "sm" | "md" | "lg";

// ROUNDED
type Rounded = "none" | "sm" | "md" | "lg" | "full";

interface AppButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: Rounded;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  textClassName?: ReactNode;
  icon?: ReactNode;
  loaderStyle?: ActivityIndicatorProps;
  weight?: FontWeight;
}

export default function AppButton({
  title,
  variant = "primary",
  size = "md",
  rounded = "full",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  icon,
  className,
  textClassName,
  loaderStyle,
  weight,
  ...props
}: AppButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-primary-500",
    secondary: "bg-secondary-500",
    success: "bg-success-500",
    danger: "bg-danger-500",
    outline: "border border-gray-200 bg-white",
    ghost: "bg-transparent",
    floating: "bg-primary-500 shadow-lg",
  };

  // TEXT COLORS
  const textColor: Record<ButtonVariant, string> = {
    primary: "text-white",
    secondary: "text-white",
    success: "text-white",
    danger: "text-white",
    outline: "text-text",
    ghost: "text-text-secondary",
    floating: "text-white",
  };

  // SIZES
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // ROUNDED
  const roundedStyles: Record<Rounded, string> = {
    none: "rounded-none",
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  // BASE STYLE
  let baseStyle = `
    flex-row items-center justify-center
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${roundedStyles[rounded]}
    ${disabled ? "opacity-50" : ""}
  `;

  // Floating variant overrides
  if (variant === "floating") {
    baseStyle = `
      absolute bottom-6 right-6
      w-16 h-16
      flex items-center justify-center
      bg-primary-500 shadow-lg
      rounded-full
    `;
  }

  return (
    <Pressable
      android_ripple={{
        color: "rgba(0, 0, 0, 0.05)",
        borderless: false,
        foreground: true,
      }}
      disabled={disabled || loading}
      className={cn(baseStyle, className)}
      style={[{ alignSelf: "flex-start", overflow: "hidden" }, props.style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" {...loaderStyle} />
      ) : variant === "floating" ? (
        icon || <AppText className="text-xl text-white">+</AppText>
      ) : icon ? (
        icon
      ) : (
        <View className="flex-row items-center gap-2">
          {leftIcon}
          {title && (
            <AppText
              className={cn(`!${textColor[variant]}`, textClassName)}
              weight={weight}
            >
              {title}
            </AppText>
          )}
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}


``


## File: .\src\components\common\AppSegmentedControl.tsx


``tsx

import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React from "react";

type AppSegmentedControlProps = {
  segmentIndex: number;
  setSegmentIndex: (index: number) => void;
  onChange?: (index: number) => void;
  values: string[];
  label?: string[];
  size?: "small" | "large";
};

const AppSegmentedControl = ({
  segmentIndex,
  setSegmentIndex,
  onChange,
  values,
  label,
  size = "small"
}: AppSegmentedControlProps) => {
  return (
    <SegmentedControl
      style={{
        height: size === "small" ? 32 : 44,
        elevation: 0
      }}
      sliderStyle={{
        backgroundColor: "white",
        elevation: 0
      }}
      backgroundColor="#f3f4f6"
      fontStyle={{
        color: "#333"
      }}
      activeFontStyle={{
        color: "#333"
      }}
      values={label || values}
      selectedIndex={segmentIndex}
      onChange={(event) => {
        setSegmentIndex(event.nativeEvent.selectedSegmentIndex);
        onChange?.(event.nativeEvent.selectedSegmentIndex);
      }}
    />
  );
};

export default AppSegmentedControl;


``


## File: .\src\components\common\AppText.tsx


``tsx

import { cn } from "@/utils/utils";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

// Define possible font weights
export type FontWeight = "300" | "400" | "500" | "600" | "700";

// Map weights to Inter fonts
const fontMap: Record<FontWeight, string> = {
  "300": "Inter_300Light",
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_700Bold",
};

// Typed color system
type AppColor =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | `#${string}`; // any hex color

const colorMap: Record<Exclude<AppColor, `#${string}`>, string> = {
  primary: "text-[#333333]",
  secondary: "text-[#9ca3af]",
  danger: "text-[#e05252]",
  success: "text-[#34C759]",
  warning: "text-[#FFCC00]",
};

interface AppTextProps extends TextProps {
  weight?: FontWeight;
  type?: AppColor;
}

export default function AppText({
  weight = "400",
  type = "primary",
  style,
  className,
  ...props
}: AppTextProps) {
  const fontFamily = fontMap[weight];

  const resolvedColor = type.startsWith("#")
    ? type
    : colorMap[type as keyof typeof colorMap];

  return (
    <Text
      {...props}
      className={cn(`${resolvedColor}`, className)}
      style={[{ fontFamily } as TextStyle, style]}
    />
  );
}


``


## File: .\src\components\common\ModalWithSafeArea.tsx


``tsx

import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ModalProps,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ModalWithSafeArea = ({ children, ...modalProps }: ModalProps) => {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = Dimensions.get("window");

  // If callers request "slide", do a smoother translateY animation ourselves.
  const shouldAnimateSlide = modalProps.animationType === "slide";
  const requestedVisible = !!modalProps.visible;
  const [rendered, setRendered] = React.useState(requestedVisible);
  const translateY = React.useRef(new Animated.Value(windowHeight)).current;

  React.useEffect(() => {
    if (!shouldAnimateSlide) return;

    if (requestedVisible) {
      setRendered(true);
      translateY.setValue(windowHeight);
      // Smooth spring from bottom to top that takes a bit of time to settle perfectly
      Animated.spring(translateY, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true
      }).start();
      return;
    }

    // Closing: keep mounted, slide down, then unmount.
    Animated.timing(translateY, {
      toValue: windowHeight,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(({ finished }) => {
      if (finished) setRendered(false);
    });
  }, [requestedVisible, shouldAnimateSlide, translateY, windowHeight]);

  return (
    <Modal
      {...modalProps}
      visible={shouldAnimateSlide ? rendered : modalProps.visible}
      animationType={shouldAnimateSlide ? "none" : modalProps.animationType}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1
          }}
        >
          {shouldAnimateSlide ? (
            <Animated.View
              style={{
                flex: 1,
                transform: [{ translateY }]
              }}
            >
              {children}
            </Animated.View>
          ) : (
            children
          )}
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ModalWithSafeArea;


``


## File: .\src\components\common\SegmentedTabs.tsx


``tsx

import React from "react";
import { View } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

interface SegmentedTabsProps {
  /** Array of tab labels to display */
  values: string[];
  /** Currently selected tab index */
  selectedIndex: number;
  /** Callback when a tab is selected */
  onChange: (index: number) => void;
  /** Active tab tint color (default: #1E293B) */
  activeTintColor?: string;
  /** Active tab background color (default: white) */
  activeBackgroundColor?: string;
  /** Inactive text color (default: #94A3B8) */
  inactiveTintColor?: string;
  /** Background color of the control (default: #F1F5F9) */
  backgroundColor?: string;
}

/**
 * Reusable segmented tab control built on top of
 * @react-native-segmented-control/segmented-control.
 *
 * Usage:
 * ```tsx
 * <SegmentedTabs
 *   values={["Tab A", "Tab B"]}
 *   selectedIndex={activeIndex}
 *   onChange={setActiveIndex}
 * />
 * ```
 */
export default function SegmentedTabs({
  values,
  selectedIndex,
  onChange,
  activeTintColor = "#1E293B",
  activeBackgroundColor = "#FFFFFF",
  inactiveTintColor = "#94A3B8",
  backgroundColor = "#F1F5F9",
}: SegmentedTabsProps) {
  return (
    <View className="mx-5 mt-2 mb-4">
      <SegmentedControl
        values={values}
        selectedIndex={selectedIndex}
        onChange={(event) => onChange(event.nativeEvent.selectedSegmentIndex)}
        style={{ height: 44, borderRadius: 14 }}
        backgroundColor={backgroundColor}
        tintColor={activeBackgroundColor}
        fontStyle={{
          fontWeight: "800",
          fontSize: 13,
          color: inactiveTintColor,
        }}
        activeFontStyle={{
          fontWeight: "900",
          fontSize: 13,
          color: activeTintColor,
        }}
      />
    </View>
  );
}


``


## File: .\src\components\forms\ChildDeathModal.tsx


``tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { Calendar, Edit, Save, X, Check } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from 'expo-crypto';
import { createChildDeath } from "../../hooks/database/models/ChildDeathModel";
import { ChildDeathStoreType } from "../../hooks/database/types/childDeathModal";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";

interface ChildDeathModalProps {
  visible: boolean;
  onClose: () => void;
  record: HmisRecordStoreType;
  onSuccess: (updatedDeath: ChildDeathStoreType) => void;
  showToast: (msg: string) => void;
}

export default function ChildDeathModal({ visible, onClose, record, onSuccess, showToast }: ChildDeathModalProps) {
  // Form values
  const [childName, setChildName] = useState('');
  const [deathAgeMonths, setDeathAgeMonths] = useState(1);
  const [birthDay, setBirthDay] = useState(new Date().getDate());
  const [birthMonth, setBirthMonth] = useState(new Date().getMonth() + 1);
  const [birthYear, setBirthYear] = useState(new Date().getFullYear());
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [causeOfDeathOther, setCauseOfDeathOther] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [remarks, setRemarks] = useState('');

  // Inline errors
  const [errChildName, setErrChildName] = useState(false);
  const [errCauseOfDeath, setErrCauseOfDeath] = useState(false);
  const [errGender, setErrGender] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDay(selectedDate.getDate());
      setBirthMonth(selectedDate.getMonth() + 1);
      setBirthYear(selectedDate.getFullYear());
    }
  };

  const handleSave = async () => {
    let hasError = false;

    if (!childName.trim()) { setErrChildName(true); hasError = true; } else { setErrChildName(false); }
    if (!causeOfDeath) { setErrCauseOfDeath(true); hasError = true; } else { setErrCauseOfDeath(false); }
    if (!gender) { setErrGender(true); hasError = true; } else { setErrGender(false); }

    if (hasError) return;

    try {
      const payload = {
        id: Crypto.randomUUID(),
        mother_id: record.id,
        mother_name: record.mother_name,
        child_name: childName,
        birth_day: birthDay,
        birth_month: birthMonth,
        birth_year: birthYear,
        death_age_months: deathAgeMonths,
        cause_of_death: causeOfDeath === 'Other' ? causeOfDeathOther : causeOfDeath,
        gender: gender,
        remarks: remarks,
      } as any;

      await createChildDeath(payload);
      showToast("बाल मृत्यु विवरण सुरक्षित गरियो ।");
      
      // Reset form fields
      setChildName('');
      setDeathAgeMonths(1);
      setBirthDay(new Date().getDate());
      setBirthMonth(new Date().getMonth() + 1);
      setBirthYear(new Date().getFullYear());
      setCauseOfDeath('');
      setCauseOfDeathOther('');
      setGender('');
      setRemarks('');
      setErrChildName(false);
      setErrCauseOfDeath(false);
      setErrGender(false);

      onSuccess(payload as ChildDeathStoreType);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  const FieldLabel = ({ label, hasError, required = true }: { label: string; hasError: boolean; required?: boolean }) => (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-[13px] text-slate-700 font-medium">{label} {required && <Text className="text-red-500">*</Text>}</Text>
      {hasError && (
        <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
          <Text className="text-red-500 text-[10px] font-bold uppercase">Required</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-white shadow-sm shadow-slate-200">
          <Text className="text-slate-900 text-[17px] font-bold">२८ दिन देखि ५९ महिना सम्मका बाल मृत्यु विवरण</Text>
          <Pressable onPress={onClose} className="bg-slate-100 p-1 rounded-full">
            <X size={18} color="#64748B" />
          </Pressable>
        </View>

        {/* Progress bar indicator */}
        <View className="h-[3px] bg-blue-100 w-full">
           <View className="h-full bg-[#0056D2]" style={{ width: '100%' }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 flex-1 mt-4">
          <View className="gap-y-6 pb-12">
            
            {/* Child Name */}
            <View>
              <FieldLabel label="मृतक बच्चाको नाम" hasError={errChildName} />
              <TextInput
                placeholder="बच्चाको नाम लेख्नुहोस्..."
                placeholderTextColor="#94A3B8"
                className={`bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errChildName ? 'border-red-400' : 'border-slate-200'}`}
                onChangeText={(v) => { setChildName(v); if (v.trim()) setErrChildName(false); }}
                value={childName}
              />
            </View>

            {/* Gender */}
            <View>
              <FieldLabel label="बच्चाको लिङ्ग (Gender)" hasError={errGender} />
              <View className="flex-row gap-x-4">
                {[
                  { v: 'Male', l: 'छोरा (Male)' },
                  { v: 'Female', l: 'छोरी (Female)' }
                ].map((g) => (
                  <Pressable
                    key={g.v}
                    onPress={() => { setGender(g.v as any); setErrGender(false); }}
                    className={`flex-1 p-3.5 rounded-xl border flex-row items-center justify-between ${gender === g.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errGender ? 'border-red-400 bg-white' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[13px] font-medium ${gender === g.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{g.l}</Text>
                    <View className={`w-5 h-5 rounded-full border-2 ${gender === g.v ? 'bg-[#0056D2] border-[#0056D2]' : 'border-slate-300'} items-center justify-center`}>
                      {gender === g.v && <Check size={12} color="white" strokeWidth={3} />}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Birth Date */}
            <View>
              <FieldLabel label="बच्चा जन्मेको मिति (Birth Date)" hasError={false} />
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-slate-200 p-3.5 rounded-xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Calendar size={18} color="#0056D2" />
                  <Text className="text-slate-800 text-[14px] ml-3">
                    {birthDay}/{birthMonth}/{birthYear}
                  </Text>
                </View>
                <View className="bg-blue-50 p-2 rounded-lg">
                  <Edit size={14} color="#0056D2" />
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(birthYear, birthMonth - 1, birthDay)}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Age at Death */}
            <View>
              <FieldLabel label="मृत्यु हुँदा बच्चाको उमेर (महिनामा)" hasError={false} required={false} />
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-1 justify-between">
                <TextInput
                  keyboardType="numeric"
                  className="font-medium text-[#0056D2] text-[15px] py-2.5 flex-1"
                  onChangeText={(v) => setDeathAgeMonths(parseInt(v) || 0)}
                  value={deathAgeMonths?.toString() || ''}
                />
                <Text className="text-slate-500 text-[13px]">महिना (Months)</Text>
              </View>
              <Text className="text-slate-400 text-[10px] mt-1.5 ml-1 italic font-medium">
                Note: This should be between 1 to 59 months.
              </Text>
            </View>

            {/* Cause of Death */}
            <View>
              <FieldLabel label="मृत्युको सम्भाव्य कारण" hasError={errCauseOfDeath} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { v: 'Pneumonia', l: 'न्युमोनिया (Pneumonia)' },
                  { v: 'Diarrhea', l: 'पखाला (Diarrhea)' },
                  { v: 'Malnutrition', l: 'कुपोषण (Malnutrition)' },
                  { v: 'Other', l: 'अन्य (Other)' }
                ].map((c) => (
                  <Pressable
                    key={c.v}
                    onPress={() => { setCauseOfDeath(c.v); setErrCauseOfDeath(false); }}
                    className={`w-[48%] p-3.5 rounded-xl border flex-row items-center justify-between min-h-[70px] ${causeOfDeath === c.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errCauseOfDeath ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium leading-relaxed ${causeOfDeath === c.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{c.l}</Text>
                    {causeOfDeath === c.v ? (
                      <View className="w-5 h-5 rounded-full bg-[#0056D2] items-center justify-center">
                        <Check size={12} color="white" strokeWidth={3} />
                      </View>
                    ) : (
                      <View className={`w-5 h-5 rounded-full border-2 ${errCauseOfDeath ? 'border-red-300' : 'border-slate-300'}`} />
                    )}
                  </Pressable>
                ))}
              </View>
              {causeOfDeath === 'Other' && (
                <TextInput
                  placeholder="कारण खुलाउनुहोस् (Specify)..."
                  className="mt-3 bg-white border border-slate-200 p-3.5 rounded-xl text-slate-900 text-[13px]"
                  onChangeText={setCauseOfDeathOther}
                  value={causeOfDeathOther}
                />
              )}
            </View>

            {/* Remarks */}
            <View>
              <FieldLabel label="कैफियत (Remarks)" hasError={false} required={false} />
              <TextInput
                placeholder="Remarks..."
                className="bg-white border border-slate-200 p-4 rounded-xl text-slate-900 min-h-[100px]"
                multiline
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                onChangeText={setRemarks}
                value={remarks}
              />
            </View>

          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-4 bg-white border-t border-slate-100">
          <Pressable
            onPress={handleSave}
            className="bg-[#0056D2] w-full py-4 rounded-full flex-row items-center justify-center shadow-lg shadow-blue-200"
          >
            <Save size={18} color="white" />
            <Text className="text-white font-bold text-[15px] ml-2">विवरण सुरक्षित गर्नुहोस् (Save Record)</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}


``


## File: .\src\components\forms\MaternalDeathModal.tsx


``tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { Calendar, Edit, X, Save, ArrowLeft, Check } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from 'expo-crypto';
import { createMaternalDeath } from "../../hooks/database/models/MaternalDeathModel";
import { MaternalDeathStoreType } from "../../hooks/database/types/maternalDeathModal";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";

interface MaternalDeathModalProps {
  visible: boolean;
  onClose: () => void;
  record: HmisRecordStoreType;
  onSuccess: (updatedDeath: MaternalDeathStoreType) => void;
  showToast: (msg: string) => void;
}

export default function MaternalDeathModal({ visible, onClose, record, onSuccess, showToast }: MaternalDeathModalProps) {
  // Form values
  const [deathCondition, setDeathCondition] = useState('');
  const [deathConditionOther, setDeathConditionOther] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [deliveryPlaceOther, setDeliveryPlaceOther] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [deathPlaceOther, setDeathPlaceOther] = useState('');

  const [deathDay, setDeathDay] = useState(new Date().getDate());
  const [deathMonth, setDeathMonth] = useState(new Date().getMonth() + 1);
  const [deathYear, setDeathYear] = useState(2081);
  const [remarks, setRemarks] = useState('');

  // Inline errors
  const [errDeathCondition, setErrDeathCondition] = useState(false);
  const [errDeathConditionOther, setErrDeathConditionOther] = useState(false);
  const [errDeliveryPlace, setErrDeliveryPlace] = useState(false);
  const [errDeliveryPlaceOther, setErrDeliveryPlaceOther] = useState(false);
  const [errDeathPlace, setErrDeathPlace] = useState(false);
  const [errDeathPlaceOther, setErrDeathPlaceOther] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeathDay(selectedDate.getDate());
      setDeathMonth(selectedDate.getMonth() + 1);
      setDeathYear(selectedDate.getFullYear());
    }
  };

  const handleSaveMaternalDeath = async () => {
    let hasError = false;

    if (!deathCondition) { setErrDeathCondition(true); hasError = true; } else { setErrDeathCondition(false); }
    if (deathCondition === 'Other' && !deathConditionOther.trim()) { setErrDeathConditionOther(true); hasError = true; } else { setErrDeathConditionOther(false); }
    if (!deliveryPlace) { setErrDeliveryPlace(true); hasError = true; } else { setErrDeliveryPlace(false); }
    if (deliveryPlace === 'Other' && !deliveryPlaceOther.trim()) { setErrDeliveryPlaceOther(true); hasError = true; } else { setErrDeliveryPlaceOther(false); }
    if (!deathPlace) { setErrDeathPlace(true); hasError = true; } else { setErrDeathPlace(false); }
    if (deathPlace === 'Other' && !deathPlaceOther.trim()) { setErrDeathPlaceOther(true); hasError = true; } else { setErrDeathPlaceOther(false); }

    if (hasError) return;

    try {
      const payload = {
        id: Crypto.randomUUID(),
        mother_id: record.id,
        mother_name: record.mother_name,
        mother_age: record.mother_age,
        death_condition: deathCondition,
        death_condition_other: deathConditionOther,
        delivery_place: deliveryPlace,
        delivery_place_other: deliveryPlaceOther,
        death_place: deathPlace,
        death_place_other: deathPlaceOther,
        death_day: deathDay,
        death_month: deathMonth,
        death_year: deathYear,
        remarks: remarks,
      } as any;

      await createMaternalDeath(payload);
      showToast("Maternal death record updated successfully.");

      // Reset form fields
      setDeathCondition('');
      setDeathConditionOther('');
      setDeliveryPlace('');
      setDeliveryPlaceOther('');
      setDeathPlace('');
      setDeathPlaceOther('');
      setDeathDay(new Date().getDate());
      setDeathMonth(new Date().getMonth() + 1);
      setDeathYear(2081);
      setRemarks('');
      
      // Reset errors
      setErrDeathCondition(false);
      setErrDeathConditionOther(false);
      setErrDeliveryPlace(false);
      setErrDeliveryPlaceOther(false);
      setErrDeathPlace(false);
      setErrDeathPlaceOther(false);

      onSuccess(payload as MaternalDeathStoreType);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  // Helper: renders a field label row with optional REQUIRED badge
  const FieldLabel = ({ label, hasError }: { label: string; hasError: boolean }) => (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-[13px] text-slate-700 font-medium">{label} <Text className="text-red-500">*</Text></Text>
      {hasError && (
        <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
          <Text className="text-red-500 text-[10px] font-bold uppercase">Required</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <View className="flex-row items-center justify-between p-4 bg-white">
          {/* <Pressable onPress={onClose}>
            <ArrowLeft size={24} color="#0056D2" />
          </Pressable> */}
          <Text className="text-slate-900 text-[17px] font-bold">मातृ मृत्यु विवरण</Text>
          <Pressable onPress={onClose} className="bg-slate-100 p-1 rounded-full">
            <X size={18} color="#64748B" />
          </Pressable>
        </View>
        {/* Progress bar */}
        <View className="h-[3px] bg-blue-100 w-full mb-2">
          <View className="h-full bg-[#0056D2]" style={{ width: '100%' }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 flex-1 mt-2">
          <View className="gap-y-6 pb-6">

            {/* Death Date */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">मृत्यु भएको मिति (Date of Death)</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-white border border-slate-200 p-3.5 rounded-xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Calendar size={18} color="#0056D2" />
                  <Text className="text-slate-800 text-[14px] ml-3">
                    {deathDay}/{deathMonth}/{deathYear}
                  </Text>
                </View>
                <View className="bg-blue-50 p-2 rounded-lg">
                  <Edit size={14} color="#0056D2" />
                </View>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date(deathYear, deathMonth - 1, deathDay)}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Condition of Death */}
            <View>
              <FieldLabel label="मृत्यु हुँदाको अवस्था (Condition of Death)" hasError={errDeathCondition} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { value: 'Pregnant', label: 'गर्भवती (Pregnant)' },
                  { value: 'Labor', label: 'सुत्केरी व्यथा (Labor)' },
                  { value: 'Post_delivery', label: 'सुत्केरी (Postpartum)' },
                  { value: 'Other', label: 'अन्य (Other)' }
                ].map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => { setDeathCondition(c.value); setErrDeathCondition(false); }}
                    className={`w-[48%] p-3.5 rounded-xl border flex-row items-center justify-between min-h-[70px] ${deathCondition === c.value
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errDeathCondition ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium leading-relaxed ${deathCondition === c.value ? 'text-[#0056D2]' : 'text-slate-500'}`}>{c.label}</Text>
                    {deathCondition === c.value ? (
                      <View className="w-5 h-5 rounded-full bg-[#0056D2] items-center justify-center">
                        <Check size={12} color="white" strokeWidth={3} />
                      </View>
                    ) : (
                      <View className={`w-5 h-5 rounded-full border-2 ${errDeathCondition ? 'border-red-300' : 'border-slate-300'}`} />
                    )}
                  </Pressable>
                ))}
              </View>
              {deathCondition === 'Other' && (
                <TextInput
                  placeholder="अवस्था खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errDeathConditionOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setDeathConditionOther(v); if (v.trim()) setErrDeathConditionOther(false); }}
                  value={deathConditionOther}
                />
              )}
              {errDeathConditionOther && (
                <Text className="text-red-500 text-[11px] mt-1">अवस्था खुलाउनुहोस् (Please specify).</Text>
              )}
            </View>

            {/* Delivery Place */}
            <View>
              <FieldLabel label="प्रसूति भएको स्थान (Delivery Place)" hasError={errDeliveryPlace} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { value: 'Home', label: 'घर' },
                  { value: 'Institution', label: 'संस्था' },
                  { value: 'Other', label: 'अन्य' }
                ].map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => { setDeliveryPlace(c.value); setErrDeliveryPlace(false); }}
                    className={`w-[31%] p-3.5 rounded-xl border items-center justify-center ${deliveryPlace === c.value
                      ? 'bg-[#0056D2] border-[#0056D2]'
                      : errDeliveryPlace ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium text-center ${deliveryPlace === c.value ? 'text-white' : 'text-slate-500'}`}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
              {deliveryPlace === 'Other' && (
                <TextInput
                  placeholder="स्थान खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errDeliveryPlaceOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setDeliveryPlaceOther(v); if (v.trim()) setErrDeliveryPlaceOther(false); }}
                  value={deliveryPlaceOther}
                />
              )}
              {errDeliveryPlaceOther && (
                <Text className="text-red-500 text-[11px] mt-1">स्थान खुलाउनुहोस् (Please specify).</Text>
              )}
            </View>

            {/* Death Place */}
            <View>
              <FieldLabel label="मृत्यु भएको स्थान (Death Place)" hasError={errDeathPlace} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { value: 'Home', label: 'घर' },
                  { value: 'Institution', label: 'संस्था' },
                  { value: 'Other', label: 'अन्य' }
                ].map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => { setDeathPlace(c.value); setErrDeathPlace(false); }}
                    className={`w-[31%] p-3.5 rounded-xl border items-center justify-center ${deathPlace === c.value
                      ? 'bg-[#0056D2] border-[#0056D2]'
                      : errDeathPlace ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium text-center ${deathPlace === c.value ? 'text-white' : 'text-slate-500'}`}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
              {deathPlace === 'Other' && (
                <TextInput
                  placeholder="स्थान खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errDeathPlaceOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setDeathPlaceOther(v); if (v.trim()) setErrDeathPlaceOther(false); }}
                  value={deathPlaceOther}
                />
              )}
              {errDeathPlaceOther && (
                <Text className="text-red-500 text-[11px] mt-1">स्थान खुलाउनुहोस् (Please specify).</Text>
              )}
            </View>

            {/* Remarks */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">कैफियत (Remarks)</Text>
              <TextInput
                placeholder="Remarks..."
                className="bg-white border border-slate-200 p-4 rounded-xl text-slate-900 min-h-[80px]"
                multiline
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                onChangeText={setRemarks}
                value={remarks}
              />
            </View>

          </View>
        </ScrollView>

        <View className="p-4 bg-white border-t border-slate-100">
          <Pressable
            onPress={handleSaveMaternalDeath}
            className="bg-[#0056D2] w-full py-4 rounded-full flex-row items-center justify-center mt-1 mb-1"
          >
            <Save size={18} color="white" />
            <Text className="text-white font-bold text-[15px] ml-2">विवरण सुरक्षित गर्नुहोस् (Save Record)</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}


``


## File: .\src\components\forms\NewbornDeathModal.tsx


``tsx

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Modal,
  TextInput,
  Alert
} from "react-native";
import { Calendar, Edit, Save, ArrowLeft, X, Check } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Crypto from 'expo-crypto';
import { createNewbornDeath } from "../../hooks/database/models/NewbornDeathModel";
import { NewbornDeathStoreType } from "../../hooks/database/types/newbornDeathModal";
import { HmisRecordStoreType } from "../../hooks/database/types/hmisRecordModal";

interface NewbornDeathModalProps {
  visible: boolean;
  onClose: () => void;
  record: HmisRecordStoreType;
  onSuccess: (updatedDeath: NewbornDeathStoreType) => void;
  showToast: (msg: string) => void;
}

export default function NewbornDeathModal({ visible, onClose, record, onSuccess, showToast }: NewbornDeathModalProps) {
  // Form values
  const [babyName, setBabyName] = useState('');
  const [deliveryPlace, setDeliveryPlace] = useState('');
  const [deliveryPlaceOther, setDeliveryPlaceOther] = useState('');
  const [birthCondition, setBirthCondition] = useState('');
  const [birthConditionOther, setBirthConditionOther] = useState('');
  const [causeOfDeath, setCauseOfDeath] = useState('');
  const [causeOfDeathOther, setCauseOfDeathOther] = useState('');
  const [deathPlace, setDeathPlace] = useState('');
  const [deathPlaceOther, setDeathPlaceOther] = useState('');
  const [deathAgeDays, setDeathAgeDays] = useState(1);
  const [birthDay, setBirthDay] = useState(new Date().getDate());
  const [birthMonth, setBirthMonth] = useState(new Date().getMonth() + 1);
  const [birthYear, setBirthYear] = useState(2081);
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [remarks, setRemarks] = useState('');

  // Inline errors
  const [errDeliveryPlace, setErrDeliveryPlace] = useState(false);
  const [errDeliveryPlaceOther, setErrDeliveryPlaceOther] = useState(false);
  const [errBirthCondition, setErrBirthCondition] = useState(false);
  const [errBirthConditionOther, setErrBirthConditionOther] = useState(false);
  const [errCauseOfDeath, setErrCauseOfDeath] = useState(false);
  const [errCauseOfDeathOther, setErrCauseOfDeathOther] = useState(false);
  const [errDeathPlace, setErrDeathPlace] = useState(false);
  const [errDeathPlaceOther, setErrDeathPlaceOther] = useState(false);
  const [errGender, setErrGender] = useState(false);

  const [showNewbornDatePicker, setShowNewbornDatePicker] = useState(false);

  const onNewbornDateChange = (event: any, selectedDate?: Date) => {
    setShowNewbornDatePicker(false);
    if (selectedDate) {
      setBirthDay(selectedDate.getDate());
      setBirthMonth(selectedDate.getMonth() + 1);
      setBirthYear(selectedDate.getFullYear());
    }
  };

  const handleSaveNewbornDeath = async () => {
    let hasError = false;

    if (!deliveryPlace) { setErrDeliveryPlace(true); hasError = true; } else { setErrDeliveryPlace(false); }
    if (deliveryPlace === 'Other' && !deliveryPlaceOther.trim()) { setErrDeliveryPlaceOther(true); hasError = true; } else { setErrDeliveryPlaceOther(false); }
    if (!birthCondition) { setErrBirthCondition(true); hasError = true; } else { setErrBirthCondition(false); }
    if (birthCondition === 'Other' && !birthConditionOther.trim()) { setErrBirthConditionOther(true); hasError = true; } else { setErrBirthConditionOther(false); }
    if (!causeOfDeath) { setErrCauseOfDeath(true); hasError = true; } else { setErrCauseOfDeath(false); }
    if (causeOfDeath === 'Other' && !causeOfDeathOther.trim()) { setErrCauseOfDeathOther(true); hasError = true; } else { setErrCauseOfDeathOther(false); }
    if (!deathPlace) { setErrDeathPlace(true); hasError = true; } else { setErrDeathPlace(false); }
    if (deathPlace === 'Other' && !deathPlaceOther.trim()) { setErrDeathPlaceOther(true); hasError = true; } else { setErrDeathPlaceOther(false); }
    if (!gender) { setErrGender(true); hasError = true; } else { setErrGender(false); }

    if (hasError) return;

    try {
      const payload = {
        id: Crypto.randomUUID(),
        mother_id: record.id,
        mother_name: record.mother_name,
        baby_name: babyName,
        delivery_place: deliveryPlace,
        delivery_place_other: deliveryPlaceOther,
        birth_condition: birthCondition,
        birth_condition_other: birthConditionOther,
        cause_of_death: causeOfDeath,
        cause_of_death_other: causeOfDeathOther,
        death_place: deathPlace,
        death_place_other: deathPlaceOther,
        death_age_days: deathAgeDays,
        birth_day: birthDay,
        birth_month: birthMonth,
        birth_year: birthYear,
        gender: gender,
        remarks: remarks,
      } as any;

      await createNewbornDeath(payload);
      showToast("Newborn death record updated successfully.");

      // Reset form fields
      setBabyName('');
      setDeliveryPlace('');
      setDeliveryPlaceOther('');
      setBirthCondition('');
      setBirthConditionOther('');
      setCauseOfDeath('');
      setCauseOfDeathOther('');
      setDeathPlace('');
      setDeathPlaceOther('');
      setDeathAgeDays(1);
      setBirthDay(new Date().getDate());
      setBirthMonth(new Date().getMonth() + 1);
      setBirthYear(2081);
      setGender('');
      setRemarks('');
      
      // Reset errors
      setErrDeliveryPlace(false);
      setErrDeliveryPlaceOther(false);
      setErrBirthCondition(false);
      setErrBirthConditionOther(false);
      setErrCauseOfDeath(false);
      setErrCauseOfDeathOther(false);
      setErrDeathPlace(false);
      setErrDeathPlaceOther(false);
      setErrGender(false);

      onSuccess(payload as NewbornDeathStoreType);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save record.");
    }
  };

  // Reusable field label with inline REQUIRED badge
  const FieldLabel = ({ label, hasError }: { label: string; hasError: boolean }) => (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-[13px] text-slate-700 font-medium">{label} <Text className="text-red-500">*</Text></Text>
      {hasError && (
        <View className="bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
          <Text className="text-red-500 text-[10px] font-bold uppercase">Required</Text>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-[#F8FAFC]">
        <View className="flex-row items-center justify-between p-4 bg-white">
          {/* <Pressable onPress={onClose}>
            <ArrowLeft size={24} color="#0056D2" />
          </Pressable> */}
          <Text className="text-slate-900 text-[17px] font-bold">नवजात शिशु मृत्यु विवरण</Text>
          <Pressable onPress={onClose} className="bg-slate-100 p-1 rounded-full">
            <X size={18} color="#64748B" />
          </Pressable>
        </View>
        {/* Progress bar */}
        <View className="h-[3px] bg-blue-100 w-full mb-2">
          <View className="h-full bg-[#0056D2]" style={{ width: '100%' }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="px-6 flex-1 mt-2">
          <View className="gap-y-6 pb-6">

            {/* Baby Name */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">
                मृतक नवजात शिशुको नाम <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="शिशुको नाम लेख्नुहोस्..."
                placeholderTextColor="#94A3B8"
                className="bg-white border border-slate-200 p-3.5 rounded-xl text-slate-900 text-[13px]"
                onChangeText={setBabyName}
                value={babyName}
              />
            </View>

            {/* Gender */}
            <View>
              <FieldLabel label="बच्चाको लिङ्ग (Gender)" hasError={errGender} />
              <View className="flex-row gap-x-4">
                {[
                  { v: 'Male', l: 'छोरा (Male)' },
                  { v: 'Female', l: 'छोरी (Female)' }
                ].map((g) => (
                  <Pressable
                    key={g.v}
                    onPress={() => { setGender(g.v as any); setErrGender(false); }}
                    className={`flex-1 p-3.5 rounded-xl border flex-row items-center justify-between ${gender === g.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errGender ? 'border-red-400 bg-white' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[13px] font-medium ${gender === g.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{g.l}</Text>
                    <View className={`w-5 h-5 rounded-full border-2 ${gender === g.v ? 'bg-[#0056D2] border-[#0056D2]' : 'border-slate-300'} items-center justify-center`}>
                      {gender === g.v && <Check size={12} color="white" strokeWidth={3} />}
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Birth Date */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">जन्म मिति (Birth Date) <Text className="text-red-500">*</Text></Text>
              <Pressable
                onPress={() => setShowNewbornDatePicker(true)}
                className="bg-white border border-slate-200 p-3.5 rounded-xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center">
                  <Calendar size={18} color="#0056D2" />
                  <Text className="text-slate-800 text-[14px] ml-3">
                    {birthDay}/{birthMonth}/{birthYear}
                  </Text>
                </View>
                <View className="bg-blue-50 p-2 rounded-lg">
                  <Edit size={14} color="#0056D2" />
                </View>
              </Pressable>
              {showNewbornDatePicker && (
                <DateTimePicker
                  value={new Date(birthYear, birthMonth - 1, birthDay)}
                  mode="date"
                  display="default"
                  onChange={onNewbornDateChange}
                />
              )}
            </View>

            {/* Birth Place */}
            <View>
              <FieldLabel label="जन्मस्थान (Birth Place)" hasError={errDeliveryPlace} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { value: 'Home', label: 'घर' },
                  { value: 'Institution', label: 'संस्था' },
                  { value: 'Other', label: 'अन्य' }
                ].map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => { setDeliveryPlace(c.value); setErrDeliveryPlace(false); }}
                    className={`w-[31%] p-3.5 rounded-xl border items-center justify-center ${deliveryPlace === c.value
                      ? 'bg-[#0056D2] border-[#0056D2]'
                      : errDeliveryPlace ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium text-center ${deliveryPlace === c.value ? 'text-white' : 'text-slate-500'}`}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
              {deliveryPlace === 'Other' && (
                <TextInput
                  placeholder="स्थान खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errDeliveryPlaceOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setDeliveryPlaceOther(v); if (v.trim()) setErrDeliveryPlaceOther(false); }}
                  value={deliveryPlaceOther}
                />
              )}
              {errDeathPlaceOther && (
                <Text className="text-red-500 text-[11px] mt-1">स्थान खुलाउनुहोस् (Please specify).</Text>
              )}
            </View>



            {/* Birth Condition */}
            <View>
              <FieldLabel label="जन्मको अवस्था (Birth Condition)" hasError={errBirthCondition} />
              <View className="flex-row flex-wrap gap-2.5">
                {[
                  { v: 'Preterm', l: 'समय नपुगेको (Preterm)' },
                  { v: 'LowWeight', l: 'कम तौल (Low Weight)' },
                  { v: 'Normal', l: 'सामान्य (Normal)' },
                  { v: 'Other', l: 'अन्य (Other)' }
                ].map((c) => (
                  <Pressable
                    key={c.v}
                    onPress={() => { setBirthCondition(c.v); setErrBirthCondition(false); }}
                    className={`px-4 py-2.5 rounded-full border ${birthCondition === c.v
                      ? 'bg-[#0056D2] border-[#0056D2]'
                      : errBirthCondition ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium ${birthCondition === c.v ? 'text-white' : 'text-slate-600'}`}>{c.l}</Text>
                  </Pressable>
                ))}
              </View>
              {birthCondition === 'Other' && (
                <TextInput
                  placeholder="अवस्था खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errBirthConditionOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setBirthConditionOther(v); if (v.trim()) setErrBirthConditionOther(false); }}
                  value={birthConditionOther}
                />
              )}
              {errBirthConditionOther && <Text className="text-red-500 text-[11px] mt-1">अवस्था खुलाउनुहोस् (Please specify).</Text>}
            </View>

            {/* Age at Death */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">मृत्यु भएको उमेर (Age at Death in days)</Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-4 py-1 justify-between">
                <TextInput
                  keyboardType="numeric"
                  className="font-medium text-[#0056D2] text-[15px] py-2.5 flex-1"
                  onChangeText={(v) => setDeathAgeDays(parseInt(v) || 0)}
                  value={deathAgeDays?.toString() || ''}
                />
                <Text className="text-slate-500 text-[13px]">दिन (Days)</Text>
              </View>
            </View>

            {/* Cause of Death */}
            <View>
              <FieldLabel label="सम्भावित कारण (Probable Cause)" hasError={errCauseOfDeath} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { v: 'Asphyxia', l: 'निसासिएको (Asphyxia)' },
                  { v: 'Hypothermia', l: 'शितलहर (Hypothermia)' },
                  { v: 'Infection', l: 'संक्रमण (Infection)' },
                  { v: 'Other', l: 'अन्य (Other)' }
                ].map((c) => (
                  <Pressable
                    key={c.v}
                    onPress={() => { setCauseOfDeath(c.v); setErrCauseOfDeath(false); }}
                    className={`w-[48%] p-3.5 rounded-xl border flex-row items-center justify-between min-h-[70px] ${causeOfDeath === c.v
                      ? 'bg-blue-50/40 border-[#0056D2]'
                      : errCauseOfDeath ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium leading-relaxed ${causeOfDeath === c.v ? 'text-[#0056D2]' : 'text-slate-500'}`}>{c.l}</Text>
                    {causeOfDeath === c.v ? (
                      <View className="w-5 h-5 rounded-full bg-[#0056D2] items-center justify-center">
                        <Check size={12} color="white" strokeWidth={3} />
                      </View>
                    ) : (
                      <View className={`w-5 h-5 rounded-full border-2 ${errCauseOfDeath ? 'border-red-300' : 'border-slate-300'}`} />
                    )}
                  </Pressable>
                ))}
              </View>
              {causeOfDeath === 'Other' && (
                <TextInput
                  placeholder="कारण खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errCauseOfDeathOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setCauseOfDeathOther(v); if (v.trim()) setErrCauseOfDeathOther(false); }}
                  value={causeOfDeathOther}
                />
              )}
              {errCauseOfDeathOther && <Text className="text-red-500 text-[11px] mt-1">कारण खुलाउनुहोस् (Please specify).</Text>}
            </View>

            {/* Death Place */}
            <View>
              <FieldLabel label="मृत्यु भएको स्थान (Death Place)" hasError={errDeathPlace} />
              <View className="flex-row flex-wrap justify-between gap-y-3">
                {[
                  { value: 'Home', label: 'घर' },
                  { value: 'Institution', label: 'संस्था' },
                  { value: 'Other', label: 'अन्य' }
                ].map((c) => (
                  <Pressable
                    key={c.value}
                    onPress={() => { setDeathPlace(c.value); setErrDeathPlace(false); }}
                    className={`w-[31%] p-3.5 rounded-xl border items-center justify-center ${deathPlace === c.value
                      ? 'bg-[#0056D2] border-[#0056D2]'
                      : errDeathPlace ? 'bg-white border-red-300' : 'bg-white border-slate-200'
                      }`}
                  >
                    <Text className={`text-[12px] font-medium text-center ${deathPlace === c.value ? 'text-white' : 'text-slate-500'}`}>{c.label}</Text>
                  </Pressable>
                ))}
              </View>
              {deathPlace === 'Other' && (
                <TextInput
                  placeholder="स्थान खुलाउनुहोस् (Specify)..."
                  className={`mt-3 bg-white border p-3.5 rounded-xl text-slate-900 text-[13px] ${errDeathPlaceOther ? 'border-red-400' : 'border-slate-200'}`}
                  onChangeText={(v) => { setDeathPlaceOther(v); if (v.trim()) setErrDeathPlaceOther(false); }}
                  value={deathPlaceOther}
                />
              )}
              {errDeathPlaceOther && (
                <Text className="text-red-500 text-[11px] mt-1">स्थान खुलाउनुहोस् (Please specify).</Text>
              )}
            </View>

            {/* Remarks */}
            <View>
              <Text className="text-[13px] text-slate-700 mb-2 font-medium">कैफियत (Remarks)</Text>
              <TextInput
                placeholder="Remarks..."
                className="bg-white border border-slate-200 p-4 rounded-xl text-slate-900 min-h-[80px]"
                multiline
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                onChangeText={setRemarks}
                value={remarks}
              />
            </View>

          </View>
        </ScrollView>

        <View className="p-4 bg-white border-t border-slate-100">
          <Pressable
            onPress={handleSaveNewbornDeath}
            className="bg-[#0056D2] w-full py-4 rounded-full flex-row items-center justify-center mt-1 mb-1"
          >
            <Save size={18} color="white" />
            <Text className="text-white font-bold text-[15px] ml-2">विवरण सुरक्षित गर्नुहोस् (Save Record)</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}


``


## File: .\src\components\layout\FormHeader.tsx


``tsx

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronLeft, LucideIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormHeaderProps {
  title: string;
  subTitle?: string;
  rightIcon?: LucideIcon;
  rightIconColor?: string;
  rightIconBgColor?: string;
}

const FormHeader = ({
  title,
  subTitle,
  rightIcon: RightIcon,
  rightIconColor = "#EC4899",
  rightIconBgColor = "bg-pink-100",
}: FormHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white px-6 pb-8 flex flex-row justify-between items-center rounded-b-[40px] mb-6 shadow-sm border-b border-gray-50"
      style={{ paddingTop: Math.max(insets.top + 12, 24) }}
    >
      <View className="flex-row items-center flex-1">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 bg-gray-50 p-2 rounded-xl"
        >
          <ChevronLeft size={24} color="#334155" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-slate-900 leading-tight" numberOfLines={1}>
            {title}
          </Text>
          {subTitle && (
            <Text className="text-slate-500 text-sm font-medium mt-0.5" numberOfLines={1}>
              {subTitle}
            </Text>
          )}
        </View>
      </View>
      {RightIcon && (
        <View className={`w-10 h-10 ${rightIconBgColor} rounded-full items-center justify-center ml-2`}>
          <RightIcon size={20} color={rightIconColor} />
        </View>
      )}
    </View>
  );
};

export default FormHeader;


``


## File: .\src\components\layout\TopHeader.tsx


``tsx

import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { CircleUserRound } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "../../context/LanguageContext";

const TopHeader = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View className="px-6 pt-14 pb-4 flex-row justify-between items-center bg-white border-b border-gray-50">
      <View className="flex-row items-center">
        <View className="bg-blue-50 p-1 rounded-xl mr-3">
          <Image 
            source={require("../../assets/fchv-logo.png")} 
            className="w-10 h-10" 
            resizeMode="contain" 
          />
        </View>
        <View>
          <Text className="text-[#1E293B] text-[17px] font-black leading-none">
            {t('header.fchv')}
          </Text>
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">
            {t('header.community_connect')}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        onPress={() => router.push("/dashboard/profile")} 
        className="bg-gray-50 p-2 rounded-2xl"
      >
        <CircleUserRound size={22} color="#64748B" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

export default TopHeader;


``


## File: .\src\components\navigation\BottomNavigation.tsx


``tsx

import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Keyboard } from "react-native";
import { Home, Calendar, Plus, FileText, BookOpen } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import Colors from "../../constants/Colors";

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const keyboardDidShowListener = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const keyboardDidShowListener2 = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true)); // Extra safety for Android
    const keyboardDidHideListener = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    const keyboardDidHideListener2 = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidShowListener2.remove();
      keyboardDidHideListener.remove();
      keyboardDidHideListener2.remove();
    };
  }, []);

  const hiddenRoutes = ["add-record", "add-mother", "follow-up", "mother-profile", "mother-list/add-mother"];
  const isSearchActive = pathname.includes("record") && isKeyboardVisible; // Specifically hide when searching in record
  const shouldHide = hiddenRoutes.some(route => pathname.includes(route)) || isKeyboardVisible || isSearchActive;

  if (shouldHide) return null;

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/dashboard" },
    { id: "visit", label: "Visit", icon: Calendar, path: "/dashboard/visit-list" },
    { id: "record", label: "Register", icon: Plus, path: "/dashboard/record", isAction: true },
    { id: "report", label: "Report", icon: FileText, path: "/dashboard/report" },
    { id: "guide", label: "Guideline", icon: BookOpen, path: "/dashboard/learn" },
  ];

  const isActive = (path: string | null) => {
    if (!path) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex-row justify-around items-center px-2 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] pb-8 pt-2">
      {tabs.map((tab, index) => {
        const Icon = tab.icon;
        const active = isActive(tab.path);

        if (tab?.isAction) {
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => tab.path && router.push(tab.path as any)}
              className="bg-primary -mt-12 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-blue-200 border-4 border-white"
            >
              <Plus size={32} color="white" strokeWidth={3} />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => tab.path && router.push(tab.path as any)}
            className="items-center justify-center py-2 px-3 flex-1"
          >
            <View className={`p-1.5 rounded-xl ${active ? 'bg-blue-50' : 'bg-transparent'}`}>
                <Icon
                size={22}
                color={active ? Colors.primary : "#64748B"}
                strokeWidth={active ? 2.5 : 2}
                />
            </View>
            <Text
              className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${active ? "text-primary" : "text-slate-400"}`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


``


## File: .\src\components\navigation\CustomDrawer.tsx


``tsx

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { User, Globe, LogOut, X, BookOpen } from "lucide-react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "expo-router";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import ModalWithSafeArea from "../common/ModalWithSafeArea";
import DatabaseViewer from "../DatabaseViewer";

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [isDbOpen, setIsDbOpen] = useState(false);

  const handleLogout = () => {
    props.navigation.closeDrawer?.();
    router.replace("/login");
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        <TouchableOpacity
          onPress={() => props.navigation.closeDrawer()}
          className="self-end p-2 bg-gray-50 rounded-full mb-5"
        >
          <X size={20} color="#666" />
        </TouchableOpacity>

        {/* Profile Header */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 bg-emerald-50 rounded-full items-center justify-center mb-4">
            <User size={40} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-gray-900">Anita Sharma</Text>
        </View>

        {/* Drawer Items */}
        <View className="flex-1">
          <TouchableOpacity
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/dashboard/profile");
            }}
            className="flex-row items-center py-4 border-b border-gray-50"
          >
            <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-4">
              <User size={20} color="#3B82F6" />
            </View>
            <Text className="text-gray-700 font-semibold">
              {t("dashboard.drawer.profile")}
            </Text>
          </TouchableOpacity>
          <View>
            <Text>View Db</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/dashboard/change-language");
            }}
            className="flex-row items-center py-4 border-b border-gray-50"
          >
            <View className="w-10 h-10 bg-indigo-50 rounded-xl items-center justify-center mr-4">
              <Globe size={20} color="#6366F1" />
            </View>
            <Text className="text-gray-700 font-semibold">
              {t("dashboard.drawer.language")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.navigation.closeDrawer();
              router.push("/dashboard/learn");
            }}
            className="flex-row items-center py-4 border-b border-gray-50"
          >
            <View className="w-10 h-10 bg-amber-50 rounded-xl items-center justify-center mr-4">
              <BookOpen size={20} color="#F59E0B" />
            </View>
            <Text className="text-gray-700 font-semibold">
              {t("dashboard.drawer.learn")}
            </Text>
          </TouchableOpacity>
          <Pressable className="rounded-full" onPress={() => setIsDbOpen(true)}><Text className="py-2 px-3 bg-green-500 my-3 text-white rounded-full">Open DB</Text></Pressable>
          <ModalWithSafeArea
            visible={isDbOpen}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={() => setIsDbOpen(false)}
          >
            <DatabaseViewer onClose={() => setIsDbOpen(false)} />
          </ModalWithSafeArea>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center py-5 bg-red-50 rounded-3xl px-6 mb-4"
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="text-red-500 font-bold ml-4">
            {t("dashboard.drawer.logout")}
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
}


``


## File: .\src\constants\Colors.ts


``typescript

export const Colors = {
  primary: "#3B82F6",
  trust: "#22C55E",
  secondary: "#F97316",
  nepali: "#E11D48",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  textPrimary: "#1E2937",
  textSecondary: "#64748B",
};

export default Colors;


``


## File: .\src\constants\token.ts


``typescript

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";


``


## File: .\src\context\LanguageContext.tsx


``tsx

import storage from "@/utils/storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation as useI18nTranslation } from "react-i18next";
import "../i18n/config";

type Language = "en" | "np";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { t, i18n } = useI18nTranslation();
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await storage.get<Language>("language");
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        setLanguageState(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    await storage.set("language", lang);
    await i18n.changeLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};


``


## File: .\src\context\ToastContext.tsx


``tsx

import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";
import ToastMessage from "../components/ToastModal";

interface ToastOptions {
  durationMs?: number;
}

interface ToastContextType {
  showToast: (message: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [durationMs, setDurationMs] = useState(1000);

  const showToast = useCallback(
    (nextMessage: string, options?: ToastOptions) => {
      setMessage(nextMessage);
      setDurationMs(options?.durationMs ?? 1000);
      setVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastMessage
        visible={visible}
        message={message}
        setVisible={setVisible}
        durationMs={durationMs}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};


``


## File: .\src\hooks\useMother.ts


``typescript


``


## File: .\src\hooks\useOnlineStatus.ts


``typescript

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state) => {
      setIsConnected(!!state.isConnected);
    });

    // Listen to network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return { isConnected };
}


``


## File: .\src\hooks\usePregnancy.ts


``typescript

import { useState } from 'react';
import { createPregnancy, getPregnancyById, updatePregnancy } from './database/models/PregnantWomenModal';
import { CreatePregnancyPayload } from './database/types/pregnancyModal';

export const usePregnancy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addPregnancy = async (data: Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createPregnancy(data);
      return { success: true, id: result.id };
    } catch (err: any) {
      console.error('Error adding pregnancy:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getPregnancy = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await getPregnancyById(id);
    } catch (err: any) {
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const editPregnancy = async (id: string, data: Partial<CreatePregnancyPayload>) => {
    setIsLoading(true);
    setError(null);
    try {
      await updatePregnancy(id, data);
      return { success: true };
    } catch (err: any) {
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addPregnancy,
    getPregnancy,
    editPregnancy,
    isLoading,
    error,
  };
};


``


## File: .\src\hooks\useTodo.ts


``typescript

import { useState, useCallback } from 'react';
import {
  createTodo,
  getAllTodos,
  updateTodo,
  deleteTodo,
  TodoItem,
} from './database/models/TodoModel';

export const useTodo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = async (task: string) => {
    try {
      await createTodo(task);
      await fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const editTodo = async (id: string, task: string) => {
    try {
      await updateTodo(id, { task });
      await fetchTodos();
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: number) => {
    try {
      await updateTodo(id, { is_completed: currentStatus === 1 ? 0 : 1 });
      await fetchTodos();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const removeTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      await fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return {
    todos,
    loading,
    fetchTodos,
    addTodo,
    editTodo,
    toggleTodo,
    removeTodo,
  };
};


``


## File: .\src\hooks\useVisit.ts


``typescript

import { useState } from 'react';
import {
  createVisit,
  updateVisit,
  deleteVisit,
  getVisitById,
  getAllVisits,
  VisitListItem,
} from './database/models/VisitModel';
import { CreateVisitPayload } from './database/types/visitModal';

export const useVisit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addVisit = async (
    data: Omit<CreateVisitPayload, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createVisit(data);
      return { success: true, id: result.id };
    } catch (err: any) {
      console.error('Error adding visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const editVisit = async (
    id: string,
    data: Partial<CreateVisitPayload>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await updateVisit(id, data);
      return { success: true };
    } catch (err: any) {
      console.error('Error updating visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const removeVisit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteVisit(id);
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting visit:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const getVisit = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await getVisitById(id);
    } catch (err: any) {
      console.error('Error fetching visit:', err);
      setError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllVisits = async (): Promise<VisitListItem[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await getAllVisits();
    } catch (err: any) {
      console.error('Error fetching visits:', err);
      setError(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addVisit,
    editVisit,
    removeVisit,
    getVisit,
    fetchAllVisits,
    isLoading,
    error,
  };
};


``


## File: .\src\hooks\database\db.ts


``typescript

// db/index.ts
import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";
import { MIGRATIONS, SCHEMA_VERSION } from "./migrations";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Get the DB singleton (async open)
export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("myapp.db");
  }
  return dbPromise;
}

async function initSyncDefaultColumns(): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `INSERT OR IGNORE INTO sync (table_name, last_synced_at)
     VALUES (?, NULL), (?, NULL);`,
    [
      "pregnancy",
      "pregnant_women",
    ],
  );
}
                                                                                                         

async function getUserVersion(
  db: SQLite.SQLiteDatabase
): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;"
  );
  return row?.user_version ?? 0;
}

async function setUserVersion(
  db: SQLite.SQLiteDatabase,
  version: number
): Promise<void> {
  await db.execAsync(`PRAGMA user_version = ${version};`);
}


async function hasAnyUserTables(db: SQLite.SQLiteDatabase): Promise<boolean> {
  const row = await db.getFirstAsync<{ count: number }>(
    "SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'"
  );
  return (row?.count ?? 0) > 0;
}

async function applyMigrations(
  db: SQLite.SQLiteDatabase,
  fromVersion: number
): Promise<number> {
  const pending = [...MIGRATIONS]
    .sort((a, b) => a.version - b.version)
    .filter((m) => m.version > fromVersion);

  let currentVersion = fromVersion;
  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await migration.up(db);
      await setUserVersion(db, migration.version);
    });
    currentVersion = migration.version;
  }

  return currentVersion;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  const hadTables = await hasAnyUserTables(db);
  await db.execAsync(SCHEMA_SQL); // Executes all schema SQL at once

  let userVersion = await getUserVersion(db);
  if (userVersion === 0) {
    if (hadTables) {
      userVersion = await applyMigrations(db, 0);
    } else {
      await setUserVersion(db, SCHEMA_VERSION);
      userVersion = SCHEMA_VERSION;
    }
  }

  if (userVersion < SCHEMA_VERSION) {
    await applyMigrations(db, userVersion);
  }

  await initSyncDefaultColumns();
}

export async function clearDatabase(): Promise<void> {
  const db = await getDb();

  const tables = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != 'android_metadata'"
  );

  for (const table of tables) {
    await db.execAsync(`DELETE FROM ${table.name};`);
  }

  // Re-seed sync tracking so new sessions can sync without app restart.
  await initSyncDefaultColumns();

  console.log("ALL TABLE ERASED");
}


``


## File: .\src\hooks\database\migrations.ts


``typescript

import * as SQLite from "expo-sqlite";

export const SCHEMA_VERSION = 12;

type Migration = {
  version: number;
  up: (db: SQLite.SQLiteDatabase) => Promise<void>;
};

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    up: async (db) => { }
  },
  {
    version: 2,
    up: async (db) => {
      // Force table refresh for the new schema since development db may have dirty state
      await db.execAsync(`
        DROP TABLE IF EXISTS pregnancy;
        DROP TABLE IF EXISTS mother;
        DROP TABLE IF EXISTS sync;
      `);

      const { SCHEMA_SQL } = require('./schema');
      await db.execAsync(SCHEMA_SQL);
    }
  },
  {
    version: 3,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE mother ADD COLUMN photo TEXT;`);
      } catch (e) {
        console.log("Migration 3 (photo column) already applied or failed:", e);
      }
    }
  },
  {
    version: 4,
    up: async (db) => {
      try {
        await db.execAsync(`
          ALTER TABLE mother ADD COLUMN ethnicity TEXT;
          ALTER TABLE mother ADD COLUMN education TEXT;
        `);
      } catch (e) {
        console.log("Migration 4 failed or columns already exist:", e);
      }
    }
  },
  {
    version: 5,
    up: async (db) => {
      try {
        await db.execAsync(`
          DROP TABLE IF EXISTS visit;
          CREATE TABLE IF NOT EXISTS visit (
            id TEXT PRIMARY KEY,
            mother_id TEXT NOT NULL,
            name TEXT,
            address TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            visit_date TEXT NOT NULL,
            visit_type TEXT NOT NULL CHECK(visit_type IN ('ANC', 'PNC')),
            visit_notes TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 5 (visit table) failed:", e);
      }
    }
  },
  {
    version: 6,
    up: async (db) => {
      try {
        await db.execAsync(`
          ALTER TABLE mother ADD COLUMN code TEXT;
        `);
      } catch (e) {
        console.log("Migration 6 (code column) already applied or failed:", e);
      }
      try {
        await db.execAsync(`
          ALTER TABLE pregnancy ADD COLUMN mother_id TEXT;
        `);
      } catch (e) {
        console.log("Migration 6 (mother_id column) already applied or failed:", e);
      }
    }
  },
  {
    version: 7,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_record (
            id TEXT PRIMARY KEY,
            serial_no INTEGER,
            date_day INTEGER,
            date_month INTEGER,
            date_year INTEGER,
            mother_name TEXT,
            mother_age INTEGER,
            lmp_day INTEGER,
            lmp_month INTEGER,
            lmp_year INTEGER,
            edd_day INTEGER,
            edd_month INTEGER,
            edd_year INTEGER,
            counseling_given INTEGER,
            checkup_12 INTEGER,
            checkup_16 INTEGER,
            checkup_20_24 INTEGER,
            checkup_28 INTEGER,
            checkup_32 INTEGER,
            checkup_34 INTEGER,
            checkup_36 INTEGER,
            checkup_38_40 INTEGER,
            checkup_other TEXT,
            iron_preg_received INTEGER,
            iron_pnc_received INTEGER,
            vit_a_received INTEGER,
            delivery_place TEXT,
            newborn_condition TEXT,
            pnc_check_24hr INTEGER,
            pnc_check_3day INTEGER,
            pnc_check_7_14day INTEGER,
            pnc_check_42day INTEGER,
            pnc_check_other TEXT,
            family_planning_used INTEGER,
            remarks TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
        `);
      } catch (e) {
        console.log("Migration 7 (hmis_record table) failed:", e);
      }
    }
  },
  {
    version: 8,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_maternal_death (
            id TEXT PRIMARY KEY,
            mother_id TEXT,
            serial_no INTEGER,
            mother_name TEXT,
            mother_age INTEGER,
            death_condition TEXT,
            death_day INTEGER,
            death_month INTEGER,
            death_year INTEGER,
            delivery_place TEXT,
            death_place TEXT,
            remarks TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 8 (hmis_maternal_death table) failed:", e);
      }
    }
  },
  {
    version: 9,
    up: async (db) => {
      const queries = [
        "ALTER TABLE hmis_maternal_death ADD COLUMN death_condition_other TEXT;",
        "ALTER TABLE hmis_maternal_death ADD COLUMN delivery_place_other TEXT;",
        "ALTER TABLE hmis_maternal_death ADD COLUMN death_place_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN delivery_place_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN birth_condition_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN cause_of_death_other TEXT;",
        "ALTER TABLE hmis_newborn_death ADD COLUMN death_place_other TEXT;"
      ];
      for (const query of queries) {
        try {
          await db.execAsync(query);
        } catch (e) {
          console.log(`Migration 9 query failed or already applied: ${query}`, e);
        }
      }
    }
  },
  {
    version: 10,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE hmis_newborn_death ADD COLUMN baby_name TEXT;`);
      } catch (e) {
        console.log("Migration 10 (baby_name column) already applied or failed:", e);
      }
    }
  },
  {
    version: 11,
    up: async (db) => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS hmis_child_death (
            id TEXT PRIMARY KEY,
            mother_id TEXT,
            mother_name TEXT,
            child_name TEXT,
            birth_day INTEGER,
            birth_month INTEGER,
            birth_year INTEGER,
            death_age_months INTEGER,
            cause_of_death TEXT,
            remarks TEXT,
            is_synced INTEGER NOT NULL DEFAULT 0,
            is_deleted INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(mother_id) REFERENCES mother(id)
          );
        `);
      } catch (e) {
        console.log("Migration 11 (hmis_child_death table) failed:", e);
      }
    }
  },
  {
    version: 12,
    up: async (db) => {
      try {
        await db.execAsync(`ALTER TABLE hmis_newborn_death ADD COLUMN gender TEXT;`);
      } catch (e) {
        console.log("Migration 12 (gender newborn) failed:", e);
      }
      try {
        await db.execAsync(`ALTER TABLE hmis_child_death ADD COLUMN gender TEXT;`);
      } catch (e) {
        console.log("Migration 12 (gender child) failed:", e);
      }
    }
  }
];


``


## File: .\src\hooks\database\schema.ts


``typescript

export const SCHEMA_SQL = `
 PRAGMA journal_mode = WAL; -- Improves performance/concurrency

CREATE TABLE IF NOT EXISTS mother(
    id TEXT PRIMARY KEY,
    code TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    name TEXT,
    age INTEGER,
    phone TEXT,
    address TEXT,
    husband_name TEXT,
    ethnicity TEXT,
    education TEXT,
    photo TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pregnancy (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    gravida INTEGER,
    parity INTEGER,
    lmp_date TEXT NOT NULL,
    expected_delivery_date TEXT,
    is_current INTEGER NOT NULL DEFAULT 0,
    selected INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS visit (
    id TEXT PRIMARY KEY,
    mother_id TEXT NOT NULL,
    name TEXT,
    address TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    visit_date TEXT NOT NULL,
    visit_type TEXT NOT NULL CHECK(visit_type IN ('ANC', 'PNC')),
    visit_notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
  );

CREATE TABLE IF NOT EXISTS sync (
    table_name TEXT PRIMARY KEY,
    last_synced_at TEXT
);

CREATE TABLE IF NOT EXISTS todo (
    id TEXT PRIMARY KEY,
    task TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hmis_record (
    id TEXT PRIMARY KEY,
    serial_no INTEGER,
    date_day INTEGER,
    date_month INTEGER,
    date_year INTEGER,
    mother_name TEXT,
    mother_age INTEGER,
    lmp_day INTEGER,
    lmp_month INTEGER,
    lmp_year INTEGER,
    edd_day INTEGER,
    edd_month INTEGER,
    edd_year INTEGER,
    counseling_given INTEGER,
    checkup_12 INTEGER,
    checkup_16 INTEGER,
    checkup_20_24 INTEGER,
    checkup_28 INTEGER,
    checkup_32 INTEGER,
    checkup_34 INTEGER,
    checkup_36 INTEGER,
    checkup_38_40 INTEGER,
    checkup_other TEXT,
    iron_preg_received INTEGER,
    iron_pnc_received INTEGER,
    vit_a_received INTEGER,
    delivery_place TEXT,
    newborn_condition TEXT,
    pnc_check_24hr INTEGER,
    pnc_check_3day INTEGER,
    pnc_check_7_14day INTEGER,
    pnc_check_42day INTEGER,
    pnc_check_other TEXT,
    family_planning_used INTEGER,
    remarks TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS hmis_maternal_death (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    serial_no INTEGER,
    mother_name TEXT,
    mother_age INTEGER,
    death_condition TEXT, -- 'Pregnant', 'Labor', 'Post-delivery', 'Other'
    death_condition_other TEXT,
    death_day INTEGER,
    death_month INTEGER,
    death_year INTEGER,
    delivery_place TEXT, -- 'Home', 'Institution', 'Other'
    delivery_place_other TEXT,
    death_place TEXT, -- 'Home', 'Institution', 'Other'
    death_place_other TEXT,
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);

CREATE TABLE IF NOT EXISTS hmis_newborn_death (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    mother_name TEXT,
    baby_name TEXT,
    birth_day INTEGER,
    birth_month INTEGER,
    birth_year INTEGER,
    delivery_place TEXT, -- 'Home', 'Institution', 'Other'
    delivery_place_other TEXT,
    birth_condition TEXT, -- 'Preterm', 'LowWeight', 'Normal', 'Other'
    birth_condition_other TEXT,
    death_age_days INTEGER,
    cause_of_death TEXT, -- 'Asphyxia', 'Hypothermia', 'Infection', 'Other'
    cause_of_death_other TEXT,
    death_place TEXT, -- 'Home', 'Institution', 'Other'
    death_place_other TEXT,
    gender TEXT, -- 'Male', 'Female'
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);

CREATE TABLE IF NOT EXISTS hmis_child_death (
    id TEXT PRIMARY KEY,
    mother_id TEXT,
    mother_name TEXT,
    child_name TEXT,
    birth_day INTEGER,
    birth_month INTEGER,
    birth_year INTEGER,
    death_age_months INTEGER,
    cause_of_death TEXT,
    gender TEXT, -- 'Male', 'Female'
    remarks TEXT,
    is_synced INTEGER NOT NULL DEFAULT 0,
    is_deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(mother_id) REFERENCES mother(id)
);
`;


``


## File: .\src\hooks\database\models\ChildDeathModel.ts


``typescript

import { getDb } from "../db";
import { ChildDeathStoreType } from "../types/childDeathModal";

export async function createChildDeath(data: Partial<ChildDeathStoreType>): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT INTO hmis_child_death (
      id, mother_id, mother_name, child_name, birth_day, birth_month, birth_year,
      death_age_months, cause_of_death, gender, remarks, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id!,
      data.mother_id!,
      data.mother_name!,
      data.child_name || '',
      data.birth_day || 0,
      data.birth_month || 0,
      data.birth_year || 0,
      data.death_age_months || 0,
      data.cause_of_death || '',
      data.gender || '',
      data.remarks || '',
      now,
      now
    ]
  );
}

export async function getAllChildDeaths(): Promise<ChildDeathStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ChildDeathStoreType>(
    `SELECT * FROM hmis_child_death ORDER BY created_at DESC`
  );
  return rows;
}

export async function getChildDeathByMother(motherId: string): Promise<ChildDeathStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<ChildDeathStoreType>(
    `SELECT * FROM hmis_child_death WHERE mother_id = ?`,
    [motherId]
  );
  return row;
}

export async function getTotalChildDeaths(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM hmis_child_death`
  );
  return result?.count || 0;
}

export async function deleteChildDeath(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_child_death WHERE id = ?`, [id]);
}


``


## File: .\src\hooks\database\models\CommonModal.ts


``typescript

import { SQLiteDatabase } from "expo-sqlite";
import { getDb } from "../db";
import { TableType } from "../types/table";
import { toSqlParam } from "@/utils/parse";

export async function deleteRecords(
  tableName: TableType,
  ids: string[],
  deleteType: "hard" | "soft"
): Promise<void> {
  if (ids.length === 0) return;

  const db = await getDb();

  if (deleteType === "hard") {
    const placeholders = ids.map(() => "?").join(",");
    await db.runAsync(
      `DELETE FROM ${tableName} WHERE id IN (${placeholders})`,
      ids
    );
  } else {
    const placeholders = ids.map(() => "?").join(",");
    const now = new Date().toISOString();

    await db.runAsync(
      `UPDATE ${tableName}
   SET is_synced = ?, is_deleted = ?, updated_at = ?
   WHERE id IN (${placeholders})`,
      [0, 1, now, ...ids]
    );
  }
}

export async function clearTable(tableName: TableType) {
  const db = await getDb();
  await db.runAsync(`DELETE FROM ${tableName};`);
}

export async function bulkInsertToTempTable<T>(
  opts: {
    db: SQLiteDatabase;
    table: string;
    columns: string[];
    rows: (item: T) => any[]; // must match columns length/order
    onConflict?: "none" | "replace" | "ignore"; // optional
  },
  items: T[]
) {
  if (!items?.length) return;

  const { db, table, columns, rows, onConflict = "none" } = opts;

  if (!columns.length) throw new Error("columns must not be empty");

  const placeholders = columns.map(() => "?").join(", ");
  const colSql = columns.join(", ");

  const insertVerb =
    onConflict === "replace"
      ? "INSERT OR REPLACE"
      : onConflict === "ignore"
        ? "INSERT OR IGNORE"
        : "INSERT";

  const sql = `${insertVerb} INTO ${table} (${colSql}) VALUES (${placeholders});`;

  for (const item of items) {
    const vals = rows(item);
    if (vals.length !== columns.length) {
      throw new Error(
        `Row values length (${vals.length}) != columns length (${columns.length}) for table ${table}`
      );
    }
    await db.runAsync(sql, vals.map(toSqlParam));
  }
}


``


## File: .\src\hooks\database\models\HmisRecordModel.ts


``typescript

import { getDb } from '../db';
import { CreateHmisRecordPayload, HmisRecordStoreType } from '../types/hmisRecordModal';

export async function createHmisRecord(
  payload: CreateHmisRecordPayload
): Promise<HmisRecordStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO hmis_record 
      (id, serial_no, date_day, date_month, date_year, mother_name, mother_age, 
       lmp_day, lmp_month, lmp_year, edd_day, edd_month, edd_year, 
       counseling_given, checkup_12, checkup_16, checkup_20_24, checkup_28, 
       checkup_32, checkup_34, checkup_36, checkup_38_40, checkup_other, 
       iron_preg_received, iron_pnc_received, vit_a_received, delivery_place, 
       newborn_condition, pnc_check_24hr, pnc_check_3day, pnc_check_7_14day, 
       pnc_check_42day, pnc_check_other, family_planning_used, remarks, 
       created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      serial_no = excluded.serial_no,
      date_day = excluded.date_day,
      date_month = excluded.date_month,
      date_year = excluded.date_year,
      mother_name = excluded.mother_name,
      mother_age = excluded.mother_age,
      lmp_day = excluded.lmp_day,
      lmp_month = excluded.lmp_month,
      lmp_year = excluded.lmp_year,
      edd_day = excluded.edd_day,
      edd_month = excluded.edd_month,
      edd_year = excluded.edd_year,
      counseling_given = excluded.counseling_given,
      checkup_12 = excluded.checkup_12,
      checkup_16 = excluded.checkup_16,
      checkup_20_24 = excluded.checkup_20_24,
      checkup_28 = excluded.checkup_28,
      checkup_32 = excluded.checkup_32,
      checkup_34 = excluded.checkup_34,
      checkup_36 = excluded.checkup_36,
      checkup_38_40 = excluded.checkup_38_40,
      checkup_other = excluded.checkup_other,
      iron_preg_received = excluded.iron_preg_received,
      iron_pnc_received = excluded.iron_pnc_received,
      vit_a_received = excluded.vit_a_received,
      delivery_place = excluded.delivery_place,
      newborn_condition = excluded.newborn_condition,
      pnc_check_24hr = excluded.pnc_check_24hr,
      pnc_check_3day = excluded.pnc_check_3day,
      pnc_check_7_14day = excluded.pnc_check_7_14day,
      pnc_check_42day = excluded.pnc_check_42day,
      pnc_check_other = excluded.pnc_check_other,
      family_planning_used = excluded.family_planning_used,
      remarks = excluded.remarks,
      updated_at = excluded.updated_at;`,
    [
      payload.id, payload.serial_no, payload.date_day, payload.date_month, payload.date_year, 
      payload.mother_name, payload.mother_age, 
      payload.lmp_day, payload.lmp_month, payload.lmp_year, 
      payload.edd_day, payload.edd_month, payload.edd_year, 
      payload.counseling_given, payload.checkup_12, payload.checkup_16, payload.checkup_20_24, payload.checkup_28, 
      payload.checkup_32, payload.checkup_34, payload.checkup_36, payload.checkup_38_40, payload.checkup_other, 
      payload.iron_preg_received, payload.iron_pnc_received, payload.vit_a_received, payload.delivery_place, 
      payload.newborn_condition, payload.pnc_check_24hr, payload.pnc_check_3day, payload.pnc_check_7_14day, 
      payload.pnc_check_42day, payload.pnc_check_other, payload.family_planning_used, payload.remarks, 
      now, now
    ]
  );

  return {
    ...payload,
    created_at: now,
    updated_at: now
  };
}

export async function getAllHmisRecords(): Promise<HmisRecordStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<HmisRecordStoreType>(
    `SELECT * FROM hmis_record ORDER BY date_year DESC, date_month DESC, date_day DESC, serial_no ASC`
  );
  return rows;
}

export async function deleteHmisRecord(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_record WHERE id = ?`, [id]);
}

export async function getNextSerialNo(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ max_sn: number }>(
    `SELECT MAX(serial_no) as max_sn FROM hmis_record`
  );
  return (result?.max_sn || 0) + 1;
}

export async function getHmisRecord(id: string): Promise<HmisRecordStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<HmisRecordStoreType>(
    `SELECT * FROM hmis_record WHERE id = ?`,
    [id]
  );
  return row;
}


``


## File: .\src\hooks\database\models\MaternalDeathModel.ts


``typescript

import { getDb } from '../db';
import { CreateMaternalDeathPayload, MaternalDeathStoreType } from '../types/maternalDeathModal';

export async function createMaternalDeath(
  payload: CreateMaternalDeathPayload
): Promise<MaternalDeathStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO hmis_maternal_death 
      (id, mother_id, serial_no, mother_name, mother_age, death_condition, death_condition_other,
       death_day, death_month, death_year, delivery_place, delivery_place_other, 
       death_place, death_place_other, remarks, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      mother_id = excluded.mother_id,
      serial_no = excluded.serial_no,
      mother_name = excluded.mother_name,
      mother_age = excluded.mother_age,
      death_condition = excluded.death_condition,
      death_condition_other = excluded.death_condition_other,
      death_day = excluded.death_day,
      death_month = excluded.death_month,
      death_year = excluded.death_year,
      delivery_place = excluded.delivery_place,
      delivery_place_other = excluded.delivery_place_other,
      death_place = excluded.death_place,
      death_place_other = excluded.death_place_other,
      remarks = excluded.remarks,
      updated_at = excluded.updated_at;`,
    [
      payload.id, 
      payload.mother_id ?? null, 
      payload.serial_no ?? null, 
      payload.mother_name ?? null, 
      payload.mother_age ?? null, 
      payload.death_condition ?? null, 
      payload.death_condition_other ?? '',
      payload.death_day ?? null, 
      payload.death_month ?? null, 
      payload.death_year ?? null, 
      payload.delivery_place ?? null, 
      payload.delivery_place_other ?? '',
      payload.death_place ?? null, 
      payload.death_place_other ?? '',
      payload.remarks ?? null, 
      now, 
      now
    ]
  );

  return {
    ...payload,
    created_at: now,
    updated_at: now
  };
}

export async function getAllMaternalDeaths(): Promise<MaternalDeathStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MaternalDeathStoreType>(
    `SELECT * FROM hmis_maternal_death ORDER BY created_at DESC`
  );
  return rows;
}

export async function getMaternalDeathByMother(motherId: string): Promise<MaternalDeathStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<MaternalDeathStoreType>(
    `SELECT * FROM hmis_maternal_death WHERE mother_id = ?`,
    [motherId]
  );
  return row;
}

export async function getTotalMaternalDeaths(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM hmis_maternal_death`
  );
  return result?.count || 0;
}

export async function deleteMaternalDeath(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_maternal_death WHERE id = ?`, [id]);
}


``


## File: .\src\hooks\database\models\MotherModel.ts


``typescript

import { getDb } from '../db';
import { CreateMotherPayload, MotherStoreType } from '../types/motherModal';

export async function createMother(
  payload: Omit<CreateMotherPayload, 'created_at' | 'updated_at'>
): Promise<MotherStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO mother 
      (id, code, name, age, phone, address, husband_name, ethnicity, education, photo, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      code = excluded.code,
      name = excluded.name,
      age = excluded.age,
      phone = excluded.phone,
      address = excluded.address,
      husband_name = excluded.husband_name,
      ethnicity = excluded.ethnicity,
      education = excluded.education,
      photo = excluded.photo,
      is_synced = excluded.is_synced,
      is_deleted = excluded.is_deleted,
      updated_at = excluded.updated_at;`,
    [
      payload.id,
      payload.code ?? null,
      payload.name ?? null,
      payload.age ?? null,
      payload.phone ?? null,
      payload.address ?? null,
      payload.husband_name ?? null,
      payload.ethnicity ?? null,
      payload.education ?? null,
      payload.photo ?? null,
      payload.is_synced ? 1 : 0,
      0,
      now,
      now
    ]
  );

  return {
    id: payload.id,
    code: payload.code ?? null,
    name: payload.name ?? null,
    age: payload.age ?? null,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
    husband_name: payload.husband_name ?? null,
    ethnicity: payload.ethnicity ?? null,
    education: payload.education ?? null,
    photo: payload.photo ?? null,
    is_synced: payload.is_synced ? 1 : 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

export async function unSyncedMothers(): Promise<CreateMotherPayload[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<MotherStoreType>(
    `SELECT * FROM mother WHERE is_synced = 0 AND is_deleted = 0`
  );

  return rows.map((row) => ({
    id: row.id,
    code: row.code ?? undefined,
    name: row.name ?? undefined,
    age: row.age ?? undefined,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    husband_name: row.husband_name ?? undefined,
    ethnicity: row.ethnicity ?? undefined,
    education: row.education ?? undefined,
    photo: row.photo ?? undefined,
    is_synced: false
  }));
}

export async function deleteMother(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE mother SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}

export interface MotherListDbItem {
  id: string;
  code?: string;
  name: string;
  nameNp: string;
  age: number;
  edd: string;
  lmp: string;
  anc: number;
  status: string;
  risk: string;
  ward: string;
  image: string;
  pregnancy_count: number;
}

export async function getAllMothersList(): Promise<MotherListDbItem[]> {
  const db = await getDb();

  const query = `
    SELECT 
      m.*,
      p.lmp_date as lmp,
      p.expected_delivery_date as edd,
      (SELECT COUNT(*) FROM pregnancy WHERE mother_id = m.id AND is_deleted = 0) as pregnancy_count
    FROM mother m
    LEFT JOIN pregnancy p ON p.id = (
      SELECT id FROM pregnancy 
      WHERE mother_id = m.id AND is_deleted = 0 
      ORDER BY created_at DESC LIMIT 1
    )
    WHERE m.is_deleted = 0 
    ORDER BY m.created_at ASC
  `;

  const rows = await db.getAllAsync<any>(query);

  return rows.map((row) => ({
    id: row.id,
    code: row.code || "",
    name: row.name || "Unknown",
    nameNp: row.husband_name || "",
    age: row.age || 0,
    ward: row.address || "Unknown Ward",
    image: row.photo || "https://vectorified.com/images/no-profile-picture-icon-13.png",
    lmp: row.lmp || "N/A",
    edd: row.edd || "N/A",
    anc: 0,
    status: "active",
    risk: "low",
    pregnancy_count: row.pregnancy_count || 0
  }));
}

export interface MotherProfileDbItem extends MotherListDbItem {
  code: string;
  phone: string;
  regDate: string;
  pregnancyId: string | null;
  husbandName: string;
  ethnicity: string;
  education: string;
  gravida: string;
  parity: string;
}

export async function getMotherProfile(id: string): Promise<MotherProfileDbItem | null> {
  const db = await getDb();
  const query = `
    SELECT 
      m.id,
      m.code,
      m.name,
      m.husband_name as nameNp,
      m.husband_name as husbandName,
      m.ethnicity,
      m.education,
      m.age,
      m.phone,
      m.address as ward,
      m.photo as image,
      m.created_at as regDate,
      p.id as pregnancyId,
      p.lmp_date as lmp,
      p.expected_delivery_date as edd,
      p.gravida,
      p.parity,
      (SELECT COUNT(*) FROM pregnancy WHERE mother_id = m.id AND is_deleted = 0) as pregnancy_count
    FROM mother m
    LEFT JOIN pregnancy p ON p.id = (
      SELECT id FROM pregnancy 
      WHERE mother_id = m.id AND is_deleted = 0 
      ORDER BY created_at DESC LIMIT 1
    )
    WHERE m.id = ? AND m.is_deleted = 0
  `;
  const row = await db.getFirstAsync<any>(query, [id]);
  if (!row) return null;

  return {
    id: row.id,
    code: row.code || "",
    name: row.name || "Unknown",
    nameNp: row.nameNp || "",
    husbandName: row.husbandName || "",
    ethnicity: row.ethnicity || "",
    education: row.education || "",
    pregnancyId: row.pregnancyId || null,
    gravida: row.gravida !== null ? String(row.gravida) : "",
    parity: row.parity !== null ? String(row.parity) : "",
    age: row.age || 0,
    phone: row.phone || "",
    ward: row.ward || "Unknown Ward",
    image: row.image || "https://vectorified.com/images/no-profile-picture-icon-13.png",
    lmp: row.lmp || "",
    edd: row.edd || "N/A",
    anc: 0,
    status: "active",
    risk: "low",
    regDate: row.regDate || "N/A",
    pregnancy_count: row.pregnancy_count || 0
  };
}

export async function getMotherCount(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM mother WHERE is_deleted = 0"
  );
  return result?.count ?? 0;
}


``


## File: .\src\hooks\database\models\NewbornDeathModel.ts


``typescript

import { getDb } from "../db";
import { NewbornDeathStoreType } from "../types/newbornDeathModal";

export async function createNewbornDeath(data: Partial<NewbornDeathStoreType>): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT INTO hmis_newborn_death (
      id, mother_id, mother_name, baby_name, birth_day, birth_month, birth_year,
      delivery_place, delivery_place_other, birth_condition, birth_condition_other,
      death_age_days, cause_of_death, cause_of_death_other, death_place, death_place_other,
      gender, remarks, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id!,
      data.mother_id!,
      data.mother_name!,
      data.baby_name || '',
      data.birth_day || 0,
      data.birth_month || 0,
      data.birth_year || 0,
      data.delivery_place || '',
      data.delivery_place_other || '',
      data.birth_condition || '',
      data.birth_condition_other || '',
      data.death_age_days || 0,
      data.cause_of_death || '',
      data.cause_of_death_other || '',
      data.death_place || '',
      data.death_place_other || '',
      data.gender || '',
      data.remarks || '',
      now,
      now
    ]
  );
}

export async function getAllNewbornDeaths(): Promise<NewbornDeathStoreType[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<NewbornDeathStoreType>(
    `SELECT * FROM hmis_newborn_death ORDER BY created_at DESC`
  );
  return rows;
}

export async function getNewbornDeathByMother(motherId: string): Promise<NewbornDeathStoreType | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<NewbornDeathStoreType>(
    `SELECT * FROM hmis_newborn_death WHERE mother_id = ?`,
    [motherId]
  );
  return row;
}

export async function getTotalNewbornDeaths(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM hmis_newborn_death`
  );
  return result?.count || 0;
}

export async function deleteNewbornDeath(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM hmis_newborn_death WHERE id = ?`, [id]);
}


``


## File: .\src\hooks\database\models\PregnantWomenModal.ts


``typescript

import { getDb } from '../db';
import * as Crypto from "expo-crypto";
import { bulkInsertToTempTable } from './CommonModal';
import { setSyncTimestamp } from './SyncModel';
import { CreatePregnancyPayload, PregnancyStoreType } from '../types/pregnancyModal';

export async function createPregnancy(
  payload: Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'> & { id?: string }
): Promise<PregnancyStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = payload.id || Crypto.randomUUID();

  await db.runAsync(
    `INSERT INTO pregnancy 
      (id, mother_id, lmp_date, expected_delivery_date, is_current, gravida, parity, selected, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      mother_id = excluded.mother_id,
      lmp_date = excluded.lmp_date,
      expected_delivery_date = excluded.expected_delivery_date,
      is_current = excluded.is_current,
      gravida = excluded.gravida,
      parity = excluded.parity,
      selected = excluded.selected,
      is_synced = excluded.is_synced,
      is_deleted = excluded.is_deleted,
      updated_at = excluded.updated_at;`,
    [
      id,
      payload.mother_id,
      payload.lmp_date,
      payload.expected_delivery_date ?? null,
      payload.is_current ? 1 : 0,
      payload.gravida ?? null,
      payload.parity ?? null,
      payload.selected ? 1 : 0,
      0,
      0,
      now,
      now
    ]
  );

  return {
    id: id,
    mother_id: payload.mother_id,
    lmp_date: payload.lmp_date,
    expected_delivery_date: payload.expected_delivery_date ?? null,
    is_current: payload.is_current ? 1 : 0,
    gravida: payload.gravida ?? null,
    parity: payload.parity ?? null,
    selected: payload.selected ? 1 : 0,
    is_synced: payload.is_synced ? 1 : 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

export async function unSyncedPregnancies(): Promise<CreatePregnancyPayload[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<PregnancyStoreType>(
    `SELECT * FROM pregnancy WHERE is_synced = 0 AND is_deleted = 0`
  );

  return rows.map((row) => ({
    id: row.id,
    mother_id: row.mother_id || "",
    gravida: row.gravida ?? undefined,
    parity: row.parity ?? undefined,
    lmp_date: row.lmp_date,
    expected_delivery_date: row.expected_delivery_date ?? undefined,
    is_current: row.is_current === 1,
    selected: row.selected === 1,
    is_synced: false
  }));
}

export async function deletePregnancy(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE pregnancy SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}

export async function insertToTempPregnancyTable(
  apiRes: any[]
) {
  if (!apiRes.length) return;
  const db = await getDb();

  const columns = [
    "id",
    "mother_id",
    "gravida",
    "parity",
    "lmp_date",
    "expected_delivery_date",
    "is_current",
    "selected",
    "is_synced",
    "is_deleted",
    "created_at",
    "updated_at"
  ];

  await bulkInsertToTempTable<any>(
    {
      db,
      table: "pregnancy_staging",
      columns,
      onConflict: "replace",
      rows: (item: any) => [
        item.id,
        item.mother_id,
        item.gravida ?? null,
        item.parity ?? null,
        item.lmp_date,
        item.expected_delivery_date ?? null,
        item.is_current ? 1 : 0,
        item.selected ? 1 : 0,
        1,
        item.deleted ? 1 : 0,
        item.created_at,
        item.updated_at
      ]
    },
    apiRes
  );
}

export async function moveTempToRealPregnancyTable() {
  const db = await getDb();

  const staged = await db.getAllAsync<any>(
    `SELECT * FROM pregnancy_staging`
  );

  if (!staged.length) return;

  for (const item of staged) {
    await db.runAsync(
      `
      INSERT INTO pregnancy
        (id, mother_id, gravida, parity, lmp_date, expected_delivery_date, is_current, selected, is_synced, is_deleted, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        mother_id = excluded.mother_id,
        gravida = excluded.gravida,
        parity = excluded.parity,
        lmp_date = excluded.lmp_date,
        expected_delivery_date = excluded.expected_delivery_date,
        is_current = excluded.is_current,
        selected = excluded.selected,
        created_at = excluded.created_at,
        updated_at = excluded.updated_at,
        is_synced = excluded.is_synced,
        is_deleted = excluded.is_deleted
      WHERE datetime(excluded.updated_at) > datetime(pregnancy.updated_at)
         OR pregnancy.updated_at IS NULL;
      `,
      [
        item.id,
        item.mother_id,
        item.gravida,
        item.parity,
        item.lmp_date,
        item.expected_delivery_date,
        item.is_current,
        item.selected,
        1,
        item.is_deleted,
        item.created_at,
        item.updated_at
      ]
    );
  }

  const now = new Date().toISOString();
  await setSyncTimestamp("pregnancy", now);
}

export async function getSelectedPregnancy(): Promise<PregnancyStoreType | null> {
  const db = await getDb();
  return await db.getFirstAsync<PregnancyStoreType>(
    `SELECT * FROM pregnancy WHERE selected = 1 AND is_deleted = 0`
  );
}

export async function getPregnancyCount(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM pregnancy WHERE is_deleted = 0 AND is_current = 1"
  );
  return result?.count ?? 0;
}

export interface PregnantWomenListItem {
  id: string;
  mother_id: string;
  name: string;
  husband_name: string;
  age: number;
  ward: string;
  phone: string;
  lmp_date: string;
  edd: string;
  gravida: number;
  parity: number;
}

export async function getPregnantWomenList(): Promise<PregnantWomenListItem[]> {
  const db = await getDb();
  const query = `
    SELECT 
      p.id,
      p.mother_id,
      m.name,
      m.husband_name,
      m.age,
      m.address as ward,
      m.phone,
      p.lmp_date,
      p.expected_delivery_date as edd,
      p.gravida,
      p.parity
    FROM pregnancy p
    INNER JOIN mother m ON p.mother_id = m.id
    WHERE p.is_deleted = 0 AND p.is_current = 1 AND m.is_deleted = 0
    ORDER BY p.updated_at DESC
  `;
  const rows = await db.getAllAsync<any>(query);
  return rows.map(row => ({
    ...row,
    gravida: row.gravida || 0,
    parity: row.parity || 0,
  }));
}

export async function getPregnancyById(id: string): Promise<any> {
  const db = await getDb();
  const query = `
    SELECT 
      p.*,
      m.name as mother_name,
      m.phone as mother_phone
    FROM pregnancy p
    INNER JOIN mother m ON p.mother_id = m.id
    WHERE p.id = ? AND p.is_deleted = 0
  `;
  return await db.getFirstAsync<any>(query, [id]);
}

export async function updatePregnancy(
  id: string,
  payload: Partial<Omit<CreatePregnancyPayload, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  const sets: string[] = ["updated_at = ?"];
  const values: any[] = [now];

  if (payload.lmp_date !== undefined) {
    sets.push("lmp_date = ?");
    values.push(payload.lmp_date);
  }
  if (payload.expected_delivery_date !== undefined) {
    sets.push("expected_delivery_date = ?");
    values.push(payload.expected_delivery_date);
  }
  if (payload.gravida !== undefined) {
    sets.push("gravida = ?");
    values.push(payload.gravida);
  }
  if (payload.parity !== undefined) {
    sets.push("parity = ?");
    values.push(payload.parity);
  }
  if (payload.is_current !== undefined) {
    sets.push("is_current = ?");
    values.push(payload.is_current ? 1 : 0);
  }
  if (payload.selected !== undefined) {
    sets.push("selected = ?");
    values.push(payload.selected ? 1 : 0);
  }
  if (payload.is_synced !== undefined) {
    sets.push("is_synced = ?");
    values.push(payload.is_synced ? 1 : 0);
  }

  values.push(id);
  const sql = `UPDATE pregnancy SET ${sets.join(", ")} WHERE id = ?`;
  await db.runAsync(sql, values);
}



``


## File: .\src\hooks\database\models\SyncModel.ts


``typescript

import { getDb } from "../db";
import { SyncRow } from "../types/sync";
import { TableType } from "../types/table";

export async function ensureSyncRow(tableName: TableType): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR IGNORE INTO sync (table_name, last_synced_at) VALUES (?, NULL);`,
    [tableName]
  );
}

export async function getSyncTimestamp(
  tableName: TableType
): Promise<string | null> {
  const db = await getDb();
  await ensureSyncRow(tableName);

  const row = await db.getFirstAsync<Pick<SyncRow, "last_synced_at">>(
    `SELECT last_synced_at FROM sync WHERE table_name = ?;`,
    [tableName]
  );

  return row?.last_synced_at ?? null;
}

export async function setSyncTimestamp(
  tableName: TableType,
  timestamp: string | null
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO sync (table_name, last_synced_at) VALUES (?, ?);`,
    [tableName, timestamp]
  );
}

export async function getTablesWithTimestamp(): Promise<
  Record<TableType, string | null>
> {
  const db = await getDb();

  const rows = await db.getAllAsync<{
    table_name: TableType;
    last_synced_at: string | null;
  }>("SELECT table_name, last_synced_at FROM sync");

  const result: Partial<Record<TableType, string | null>> = {};

  for (const r of rows) {
    result[r.table_name] = r.last_synced_at || null;
  }

  return result as Record<TableType, string>;
}


``


## File: .\src\hooks\database\models\TodoModel.ts


``typescript

import { getDb } from "../db";

const generateId = () => 
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export interface TodoItem {
  id: string;
  task: string;
  is_completed: number;
  created_at: string;
  updated_at: string;
}

export async function createTodo(task: string): Promise<TodoItem> {
  const db = await getDb();
  const id = generateId();
  const now = new Date().toISOString();
  
  await db.runAsync(
    `INSERT INTO todo (id, task, is_completed, created_at, updated_at) 
     VALUES (?, ?, 0, ?, ?)`,
    [id, task, now, now]
  );

  return { id, task, is_completed: 0, created_at: now, updated_at: now };
}

export async function getAllTodos(): Promise<TodoItem[]> {
  const db = await getDb();
  return await db.getAllAsync<TodoItem>(
    `SELECT * FROM todo WHERE is_deleted = 0 ORDER BY created_at DESC`
  );
}

export async function updateTodo(id: string, updates: Partial<TodoItem>): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  
  const sets: string[] = [];
  const params: any[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    sets.push(`${key} = ?`);
    params.push(value);
  });
  
  if (sets.length === 0) return;
  
  sets.push(`updated_at = ?`);
  params.push(now);
  params.push(id);
  
  await db.runAsync(
    `UPDATE todo SET ${sets.join(", ")} WHERE id = ?`,
    params
  );
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE todo SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}


``


## File: .\src\hooks\database\models\VisitModel.ts


``typescript

import { getDb } from '../db';
import * as Crypto from 'expo-crypto';
import { CreateVisitPayload, VisitStoreType } from '../types/visitModal';

export async function createVisit(
  payload: Omit<CreateVisitPayload, 'created_at' | 'updated_at'>
): Promise<VisitStoreType> {
  const db = await getDb();
  const now = new Date().toISOString();
  const id = payload.id || Crypto.randomUUID();

  await db.runAsync(
    `INSERT OR REPLACE INTO visit 
      (id, mother_id, name, address, visit_date, visit_type, visit_notes, is_synced, is_deleted, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      id,
      payload.mother_id,
      payload.name ?? null,
      payload.address ?? null,
      payload.visit_date,
      payload.visit_type,
      payload.visit_notes ?? null,
      payload.is_synced ? 1 : 0,
      0,
      now,
      now
    ]
  );

  return {
    id,
    mother_id: payload.mother_id,
    name: payload.name ?? null,
    address: payload.address ?? null,
    visit_date: payload.visit_date,
    visit_type: payload.visit_type,
    visit_notes: payload.visit_notes ?? null,
    is_synced: payload.is_synced ? 1 : 0,
    is_deleted: 0,
    created_at: now,
    updated_at: now
  };
}

export async function updateVisit(
  id: string,
  payload: Partial<Omit<CreateVisitPayload, 'id' | 'created_at' | 'updated_at'>>
): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();

  const sets: string[] = ['updated_at = ?'];
  const values: any[] = [now];

  if (payload.name !== undefined) {
    sets.push('name = ?');
    values.push(payload.name);
  }
  if (payload.address !== undefined) {
    sets.push('address = ?');
    values.push(payload.address);
  }
  if (payload.visit_date !== undefined) {
    sets.push('visit_date = ?');
    values.push(payload.visit_date);
  }
  if (payload.visit_type !== undefined) {
    sets.push('visit_type = ?');
    values.push(payload.visit_type);
  }
  if (payload.visit_notes !== undefined) {
    sets.push('visit_notes = ?');
    values.push(payload.visit_notes);
  }
  if (payload.is_synced !== undefined) {
    sets.push('is_synced = ?');
    values.push(payload.is_synced ? 1 : 0);
  }

  values.push(id);
  await db.runAsync(`UPDATE visit SET ${sets.join(', ')} WHERE id = ?`, values);
}

export async function deleteVisit(id: string): Promise<void> {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync(
    `UPDATE visit SET is_deleted = 1, updated_at = ? WHERE id = ?`,
    [now, id]
  );
}

export async function getVisitById(id: string): Promise<VisitStoreType | null> {
  const db = await getDb();
  return await db.getFirstAsync<VisitStoreType>(
    `SELECT * FROM visit WHERE id = ? AND is_deleted = 0`,
    [id]
  );
}

export interface VisitListItem {
  id: string;
  mother_id: string;
  name: string;
  address: string;
  visit_date: string;
  visit_type: string;
  visit_notes: string;
}

export async function getAllVisits(): Promise<VisitListItem[]> {
  const db = await getDb();
  const query = `
    SELECT 
      v.id,
      v.mother_id,
      COALESCE(v.name, m.name) as name,
      COALESCE(v.address, m.address) as address,
      v.visit_date,
      v.visit_type,
      v.visit_notes
    FROM visit v
    LEFT JOIN mother m ON v.mother_id = m.id
    WHERE v.is_deleted = 0
    ORDER BY v.visit_date DESC, v.created_at DESC
  `;
  const rows = await db.getAllAsync<any>(query);
  return rows.map(row => ({
    id: row.id,
    mother_id: row.mother_id,
    name: row.name || 'Unknown',
    address: row.address || '',
    visit_date: row.visit_date,
    visit_type: row.visit_type,
    visit_notes: row.visit_notes || '',
  }));
}

export async function getVisitCount(): Promise<number> {
  const db = await getDb();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM visit WHERE is_deleted = 0'
  );
  return result?.count ?? 0;
}

export async function unSyncedVisits(): Promise<CreateVisitPayload[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<VisitStoreType>(
    `SELECT * FROM visit WHERE is_synced = 0 AND is_deleted = 0`
  );

  return rows.map((row) => ({
    id: row.id,
    mother_id: row.mother_id,
    name: row.name ?? undefined,
    address: row.address ?? undefined,
    visit_date: row.visit_date,
    visit_type: row.visit_type,
    visit_notes: row.visit_notes ?? undefined,
    is_synced: false,
  }));
}


``


## File: .\src\hooks\database\types\childDeathModal.ts


``typescript

export interface ChildDeathStoreType {
  id: string;
  mother_id: string;
  mother_name: string;
  child_name?: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
  death_age_months: number;
  cause_of_death: string;
  gender?: 'Male' | 'Female';
  remarks: string;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}


``


## File: .\src\hooks\database\types\hmisRecordModal.ts


``typescript

export interface HmisRecordStoreType {
  id: string;
  serial_no: number | null;
  date_day: number | null;
  date_month: number | null;
  date_year: number | null;
  mother_name: string | null;
  mother_age: number | null;
  lmp_day: number | null;
  lmp_month: number | null;
  lmp_year: number | null;
  edd_day: number | null;
  edd_month: number | null;
  edd_year: number | null;
  counseling_given: number | null; // 0 or 1
  checkup_12: number | null;
  checkup_16: number | null;
  checkup_20_24: number | null;
  checkup_28: number | null;
  checkup_32: number | null;
  checkup_34: number | null;
  checkup_36: number | null;
  checkup_38_40: number | null;
  checkup_other: string | null;
  iron_preg_received: number | null;
  iron_pnc_received: number | null;
  vit_a_received: number | null;
  delivery_place: string | null;
  newborn_condition: string | null;
  pnc_check_24hr: number | null;
  pnc_check_3day: number | null;
  pnc_check_7_14day: number | null;
  pnc_check_42day: number | null;
  pnc_check_other: string | null;
  family_planning_used: number | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateHmisRecordPayload = Omit<HmisRecordStoreType, 'created_at' | 'updated_at'>;


``


## File: .\src\hooks\database\types\maternalDeathModal.ts


``typescript

export interface MaternalDeathStoreType {
  id: string;
  mother_id?: string;
  serial_no?: number;
  mother_name?: string;
  mother_age?: number;
  death_condition?: string; // 'Pregnant', 'Labor', 'Post-delivery', 'Other'
  death_condition_other?: string;
  death_day?: number;
  death_month?: number;
  death_year?: number;
  delivery_place?: string; // 'Home', 'Institution', 'Other'
  delivery_place_other?: string;
  death_place?: string; // 'Home', 'Institution', 'Other'
  death_place_other?: string;
  remarks?: string;
  is_synced?: number;
  is_deleted?: number;
  created_at: string;
  updated_at: string;
}

export type CreateMaternalDeathPayload = Omit<MaternalDeathStoreType, 'created_at' | 'updated_at' | 'is_synced' | 'is_deleted'>;


``


## File: .\src\hooks\database\types\motherModal.ts


``typescript

export type MotherStoreType = {
  id: string;
  code: string | null;
  is_synced: number;
  is_deleted: number;
  name: string | null;
  age: number | null;
  phone: string | null;
  address: string | null;
  husband_name: string | null;
  ethnicity: string | null;
  education: string | null;
  photo: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateMotherPayload = {
  id: string;
  code?: string;
  name?: string;
  age?: number;
  phone?: string;
  address?: string;
  husband_name?: string;
  ethnicity?: string;
  education?: string;
  photo?: string;
  is_synced?: boolean;
};


``


## File: .\src\hooks\database\types\newbornDeathModal.ts


``typescript

export interface NewbornDeathStoreType {
  id: string;
  mother_id: string;
  mother_name: string;
  baby_name?: string;
  birth_day: number;
  birth_month: number;
  birth_year: number;
  delivery_place: string; // 'Home', 'Institution', 'Other'
  delivery_place_other?: string;
  birth_condition: string; // 'Preterm', 'LowWeight', 'Normal', 'Other'
  birth_condition_other?: string;
  death_age_days: number;
  cause_of_death: string; // 'Asphyxia', 'Hypothermia', 'Infection', 'Other'
  cause_of_death_other?: string;
  death_place: string; // 'Home', 'Institution', 'Other'
  death_place_other?: string;
  gender?: 'Male' | 'Female';
  remarks: string;
  is_synced: number;
  is_deleted: number;
  created_at: string;
  updated_at: string;
}


``


## File: .\src\hooks\database\types\pregnancyModal.ts


``typescript

export type PregnancyStoreType = {
  id: string;
  mother_id: string | null;
  is_synced: number;
  is_deleted: number;
  gravida: number | null;
  parity: number | null;
  lmp_date: string;
  expected_delivery_date: string | null;
  is_current: number;
  selected: number;
  created_at: string;
  updated_at: string;
};

export interface PregnancyData {
  id: string;
  gravida: number;
  parity: number;
  lmp_date: string;
  expected_delivery_date: string;
  created_at: string;
  updated_at: string;
}

export type CreatePregnancyPayload = {
  id: string;
  mother_id: string;
  gravida?: number;
  parity?: number;
  lmp_date: string;
  expected_delivery_date?: string;
  is_current?: boolean;
  selected: boolean;
  is_synced?: boolean;
};


``


## File: .\src\hooks\database\types\sync.ts


``typescript

export type SyncRow = {
  table_name: string;
  last_synced_at: string | null;
};


``


## File: .\src\hooks\database\types\table.ts


``typescript

type TableType =
  | "pregnancy"
  | "pregnancy_staging"

type SyncTableType = Extract<
  TableType,
  | "pregnancy"
  | "pregnancy_staging"
>;

type RunAsync = (sql: string, params?: any[]) => Promise<any>;

type Primitive = string | number | null | boolean;

export { Primitive, RunAsync, SyncTableType, TableType };


``


## File: .\src\hooks\database\types\visitModal.ts


``typescript

export type VisitType = 'ANC' | 'PNC';

export type VisitStoreType = {
  id: string;
  mother_id: string;
  name: string | null;
  address: string | null;
  is_synced: number;
  is_deleted: number;
  visit_date: string;
  visit_type: VisitType;
  visit_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateVisitPayload = {
  id?: string;
  mother_id: string;
  name?: string;
  address?: string;
  visit_date: string;
  visit_type: VisitType;
  visit_notes?: string;
  is_synced?: boolean;
};


``


## File: .\src\i18n\config.ts


``typescript

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../assets/i18n/en.json";
import np from "../assets/i18n/np.json";
import storage from "@/utils/storage";

const resources = {
  en: { translation: en },
  np: { translation: np },
};

// Initialize i18n
const initI18n = async () => {
  const savedLanguage = await storage.get<string>("language");

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    resources,
    lng: savedLanguage || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;


``


## File: .\src\schema\schema.global.ts


``typescript


``


## File: .\src\types\lucide-react-native.d.ts


``typescript

import "lucide-react-native";

declare module "lucide-react-native" {
  interface LucideProps {
    color?: string;
  }
}


``


## File: .\src\utils\data.ts


``typescript

export const JATI_CODES = [
  { code: "1", name: "दलित (Dalit)" },
  { code: "2", name: "जनजाति (Janajati)" },
  { code: "3", name: "मधेसी (Madhesi)" },
  { code: "4", name: "मुस्लिम (Muslim)" },
  { code: "5", name: "ब्राह्मण/छेत्री (Brahmin/Chhetri)" },
  { code: "6", name: "अन्य (Other)" },
];

export const EDUCATION_LEVELS = [
  { value: "no_formal", label: "कुनै औपचारिक शिक्षा छैन (No Formal Education)" },
  { value: "primary", label: "प्राथमिक तह – कक्षा १–५ (Primary Level)" },
  { value: "lower_secondary", label: "निम्न माध्यमिक तह – कक्षा ६–८ (Lower Secondary Level)" },
  { value: "secondary", label: "माध्यमिक तह – कक्षा ९–१० (Secondary Level / SEE)" },
  { value: "higher_secondary", label: "उच्च माध्यमिक तह – कक्षा ११–१२ (+2 / Higher Secondary)" },
  { value: "bachelor", label: "स्नातक तह (Bachelor’s Degree)" },
  { value: "master", label: "स्नातकोत्तर तह (Master’s Degree)" },
  { value: "doctoral", label: "विद्यावारिधि तह (Doctoral / PhD)" },
];

``


## File: .\src\utils\parse.ts


``typescript

import { Primitive } from "@/hooks/database/types/table";

const safeParse = <T>(value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    // fallback for plain string values
    return value as unknown as T;
  }
};

/**
 * Converts a potentially invalid datetime string (e.g. "0", unix timestamp
 * number as string, or null/undefined) to a valid ISO 8601 string required
 * by the Django REST API: YYYY-MM-DDThh:mm:ss.uuuuuuZ
 *
 * If the value is falsy or cannot be parsed, falls back to the current time.
 */
export function toISOStringSafe(value: string | number | null | undefined): string {
  // Null / undefined / empty
  if (value === null || value === undefined || value === "") {
    return new Date().toISOString();
  }

  const str = String(value).trim();

  // "0" or plain "0" unix epoch — treat as missing
  if (str === "0") {
    return new Date().toISOString();
  }

  // Pure numeric string — treat as unix timestamp (seconds)
  if (/^\d+$/.test(str)) {
    const ms = Number(str) * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  // Already an ISO-like string — validate it
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

const toSqlParam = (v: any): Primitive => {
  // expo-sqlite accepts numbers/strings/null well; booleans -> 0/1
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return v ? 1 : 0;
  return v;
};

export {safeParse, toSqlParam};


``


## File: .\src\utils\storage.ts


``typescript

import AsyncStorage from "@react-native-async-storage/async-storage";
import { safeParse } from "./parse";

const storage = {
  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value),
    );
  },

  async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);

    if (value === null) return null;

    return safeParse<T>(value);
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};

export default storage;


``


## File: .\src\utils\utils.tsx


``tsx

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


``


