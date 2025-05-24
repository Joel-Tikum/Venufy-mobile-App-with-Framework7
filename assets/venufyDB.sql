-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2025 at 04:19 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `venufy`
--

-- --------------------------------------------------------

--
-- Table structure for table `v_events`
--

CREATE TABLE `v_events` (
  `id` int(11) NOT NULL,
  `venueId` int(11) NOT NULL,
  `organizer` int(11) NOT NULL,
  `title` text NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `v_events`
--

INSERT INTO `v_events` (`id`, `venueId`, `organizer`, `title`, `description`, `date`, `status`, `created_on`) VALUES
(53, 51, 20, 'Birthday Party', 'My twenty-forth birthday celebration', '2025-10-17', 0, '2025-05-03 05:39:18'),
(63, 51, 20, 'New Event', 'New Event', '2025-05-13', 0, '2025-05-12 19:44:59');

-- --------------------------------------------------------

--
-- Table structure for table `v_images`
--

CREATE TABLE `v_images` (
  `id` int(11) NOT NULL,
  `venueId` int(50) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `v_images`
--

INSERT INTO `v_images` (`id`, `venueId`, `image`) VALUES
(64, 47, 'images\\venues\\1745668923448-630846307.jfif'),
(65, 47, 'images\\venues\\1745669003568-924585302.jfif'),
(66, 48, 'images\\venues\\1745669306252-509911872.jfif'),
(67, 48, 'images\\venues\\1745669330245-653747533.jfif'),
(70, 51, 'images\\venues\\1745929516262-294605303.jfif'),
(71, 51, 'images\\venues\\1746092460205-431628756.jfif'),
(72, 51, 'images\\venues\\1746092483258-140599512.jfif'),
(73, 47, 'images\\venues\\1746095811210-618185023.jfif');

-- --------------------------------------------------------

--
-- Table structure for table `v_notifications`
--

CREATE TABLE `v_notifications` (
  `id` int(11) NOT NULL,
  `initiator_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `message` text NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_on` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `v_notifications`
--

INSERT INTO `v_notifications` (`id`, `initiator_id`, `receiver_id`, `type`, `message`, `created_on`, `expires_on`, `status`) VALUES
(1, 22, 20, 'Comment', 'Your are doing well Joel Tikum', '2025-05-11 12:16:28', '2025-05-31 12:14:10', 0);

-- --------------------------------------------------------

--
-- Table structure for table `v_users`
--

CREATE TABLE `v_users` (
  `id` int(11) NOT NULL,
  `fname` text NOT NULL,
  `lname` text NOT NULL,
  `email` varchar(25) NOT NULL,
  `contact` int(25) NOT NULL,
  `photo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `v_users`
--

INSERT INTO `v_users` (`id`, `fname`, `lname`, `email`, `contact`, `photo`) VALUES
(20, 'Joel', 'Tikum', 'joeltikum646@gmail.com', 652480055, 'images\\users\\1746064967837-491426464.jpeg'),
(22, 'Nzume', 'Jude', 'sonlion@gmail.com', 652153995, 'images\\users\\1746065689832-485519043.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `v_venues`
--

CREATE TABLE `v_venues` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `address` text NOT NULL,
  `capacity` double NOT NULL,
  `pricing` double NOT NULL,
  `description` text NOT NULL,
  `image` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `owner` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `v_venues`
--

INSERT INTO `v_venues` (`id`, `name`, `address`, `capacity`, `pricing`, `description`, `image`, `status`, `owner`) VALUES
(47, 'H\'S Party Hall', 'Molyko - Buea', 500, 100000, 'M\'S Party Hall is a multipurpose hall, with several amenities, some of which include an AC, external water closet with constant water supply and a standby generator. We also offer decoration services optionally.', 'images\\venues\\1745668923448-630846307.jfif', 0, 20),
(48, 'King\'s Party Hub', 'City Chemist - Bamenda', 200, 50000, 'King\'s Party Hub is a multipurpose hall, with several amenities, some of which include an AC, external water closet with constant water supply and a standby generator. We also offer decoration services optionally.', 'images\\venues\\1745669306252-509911872.jfif', 0, 20),
(51, 'Party Ven', 'Kumba', 500, 10000, 'A great choice', 'images\\venues\\1745929516262-294605303.jfif', 0, 22);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `v_events`
--
ALTER TABLE `v_events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Deleting a venue also deletes all the events` (`venueId`) USING BTREE,
  ADD KEY `Deleting an account also deletes all the events` (`organizer`) USING BTREE;

--
-- Indexes for table `v_images`
--
ALTER TABLE `v_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FOREIGN KEY` (`venueId`);

--
-- Indexes for table `v_notifications`
--
ALTER TABLE `v_notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Deleting an account also deletes all the notifications` (`receiver_id`);

--
-- Indexes for table `v_users`
--
ALTER TABLE `v_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `v_venues`
--
ALTER TABLE `v_venues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Deleting an account also deletes all the venues` (`owner`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `v_events`
--
ALTER TABLE `v_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `v_images`
--
ALTER TABLE `v_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `v_notifications`
--
ALTER TABLE `v_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `v_users`
--
ALTER TABLE `v_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `v_venues`
--
ALTER TABLE `v_venues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `v_events`
--
ALTER TABLE `v_events`
  ADD CONSTRAINT `Deleting a venues also deletes all the events` FOREIGN KEY (`organizer`) REFERENCES `v_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `v_images`
--
ALTER TABLE `v_images`
  ADD CONSTRAINT `FOREIGN KEY` FOREIGN KEY (`venueId`) REFERENCES `v_venues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `v_notifications`
--
ALTER TABLE `v_notifications`
  ADD CONSTRAINT `Deleting an account also deletes all the notifications` FOREIGN KEY (`receiver_id`) REFERENCES `v_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `v_venues`
--
ALTER TABLE `v_venues`
  ADD CONSTRAINT `Deleting an account also deletes all the venues` FOREIGN KEY (`owner`) REFERENCES `v_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
