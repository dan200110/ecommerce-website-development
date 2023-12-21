-- Create table

Create table test_table (
  id int NOT NULL,
  name varchar(255) default null,
  address varchar(255) default null
  primary key (id)
) ENGINE=InnoDB default CHARSET=utf8mb4

-- Create procedure

DELIMITER //

CREATE DEFINER=`tipjs`@`%` PROCEDURE `insert_data`()
BEGIN
    DECLARE max_id INT DEFAULT 100000;
    DECLARE i INT DEFAULT 1;

    WHILE i <= max_id DO
        INSERT INTO test_table (id, name, address) VALUES (i, CONCAT('name', i), CONCAT('address', i));
        SET i = i + 1;
    END WHILE;
END//

DELIMITER ;



CREATE table orders (
  order_id INT,
  order_date DATE NOT NULL,
  total_amount DECIMAL(10,2),
  PIRMARY key (order_id, order_date)
)
PARTITION



