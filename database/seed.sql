INSERT INTO departments (name) 
VALUES 
    ("Accounting"),
    ("Customer Support"),
    ("Sales"),
    ("Human Resources"),
    ("Management");


INSERT INTO roles (title, salary, department_id) 
VALUES 
    ("Tax Accountant", 85000, 1),
    ("Financial Analyst", 110000, 1),
    ("Call agent", 60000, 2),
    ("Junior SalesPerson", 90000, 3),
    ("Senior SalesPerson", 120000, 3),
    ("Recruiter", 75000, 4),
    ("Human Resource representative", 95000, 4),
    ("Regional Manager", 135000, 5);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", 8, NULL),
    ("Jim", "Halpert", 5, 1),
    ("Dwight", "Schrute", 5, 1),
    ("Pam", "Beasley", 3, 1),
    ("Oscar", "Hernandez", 2, 1),
    ("Kevin", "baldy", 1, 5),
    ("Angela", "Cristian", 1, 5),
    ("Ryan", "Temp", 4, 2),
    ("Andy", "Bernard", 4, 3),
    ("Tobey", "Flander", 7, 1),
    ("Stanley", "Jefferson", 6, 10),
    ("Phyllis", "Vance", 6, 10),
    ("Kelly", "Kapoor", 3, 1),
    ("Creed", "Cooper", 6, NULL);
