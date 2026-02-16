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

const getMealById = async (req: Request, res: Response) => {
    try {
        const data = await mealServices.getMealById(req.params.id as string)
        res.status(201).json({
            success:true,
            message:  "Menu  retrieved successfully",
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

const updateMeal = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const data = await mealServices.updateMeal(id as string,req.body)
        res.status(201).json({
            success:true,
            message:  "Menu updated successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Failed to update menus",
            error: err.message
        })
    }
}
const deleteMeal = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const data = await mealServices.deleteMeal(id as string)
        res.status(201).json({
            success:true,
            message:  "Menu deleted successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "Failed to delete menu",
            error: err.message
        })
    }
}

export const mealController = {
    createMeal,
    getAllMeal,
    updateMeal,
    getMealById,
    deleteMeal,
}