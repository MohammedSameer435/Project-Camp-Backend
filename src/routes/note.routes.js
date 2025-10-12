import express from "express"
import {
  getProjectNotes,
  createNote,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { isAdmin, isProjectMember } from "../middlewares/role.middleware.js"

const router = express.Router()



router.use(verifyJWT)

router.get("/:projectId", isProjectMember, getProjectNotes)


router.post("/:projectId", isAdmin, createNote)


router.get("/:projectId/n/:noteId", isProjectMember, getNoteById)


router.put("/:projectId/n/:noteId", isAdmin, updateNote)


router.delete("/:projectId/n/:noteId", isAdmin, deleteNote)

export default router
