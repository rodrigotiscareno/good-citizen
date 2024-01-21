-- CreateTable
CREATE TABLE `meta_analysis` (
    `meta_analysis_id` INTEGER NOT NULL AUTO_INCREMENT,
    `voice_id` INTEGER NULL,
    `feed_id` INTEGER NULL,
    `category` VARCHAR(191) NULL,
    `sentimentScore` INTEGER NULL,

    UNIQUE INDEX `meta_analysis_voice_id_key`(`voice_id`),
    UNIQUE INDEX `meta_analysis_feed_id_key`(`feed_id`),
    PRIMARY KEY (`meta_analysis_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `meta_analysis` ADD CONSTRAINT `meta_analysis_voice_id_fkey` FOREIGN KEY (`voice_id`) REFERENCES `voice`(`voice_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meta_analysis` ADD CONSTRAINT `meta_analysis_feed_id_fkey` FOREIGN KEY (`feed_id`) REFERENCES `feed_posts`(`feed_id`) ON DELETE SET NULL ON UPDATE CASCADE;
