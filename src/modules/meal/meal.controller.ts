import { Request, Response } from "express"
import { mealServices } from "./meal.services"

const createMeal = async (req: Request, res: Response) => {
    try {
        const mealData ={...req.body,price:Number(req.body.price)}
        const data = await mealServices.createMeal(mealData)
        res.status(201).json({
            success:true,
            message: "New menu added successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Failed to add new menu",
            error: err.message
        })
    }
}
const getAllMeal = async (req: Request, res: Response) => {
    try {
        const data = await mealServices.getAllMeal()
        res.status(201).json({
            success:true,
            message:  "Menu list retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Failed to fetch menus",
            error: err.message
        })
    }
}


export const mealController = {
    createMeal,
    getAllMeal,
}