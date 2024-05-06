const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // TODO: Add MySQL Password
    password: 'Acceptance2!',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);

// Define your list of choices
const choices = [
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
];

// Prompt the user to select an item
inquirer.prompt([
  {
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: choices,
  }, 
])

.then((answers) => {
  const selected = answers.selection;
  console.log(`You selected: ${selected}`);
  if (selected === 'View All Employees') {
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id;', function (err, results) {
      console.table(results);
    });
  }
  if (selected === 'View All Roles') {
    db.query('SELECT role.id, role.title AS Title, department.department_name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
      console.table(results);
    });
  }
  if (selected === 'View All Departments') {
    db.query('SELECT department.id, department.department_name AS Department FROM department;', function (err, results) {
      console.table(results);
    });
  }
  
  /*
  if (selected === 'Add Employee') {
    inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'What is the employee',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'What is the employee',
      },
      {
        type: 'input',
        name: 'role_title',
        message: 'What is the employee',
      },
      {
        type: 'list',
        name: 'manager_name',
        message: 'What is the employee',
      },
    ])
    .then((data) => {
      db.query('INSERT INTO employee,(first_name, last_name, role_id, manager_id')  
    })
  }
  */
})

.catch((error) => {
  console.error(error);
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
