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
      choices: ["View All Employees", "View All Departments", "View All Roles"]
    }
  ];

  // Choice user made in main menu
  let selection = await inquirer.prompt(mainMenuQs);

  switch (selection.selection) {
    // Show entire employee table
    case ("View All Employees"):
      console.log(`You selected "View All Employees"`);
      break;

    // Display department table
    case ("View All Departments"):
      const viewAllDepartmentsQry = `SELECT * FROM department;`;

      db.query(viewAllDepartmentsQry, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
      });

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