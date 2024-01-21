/*
  Warnings:

  - Made the column `voice_id` on table `voice_mc` required. This step will fail if there are existing NULL values in that column.
  - Made the column `voice_id` on table `voice_results` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `voice_mc` MODIFY `voice_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `voice_results` MODIFY `voice_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `voice_mc` ADD CONSTRAINT `voice_mc_voice_id_fkey` FOREIGN KEY (`voice_id`) REFERENCES `voice`(`voice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voice_results` ADD CONSTRAINT `voice_results_voice_id_fkey` FOREIGN KEY (`voice_id`) REFERENCES `voice`(`voice_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
