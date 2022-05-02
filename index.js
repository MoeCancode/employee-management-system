const inquirer = require("inquirer");
const ctab = require("console.table");
const mysql = require("mysql2");
const Choices = require("inquirer/lib/objects/choices");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'okokokok',
      database: 'corporate',
      multipleStatements: true
    },
    console.log("Connected to corporate database"),
  );

  starterFunction();

  function starterFunction() {
      console.log("WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM \n");
      mainMenu();
  }

const questions = ["VIEW ALL DEPARTMENTS", "VIEW ALL ROLES", "VIEW ALL EMPLOYEES", "ADD A DEPARTMENT", "ADD A ROLE", "ADD AN EMPLOYEE", "UPDATE EMPLOYEE ROLE", "CALL IT A DAY"];

  function mainMenu() {
      inquirer.prompt([
          {
              name: "chooseOption",
              type: "list",
              message: "CHOOSE AN OPTION: ",
              choice: questions  
          }
      ]).then(data => {
        if(data == questions[0]) {
            viewDepartment();
        }
        else if(data == questions[1]) {
            viewRoles();
        }
        else if(data == questions[2]) {
            viewEmployees();
        }
        else if(data == questions[3]) {
            addDepartment();
        }
        else if(data == questions[4]) {
            addRole();
        }
        else if(data == questions[5]) {
            addEmployee();
        }
        else if(data == questions[6]) {
            updateEmployeeRole();
        }
        else if(data == questions[7]) {
            okBye();
        }
      })
  }