import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { commentController } from "./comment.controller";

const router = Router()
router.post('/review', auth(userRole.ADMIN, userRole.CUSTOMER, userRole.PROVIDER), commentController.createComment)
router.get('/review/:id', commentController.getReviewByMealId)


export const commentRoutes = router