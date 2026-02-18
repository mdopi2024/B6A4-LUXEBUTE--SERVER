import { Router } from "express";

import { auth, userRole } from "../../middleware/auth";
import { mealController } from "./meal.controller";

const router = Router()

router.get('/meal',mealController.getAllMeal);
router.get('/meal/:id',mealController.getMealById);
router.post('/meal',auth(userRole.PROVIDER),mealController.createMeal);
router.patch('/meal/update/:id',auth(userRole.PROVIDER),mealController.updateMeal);
router.delete('/meal/:id',auth(userRole.PROVIDER),mealController.deleteMeal);


export const mealRoute = router