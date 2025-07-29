-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: cbc_mis
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `cbc_mis`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `cbc_mis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `cbc_mis`;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `term` varchar(10) DEFAULT NULL,
  `year` year DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'2',2025,'2025-07-22 07:28:56'),(2,'2',2025,'2025-07-22 07:38:33');
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performance`
--

DROP TABLE IF EXISTS `performance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `performance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_name` varchar(100) DEFAULT NULL,
  `adm_no` varchar(50) DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL,
  `term` varchar(10) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `submitted_by` varchar(50) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performance`
--

LOCK TABLES `performance` WRITE;
/*!40000 ALTER TABLE `performance` DISABLE KEYS */;
/*!40000 ALTER TABLE `performance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performances`
--

DROP TABLE IF EXISTS `performances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `performances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `exam_id` int DEFAULT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `remark` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `exam_id` (`exam_id`),
  CONSTRAINT `performances_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `performances_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `performances_chk_1` CHECK ((`level` between 1 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performances`
--

LOCK TABLES `performances` WRITE;
/*!40000 ALTER TABLE `performances` DISABLE KEYS */;
INSERT INTO `performances` VALUES (1,1,1,'English',3,'Meeting Expectations','2025-07-22 07:28:56'),(2,1,1,'Mathematics',4,'Exceeding Expectations','2025-07-22 07:28:56'),(3,1,1,'Science',2,'Approaching Expectations','2025-07-22 07:28:56'),(4,2,2,'Language Activities',3,'Meeting Expectations','2025-07-22 07:38:33'),(5,2,2,'Mathematical Activities',2,'Approaching Expectations','2025-07-22 07:38:33'),(6,2,2,'Environmental Activities',3,'Meeting Expectations','2025-07-22 07:38:33'),(7,2,2,'Psychomotor & Creative Activities',2,'Approaching Expectations','2025-07-22 07:38:33'),(8,2,2,'Religious Education',3,'Meeting Expectations','2025-07-22 07:38:33');
/*!40000 ALTER TABLE `performances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_subjects`
--

DROP TABLE IF EXISTS `report_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int DEFAULT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  CONSTRAINT `report_subjects_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_subjects`
--

LOCK TABLES `report_subjects` WRITE;
/*!40000 ALTER TABLE `report_subjects` DISABLE KEYS */;
INSERT INTO `report_subjects` VALUES (4,1,'Mathematics',3,'Meeting Expectations'),(5,1,'English',4,'Exceeding Expectations'),(6,1,'Science',2,'Approaching Expectations');
/*!40000 ALTER TABLE `report_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `term` varchar(10) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `opening_date` date DEFAULT NULL,
  `closing_date` date DEFAULT NULL,
  `remarks_on_core_competencies` text,
  `class_teacher_comment` text,
  `head_teacher_comment` text,
  `class_teacher` varchar(100) DEFAULT NULL,
  `headteacher` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,'Term 2','2025','2025-07-23 11:49:53',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,3,'1','2025','2025-07-26 06:52:33','2025-07-19','2025-08-26','111','111','111','m1','1'),(3,3,'1','2025','2025-07-26 06:55:35','2025-07-19','2025-08-26','111','111','111','m1','1'),(4,3,'2','2025','2025-07-26 07:22:47','2025-07-19','2025-08-26','tttt','ttt','ttt','ttt','tttt'),(5,5,'1','2025','2025-07-26 09:02:31','2025-07-19','2025-08-26','222','222','222','Josphat Munyasia','Josphat Munyasia'),(6,8,'1','2025','2025-07-28 11:04:01','2025-07-19','2025-08-26','COMMENT','COMMENT','COMMENT','Odero','Josphat'),(7,9,'2','2025','2025-07-28 11:09:42','2025-08-01','2025-08-27','SHANIIE','SHANNIE','SHANNIE','SHANNIE','SHANNIE');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `subject` varchar(100) NOT NULL,
  `performance_level` int NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `term` varchar(20) DEFAULT NULL,
  `year` year DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cat1` int DEFAULT '0',
  `cat2` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `results_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `adm_no` varchar(20) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `class_level` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `class` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adm_no` (`adm_no`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'00123','Jane Muthoni','Grade 4','2025-07-22 07:28:56',NULL,NULL),(2,'122','jane Muthoni','PP1','2025-07-22 07:38:33',NULL,NULL),(3,'1','Violet Ndawa',NULL,'2025-07-23 13:06:24','Grade 4','Female'),(5,'3','Flavian Akinyi',NULL,'2025-07-26 08:59:23','Grade 4','Female'),(6,'5','Mejumaa Swale',NULL,'2025-07-26 09:43:25','Grade 6','Female'),(8,'6','TEKLA MWAKA',NULL,'2025-07-28 11:01:49','Grade 3','Female'),(9,'7','BAHATI SAMSON',NULL,'2025-07-28 11:06:13','Grade 5','Female');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `grade_level` varchar(10) DEFAULT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `assigned_class` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (1,'munyasiajosphat@gmail.com','$2b$10$7nIedgMi0Ujl4nLs8RaEneGYZ.EaRxSNwGMYgyTxPdmWqKhfnW.D6','teacher','Grade 4'),(2,'josphatmukhwana5@gmail.com','$2b$10$IX8ayclwT3wv4pCh6UwpfuDgSL44bEFcpa50owHZwLR1y0GmgMU4q','admin',NULL),(3,'classteacher1','pass123','teacher',NULL),(5,'velmaantony5@gmail.com','$2b$10$jNJpZut9Asx9UPEOw4q51uAMkdcjZPG4cYouxG75.NKAiC70FTEaG','teacher','PP1'),(6,'maimunaomar953@gmail.com','$2b$10$6w4rr.8Q5UZjeJWZSPJGmezNh5NvWjswvfNr6PyDsTuigorjr61sC','teacher','PP2'),(7,'loicemusamali@gmail.com','$2b$10$gx47sqEND6YXPKLjBV6qveKRzUILLR0WA/QNGO527mBmf12fiXBA.','teacher','Grade 1'),(8,'shanimatanomatano@gmail.com','$2b$10$uFfARBElEOliFOvDq.IYWuLZt.ILeocYMePZpTxk0muYG6GoGcR4q','teacher','Grade 2'),(9,'oderowyclife48@gmail.com','$2b$10$5OqraCfihKcrT/1ae7dQ0eri81pUO4nRSjtQvhnCho5dgFHVaWNUe','teacher','Grade 3'),(10,'Josphat Munyasia','$2b$10$HzZAFby92nSjOTWIzlu5.OynEZESoHLq799lY70sasrWG3G6DbW.K','teacher','Grade 6'),(11,'linahmboashi@gmail.com','$2b$10$ws2WfUPRap9h7UPeJpmJu.DYqFi3tIhbrfmoYs9Q8ncaBkyFW2fza','teacher','Play Group'),(12,'amadishannie@gmail.com','$2b$10$r1n5a/nGCjCP9I83MyT50eTG.XkAkdNk3.WU1i15IQEIagLSj5dSS','teacher','Grade 5'),(13,'grade7@school.com','$2b$10$Eg3LvCZPQsVQVyV/hAcDlORP7aA59F2O4SDN5hGtYmpj/I9/ZctIe',NULL,NULL),(14,'grade8@school.com','$2b$10$WIAuCLfSU9SnX1vRrjEVw.o.AuXz4Vq6M8AzOcMFilSt60/2iSmH6',NULL,NULL),(15,'grade9@school.com','$2b$10$FSHGscHU1FKVYNe0JIuXsOKfb2lDBiCuYn.ziQ8iBFR.5KU9xKZY2',NULL,NULL);
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-28 19:27:03
