/*
  Warnings:

  - You are about to drop the `FeatureUsage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Match` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillMatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillRelation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Swipe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserInteraction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `applicationsCount` on the `JobListing` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `JobSkill` table. All the data in the column will be lost.
  - You are about to drop the column `jobListingId` on the `JobSkill` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `JobSkill` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `embedding` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `UserSkill` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsed` on the `UserSkill` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `UserSkill` table. All the data in the column will be lost.
  - You are about to alter the column `yearsOfExperience` on the `UserSkill` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - Added the required column `jobId` to the `JobSkill` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FeatureUsage_featureId_usageCount_idx";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- DropIndex
DROP INDEX "SkillMatch_matchId_skillId_key";

-- DropIndex
DROP INDEX "SkillRelation_fromSkillId_toSkillId_type_key";

-- DropIndex
DROP INDEX "Swipe_userId_jobListingId_key";

-- DropIndex
DROP INDEX "UserInteraction_userId_timestamp_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FeatureUsage";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Match";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Profile";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SkillMatch";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SkillRelation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Swipe";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserInteraction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "coverLetter" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobListing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "salary" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("company", "createdAt", "description", "id", "location", "requirements", "salary", "title", "type", "updatedAt", "userId") SELECT "company", "createdAt", "description", "id", "location", "requirements", "salary", "title", "type", "updatedAt", "userId" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
CREATE TABLE "new_JobSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "importance" REAL NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "JobSkill_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobListing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "JobSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JobSkill" ("id", "importance", "required", "skillId") SELECT "id", "importance", "required", "skillId" FROM "JobSkill";
DROP TABLE "JobSkill";
ALTER TABLE "new_JobSkill" RENAME TO "JobSkill";
CREATE UNIQUE INDEX "JobSkill_jobId_skillId_key" ON "JobSkill"("jobId", "skillId");
CREATE TABLE "new_Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL
);
INSERT INTO "new_Skill" ("category", "id", "name") SELECT "category", "id", "name" FROM "Skill";
DROP TABLE "Skill";
ALTER TABLE "new_Skill" RENAME TO "Skill";
CREATE UNIQUE INDEX "Skill_name_key" ON "Skill"("name");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name") SELECT "email", "emailVerified", "id", "image", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_UserSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "proficiency" REAL NOT NULL,
    "yearsOfExperience" INTEGER,
    CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserSkill" ("id", "proficiency", "skillId", "userId", "yearsOfExperience") SELECT "id", "proficiency", "skillId", "userId", "yearsOfExperience" FROM "UserSkill";
DROP TABLE "UserSkill";
ALTER TABLE "new_UserSkill" RENAME TO "UserSkill";
CREATE UNIQUE INDEX "UserSkill_userId_skillId_key" ON "UserSkill"("userId", "skillId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_jobId_userId_key" ON "JobApplication"("jobId", "userId");
