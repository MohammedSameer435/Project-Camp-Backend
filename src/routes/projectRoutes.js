
import express from "express"
import {
    getAllProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    updateMemberRole,
    removeMember
} from "../controllers/projectController.js"

import { verifyJWT } from "../middlewares/authMiddleware.js"
import { isAdmin } from "../middlewares/roleMiddleware.js"

const router = express.Router()

// Porject routes
router.route("/")
    .get(verifyJWT, getAllProjects)
    .post(verifyJWT, createProject)

router.route("/:projectId")
    .get(verifyJWT, getProjectById)
    .put(verifyJWT, isAdmin, updateProject)
    .delete(verifyJWT, isAdmin, deleteProject)

// Member routes
router.route("/:projectId/members")
    .get(verifyJWT, getProjectMembers)
    .post(verifyJWT, isAdmin, addProjectMember)

router.route("/:projectId/members/:userId")
    .put(verifyJWT, isAdmin, updateMemberRole)
    .delete(verifyJWT, isAdmin, removeMember)

export default router
