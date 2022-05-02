const inquirer = require("inquirer");
const ctab = require("console.table");
const mysql = require("mysql2");

const questions = [
  "VIEW ALL DEPARTMENTS",
  "VIEW ALL ROLES",
  "VIEW ALL EMPLOYEES",
  "ADD A DEPARTMENT",
  "ADD A ROLE",
  "ADD AN EMPLOYEE",
  "UPDATE EMPLOYEE ROLE",
  "CALL IT A DAY",
];

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "okokokok",
    database: "corporation",
    multipleStatements: true,
  },
  console.log("Connected to corporate database")
);

starterFunction();

function starterFunction() {
  console.log("\n WELCOME TO THE EMPLOYEE MANAGEMENT SYSTEM \n");
  mainMenu();
}

function mainMenu() {
  inquirer
    .prompt([
      {
        name: "chooseOption",
        type: "list",
        message: "CHOOSE AN OPTION: ",
        choices: questions,
      },
    ])
    .then((data) => {
      if (data.chooseOption == questions[0]) {
        viewDepartment();
      } else if (data.chooseOption == questions[1]) {
        viewRoles();
      } else if (data.chooseOption == questions[2]) {
        viewEmployees();
      } else if (data.chooseOption == questions[3]) {
        addDepartment();
      } else if (data.chooseOption == questions[4]) {
        addRole();
      } else if (data.chooseOption == questions[5]) {
        addEmployee();
      } else if (data.chooseOption == questions[6]) {
        updateEmployeeRole();
      } else if (data.chooseOption == questions[7]) {
        okBye();
      } else {
        console.log(data);
        console.log(questions[0]);
      }
    });
}

function viewDepartment() {
  let sql = `SELECT * FROM departments`;
  db.query(sql, (error, result) => {
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
    `;
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    mainMenu();
  });
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
      `;
  db.query(sql, (error, result) => {
    if (error) throw error;
    console.table(result);
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "depName",
        message: "ENTER THE NAME FOR THE NEW DEPARTMENT",
        type: "input",
      },
    ])
    .then((answer) => {
      let sql = `
          INSERT INTO departments (name)
          VALUES ('${answer.depName}');
          `;
      db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(
          `DEPARTMENT ${answer.depName} HAS BEEN SUCCESSFULLY ADDED! `
        );
        mainMenu();
      });
    });
}

function addRole() {

    let currentDepartments = [];
    let sql1 = `SELECT * FROM departments`;
  db.query(sql1, (error, result) => {
    if (error) throw error;
    
    let i = 0;
    while(result[i]) {
        currentDepartments.push(result[i].name);
        i++;
    }
    console.log("curent departments are: " + currentDepartments);
  });
    

    inquirer
    .prompt([
      {
        name: "roleName",
        message: "ENTER THE TITLE FOR THE NEW ROLE",
        type: "input",
      },
      {
          name: "roleSalary",
          message: "WHAT IS THE SALARY FOR THIS ROLE?",
          type: "input"
      },
      {
          name: "roleDepartment",
          message: "CHOOSE THE DEPARTMENT THIS ROLE BELONGS TO: ",
          type: "list",
          choices: currentDepartments
      }
    ])
    .then((answer) => {
        let dep_id = 0;
        for(let x = 0; x < currentDepartments.length; x++) {
            if(answer.roleDepartment == currentDepartments[x]) {
                dep_id = x + 1;
            }
        }
        console.log("department ID is: " + dep_id );
      let sql = `
          INSERT INTO roles (title, salary, department_id)
          VALUES ('${answer.roleName}', ${answer.roleSalary}, ${dep_id});
          `;
      db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(
          `ROLE ${answer.roleName} CREATED WITH SALARY:  ${answer.roleSalary} `
        );
        mainMenu();
      });
    });
}
