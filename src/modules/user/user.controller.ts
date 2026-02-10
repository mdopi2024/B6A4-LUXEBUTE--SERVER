import { Request, Response } from "express"
import { userServices } from "./user.services"

const getAllUser = async (req: Request, res: Response) => {
    try {
        const data = await userServices.getAllUser()
        res.status(201).json({
            success:true,
            message:  "All user retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to fetch user",
            error: err.message
        })
    }
}

export const userController = {
  getAllUser
}