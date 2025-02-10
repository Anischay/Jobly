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
    "userId" TEXT NOT NULL,
    "applicationsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "JobListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_JobListing" ("company", "createdAt", "description", "id", "location", "requirements", "salary", "title", "type", "updatedAt", "userId") SELECT "company", "createdAt", "description", "id", "location", "requirements", "salary", "title", "type", "updatedAt", "userId" FROM "JobListing";
DROP TABLE "JobListing";
ALTER TABLE "new_JobListing" RENAME TO "JobListing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
