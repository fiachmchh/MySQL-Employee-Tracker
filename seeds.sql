USE EmployeesDB;

INSERT INTO department (name)
VALUES ("sales"), ("Tech"), ("Culinary"), ("Decorating"), ("Spiritual");
  
  INSERT INTO role (title, salary, department_id)
VALUES ("salesperson", 90.000, 1), ("programmer", 80.000, 2),("cook", 50.000, 3),("painter", 50.000, 4), ("desert chef", 120.000, 3), ("priest", 5.000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Roger", "Hill", 1), ("Billy", "Bingham", 2), ("Jed", "Hush", 3), ("Patrick", "McGee", 4), ("Pat", "Green", 2), ("Bruce", "Bogtrotter", 5), ("Luke", "Skywalker", 2), ("Ted", "Crilly", 6), ("Jack", "Hacket", 6), ("Father", "Dougal", 6) ;

SELECT first_name, last_name, title, salary, name
FROM employee 
LEFT JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id

-- SELECT name FROM department

-- SELECT title, salary, name
-- FROM role
-- INNER JOIN department ON role.department_id = department.id

-- SELECT id, title, salary FROM role

