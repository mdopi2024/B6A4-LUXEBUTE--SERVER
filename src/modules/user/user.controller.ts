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
const getUserById = async (req: Request, res: Response) => {
    try {
        const id=req.params.id
        const data = await userServices.getUserById(id as string)
        res.status(201).json({
            success:true,
            message:  " User retrieved by id successfully",
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
const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const id=req.params.id
        const data = await userServices.updateUserStatus(id as string,req.body)
        res.status(201).json({
            success:true,
            message:  " User status updated successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to update user status",
            error: err.message
        })
    }
}
const updateUserRole = async (req: Request, res: Response) => {
    try {
        const id=req.params.id
        const data = await userServices.updateUserRole(id as string,req.body)
        res.status(201).json({
            success:true,
            message:  " User role updated successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to update user role",
            error: err.message
        })
    }
}
const deleteUser = async (req: Request, res: Response) => {
    try {
        const id=req.params.id
        const data = await userServices.deleteUser(id as string)
        res.status(201).json({
            success:true,
            message:  " User deleted successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:  "Failed to delete user",
            error: err.message
        })
    }
}

export const userController = {
  getAllUser,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser
}