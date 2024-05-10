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
  // console.log(`You selected: ${selected}`);
  if (selected === 'Quit') {
    return;
  };

  if (selected === 'View Employees by Manager') {
    viewEmployeesByManager()
  };

  if (selected === 'View All Employees') {
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id;', function (err, results) {
      console.table(results);
    });
  };

  if (selected === 'View All Roles') {
    db.query('SELECT role.id, role.title AS Title, department.department_name AS Department, role.salary AS Salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
      console.table(results);
    });
  }; 

  if (selected === 'View All Departments') {
    db.query('SELECT department.id, department.department_name AS Department FROM department;', function (err, results) {
      console.table(results);
    });
  };

  if (selected === 'Add Department') {
    addDepartment()
  };

  if (selected === 'Add Role') {
    addRole()
  };

})

.catch((error) => {
  console.error(error);
});


// function to allow call that allows users to view employees based on manager
async function viewEmployeesByManager(){
  const answers = [
    {
      type: 'input',
      name: 'managerName',
      message: 'What is the first name of the manager?',
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    // console.log(data, 'line #111');  //* { managerName: 'Jack' } 
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE manager.first_name = ?;', [data.managerName], function (err, results){
      console.table(results);
    });
    console.log(`You are viewing employees under manager, ${data.managerName}`);
  })
  .catch(err => console.error(err));
};


function addDepartment(){
  const answers = [
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    console.log(answers);  //* { type: 'input', name: 'department', message: 'What is the name of the department?' }
    console.log(data);  //* { department: 'Industrial' }
    db.query('INSERT INTO department (department_name) VALUES (?)', [data.department], function (err, results){
        // console.table(results);
      });
      console.log(`Added ${data.department} to the departments`);
    })
  .catch(err => console.error(err));
};

// function to allow call that allows users to add role position to database
async function addRole(){
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
      // console.log(results);
          /*

          ResultSetHeader {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 10,
            info: '',
            serverStatus: 2,
            warningStatus: 0
          }

          */
    });
    console.log(`Added ${data.title} to roles`);
  })
  .catch(err => console.error(err));
};

// function that enables dynamic choice selection when trying to view employees by manager (not utilized)
function getListofManagers() {
  return new Promise((resolve, reject) => {
    db.query('SELECT manager_id AS value, first_name FROM employee',function(err,data){
      if(err) console.log(err)
      console.log(data, 'line #178');
      resolve(data.map(row => ({ value: row.value, name: row.first_name })));
    })
  });
}

// function that enables dynamic choice selection when adding a role position to a department
function getDepartmentChoices() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, department_name FROM department',function(err,data){
      if(err) console.log(err)
      // console.log(data); 
      /*

      [
        { value: 1, department_name: 'Sales' },
        { value: 2, department_name: 'Engineering' },
        { value: 3, department_name: 'Finance' },
        { value: 4, department_name: 'Legal' },
        { value: 5, department_name: 'Secretary' },
        { value: 6, department_name: 'Industrial' }
      ]

      */
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
