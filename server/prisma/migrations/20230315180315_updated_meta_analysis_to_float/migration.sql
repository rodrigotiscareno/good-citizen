/*
  Warnings:

  - You are about to alter the column `sentimentScore` on the `meta_analysis` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `meta_analysis` MODIFY `sentimentScore` DOUBLE NULL;
