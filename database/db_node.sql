CREATE SCHEMA db_node DEFAULT CHARACTER SET utf8 ;
USE db_node;

CREATE TABLE users (
	id BIGINT NOT NULL AUTO_INCREMENT,
	email VARCHAR(180) NOT NULL UNIQUE,
	name VARCHAR(90) NOT NULL,
	lastname VARCHAR(90) NOT NULL,
	phone VARCHAR(90) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(90) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE tasks (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  project_id BIGINT NOT NULL,
  assigned_to BIGINT NOT NULL,
  progress INT DEFAULT 0,
  priority ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
  due_date DATE,
  status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE projects (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  team VARCHAR(255) NOT NULL,         -- equipo quien lo realiza (puedes guardar nombres o IDs separados por comas)
  progress INT DEFAULT 0,             -- porcentaje de avance
  status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;