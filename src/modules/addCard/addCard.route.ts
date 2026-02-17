import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { addCardController } from "./addCard.controller";

const router = Router();

router.post('/add-item',auth(userRole.ADMIN,userRole.CUSTOMER,userRole.PROVIDER),addCardController.addItemCard)

export const addItemRotuer = router