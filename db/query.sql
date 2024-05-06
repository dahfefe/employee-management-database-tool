SELECT *
FROM role
JOIN department ON role.department_id = department.id
JOIN employee ON employee.role_id = role.id;

SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary
FROM role
JOIN department ON role.department_id = department.id
JOIN employee ON employee.role_id = role.id;