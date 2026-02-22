import { Request, Response } from "express"
import { commentServices } from "./comment.services"

const createComment = async (req: Request, res: Response) => {
    try {
        const commentData = req.body
        commentData.rating = Number(commentData.rating)
        const data = await commentServices.createComment(commentData)
        res.status(201).json({
            success:true,
            message: "Review created successfully",
            data
        })
    } catch (err: any) {
      
        res.status(500).json({
            success:false,
            message: "Review creation failed",
            error: err.message
        })
    }
}
const getReviewByMealId = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const data = await commentServices.getReviewByMealId(id as string)
        res.status(201).json({
            success:true,
            message: "Review retrived successfully",
            data
        })
    } catch (err: any) {
      
        res.status(500).json({
            success:false,
            message: "Review retrived failed",
            error: err.message
        })
    }
}


export const commentController = {
    createComment,
    getReviewByMealId,
}