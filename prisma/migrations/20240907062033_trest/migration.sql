-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "depth" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("created_at", "depth", "id", "parentId", "payload", "postId", "updated_at", "userId") SELECT "created_at", "depth", "id", "parentId", "payload", "postId", "updated_at", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Pcomment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "payload" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "depth" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Pcomment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pcomment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pcomment" ("created_at", "depth", "id", "parentId", "payload", "productId", "updated_at", "userId") SELECT "created_at", "depth", "id", "parentId", "payload", "productId", "updated_at", "userId" FROM "Pcomment";
DROP TABLE "Pcomment";
ALTER TABLE "new_Pcomment" RENAME TO "Pcomment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
