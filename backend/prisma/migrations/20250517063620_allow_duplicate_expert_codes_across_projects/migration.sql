-- DropIndex
DROP INDEX "Expert_code_key";

-- CreateIndex
CREATE UNIQUE INDEX "Expert_code_projectId_key" ON "Expert"("code", "projectId");