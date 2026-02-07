import { Request, Response } from "express";
import { categoryServices } from "./category.services";

const createCategories = async (req: Request, res: Response) => {
    try {
        const categoryData = req.body
        const data = await categoryServices.createCategories(categoryData)
        res.status(500).json({
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

export const categoryController = {
    createCategories
}