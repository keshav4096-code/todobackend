import Todo from "../models/todo.js";
import jwt from "jsonwebtoken";

const getUserId = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};

export const getTodos = async (req, res) => {
  try {
    const userId = getUserId(req);
    const todos = await Todo.find({ userId }).sort({ createdAt: 1 });
    res.json(todos);
  } catch (error) {
    console.log("getTodos error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const addTodo = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { text } = req.body;
    const todo = await Todo.create({ userId, text });
    res.status(201).json(todo);
  } catch (error) {
    console.log("addTodo error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { text, done } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      { text, done },
      { new: true }
    );
    res.json(todo);
  } catch (error) {
    console.log("updateTodo error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    await Todo.findOneAndDelete({ _id: id, userId });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.log("deleteTodo error:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};