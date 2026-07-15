import { Request, Response } from "express"
import { mealServices } from "./meal.services"


export interface GetAllMealParams {
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    categoryId?: string | undefined;
    isAvailable?: boolean | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}



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


// working here
const getAllMeal = async (req: Request, res: Response) => {
    try {
        const { search, page, limit, categoryId, isAvailable, sortBy, sortOrder } = req.query;

        const params: GetAllMealParams = {
            search: search as string | undefined,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            categoryId: categoryId as string | undefined,
            isAvailable: isAvailable !== undefined ? isAvailable === "true" : undefined,
            sortBy: sortBy as string | undefined,
            sortOrder: sortOrder as "asc" | "desc" | undefined,
        };

        const result = await mealServices.getAllMeal(params);

        res.status(200).json({
            success: true,
            message: "Menu list retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch menus",
            error: err.message,
        });
    }
};

export const mealControllers = {
    getAllMeal,
};



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