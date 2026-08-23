-- CreateEnum
CREATE TYPE "CourseDepth" AS ENUM ('QUICK_START', 'STANDARD', 'COMPREHENSIVE');

-- AlterTable
ALTER TABLE "Course"
ADD COLUMN "courseDepth" "CourseDepth" NOT NULL DEFAULT 'STANDARD';
