import { prisma } from "../../lib/prisma"
import { Prisma } from "@prisma/client";
import { GetAllMealParams } from "./meal.controller";

interface MealType {
    name:string, 
    description:string
    price:string
    image:string
    categoryId:string
}
interface UpdatedMealType {
    name:string, 
    description:string
    price:string
    image:string
    categoryId:string
}




const createMeal = (data:MealType)=>{
   return prisma.meal.create({data})
}


const getAllMeal = async (params: GetAllMealParams) => {
    const {
        search,
        page = 1,
        limit = 2,
        categoryId,
        isAvailable,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // Build dynamic where clause
    const andConditions: Prisma.MealWhereInput[] = [];

    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { categoryName: { contains: search, mode: "insensitive" } } },
            ],
        });
    }

    if (categoryId) {
        andConditions.push({ categoryId });
    }

    if (isAvailable !== undefined) {
        andConditions.push({ isAvailable });
    }

    const whereConditions: Prisma.MealWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    // Run count + data queries in parallel
    const [data, total] = await Promise.all([
        prisma.meal.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: { [sortBy]: sortOrder },
            include: {
                category: {
                    select: {
                        categoryName: true,
                    },
                },
            },
        }),
        prisma.meal.count({ where: whereConditions }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data,
    };
};


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


const updateMeal = (id:string,data:UpdatedMealType)=>{
   return prisma.meal.update({
    where:{id},
    data
   })
}

const deleteMeal = (id:string)=>{
    return  prisma.meal.delete({
        where:{id}
    })
}

export const mealServices ={
    createMeal,
    getAllMeal,
    updateMeal,
    getMealById,
    deleteMeal,
}