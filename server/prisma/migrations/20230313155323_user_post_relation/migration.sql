/*
  Warnings:

  - Made the column `user_id` on table `voice` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `voice` MODIFY `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `voice` ADD CONSTRAINT `voice_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
