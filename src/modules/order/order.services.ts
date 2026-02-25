import { OrderStatus } from "../../../prisma/generated/prisma/enums"
import { prisma } from "../../lib/prisma"

interface OrderTypes {
    mealId: string,
    userId: string,
    totalAmount: number,
    quantity: number,
    paymentMethod: string,
    delevaryAddress: string
}

const createOrder = (data: OrderTypes) => {
    return prisma.order.create({ data })
}

const getSingleOrder = (id: string) => {
    return prisma.order.findUnique({
        where: { id }
    })
}
const getOrderById = (userId: string) => {
    return prisma.order.findMany({
        where: { userId },
        include:{
            meal:{
                include:{category:true}
            }
        }
    })
}
const updateOrderStatus = (id: string,data:{status:OrderStatus}) => {
 
    return prisma.order.update({
        where: { id },
        data
    })
}
const getAllOrders = ()=>{
     return prisma.order.findMany({
        include:{
            meal:{
                include:{category:true}
            },
            user:{
                select:{email:true,name:true}
            }
        }
    })
}

export const orderServices = {
    createOrder,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
    getSingleOrder
}