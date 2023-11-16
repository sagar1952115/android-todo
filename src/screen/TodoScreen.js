import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TodoScreen = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editing, setEditing] = useState("");

  const handleAddTodo = async () => {
    if (todo === "") {
      return;
    }
    setTodoList([...todoList, { id: Date.now(), title: todo }]);

    setTodo("");
  };

  useEffect(() => {
    const setStorage = async () => {
      console.log("Called");
      try {
        await AsyncStorage.setItem("todo", JSON.stringify(todoList));
      } catch (err) {
        console.log(err);
      }
      console.log("done");
    };
    setStorage();
  }, [todoList]);

  const handleDeleteTodo = async (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);

    setTodoList(updatedTodoList);
  };
  const handleEditTodo = (item) => {
    setEditing(item);
    setTodo(item.title);
  };
  const handleUpdateTodo = async (id) => {
    if (todo === "") {
      return;
    }
    const updatedTodoList = todoList.map((item) => {
      if (item.id === editing.id) {
        return { ...item, title: todo };
      }
      return item;
    });

    setTodoList(updatedTodoList);
    setEditing(null);
    setTodo("");
  };
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const items = await AsyncStorage.getItem("todo");
        console.log(JSON.parse(items));
        setTodoList(JSON.parse(items) || []);
      } catch (error) {
        console.error("Error loading todos: ", error);
      }
    };

    loadTodos();
  }, []);
  const renderTodos = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: "#1e90ff",
          borderRadius: 6,
          paddingHorizontal: 6,
          paddingVertical: 12,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text
          style={{ color: "#fff", fontSize: 20, fontWeight: "800", flex: 1 }}
        >
          {item.title}
        </Text>
        <IconButton
          onPress={() => handleEditTodo(item)}
          iconColor="#fff"
          icon="pencil"
        />
        <IconButton
          onPress={() => handleDeleteTodo(item.id)}
          iconColor="#fff"
          icon="trash-can"
        />
      </View>
    );
  };
  return (
    <SafeAreaView>
      <View style={{ marginHorizontal: 16, marginVertical: 16 }}>
        <TextInput
          value={todo}
          style={{
            borderWidth: 2,
            borderColor: "#1e90ff",
            borderRadius: 6,
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
          onChangeText={(text) => setTodo(text)}
          ontouch
          placeholder="Add a task"
        />
        {editing ? (
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              borderRadius: 6,
              paddingVertical: 12,
              marginVertical: 34,
              marginTop: 24,
            }}
            onPress={() => handleUpdateTodo()}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Save
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "#000",
              borderRadius: 6,
              paddingVertical: 12,
              marginVertical: 34,
              marginTop: 24,
            }}
            onPress={(id) => handleAddTodo(id)}
          >
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Add
            </Text>
          </TouchableOpacity>
        )}
        <FlatList data={todoList} renderItem={renderTodos} />
      </View>
    </SafeAreaView>
  );
};

export default TodoScreen;

const styles = StyleSheet.create({});
