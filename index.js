const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DATABASE = 'employees_db'

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',

    // MySQL username,
    user: 'root',

    // MySQL password
    password: 'mypass',
    database: DATABASE
  },
  console.log(`Connected to the database.`)
);

// The main() function
async function main_menu() {

  // Holds all main menu questions
  const mainMenuQs = [
    {
      name: 'selection',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        "View All Employees",
        "View All Departments",
        "Add Department",
        "View All Roles",
        "Add Role"]
    }
  ];

  // Choice user made in main menu
  let selection = await inquirer.prompt(mainMenuQs);

  switch (selection.selection) {

    case ("View All Employees"):
      viewEmployeeTable();
      break;

    case ("View All Departments"):
      viewAllDepartments();
      break;

    case ("Add Department"):
      addDepartment();
      break;

    // Insert into roles table
    case ("Add Role"):
      addRole();
      break;

    case ("View All Roles"):
      viewAllRoles();
      break;
  }
}

/* Display all employees' name, title, department, salary and their 
    manager's name (if they have been assigned to a manager) */
function viewEmployeeTable() {

  const viewAllEmployeesQry = `
  SELECT 
    emp.id, 
    emp.first_name,
    emp.last_name,
    roles.title,
    department.name AS department,
    roles.salary,
    CONCAT(man.first_name, ' ', man.last_name) AS manager
  FROM employee emp
  JOIN roles
    ON emp.role_id = roles.id
  JOIN department
    ON department.id = roles.department_id
  LEFT JOIN employee man
    ON emp.manager_id = man.id
`;

  db.query(viewAllEmployeesQry, (err, result) => {
    if (err) { console.log(err); }
    console.table(result)
  });
}

// Display department table
function viewAllDepartments() {
  const viewAllDepartmentsQry = `SELECT * FROM department;`;

  db.query(viewAllDepartmentsQry, (err, result) => {
    if (err) { console.log(err); }
    console.table(result);
  });
}

// Display joined departments / roles table
function viewAllRoles() {
  const viewAllRolesQry = `
  SELECT roles.id, roles.title, department.name AS department, roles.salary 
  FROM roles 
  JOIN department ON roles.department_id = department.id;
  `;

  db.query(viewAllRolesQry, (err, result) => {
    if (err) { console.log(err); }
    console.table(result);
  });
}

// Insert into department table
async function addDepartment() {
  // Ask for name of department that user wants to add
  let selectDepartment = [
    {
      name: 'selection',
      message: 'What is the name of the department?',
    }
  ];

  let selectedDep = await inquirer.prompt(selectDepartment);
  const department = selectedDep.selection;

  // Insert the new department into department table
  const addDepartmentQry = `
        INSERT INTO department (name) 
        VALUES ("${department}");
        `;

  db.query(addDepartmentQry, (err, result) => {
    if (err) { console.log(err); }
    console.log(`Added ${department} to the database`)
  });
}

async function addRole() {
  // Ask for name of role
  // Ask for salary of role
  // Ask for department for role
  // Insert role into role table
  let role = "Example Role";
  let salary = 5;
  let departmentID = 1;

  const addRoleQry = `
  INSERT INTO roles (title, salary, department_id) 
  VALUES ("${role}", ${salary}, ${departmentID});
  `;

  db.query(addRoleQry, (err, result) => {
    if (err) { console.log(err); }
    console.log(`Added ${role} to the database`)
  });
}

// Initialize application
main_menu();