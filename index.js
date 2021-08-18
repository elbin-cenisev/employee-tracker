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

async function main_menu() {

  // Holds all main menu questions
  const mainMenuQs = [
    {
      name: 'selection',
      type: 'list',
      message: 'Who would you like to do?',
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

    /* Show all employees' name, title, department, salary and their 
    manager's name (if they have been assigned to a manager) */
    case ("View All Employees"):
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
        console.table(result);
      });

      break;

    // Display department table
    case ("View All Departments"):
      const viewAllDepartmentsQry = `SELECT * FROM department;`;

      db.query(viewAllDepartmentsQry, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
      });

      break;

    // Insert into department table
    case ("Add Department"):
      // Ask for name of department that user wants to add
      const selectDepartment = [
        {
          name: 'selection',
          message: 'What is the name of the department?',
        }
      ];
      let selectedDep = await inquirer.prompt(selectDepartment);
      const department = selectedDep.selection;

      // Insert the input into department table
      const addDepartmentQry = `
      INSERT INTO department (name) 
      VALUES ("${department}");
      `;

      db.query(addDepartmentQry, (err, result) => {
        if (err) { console.log(err); }
        console.log(`Added ${department} to the database`)
      });

      break;

    // Insert into roles table
    case ("Add Role"):

      // Ask for salary of role
      const selectTitle = [
        {
          name: 'selection',
          message: 'What is the name of the role?',
        }
      ];
      let selectedTitle = await inquirer.prompt(selectTitle);
      const title = selectedTitle.selection;

      // Ask for salary of role
      const selectSalary = [
        {
          name: 'selection',
          message: 'What is the salary of the role?',
        }
      ];
      let selectedSalary = await inquirer.prompt(selectSalary);
      const salary = selectedSalary.selection;

      // Ask for department of role
      // let allDepartments = [];
      const selectDepartment2 = [
        {
          name: 'selection',
          type: 'list',
          message: 'Which department does the role belong to?',
          choices: [
            "Sales"
          ]
        }
      ];
      let selectedDepartment = await inquirer.prompt(selectDepartment2);
      // const department2 = selectedDepartment.selection;

      // Insert the input into roles table
      const addRoleQry = `
      INSERT INTO roles (title, salary, department_id)
      VALUES  ("${title}", ${salary}, 1);
      `;

      db.query(addRoleQry, (err, result) => {
        if (err) { console.log(err); }
        console.log(`Added ${title} to the database`)
      });

      break;

    // Show joined departments / roles table
    case ("View All Roles"):
      const viewAllRolesQry = `
        SELECT roles.id, roles.title, department.name AS department, roles.salary 
        FROM roles 
        JOIN department ON roles.department_id = department.id;
        `;

      db.query(viewAllRolesQry, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
      });

      break;
  }
}

main_menu();