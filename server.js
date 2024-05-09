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
  "View Employees by Manager",
  "View Employees by Department",
  "Add Employee",
  "Change Status of Employee as Manager",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
  "Delete Employee",
  "Delete Role",
  "Delete Department",
  "View Total Budget by Department",
  "Quit",
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
  if (selected === 'Quit') {
    return;
  };
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
  if (selected === 'Add Department') {
    // addDepartment()
    inquirer.prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
      }
    ])

      .then((data) => {
        db.query('INSERT INTO department (department_name) VALUES (?)', data.department, function (err, results){
          db.query(`SELECT * from department`, function (err, results){
            console.table(results);
          })
        })
      })
  }
  
  if (selected === 'Add Role') {
    addRoles()
  }

})

.catch((error) => {
  console.error(error);
});

async function addRoles(){
  const answers = [
    {
      type: 'input',
      name: 'title',
      message: 'What is the name of the role?',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary of the role?',
    },
    {
      type: 'list',
      name: 'selectedDepartment',
      message: 'Which department does the role belong to?',
      choices: await getDepartmentChoices(),
    }
  ];


  inquirer.prompt(answers)
  .then((data) => {
    console.log(data);
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.selectedDepartment], function (err, results){
      console.log(results);
    });
    console.log(`Added ${data.title} to the database`);
  })
  .catch(err => console.error(err));
};


function getDepartmentChoices() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, department_name FROM department',function(err,data){
      if(err) console.log(err)
      console.log(data);
      resolve(data.map(row => ({ value: row.value, name: row.department_name })));
    })
  });
}

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
