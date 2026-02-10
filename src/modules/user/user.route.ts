import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { userController } from "./user.controller";

const router = Router()

router.get('/user',auth(userRole.ADMIN),userController.getAllUser)

export const userRoute = router