import mongoose from "mongoose";
import express from "express";
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  subject: String,

  dueDate: {
    type: Date,
    required: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // teacher
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // student
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  }
}, { timestamps: true });
const Task = mongoose.model("Task", TaskSchema);
export default Task;