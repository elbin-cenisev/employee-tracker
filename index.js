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
      choices: ["View All Employees", "View All Departments", "Add Department", "View All Roles"]
    }
  ];

  // Choice user made in main menu
  let selection = await inquirer.prompt(mainMenuQs);

  switch (selection.selection) {

    /* Show employee's name, title, department, salary and their 
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
    case("Add Department"):
      // Ask for name of department that user wants to add
      const selectDepartment = [
        {
          name: 'selection',
          message: 'What is the name of the department?',
        }
      ];
      let selectedDep = await inquirer.prompt(selectDepartment);
      console.log(`You want to add ${selectedDep.selection}`);
      break;

    // Show joined departments / roles table
    case ("View All Roles"):
      const viewAllRolesQry = `
        SELECT roles.id, roles.title, department.department_name AS department, roles.salary 
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