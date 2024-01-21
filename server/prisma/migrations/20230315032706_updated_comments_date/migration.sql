/*
  Warnings:

  - You are about to alter the column `created_on` on the `comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Date`.

*/
-- AlterTable
ALTER TABLE `comments` MODIFY `created_on` DATE NULL;
