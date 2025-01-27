-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "metadata" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FeatureUsage" (
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "successRate" REAL NOT NULL DEFAULT 0,
    "timeSpent" REAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("userId", "featureId")
);

-- CreateIndex
CREATE INDEX "UserInteraction_userId_timestamp_idx" ON "UserInteraction"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "FeatureUsage_featureId_usageCount_idx" ON "FeatureUsage"("featureId", "usageCount");
