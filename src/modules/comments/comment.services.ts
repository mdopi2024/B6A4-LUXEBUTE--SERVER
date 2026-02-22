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


export const commentServices ={
    createComment,
}