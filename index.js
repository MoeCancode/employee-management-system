const inquirer = require("inquirer");
const ctab = require("console.table");
const mysql = require("mysql2");

const questions = ["VIEW ALL DEPARTMENTS", "VIEW ALL ROLES", "VIEW ALL EMPLOYEES", "ADD A DEPARTMENT", "ADD A ROLE", "ADD AN EMPLOYEE", "UPDATE EMPLOYEE ROLE", "CALL IT A DAY"];

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'okokokok',
      database: 'corporation',
      multipleStatements: true
    },
    console.log("Connected to corporate database"),
  );

  starterFunction();

  function starterFunction() {
      console.log("\n WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM \n");
      mainMenu();
  }


  function mainMenu() {
      inquirer.prompt([
          {
              name: "chooseOption",
              type: "list",
              message: "CHOOSE AN OPTION: ",
              choices: questions  
          }
      ]).then(data => {
        if(data.chooseOption == questions[0]) {
            viewDepartment();
        }
        else if(data.chooseOption == questions[1]) {
            viewRoles();
        }
        else if(data.chooseOption == questions[2]) {
            viewEmployees();
        }
        else if(data.chooseOption == questions[3]) {
            addDepartment();
        }
        else if(data.chooseOption == questions[4]) {
            addRole();
        }
        else if(data.chooseOption == questions[5]) {
            addEmployee();
        }
        else if(data.chooseOption == questions[6]) {
            updateEmployeeRole();
        }
        else if(data.chooseOption == questions[7]) {
            okBye();
        }
        else {
            console.log(data);
            console.log(questions[0]);
        }
      })
  }

  function viewDepartment() {
    
    let sql = `SELECT * FROM departments`;
    db.query(sql, (error,result) =>{
      if (error) throw error;
    //   console.log(result);
      console.table(result);
      mainMenu();
    });
  }

  function viewRoles() {

    let sql = `
    SELECT ro.id, ro.title, dep.name AS department, ro.salary
    FROM roles AS ro
    JOIN departments AS dep
    ON ro.department_id = dep.id
    ORDER BY ro.id;
    `
      db.query(sql, (error, result) => {
          if(error) throw error;
          console.table(result);
          mainMenu(); 
      })
  }

//NOT DISPLAYING EMPLOYEES THAT HAVE NO MANAGERS
  function viewEmployees() {
      let sql = `
      SELECT emp.id, emp.first_name, emp.last_name, ro.title, dep.name AS department, ro.salary, CONCAT(m.first_name, " ", m.last_name) AS reports_to
      FROM employees AS emp
      JOIN roles AS ro
      ON emp.role_id = ro.id
      JOIN departments AS dep
      ON ro.department_id = dep.id
      JOIN employees m
      ON emp.manager_id = m.id
      ORDER BY emp.id;
      `
      db.query(sql, (error, result) => {
        if(error) throw error;
        console.table(result);
        mainMenu(); 
    })
  }