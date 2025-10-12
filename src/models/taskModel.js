// models/taskModel.js
import mongoose, { Schema } from "mongoose"

// --- Subtask schema ---
const subTaskSchema = new Schema({
    title: {
        type: String,
        required: [true, "Subtask title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dueDate: {
        type: Date
    }
}, { timestamps: true })

// --- Main Task schema ---
const taskSchema = new Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    dueDate: {
        type: Date
    },
    subtasks: [subTaskSchema],
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)
export default Task
