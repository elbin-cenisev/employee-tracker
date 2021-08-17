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
  const mainMenuQs = [
    {
      name: 'selection',
      type: 'list',
      message: 'Who would you like to do?',
      choices: ["View All Employees", "View All Departments"]
    }
  ];
  let selection = await inquirer.prompt(mainMenuQs);

  switch (selection.selection) {
    // Show entire employee table
    case ("View All Employees"):
      console.log(`You selected "View All Employees"`);

    // Show entire department table
    case ("View All Departments"):
      db.query(`SELECT * FROM department;`, (err, result) => {
        if (err) { console.log(err); }  // Basic error handling
        console.table(result);  // Display queried table
      });
  }
}

main_menu();