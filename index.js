const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const DATABASE = 'employees_db'

// Using pool instead of connection for mysql2/promise to work
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

// The main function
async function main_menu() {

  // Holds all main menu questions
  const mainMenuQs = [
    {
      name: 'selection',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        "View All Employees",
        "Add Employee",
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

    case ("Add Role"):
      addRole();
      break;

    case ("View All Roles"):
      viewAllRoles();
      break;

    case ("Add Employee"):
      addEmployee();
      break;
  }
}

// Display (modified) employee table
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

// Display (modified) roles table
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

// Add a new department to the department table
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
  else { console.log(`${department} department has been added`); }
}

// Add a new role to the role table
async function addRole() {

  // Ask user to specify title for the new role
  let selectTitle = [
    {
      name: 'selection',
      message: 'What is the title for this role?',
    }
  ];
  let selectedTitle = await inquirer.prompt(selectTitle);

  const title = selectedTitle.selection;  // Holds title for role

  // Ask user to enter the salary for the new role
  let selectSalary = [
    {
      name: 'selection',
      message: 'What is the salary for this role?',
    }
  ];
  let selectedSalary = await inquirer.prompt(selectSalary);

  const salary = selectedSalary.selection;  // Holds salary for role

  // Generate a list of all currently existing departments
  const getDepartmentListQry = `
  SELECT name FROM department 
  `;

  let result = await pool.query(getDepartmentListQry);
  if (result[0].length < 1) {
    throw new Error('Couldn not generate list of department names');
  }

  let departmentList = result[0]; // Holds array of all department names

  // Ask user to select a department from this list
  const selectDepartment = [
    {
      name: 'selection',
      type: 'list',
      message: 'Select the department that this role belongs to',
      choices: departmentList
    }
  ];
  let selectedDepartment = await inquirer.prompt(selectDepartment);
  let departmentName = selectedDepartment.selection;  // Holds name of selected department

  // Find matching id for this department
  const getDepartmentIDQry = `
  SELECT id FROM department 
  WHERE department.name = ?
  `;

  result = await pool.query(getDepartmentIDQry, [departmentName]);
  if (result[0].length < 1) {
    throw new Error('Department with this name was not found');
  }

  let departmentID = result[0][0].id; // Holds department id for this role

  // Insert new role into role table
  const addRoleQry = `
  INSERT INTO roles (title, salary, department_id) 
  VALUES (?, ?, ?);
  `;

  result = await pool.query(addRoleQry, [title, salary, departmentID]);
  if (result[0].length < 1) {
    throw new Error('Something went wrong');
  }
  else { console.log(`${title} role has been added`); }
}

async function addEmployee() {
  // Add employee to the employee table
  const empFirstName = "Testoni";
  const empLastName = "Testerino";
  const empRoleID = 2;
  const empManagerID = 2;

  const addEmployeeQry = `
  INSERT INTO employee (first_name, last_name, role_id, manager_id) 
  VALUES (?, ?, ?, ?);
  `;

  result = await pool.query(addEmployeeQry, [empFirstName, empLastName, empRoleID, empManagerID]);
  if (result[0].length < 1) {
    throw new Error('Something went wrong');
  }
  else { console.log(`${empFirstName} ${empLastName} has been added to the list of employees`); }

}
// Initialize application
main_menu();