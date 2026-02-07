import { Router } from "express";
import { categoryController } from "./category.controllar";

const router = Router();

router.post('/category',categoryController.createCategories)

export const categoryRouter = router