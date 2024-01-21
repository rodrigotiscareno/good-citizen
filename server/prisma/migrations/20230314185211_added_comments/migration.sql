-- CreateTable
CREATE TABLE `comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `feed_id` INTEGER NULL,
    `voice_id` INTEGER NULL,
    `event_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `created_on` TEXT NULL,
    `content` TEXT NULL,
    `status` TEXT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_feed_id_fkey` FOREIGN KEY (`feed_id`) REFERENCES `feed_posts`(`feed_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_voice_id_fkey` FOREIGN KEY (`voice_id`) REFERENCES `voice`(`voice_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE SET NULL ON UPDATE CASCADE;
