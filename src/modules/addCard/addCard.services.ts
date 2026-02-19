import { prisma } from "../../lib/prisma"

export interface CardTypes{
    userId:string,
    mealId:string

}

const addItemCard =async (data:CardTypes)=>{
    const isAxist = await prisma.cardItem.findFirst({
       where:{mealId:data.mealId,userId:data.userId}
    })
    if(isAxist){
        throw new Error("This item already exist in you card")
    }
  return prisma.cardItem.create({data})
}

const getAllItemCard = async(id:string)=>{
    return prisma.cardItem.findMany({
        where:{userId:id},
        include:{
            meal:{
                include:{category:{select:{categoryName:true}}}
            }
        }
    })
}
const deleteItemCard = async(id:string)=>{
    return prisma.cardItem.delete({
        where:{id},
       
    })
}

export const addCardServices = {
    addItemCard,
    getAllItemCard,
    deleteItemCard,
}