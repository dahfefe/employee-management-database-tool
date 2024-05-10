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

  if (selected === 'View Employees by Department') {
    viewEmployeesByDepartment()
  };

  if (selected === 'View All Employees') {
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id;', function (err, results) {
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

  if (selected === 'Add Employee') {
    addEmployee()
  };

  if (selected === 'Update Employee Role') {
    updateEmployeeRole()
  };

})

.catch((error) => {
  console.error(error);
});


// function to allow call that allows users to view employees based on manager
function viewEmployeesByManager(){
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
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS Manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE manager.first_name = ?;', [data.managerName], function (err, results){
      console.table(results);
    });
    console.log(`You are viewing employees under manager, ${data.managerName}`);
  })
  .catch(err => console.error(err));
};

// function to allow call that allows users to view employees based on manager
function viewEmployeesByDepartment(){
  const answers = [
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the name of the department?',
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    // console.log(data, 'line #111');  //* { departmentName: 'Legal' } 
    db.query('SELECT role.id, employee.first_name AS First_Name, employee.last_name AS Last_Name, role.title AS Title, department.department_name AS Department, role.salary AS Salary, manager.first_name AS Manager FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE department.department_name = ?;', [data.departmentName], function (err, results){
      console.table(results);
    });
    console.log(`You are viewing employees under department, ${data.departmentName}`);
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
    // console.log(data); //* { title: 'Plumber', salary: '50000', selectedDepartment: 6 }
    db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [data.title, data.salary, data.selectedDepartment], function (err, results){});
    console.log(`Added ${data.title} to roles`);
  })
  .catch(err => console.error(err));
};

// function to allow call that allows users to add employees to database
async function addEmployee(){

  // const choiceOfManagers = [
  //   {value: 1, first_name: 'Bruce'}, 
  //   {value: 2, first_name: 'Mark'},
  // ];

  const answers = [
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the first name of the employee?',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'What is the last name of the employee?',
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is the role of the employee?',
      choices: await getListOfRoles(),
    },
    {
      type: 'list',
      name: 'manager',
      message: 'Which manager does the employee report to?',
      choices: await getListofManagers(),
    }
  ];

  inquirer.prompt(answers)
  .then((data) => {
    console.log(data);
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [data.first_name, data.last_name, data.role, data.manager], function (err, results){});
    console.log(`Added ${data.first_name} ${data.last_name} to database`);
  })
  .catch(err => console.error(err));
};


// function to allow call that allows users to update employees in database re role
async function updateEmployeeRole(){

  const answers = [
    {
      type: 'list',
      name: 'employee',
      message: 'Which employee is being updated?',
      choices: await getListOfEmployees(),
    },
    {
      type: 'list',
      name: 'role',
      message: 'What is new role of the employee?',
      choices: await getListOfRoles(),
    },
  ];

  inquirer.prompt(answers)
  .then((data) => {
    // console.log(data);
    db.query('UPDATE employee (first_name, role_id) VALUES (?, ?)', [data.employee, data.role], function (err, results){});
    console.log(`Updated employee role in the database`);
  })
  .catch(err => console.error(err));
};

// function that enables dynamic choice selection when trying to view employees by manager
function getListofManagers() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, first_name FROM employee',function(err,data){
      if(err) console.log(err)
      console.log(data);
      /*

      [
        { value: 1, first_name: 'Bruce' },
        { value: 2, first_name: 'Mark' },
        { value: 3, first_name: 'Jim' },
        { value: 4, first_name: 'Tom' },
        { value: 5, first_name: 'Mickey' },
        { value: 6, first_name: 'Justin' },
        { value: 7, first_name: 'Uncle' },
        { value: 8, first_name: 'Bob' }
      ]

      */
      resolve(data.map(row => ({ value: row.value, name: row.first_name })));
    })
  });
}

// function that enables dynamic choice selection for list of current employees
function getListOfEmployees() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, first_name FROM employee',function(err,data){
      if(err) console.log(err)
      // console.log(data); 
      resolve(data.map(row => ({ value: row.value, name: row.first_name })));
    })
  });
}

// function that enables dynamic choice selection for list of current roles
function getListOfRoles() {
  return new Promise((resolve, reject) => {
    db.query('SELECT id AS value, title FROM role',function(err,data){
      if(err) console.log(err)
      console.log(data); 
      /*

      [
        { value: 1, title: 'Sales Lead' },
        { value: 2, title: 'Salesperson' },
        { value: 3, title: 'Lead Engineer' },
        { value: 4, title: 'Software Engineer' },
        { value: 5, title: 'Account Manager' },
        { value: 6, title: 'Acountant' },
        { value: 7, title: 'Legal Team Lead' },
        { value: 8, title: 'Lawyer' },
        { value: 9, title: 'Receptionist' },
        { value: 10, title: 'Coordinator' },
        { value: 11, title: 'CEO' },
        { value: 12, title: 'Plumber' }
      ]

      */
      resolve(data.map(row => ({ value: row.value, name: row.title })));
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
