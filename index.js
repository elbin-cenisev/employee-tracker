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
  // Display entire department table
  const viewAllDepartmentsQry = `SELECT * FROM department;`;

  // Display role table alongside the name of the relevant department
  const viewAllRolesQry = `
  SELECT roles.id, roles.title, department.department_name AS department, roles.salary 
  FROM roles 
  JOIN department ON roles.department_id = department.id;`;

  const mainMenuQs = [
    {
      name: 'selection',
      type: 'list',
      message: 'Who would you like to do?',
      choices: ["View All Employees", "View All Departments", "View All Roles"]
    }
  ];
  let selection = await inquirer.prompt(mainMenuQs);

  switch (selection.selection) {
    // Show entire employee table
    case ("View All Employees"):
      console.log(`You selected "View All Employees"`);

    // Show entire department table
    case ("View All Departments"):
      db.query(viewAllDepartmentsQry, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
      });

    // Show joined departments / roles table
    case ("View All Roles"):
      db.query(viewAllRolesQry, (err, result) => {
        if (err) { console.log(err); }
        console.table(result);
      });
  }
}

main_menu();