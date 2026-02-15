import { Router } from "express";

import { auth, userRole } from "../../middleware/auth";
import { mealController } from "./meal.controller";

const router = Router()

router.get('/meal',auth(userRole.PROVIDER),mealController.getAllMeal);
router.get('/meal/:id',auth(userRole.PROVIDER),mealController.getMealById);
router.post('/meal',auth(userRole.PROVIDER),mealController.createMeal);
router.patch('/meal/update/:id',auth(userRole.PROVIDER),mealController.updateMeal);


export const mealRoute = router