

import Project from "../models/projectModel.js"
import { asyncHandler } from "./utils/asyncHandler.js"
import { ApiError } from "./utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"



export const getAllProjects = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const projects = await Project.find({ owner: userId })
    return res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"))
})



export const createProject = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { name, description } = req.body

    if (!name) throw new ApiError(400, "Project name is required")

    const project = await Project.create({
        name,
        description,
        owner: userId,
        members: [{ user: userId, role: "Admin" }]
    })

    return res.status(201).json(new ApiResponse(201, project, "Project created successfully"))
})



export const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(projectId).populate("members.user", "name email")

    if (!project) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"))
})


export const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body

    const updatedProject = await Project.findByIdAndUpdate(
        projectId,
        { name, description },
        { new: true }
    )

    if (!updatedProject) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"))
})


export const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const deleted = await Project.findByIdAndDelete(projectId)

    if (!deleted) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, {}, "Project deleted successfully"))
})


export const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(projectId).populate("members.user", "name email role")

    if (!project) throw new ApiError(404, "Project not found")

    return res.status(200).json(new ApiResponse(200, project.members, "Members fetched successfully"))
})


export const addProjectMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { userId, role } = req.body

    const project = await Project.findById(projectId)
    if (!project) throw new ApiError(404, "Project not found")

    const exists = project.members.find(m => m.user.toString() === userId)
    if (exists) throw new ApiError(400, "User already a member")

    project.members.push({ user: userId, role })
    await project.save()

    return res.status(200).json(new ApiResponse(200, project, "Member added successfully"))
})




export const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params
    const { role } = req.body

    const project = await Project.findById(projectId)
    if (!project) throw new ApiError(404, "Project not found")

    const member = project.members.find(m => m.user.toString() === userId)
    if (!member) throw new ApiError(404, "Member not found")

    member.role = role
    await project.save()

    return res.status(200).json(new ApiResponse(200, project, "Member role updated"))
})




export const removeMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params

    const project = await Project.findById(projectId)
    if (!project) throw new ApiError(404, "Project not found")

    project.members = project.members.filter(m => m.user.toString() !== userId)
    await project.save()

    return res.status(200).json(new ApiResponse(200, project, "Member removed successfully"))
})
