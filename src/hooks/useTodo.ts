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
