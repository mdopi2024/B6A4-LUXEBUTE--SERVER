import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router()

router.get('/user',auth(userRole.ADMIN),userController.getAllUser)
router.get('/user/:id',auth(userRole.ADMIN),userController.getUserById)
router.patch('/user/:id',auth(userRole.ADMIN),userController.updateUserStatus)
router.patch('/user/role/:id',auth(userRole.ADMIN),userController.updateUserRole)
router.delete('/user/:id',auth(userRole.ADMIN),userController.deleteUser)

export const userRoute = router