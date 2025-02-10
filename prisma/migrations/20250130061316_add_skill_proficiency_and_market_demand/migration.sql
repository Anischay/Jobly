-- CreateTable
CREATE TABLE "SkillMarketDemand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "skillId" TEXT NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'STABLE',
    "score" REAL NOT NULL DEFAULT 0.5,
    "dataSource" TEXT,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SkillMarketDemand_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JobSkill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "jobListingId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "importance" REAL NOT NULL DEFAULT 1.0,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "proficiencyLevel" TEXT NOT NULL DEFAULT 'INTERMEDIATE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JobSkill_jobListingId_fkey" FOREIGN KEY ("jobListingId") REFERENCES "JobListing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JobSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JobSkill" ("createdAt", "id", "importance", "jobListingId", "required", "skillId", "updatedAt") SELECT "createdAt", "id", "importance", "jobListingId", "required", "skillId", "updatedAt" FROM "JobSkill";
DROP TABLE "JobSkill";
ALTER TABLE "new_JobSkill" RENAME TO "JobSkill";
CREATE UNIQUE INDEX "JobSkill_jobListingId_skillId_key" ON "JobSkill"("jobListingId", "skillId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SkillMarketDemand_skillId_key" ON "SkillMarketDemand"("skillId");
