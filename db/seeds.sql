INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 80000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Account Manager", 160000, 3),
       ("Acountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bruce", "Wayne", 1, null),
       ("Mark", "Zuckerberg", 2, 1),
       ("Jim", "Carey", 3, 1),
       ("Tom", "Hanks", 4, 2),
       ("Mickey", "Mouse", 5, 2),
       ("Justin", "Bieber", 6, 1),
       ("Uncle", "Sam", 7, 2);