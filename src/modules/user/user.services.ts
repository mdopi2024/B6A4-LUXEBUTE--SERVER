import { prisma } from "../../lib/prisma"

const getAllUser = ()=>{
    return prisma.user.findMany();
}

export const userServices = {
    getAllUser,
}