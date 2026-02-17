import { prisma } from "../../lib/prisma"

export interface CardTypes{
    userId:string,
    mealId:string

}

const addItemCard = (data:CardTypes)=>{
  return prisma.cardItem.create({data})
}

export const addCardServices = {
    addItemCard
}