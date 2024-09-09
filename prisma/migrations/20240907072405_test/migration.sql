/*
  Warnings:

  - You are about to drop the column `depth` on the `Pcomment` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pcomment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Pcomment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pcomment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pcomment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Pcomment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pcomment" ("created_at", "id", "parentId", "payload", "productId", "updated_at", "userId") SELECT "created_at", "id", "parentId", "payload", "productId", "updated_at", "userId" FROM "Pcomment";
DROP TABLE "Pcomment";
ALTER TABLE "new_Pcomment" RENAME TO "Pcomment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
