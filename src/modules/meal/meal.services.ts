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

export const mealServices ={
    createMeal
}