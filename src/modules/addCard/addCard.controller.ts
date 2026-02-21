import { Request, Response } from "express"
import { addCardServices } from "./addCard.services"


const addItemCard = async (req: Request, res: Response) => {
    try {
        const cardData = req.body
        const data = await addCardServices.addItemCard(cardData)
        res.status(201).json({
            success:true,
            message: "Item added to cart successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:err?.message ||"Failed to add item to cart",
            error: err.message
        })
    }
}
const getAllItemCard= async (req: Request, res: Response) => {
    try {
       const id= req.params.id
        const data = await addCardServices.getAllItemCard(id as string)
        res.status(201).json({
            success:true,
            message:"Cart items retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:"Failed to retrieve cart items",
            error: err.message
        })
    }
}
const getItemCardById= async (req: Request, res: Response) => {
    try {
       const id= req.params.id
        const data = await addCardServices.geItemCardById(id as string)
        res.status(201).json({
            success:true,
            message:"Cart item retrieved successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:"Failed to retrieve cart item",
            error: err.message
        })
    }
}
const deleteItemCard= async (req: Request, res: Response) => {
    try {
       const id= req.params.id
        const data = await addCardServices.deleteItemCard(id as string)
        res.status(201).json({
            success:true,
            message:"Cart item deleted successfully",
            data
        })
    } catch (err: any) {
        res.status(500).json({
            success:false,
            message:"Failed to delete  item",
            error: err.message
        })
    }
}



export const addCardController = {
    addItemCard,
    getAllItemCard,
    deleteItemCard,
    getItemCardById
}