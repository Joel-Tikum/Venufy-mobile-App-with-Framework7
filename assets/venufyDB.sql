-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2025 at 03:48 AM
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

-- --------------------------------------------------------

--
-- Table structure for table `v_images`
--

CREATE TABLE `v_images` (
  `id` int(11) NOT NULL,
  `venueId` int(50) NOT NULL,
  `image` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `v_notifications`
--

CREATE TABLE `v_notifications` (
  `id` int(11) NOT NULL,
  `initiator_id` int(11) DEFAULT NULL,
  `receiver_id` int(11) NOT NULL,
  `type` text NOT NULL,
  `message` text NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_on` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `v_transactions`
--

CREATE TABLE `v_transactions` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `venue_id` int(11) NOT NULL,
  `payer_id` int(11) NOT NULL,
  `trans_id` varchar(50) NOT NULL,
  `trans_type` tinytext NOT NULL,
  `amount` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indexes for table `v_transactions`
--
ALTER TABLE `v_transactions`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `v_images`
--
ALTER TABLE `v_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `v_notifications`
--
ALTER TABLE `v_notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `v_transactions`
--
ALTER TABLE `v_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `v_users`
--
ALTER TABLE `v_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

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
