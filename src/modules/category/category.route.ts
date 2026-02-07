import { Router } from "express";
import { categoryController } from "./category.controllar";

const router = Router();

router.post('/category',categoryController.createCategories)
router.get('/category',categoryController.getAllCategories)

export const categoryRouter = router