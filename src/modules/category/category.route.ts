import { Router } from "express";
import { categoryController } from "./category.controllar";
import { auth, userRole } from "../../middleware/auth";

const router = Router();

router.post('/category',auth(userRole.ADMIN),categoryController.createCategories)
router.get('/category',auth(userRole.ADMIN),categoryController.getAllCategories)
router.get('/category/:id',auth(userRole.ADMIN),categoryController.getAllCategoryById)
router.patch('/category/:id',auth(userRole.ADMIN),categoryController.updateCategory)

export const categoryRouter = router