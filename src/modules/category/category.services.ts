import { prisma } from "../../lib/prisma"

const createCategories = async(data:{categoryName:string, description:string})=>{
    return   prisma.category.create({data})
}

const getAllCategories = async()=>{
   return  prisma.category.findMany()
}

export const categoryServices = {
    createCategories,
    getAllCategories
}