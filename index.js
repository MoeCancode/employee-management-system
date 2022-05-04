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

var empList = [];

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
          `\n DEPARTMENT ${answer.depName} HAS BEEN SUCCESSFULLY ADDED! \n `
        );
        mainMenu();
      });
    });
}

function addRole() {
  let allDepartments = [];
  let sql1 = `SELECT * FROM departments`;
  db.query(sql1, (error, result) => {
    if (error) throw error;

    let i = 0;
    while (result[i]) {
      allDepartments.push(result[i].name);
      i++;
    }
    // console.log("curent departments are: " + allDepartments);
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
        type: "input",
      },
      {
        name: "roleDepartment",
        message: "CHOOSE THE DEPARTMENT THIS ROLE BELONGS TO: ",
        type: "list",
        choices: allDepartments,
      },
    ])
    .then((answer) => {
      let dep_id = 0;
      for (let x = 0; x < allDepartments.length; x++) {
        if (answer.roleDepartment == allDepartments[x]) {
          dep_id = x + 1;
        }
      }
      let sql = `
          INSERT INTO roles (title, salary, department_id)
          VALUES ('${answer.roleName}', ${answer.roleSalary}, ${dep_id});
          `;
      db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(
          `\n ROLE ${answer.roleName} CREATED WITH SALARY:  ${answer.roleSalary} \n  `
        );
        mainMenu();
      });
    });
}

function addEmployee() {
  //Calling helper function
  let allRoles = getAllRoles();

  //Calling helper function
  let allEmployees = getAllEmployees();

  inquirer
    .prompt([
      {
        name: "first",
        message: "ENTER EMPLOYEE'S FIRST NAME: ",
        type: "input",
      },
      {
        name: "last",
        message: "ENTER EMPLOYEE'S LAST NAME: ",
        type: "input",
      },
      {
        name: "whatRole",
        message: "SELECT THE EMPLOYEE'S ROLE: ",
        type: "list",
        choices: allRoles,
      },
      {
        name: "reportsTo",
        message: "CHOOSE THE PERSON THIS EMPLOYEE REPORTS TO: ",
        type: "list",
        choices: allEmployees,
      },
    ])
    .then((answer) => {
      let role_id = 0;
      for (let x = 0; x < allRoles.length; x++) {
        if (answer.whatRole == allRoles[x]) {
          role_id = x + 1;
        }
      }
      let boss_id = 0;
      for (let q = 0; q < allEmployees.length; q++) {
        if (answer.reportsTo == allEmployees[q]) {
          boss_id = q + 1;
        }
      }

      let sql = `
    INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES ("${answer.first}", "${answer.last}", ${role_id}, ${boss_id});
    `;
      db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(`\n EMPLOYEE, ${answer.first} ${answer.last} ADDED! \n `);
        mainMenu();
      });
    });
}

function updateEmployeeRole() {
 //Calling helper function
  let allEmployees = getAllEmployees(); 
 //Calling helper function
  let allRoles = getAllRoles();

  inquirer
    .prompt([
      {
        name: "confirmation",
        message: "YOU ARE ABOUT TO UPDATE AN EMPLOYEE'S ROLE. PRESS ENTER TO CONTINUE:",
        type: "list",
        choices: ["PRESS ENTER"]
      },
      {
        name: "whatEmployee",
        message: "SELECT THE EMPLOYEE YOU WANT TO UPDATE: \n",
        type: "list",
        choices: allEmployees
      },
      {
        name: "whatRole",
        message: "SELECT THE NEW ROLE FOR THIS EMPLOYEE: \n",
        type: "list",
        choices: allRoles,
      },
    ])
    .then((answer) => {
      let idOfRole = 0;
      for (let x = 0; x < allRoles.length; x++) {
        if (answer.whatRole == allRoles[x]) {
          idOfRole = x + 1;
        }
      }

      let idOfEmployee = 0;
      for (let u = 0; u < allEmployees.length; u++) {
        if (answer.whatEmployee == allEmployees[u]) {
          idOfEmployee = u + 1;
        }
      }

      let sql = `
  UPDATE employees
  SET role_id = ${idOfRole}
  WHERE id = ${idOfEmployee};
  `;
      db.query(sql, (error, result) => {
        if (error) throw error;
        console.log(
          `\n ${answer.whatEmployee}'S ROLE HAS BEEN UPDATED TO ${answer.whatRole}! \n `
        );
        mainMenu();
      });
    });
}


//HELPER FUNCTION for getting employees
function getAllEmployees() {
  //Making an array containing all employees
  let allEmployees = [];
  let sql2 = `SELECT * FROM employees`;
  db.query(sql2, (error, result) => {
    if (error) throw error;

    let z = 0;
    while (result[z]) {
      let fullName = `${result[z].first_name} ${result[z].last_name}`;
      allEmployees.push(fullName);
      z++;
    }
  });
  return allEmployees;
}

//HELPER FUNCTION for getting roles
function getAllRoles() {
  var allRoles = [];
  let sql1 = `SELECT * FROM roles`;
  db.query(sql1, (error, result) => {
    if (error) throw error;

    let i = 0;
    while (result[i]) {
      allRoles.push(result[i].title);
      i++;
    }
  });
  return allRoles;
}