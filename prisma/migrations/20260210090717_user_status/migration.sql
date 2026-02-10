-- CreateEnum
CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "status" "userStatus" NOT NULL DEFAULT 'ACTIVE';
