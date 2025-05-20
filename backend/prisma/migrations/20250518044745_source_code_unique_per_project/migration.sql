-- DropIndex
DROP INDEX "Source_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Source_code_projectId_key" ON "Source"("code", "projectId");