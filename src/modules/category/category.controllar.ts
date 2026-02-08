import { Request, Response } from "express";
import { categoryServices } from "./category.services";

const createCategories = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body
        const data = await categoryServices.createCategories(categoryData)
        res.status(201).json({
            success:true,
            message: "category created successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message: "category creation failed",
            error: err.message
        })
    }
}
const getAllCategories = async (req: Request, res: Response) => {
    try {
        const data = await categoryServices.getAllCategories()
        res.status(201).json({
            success:true,
            message:  "All categories retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to fetch categories",
            error: err.message
        })
    }
}
const getAllCategoryById = async (req: Request, res: Response) => {
    try {
        const {id}= req.params
        const data = await categoryServices.getAllCategoryById(id as string)
        res.status(201).json({
            success:true,
            message:  "Category retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to fetch categories",
            error: err.message
        })
    }
}

export const categoryController = {
    createCategories,
    getAllCategories,
    getAllCategoryById,
}