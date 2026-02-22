import { Request, Response } from "express"
import { orderServices } from "./order.services"

const createOrder = async (req: Request, res: Response) => {
    try {
        const orderData = req.body;
        orderData.totalAmount = Number(orderData.totalAmount)
        orderData.quantity= Number(orderData.quantity)
        const data = await orderServices.createOrder( orderData)
        res.status(201).json({
            success:true,
            message: "Your order has been successfully placed.",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Unable to process your order. Please try again.",
            error: err.message
        })
    }
}
const getOrderById = async (req: Request, res: Response) => {
    try {
        
         const id= req.params.id
        const data = await orderServices.getOrderById( id as string)
        res.status(201).json({
            success:true,
            message: "Your order retrived successfully .",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Failed to retrived successfully",
            error: err.message
        })
    }
}

export const orderController = {
    createOrder,
    getOrderById
}