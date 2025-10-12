
import Task from "../models/taskModel.js"
import Project from "../models/projectModel.js"
import { APIresponse } from "../utils/api-response.js"
import { apierror } from "../utils/apierror.js"
import { asyncHandler } from "../utils/asynchandler.js"

const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const tasks = await Task.find({ project: projectId }).populate("assignedTo", "username email")
    return res.status(200).json(new APIresponse(200, tasks, "Project tasks fetched successfully"))
})


const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { title, description, assignedTo, dueDate, priority } = req.body

    const project = await Project.findById(projectId)
    if (!project) throw new apierror(404, "Project not found")

    const task = await Task.create({
        project: projectId,
        title,
        description,
        assignedTo,
        dueDate,
        priority
    })
    return res.status(201).json(new APIresponse(201, task, "Task created successfully"))
})


const getTaskById = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const task = await Task.findById(taskId).populate("assignedTo", "username email")
    if (!task) throw new apierror(404, "Task not found")
    return res.status(200).json(new APIresponse(200, task, "Task fetched successfully"))
})


const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const updates = req.body
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true })
    if (!updatedTask) throw new apierror(404, "Task not found")
    return res.status(200).json(new APIresponse(200, updatedTask, "Task updated successfully"))
})


const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const deleted = await Task.findByIdAndDelete(taskId)
    if (!deleted) throw new apierror(404, "Task not found")
    return res.status(200).json(new APIresponse(200, {}, "Task deleted successfully"))
})


const createSubTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, assignedTo, dueDate } = req.body

    const task = await Task.findById(taskId)
    if (!task) throw new apierror(404, "Parent task not found")

    task.subtasks.push({ title, description, assignedTo, dueDate })
    await task.save()

    return res.status(201).json(new APIresponse(201, task, "Subtask created successfully"))
})


const updateSubTask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params
    const updates = req.body

    const task = await Task.findOne({ project: projectId, "subtasks._id": subTaskId })
    if (!task) throw new apierror(404, "Subtask not found")

    const subtask = task.subtasks.id(subTaskId)
    Object.assign(subtask, updates)
    await task.save()

    return res.status(200).json(new APIresponse(200, subtask, "Subtask updated successfully"))
})


const deleteSubTask = asyncHandler(async (req, res) => {
    const { projectId, subTaskId } = req.params
    const task = await Task.findOne({ project: projectId, "subtasks._id": subTaskId })
    if (!task) throw new apierror(404, "Subtask not found")

    task.subtasks = task.subtasks.filter(st => st._id.toString() !== subTaskId)
    await task.save()

    return res.status(200).json(new APIresponse(200, {}, "Subtask deleted successfully"))
})

export {
    getProjectTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
}
