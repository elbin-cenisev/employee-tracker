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
      choices: ["View All Employees"]
    }
  ];
  let selection = await inquirer.prompt(mainMenuQs);
  console.log(`Hello World, you picked "` + selection.selection +`"`);
}

main_menu();