-- MySQL Workbench Synchronization
-- Generated: 2023-06-08 21:05
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: m5pan

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `vasooli_db` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `vasooli_db`.`customers` (
  `customer_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT 'Describes the unique customer_id which is used as primary key\n',
  `email_id` VARCHAR(255) NULL DEFAULT NULL,
  `mobile_no` VARCHAR(20) NULL DEFAULT NULL,
  `password_hash` VARCHAR(255) NULL DEFAULT NULL,
  `first_name` VARCHAR(45) NULL DEFAULT NULL,
  `last_name` VARCHAR(45) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE INDEX `customer_id_UNIQUE` (`customer_id` ASC) VISIBLE,
  UNIQUE INDEX `email_id_UNIQUE` (`email_id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `vasooli_db`.`transaction_details` (
  `transaction_id` BIGINT(20) NOT NULL,
  `customer_id` BIGINT(20) NOT NULL,
  `category_id` BIGINT(20) NOT NULL,
  `payment_id` BIGINT(20) NOT NULL,
  `transaction_title` VARCHAR(45) NULL DEFAULT NULL,
  `transaction_amount` VARCHAR(45) NULL DEFAULT NULL,
  `transaction_description` VARCHAR(45) NULL DEFAULT NULL,
  `requested_from_customer_id` VARCHAR(45) NULL DEFAULT NULL,
  `requested_to_customer_id` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`transaction_id`),
  INDEX `fk_transaction_details_customers1_idx` (`customer_id` ASC) VISIBLE,
  INDEX `fk_transaction_details_transaction_categories1_idx` (`category_id` ASC) VISIBLE,
  INDEX `fk_transaction_details_payment_details1_idx` (`payment_id` ASC) VISIBLE,
  CONSTRAINT `fk_transaction_details_customers1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `vasooli_db`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaction_details_transaction_categories1`
    FOREIGN KEY (`category_id`)
    REFERENCES `vasooli_db`.`transaction_categories` (`category_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_transaction_details_payment_details1`
    FOREIGN KEY (`payment_id`)
    REFERENCES `vasooli_db`.`payment_details` (`payment_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `vasooli_db`.`payment_details` (
  `payment_id` BIGINT(20) NOT NULL,
  `rzp_payment_status` VARCHAR(45) NULL DEFAULT NULL,
  `transaction_id` BIGINT(20) NULL DEFAULT NULL,
  `customer_id` BIGINT(20) NOT NULL,
  `rzp_order_id` VARCHAR(50) NULL DEFAULT NULL,
  `rzp_payment_id` VARCHAR(255) NULL DEFAULT NULL,
  `rzp_x_rzp_sign` VARCHAR(255) NULL DEFAULT NULL,
  `is_verified` BIT(1) NULL DEFAULT NULL,
  `rzp_payment_status_desc` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  INDEX `fk_payment_details_customers1_idx` (`customer_id` ASC) VISIBLE,
  CONSTRAINT `fk_payment_details_customers1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `vasooli_db`.`customers` (`customer_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `vasooli_db`.`transaction_categories` (
  `category_id` BIGINT(20) NOT NULL,
  `category_name` VARCHAR(45) NULL DEFAULT NULL,
  `category_description` TEXT NULL DEFAULT NULL,
  `category_icon` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
