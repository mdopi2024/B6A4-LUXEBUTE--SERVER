import { Router } from "express";

import { auth, userRole } from "../../middleware/auth";
import { mealController } from "./meal.controller";

const router = Router()

router.get('/meal',auth(userRole.PROVIDER),mealController.getAllMeal);
router.post('/meal',auth(userRole.PROVIDER),mealController.createMeal);


export const mealRoute = router