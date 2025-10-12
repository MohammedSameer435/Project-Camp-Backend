
import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getProjectTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} from "../controllers/taskController.js"

const router = Router()


router.use(verifyJWT)


router.route("/:projectId")
    .get(getProjectTasks)
    .post(createTask)

router.route("/:projectId/t/:taskId")
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask)


router.route("/:projectId/t/:taskId/subtasks")
    .post(createSubTask)

router.route("/:projectId/st/:subTaskId")
    .put(updateSubTask)
    .delete(deleteSubTask)

export default router
