import { prisma } from "../../lib/prisma"

const createCategories = async(data:{categoryName:string, description:string})=>{
    return   prisma.category.create({data})
}

const getAllCategories = async()=>{
   return  prisma.category.findMany()
}


const getAllCategoryById = (id:string)=>{
   return prisma.category.findUnique({
    where:{
        id
    }
   })
}

const updateCategory = async(id:string,data:{categoryName:string, description:string})=>{
    return  prisma.category.update({
        where:{
            id
        },
       data
    })
}

const deleteCategory = async(id:string)=>{
    return prisma.category.delete({
        where:{
            id
        }
    })
}
export const categoryServices = {
    createCategories,
    getAllCategories,
    getAllCategoryById,
    updateCategory,
    deleteCategory,
}