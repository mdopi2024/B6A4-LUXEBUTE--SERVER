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


const getMealById = (id:string)=>{
    return  prisma.meal.findUnique({
        where:{id},
       include:{
          category:{
            select:{
                categoryName:true
            }
          }
       }
    })
}


const updateMeal = (id:string,data)=>{
   return prisma.meal.update({
    where:{id},
    data
   })
}

export const mealServices ={
    createMeal,
    getAllMeal,
    updateMeal,
    getMealById
}