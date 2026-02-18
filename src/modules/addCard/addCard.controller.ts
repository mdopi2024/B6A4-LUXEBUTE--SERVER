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

export const addCardController = {
    addItemCard,
}