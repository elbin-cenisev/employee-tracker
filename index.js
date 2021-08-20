const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DATABASE = 'employees_db'

const pool = mysql.createPool(
  {
    host: 'localhost',
    user: 'root',
    password: 'mypass',
    database: DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
async function viewEmployeeTable() {

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

  let result = await pool.query(viewAllEmployeesQry);
  if (result[0].length < 1) {
    throw new Error('Department with this name was not found');
  }
  console.table(result[0]);
}

// Display department table
async function viewAllDepartments() {
  const viewAllDepartmentsQry = `SELECT * FROM department;`;

  let result = await pool.query(viewAllDepartmentsQry);
  if (result[0].length < 1) {
    throw new Error('Department with this name was not found');
  }
  console.table(result[0]);
}

// Display joined departments / roles table
async function viewAllRoles() {
  const viewAllRolesQry = `
  SELECT roles.id, roles.title, department.name AS department, roles.salary 
  FROM roles 
  JOIN department ON roles.department_id = department.id;
  `;

  let result = await pool.query(viewAllRolesQry);
  if (result[0].length < 1) {
    throw new Error('Department with this name was not found');
  }
  console.table(result[0]);
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
        VALUES (?);
        `;

  let result = await pool.query(addDepartmentQry, [department]);
  if (result[0].length < 1) {
    throw new Error('Something went wrong');
  }
  else { console.log (`${department} department has been added`); }
}

async function addRole() {
  // Ask for name of role
  // Ask for salary of role
  // Choose from department list
  departmentList = ["Sales"]
  const selectDepartment = [
    {
      name: 'selection',
      type: 'list',
      message: 'What would you like to do?',
      choices: departmentList
    }
  ];

  // Choice user made in main menu
  let selectedDepartment = await inquirer.prompt(selectDepartment);
  let departmentName = selectedDepartment.selection;

  const getDepartmentIDQry = `
  SELECT id FROM department 
  WHERE department.name = ?
  `;

  let result = await pool.query(getDepartmentIDQry, [departmentName]);
  if (result[0].length < 1) {
    throw new Error('Department with this name was not found');
  }
  let departmentID = result[0][0].id;
  console.log(departmentID);

  // // Insert role into role table
  // let role = "Example Role";
  // let salary = 5;
  // let departmentID = 1;

  // const addRoleQry = `
  // INSERT INTO role (title, salary, department_id) 
  // VALUES ("${role}", ${salary}, ${departmentID});
  // `;

  // pool.query(addRoleQry, (err, result) => {
  //   if (err) { console.log(err); }
  //   console.log(`Added ${role} to the database`)
  // });
}

// Initialize application
main_menu();