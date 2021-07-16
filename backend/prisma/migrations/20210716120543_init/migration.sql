-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Webhook" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "adminID" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin.id_unique" ON "Admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Admin.username_unique" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Webhook.id_unique" ON "Webhook"("id");

-- AddForeignKey
ALTER TABLE "Webhook" ADD FOREIGN KEY ("adminID") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
