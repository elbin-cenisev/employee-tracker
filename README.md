# employee-tracker

## Description
Based on Assignment 12 of the Full-Stack Bootcamp. Create CMS using MYSQL, Express, Node, etc.

## User Experience
This is a command line application which allows you to build and manage a team of employees.
You can use it to create new employee entries and assign them to departments and specific team leaders.

## Installation
To use this app, first clone this repository.
Then, open the index.js file and set the user and password to match your MySQL Server settings.
Navigate to the db directory and run the "mysql -u [username] -p" command. A prompt will appear asking you to enter your MySQL Server password.
Once you are inside the MySQL Shell, run "source schema.sql" and "source seeds.sql" to create the db.
Use the "quit" command to leave the MySQL shell and navigate to the root of the folder.
Now, use the "node index.js" command to start the app.

## Technologies Used
Node, Inquirer, mysql2, console.table

## Walkthrough Video
https://drive.google.com/file/d/1Z4_qNFUAzl48Z93MBZlCdh3VlsNwSAr5/view

# License
MIT License
