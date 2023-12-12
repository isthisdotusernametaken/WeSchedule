-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2023 at 10:59 PM
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
CREATE DATABASE IF NOT EXISTS `weschedule_db`;
USE `weschedule_db`;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `time` datetime NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `duration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `gid` int(11) NOT NULL,
  `name` char(50) NOT NULL,
  `owner_username` char(20) NOT NULL,
  `creation_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`gid`, `name`, `owner_username`, `creation_time`) VALUES
(11, 'Bob\'s Company', 'bobsAccount', '2023-12-11 11:43:55'),
(12, 'Bob\'s Acting Troupe', 'bobsAccount', '2023-12-11 11:44:19'),
(13, 'The Secret Group', 'yetAnotherUser', '2023-12-11 13:54:22');

-- --------------------------------------------------------

--
-- Table structure for table `group_logs`
--

CREATE TABLE `group_logs` (
  `gid` int(11) NOT NULL,
  `time` datetime NOT NULL,
  `description` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `group_members`
--

CREATE TABLE `group_members` (
  `gid` int(11) NOT NULL,
  `username` char(20) NOT NULL,
  `joined_time` datetime NOT NULL,
  `local_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `group_members`
--

INSERT INTO `group_members` (`gid`, `username`, `joined_time`, `local_admin`) VALUES
(11, 'bobsAccount', '2023-12-11 11:43:55', 1),
(11, 'mylastnameiscool', '2023-12-11 13:02:05', 0),
(11, 'ray005', '2023-12-11 13:01:48', 1),
(11, 'yetAnotherUser', '2023-12-11 13:11:12', 0),
(12, 'anotherUsername', '2023-12-11 13:02:47', 0),
(12, 'bobsAccount', '2023-12-11 11:44:19', 1),
(12, 'mylastnameiscool', '2023-12-11 13:02:33', 0),
(12, 'yetAnotherUser', '2023-12-11 13:11:08', 0),
(13, 'anotherUsername', '2023-12-11 13:55:04', 0),
(13, 'mylastnameiscool', '2023-12-11 13:54:57', 0),
(13, 'yetAnotherUser', '2023-12-11 13:54:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `time` datetime NOT NULL,
  `username` char(20) NOT NULL,
  `text` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`gid`, `topic`, `time`, `username`, `text`) VALUES
(11, 'General', '2023-12-11 13:30:28', 'bobsaccount', 'Welcome to the group!'),
(11, 'General', '2023-12-11 13:43:55', 'mylastnameiscool', 'Hello'),
(11, 'Production', '2023-12-11 13:38:58', 'bobsaccount', 'This channel is for discussing and scheduling the releases of products.'),
(11, 'Production', '2023-12-11 13:44:50', 'mylastnameiscool', 'The deadline for the scheduling app\'s release is coming up in a couple days'),
(11, 'Production', '2023-12-11 13:45:27', 'yetAnotherUser', 'Ugh, don\'t remind me'),
(11, 'Sales', '2023-12-11 13:39:23', 'bobsaccount', 'This channel is for developing and evaluating marketing strategies.'),
(11, 'Testing', '2023-12-11 13:39:52', 'bobsaccount', 'This channel is for discussing and planning how to test products that are currently in development.'),
(12, 'General', '2023-12-11 13:40:38', 'bobsaccount', 'Welcome to the acting group! Feel free to drop any fun ideas in the Skit Ideas topic.'),
(12, 'General', '2023-12-11 13:51:32', 'yetAnotherUser', 'I am a dancer. That is to say, a conduit. I don\'t define movement — movement defines me. Every dance tells a story, a human mind. Exploration.'),
(12, 'Scheduling', '2023-12-11 13:41:45', 'bobsaccount', 'We can discuss what dates work for everyone in this topic');

-- --------------------------------------------------------

--
-- Table structure for table `topics`
--

CREATE TABLE `topics` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `description` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topics`
--

INSERT INTO `topics` (`gid`, `topic`, `description`) VALUES
(11, 'General', ''),
(11, 'Production', 'Product deployment'),
(11, 'Sales', 'Marketing discussions'),
(11, 'Testing', 'Product testing'),
(12, 'General', ''),
(12, 'Scheduling', 'Planning events'),
(12, 'Skit Ideas', 'Skit brainstorming'),
(13, 'General', '');

-- --------------------------------------------------------

--
-- Table structure for table `topic_members`
--

CREATE TABLE `topic_members` (
  `gid` int(11) NOT NULL,
  `topic` varchar(50) NOT NULL,
  `username` char(20) NOT NULL,
  `event_perm` tinyint(1) NOT NULL,
  `message_perm` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `topic_members`
--

INSERT INTO `topic_members` (`gid`, `topic`, `username`, `event_perm`, `message_perm`) VALUES
(11, 'General', 'bobsAccount', 1, 1),
(11, 'General', 'mylastnameiscool', 0, 1),
(11, 'General', 'ray005', 1, 1),
(11, 'General', 'yetAnotherUser', 0, 1),
(11, 'Production', 'bobsAccount', 1, 1),
(11, 'Production', 'mylastnameiscool', 0, 1),
(11, 'Production', 'yetAnotherUser', 0, 1),
(11, 'Sales', 'bobsAccount', 1, 1),
(11, 'Sales', 'ray005', 1, 1),
(11, 'Testing', 'bobsAccount', 1, 1),
(11, 'Testing', 'mylastnameiscool', 0, 1),
(11, 'Testing', 'yetAnotherUser', 0, 1),
(12, 'General', 'anotherUsername', 1, 1),
(12, 'General', 'bobsAccount', 1, 1),
(12, 'General', 'mylastnameiscool', 1, 1),
(12, 'General', 'yetAnotherUser', 1, 1),
(12, 'Scheduling', 'anotherUsername', 1, 1),
(12, 'Scheduling', 'bobsAccount', 1, 1),
(12, 'Scheduling', 'mylastnameiscool', 1, 1),
(12, 'Scheduling', 'yetAnotherUser', 1, 1),
(12, 'Skit ideas', 'bobsAccount', 1, 1),
(12, 'Skit Ideas', 'mylastnameiscool', 1, 1),
(12, 'Skit Ideas', 'yetAnotherUser', 1, 1),
(13, 'General', 'anotherUsername', 1, 1),
(13, 'General', 'mylastnameiscool', 1, 1),
(13, 'General', 'yetAnotherUser', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` char(20) NOT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `salt` binary(16) NOT NULL,
  `password_hash` binary(64) NOT NULL,
  `joined_time` datetime NOT NULL,
  `lang` char(20) NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `name`, `email`, `salt`, `password_hash`, `joined_time`, `lang`, `admin`) VALUES
('admin', 'Global Admin', 'admin', 0x1d11b6c076f3abf13f92e0b68e14cc29, 0x0ac1c17a205d25d87c9fe502b8be878c3286f640805b94d745e619087ea4706dceadeb5e8d6c8d1596664f728fd90d4c92dd5889b2a9fe9b62a1430c2a57dd23, '2023-12-08 22:47:18', 'en', 1),
('anotherUsername', 'Don R. Member', 'aGroupMember3@test.com', 0x6919550d37a4a7c35ff50e920309d44e, 0x6e33dc35f6b00bc6cb61ccb2637c7de01664a7d44817076c93d9844bb1bc481b6f8e0a565fdb31a1489893ed7a13e842a1166da5aa94253598a458d9769a2da8, '2023-12-08 11:34:00', 'es', 0),
('bobsAccount', 'Bob Realperson', 'aGroupOwner@test.com', 0x92b0c9e172b70fca14841c14957d375d, 0x1d32726bcdd9409b10c6bc18bee41eafab6ed73d20c4fba1296f2ca93621e9409fd79ec9156ae838ff6df671bfc0bb8aee8c02ea5c7506ca9e8b281ff0b42361, '2023-12-08 11:31:48', 'en', 0),
('merefish', 'Ariel Person', 'example@example.com', 0xcb4c4ff983ad1a77f20038ee756b715e, 0x4a2167352d72ade7616bc78a2d47255386270e962f42302c9da66e3a34eaf1aeea25b87ae903172be9e281b27fd13389946b1f6c52dd0635ace8d68781fd60c9, '2023-12-09 17:27:20', 'en', 0),
('mylastnameiscool', 'Sally Lastname', 'aGroupMember2@test.com', 0xf821586ee56cab8e61791c38b57d4d4f, 0xc44cf2dc70566d3e1a1d7e8d20dcf338336e3c7c6152b02bf9c34bb3192ff4015034853ecf776a91fae5ce06c2db2238afaf969273792b5227506bf92c620718, '2023-12-08 11:33:50', 'en', 0),
('ray005', 'Ray Realpersonson', 'aGroupMember1@test.com', 0x0744198d7483d1ca0676f08f66aabec1, 0x61a34430988137bad291c5aab3c345a9988aaf54835ddcb684bcf030cb19e2d59782f8438e3b354392531f7ae3a5815f81944e20d31c19ff32218de2cc033ef3, '2023-12-08 11:33:00', 'en', 0),
('yetAnotherUser', 'Green Greene', 'aGroupMember4@test.com', 0x059583708b3ae723012107c7a817df04, 0x935eda74b3d5b8e3362e26b8069355922e8624aeb1bda29372373b3648cd7c634c786f51cded14450b18f4ee54ee250fc980c5ae8c5af23ba3f0278bc1cca230, '2023-12-11 13:09:54', 'es', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`gid`,`topic`,`time`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`gid`),
  ADD KEY `GROUPS_USERNAME_FK` (`owner_username`);

--
-- Indexes for table `group_logs`
--
ALTER TABLE `group_logs`
  ADD PRIMARY KEY (`gid`,`time`);

--
-- Indexes for table `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`gid`,`username`),
  ADD KEY `GM_USERNAME_FK` (`username`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`gid`,`topic`,`time`,`username`),
  ADD KEY `MESSAGES_TM_FK_1` (`gid`,`topic`,`username`);

--
-- Indexes for table `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`gid`,`topic`);

--
-- Indexes for table `topic_members`
--
ALTER TABLE `topic_members`
  ADD PRIMARY KEY (`gid`,`topic`,`username`),
  ADD KEY `TM_GM_FK` (`gid`,`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`),
  ADD UNIQUE KEY `USERS_EMAIL_UQ` (`email`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `gid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `EVENTS_TOPICS_FK_1` FOREIGN KEY (`gid`,`topic`) REFERENCES `topics` (`gid`, `topic`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `GROUPS_USERNAME_FK` FOREIGN KEY (`owner_username`) REFERENCES `users` (`username`);

--
-- Constraints for table `group_logs`
--
ALTER TABLE `group_logs`
  ADD CONSTRAINT `GL_GROUP_FK` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`) ON DELETE CASCADE;

--
-- Constraints for table `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `GM_GID_FK` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`) ON DELETE CASCADE,
  ADD CONSTRAINT `GM_USERNAME_FK` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `MESSAGES_TM_FK_1` FOREIGN KEY (`gid`,`topic`,`username`) REFERENCES `topic_members` (`gid`, `topic`, `username`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `TOPICS_GID_FK` FOREIGN KEY (`gid`) REFERENCES `groups` (`gid`) ON DELETE CASCADE;

--
-- Constraints for table `topic_members`
--
ALTER TABLE `topic_members`
  ADD CONSTRAINT `TM_GM_FK` FOREIGN KEY (`gid`,`username`) REFERENCES `group_members` (`gid`, `username`) ON DELETE CASCADE,
  ADD CONSTRAINT `TM_TOPIC_FK` FOREIGN KEY (`gid`,`topic`) REFERENCES `topics` (`gid`, `topic`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
