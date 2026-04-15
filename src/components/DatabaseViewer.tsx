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
