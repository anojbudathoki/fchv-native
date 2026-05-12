import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Check, Trash2 } from "lucide-react-native";

interface TodoItemProps {
  todo: {
    id: string;
    task: string;
    is_completed: boolean | number;
  };
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
}

const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
  setEditingId,
}: TodoItemProps) => {
  const [text, setText] = useState(todo.task);
  const [lastTap, setLastTap] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const handleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      setEditingId(todo.id);
      setLastTap(0);
    } else {
      setLastTap(now);
      setTimeout(() => {
        if (Date.now() - now >= 300) setExpanded(!expanded);
      }, 300);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handleTap}
      style={{
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F1F5F9",
        opacity: !!todo.is_completed ? 0.6 : 1,
      }}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          backgroundColor: !!todo.is_completed ? "#10B981" : "transparent",
          borderWidth: !!todo.is_completed ? 0 : 2,
          borderColor: !!todo.is_completed ? "transparent" : "#CBD5E1",
        }}
      >
        {!!todo.is_completed && <Check size={14} color="white" strokeWidth={3} />}
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        {isEditing ? (
          <TextInput
            autoFocus
            style={{ color: "#0F172A", fontSize: 15, fontWeight: "500", padding: 0 }}
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
            style={{
              color: !!todo.is_completed ? "#94A3B8" : "#1E293B",
              fontSize: 15,
              fontWeight: "500",
              textDecorationLine: !!todo.is_completed ? "line-through" : "none",
            }}
            numberOfLines={expanded ? undefined : 1}
          >
            {todo.task}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={onDelete}
        style={{
          padding: 8,
          marginLeft: 8,
        }}
      >
        <Trash2 size={18} color="#CBD5E1" strokeWidth={2} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default TodoItem;
