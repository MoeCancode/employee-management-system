DROP DATABASE IF EXISTS corporation;
CREATE DATABASE corporation;

USE corporation;

-- Create departments table
CREATE TABLE departments (
    id INT AUTO_INCREMENT,
    name VARCHAR(30),

    PRIMARY KEY(id) 
);

-- Create roles table
CREATE TABLE roles (
    id INT AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,

    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Cretae employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT, 

    PRIMARY KEY(id),
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);