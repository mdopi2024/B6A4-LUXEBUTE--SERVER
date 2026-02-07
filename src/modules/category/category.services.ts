import { prisma } from "../../lib/prisma"

const createCategories = async(data:{categoryName:string, description:string})=>{
    return  await  prisma.category.create({data})
}

export const categoryServices = {
    createCategories
}