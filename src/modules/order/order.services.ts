import { prisma } from "../../lib/prisma"

interface OrderTypes {
    mealId:string,
    userId:string,
    totalAmount:number,
    quantity:number,
    paymentMethod:string,
    delevaryAddress:string
}

const createOrder = (data:OrderTypes)=>{
    return prisma.order.create({data})
}


export const orderServices ={
    createOrder,
}