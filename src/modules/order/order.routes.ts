import { Router } from "express";
import { auth, userRole } from "../../middleware/auth";
import { orderController } from "./order.controller";

const router = Router();
router.get('/order/:id',auth(userRole.ADMIN,userRole.CUSTOMER,userRole.PROVIDER),orderController.getOrderById)
router.post('/order',auth(userRole.ADMIN,userRole.CUSTOMER,userRole.PROVIDER),orderController.createOrder)

export const orderRouter = router