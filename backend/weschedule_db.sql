-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2023 at 06:49 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weschedule_db`
--
DROP DATABASE IF EXISTS `weschedule_db`;
CREATE DATABASE IF NOT EXISTS `franchise_2023`;
USE `weschedule_db`;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `first_date` date NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `creator_uid` int(11) NOT NULL,
  `start_time` time NOT NULL,
  `duration` int(11) NOT NULL,
  `repeat_period` enum('DAILY','WEEKLY','MONTHLY (SAME DAY NUMBER)','MONTHLY (SAME DAY OF WEEK)') DEFAULT NULL,
  `last_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `gid` int(11) NOT NULL,
  `owner_uid` int(11) NOT NULL,
  `creation_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `gid` int(11) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `time` datetime NOT NULL,
  `uid` int(11) NOT NULL,
  `text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `topic_members`
--

CREATE TABLE `topic_members` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `uid` int(11) NOT NULL,
  `event_perm` tinyint(1) NOT NULL,
  `message_perm` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `salt` binary(16) NOT NULL,
  `password_hash` binary(64) NOT NULL,
  `joined_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`gid`,`topic`,`first_date`,`name`),
  ADD KEY `EVENTS_USERS_FK` (`creator_uid`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`gid`),
  ADD KEY `GROUP_OWNER_UID_FK` (`owner_uid`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`gid`,`uid`),
  ADD KEY `GM_UID_FK` (`uid`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`gid`,`topic`,`time`,`uid`),
  ADD KEY `MESSAGES_TM_FK` (`gid`,`topic`,`uid`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`gid`,`topic`);

--
-- Indexes for table `topic_members`
--
ALTER TABLE `topic_members`
  ADD PRIMARY KEY (`gid`,`topic`,`uid`),
  ADD KEY `TM_GM_FK` (`gid`,`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `USERS_EMAIL_UQ` (`email`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `gid` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `EVENTS_TOPICS_FK` FOREIGN KEY (`gid`,`topic`) REFERENCES `topics` (`gid`, `topic`),
  ADD CONSTRAINT `EVENTS_USERS_FK` FOREIGN KEY (`creator_uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `GROUP_OWNER_UID_FK` FOREIGN KEY (`owner_uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `GM_GID_FK` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`),
  ADD CONSTRAINT `GM_UID_FK` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `MESSAGES_TM_FK` FOREIGN KEY (`gid`,`topic`,`uid`) REFERENCES `topic_members` (`gid`, `topic`, `uid`);

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `TOPICS_GID_FK` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`);

--
-- Constraints for table `topic_members`
--
ALTER TABLE `topic_members`
  ADD CONSTRAINT `TM_GM_FK` FOREIGN KEY (`gid`,`uid`) REFERENCES `group_members` (`gid`, `uid`),
  ADD CONSTRAINT `TM_TOPIC_FK` FOREIGN KEY (`gid`,`topic`) REFERENCES `topics` (`gid`, `topic`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
