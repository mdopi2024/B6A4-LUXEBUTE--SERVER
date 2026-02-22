import { prisma } from "../../lib/prisma"

interface CommentData{
    comment :string,
    rating:number,
    mealId:string,
    userId:string
}

const createComment = (data:CommentData)=>{
    return prisma.review.create({data})
}
const getReviewByMealId = (id:string)=>{
    return prisma.review.findMany({
        where:{mealId:id}
    })
}


export const commentServices ={
    createComment,
    getReviewByMealId,
}