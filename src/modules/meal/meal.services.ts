import { prisma } from "../../lib/prisma"


interface MealType {
    name:string, 
    description:string
    price:string
    image:string
    categoryId:string
}


const createMeal = (data:MealType)=>{
   return prisma.meal.create({data})
}

const getAllMeal = ()=>{
    return  prisma.meal.findMany({
       include:{
          category:{
            select:{
                categoryName:true
            }
          }
       }
    })
}

export const mealServices ={
    createMeal,
    getAllMeal
}