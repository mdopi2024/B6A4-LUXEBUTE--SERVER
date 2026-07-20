import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'

import { loadEnv } from "../env";
import { PrismaClient } from "../../prisma/generated/prisma/client";

const env = loadEnv
const connectionString = `${env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export { prisma }