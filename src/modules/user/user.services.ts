import { prisma } from "../../lib/prisma"

const getAllUser = ()=>{
    return prisma.user.findMany();
}

const getUserById = (id:string)=>{
    return prisma.user.findUnique({
        where:{id}
    })
}

const updateUserStatus = (id:string,data:{status:'ACTIVE' | 'SUSPENDED'})=>{
    return prisma.user.update({
        where:{id},
        data
    })
}

export const userServices = {
    getAllUser,
    getUserById,
    updateUserStatus
}