-- CreateTable
CREATE TABLE `events` (
    `event_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NULL,
    `date_start` TIMESTAMP(0) NULL,
    `date_end` TIMESTAMP(0) NULL,
    `description` VARCHAR(1000) NULL,
    `location` VARCHAR(255) NULL,
    `centre_lat` DOUBLE NULL,
    `centre_long` DOUBLE NULL,
    `invite_criteria` VARCHAR(255) NULL,
    `status` VARCHAR(255) NULL,
    `neighborhood_id` INTEGER NULL,
    `host_user_id` INTEGER NULL,

    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feed_comments` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `feed_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `created_on` TEXT NULL,
    `content` TEXT NULL,
    `status` TEXT NULL,

    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feed_posts` (
    `feed_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `event_id` INTEGER NULL,
    `created_on` TEXT NULL,
    `status` TEXT NULL,
    `content` TEXT NULL,
    `neighborhood_id` INTEGER NULL,
    `parent_feed_id` INTEGER NULL,

    PRIMARY KEY (`feed_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `neighborhoods` (
    `neighborhood_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NULL,
    `centre_lat` DOUBLE NULL,
    `centre_long` DOUBLE NULL,
    `created_on` TIMESTAMP(0) NULL,

    PRIMARY KEY (`neighborhood_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `notice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `date_start` TIMESTAMP(0) NOT NULL,
    `date_end` TIMESTAMP(0) NOT NULL,
    `description` TEXT NULL,
    `icon` TEXT NULL,
    `location` VARCHAR(255) NULL,
    `centre_lat` DOUBLE NULL,
    `centre_long` DOUBLE NULL,
    `status` TEXT NULL,
    `neighborhood_id` INTEGER NULL,
    `host_user_id` INTEGER NULL,

    PRIMARY KEY (`notice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` TEXT NOT NULL,
    `password_hash` TEXT NULL,
    `created_on` TEXT NOT NULL,
    `status` VARCHAR(455) NOT NULL,
    `first_name` TEXT NOT NULL,
    `last_name` TEXT NOT NULL,
    `postal_code` TEXT NULL,
    `profile_picture_link` TEXT NULL,
    `neighborhood_id` INTEGER NULL,
    `user_type` TEXT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice` (
    `voice_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `question` TEXT NULL,
    `description` TEXT NULL,
    `is_mc` BOOLEAN NULL,
    `is_shortanswer` BOOLEAN NULL,
    `is_datetime` BOOLEAN NULL,
    `duration_days` INTEGER NULL,
    `created_on` DATE NULL,
    `end_date` DATE NULL,
    `status` TEXT NULL,

    PRIMARY KEY (`voice_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_mc` (
    `voice_mc_option_id` INTEGER NOT NULL AUTO_INCREMENT,
    `voice_id` INTEGER NULL,
    `title` TEXT NULL,

    PRIMARY KEY (`voice_mc_option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_results` (
    `voice_results_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `created_on` DATE NULL,
    `answer` TEXT NULL,
    `voice_id` INTEGER NULL,

    PRIMARY KEY (`voice_results_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

