import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { orderController } from "./order.controller";

const router = Router();
router.post('/order',auth(userRole.ADMIN,userRole.CUSTOMER,userRole.PROVIDER),orderController.createOrder)

export const orderRouter = router