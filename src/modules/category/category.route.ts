import { Router } from "express";
import { categoryController } from "./category.controllar";
import { auth, userRole } from "../../middleware/auth";

const router = Router();

router.post('/category',categoryController.createCategories)
router.get('/category',auth(userRole.ADMIN),categoryController.getAllCategories)
router.get('/category/:id',categoryController.getAllCategoryById)
router.patch('/category/:id',categoryController.updateCategory)

export const categoryRouter = router