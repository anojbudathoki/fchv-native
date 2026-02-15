import safeParse from "./parse";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
